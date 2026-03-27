/**
 * Content Flywheel - Data Endpoint
 *
 * Deploy as: Web App > Execute as me > Anyone with link can access
 * Returns all flywheel data in one JSON payload for Make.com
 *
 * Setup:
 * 1. Replace SPREADSHEET_ID with your sheet's ID
 * 2. Set an API token: File > Project Settings > Script Properties > Add "API_TOKEN"
 * 3. Deploy as web app
 * 4. Call from Make.com: GET {{DEPLOYED_URL}}?token={{API_TOKEN}}
 */

var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

function doGet(e) {
  var token = (e && e.parameter && e.parameter.token) || "";
  var expected = PropertiesService.getScriptProperties().getProperty("API_TOKEN");
  if (expected && token !== expected) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var warnings = [];

  var data = {
    config: safeFetch(warnings, "config", function() {
      return getKeyValueTab(ss, "config");
    }),
    brand_profile: safeFetch(warnings, "brand_profile", function() {
      return getKeyValueTab(ss, "brand_profile");
    }),
    top_hooks: safeFetch(warnings, "top_hooks", function() {
      return getTopRows(ss, "hooks_library", "score", 20, true);
    }),
    customer_intel: safeFetch(warnings, "customer_intel", function() {
      return getTopRows(ss, "customer_intelligence", "date", 5, true);
    }),
    competitor_reels: safeFetch(warnings, "competitor_reels", function() {
      return getRecentReels(ss, 7, 10);
    }),
    own_content: safeFetch(warnings, "own_content", function() {
      return getRecentOwn(ss, 30, 10);
    }),
    content_ideas: safeFetch(warnings, "content_ideas", function() {
      return getVideoInboxByType(ss, "content_idea", 5);
    }),
    recent_scripts: safeFetch(warnings, "recent_scripts", function() {
      return getRecentScripts(ss, 14);
    }),
    weekly_winner: safeFetch(warnings, "weekly_winner", function() {
      return getWeeklyWinner(ss);
    }),
    pattern_rules: safeFetch(warnings, "pattern_rules", function() {
      return getPatternRules(ss);
    }),
  };

  var payload = {
    version: 1,
    warnings: warnings,
    data: data,
    text: {
      competitor_reels: formatCompetitorReels(data.competitor_reels),
      own_content: formatOwnContent(data.own_content),
      top_hooks: formatTopHooks(data.top_hooks),
      recent_scripts: formatRecentScripts(data.recent_scripts),
      pattern_rules: formatPatternRules(data.pattern_rules),
    }
  };

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Wrap a fetch call so one bad sheet doesn't kill the whole response */
function safeFetch(warnings, key, fn) {
  try {
    return fn();
  } catch (err) {
    warnings.push(key + ": " + err.message);
    return null;
  }
}

/** Read a 2-column key-value tab (field_name, value) into an object */
function getKeyValueTab(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return {};
  var data = sheet.getDataRange().getValues();
  var obj = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) obj[data[i][0]] = data[i][1];
  }
  return obj;
}

/** Read top N rows from a sheet, sorted by a column name (descending by default) */
function getTopRows(ss, sheetName, sortColName, limit, descending) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var all = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  var headers = all[0];
  var data = all.slice(1);

  var sortCol = headers.indexOf(sortColName);
  if (sortCol === -1) return [];

  data.sort(function(a, b) {
    var va = a[sortCol] || 0;
    var vb = b[sortCol] || 0;
    return descending ? (vb > va ? 1 : vb < va ? -1 : 0) : (va > vb ? 1 : va < vb ? -1 : 0);
  });

  var results = [];
  var cap = Math.min(limit, data.length);
  for (var i = 0; i < cap; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    results.push(row);
  }
  return results;
}

/** Get the top-performing own content from the last 7 days + its original script */
function getWeeklyWinner(ss) {
  var ownSheet = ss.getSheetByName("own_content");
  if (!ownSheet || ownSheet.getLastRow() < 2) return null;
  var ownAll = ownSheet.getRange(1, 1, ownSheet.getLastRow(), ownSheet.getLastColumn()).getValues();
  var ownHeaders = ownAll[0];
  var ownData = ownAll.slice(1);

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  var dateCol = ownHeaders.indexOf("post_date");
  var scoreCol = ownHeaders.indexOf("engagement_score");
  var scriptIdCol = ownHeaders.indexOf("script_id");
  if (dateCol === -1 || scoreCol === -1) return null;

  var candidates = ownData.filter(function(row) {
    var d = new Date(row[dateCol]);
    return !isNaN(d.getTime()) && d >= cutoff && (row[scoreCol] || 0) > 0;
  });

  if (candidates.length === 0) return null;

  candidates.sort(function(a, b) {
    return (b[scoreCol] || 0) - (a[scoreCol] || 0);
  });

  var winner = {};
  for (var j = 0; j < ownHeaders.length; j++) {
    winner[ownHeaders[j]] = candidates[0][j];
  }

  // Find the original script
  var scriptSheet = ss.getSheetByName("scripts_generated");
  var originalScript = null;
  if (scriptSheet && scriptSheet.getLastRow() >= 2 && scriptIdCol !== -1) {
    var scriptAll = scriptSheet.getRange(1, 1, scriptSheet.getLastRow(), scriptSheet.getLastColumn()).getValues();
    var scriptHeaders = scriptAll[0];
    var scriptData = scriptAll.slice(1);
    var scriptIdIdx = scriptHeaders.indexOf("script_id");

    for (var i = 0; i < scriptData.length; i++) {
      if (scriptData[i][scriptIdIdx] === candidates[0][scriptIdCol]) {
        originalScript = {};
        for (var k = 0; k < scriptHeaders.length; k++) {
          originalScript[scriptHeaders[k]] = scriptData[i][k];
        }
        break;
      }
    }
  }

  return { winner: winner, original_script: originalScript };
}

/** Get own content from the last N days, sorted by engagement_score descending */
function getRecentOwn(ss, days, limit) {
  var sheet = ss.getSheetByName("own_content");
  if (!sheet || sheet.getLastRow() < 2) return [];
  var all = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  var headers = all[0];
  var data = all.slice(1);

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  var dateCol = headers.indexOf("post_date");
  var scoreCol = headers.indexOf("engagement_score");
  if (dateCol === -1 || scoreCol === -1) return [];

  var filtered = data.filter(function(row) {
    var d = new Date(row[dateCol]);
    return !isNaN(d.getTime()) && d >= cutoff && (row[scoreCol] || 0) > 0;
  });

  filtered.sort(function(a, b) {
    return (b[scoreCol] || 0) - (a[scoreCol] || 0);
  });

  var results = [];
  var cap = Math.min(limit, filtered.length);
  for (var i = 0; i < cap; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = filtered[i][j];
    }
    results.push(row);
  }
  return results;
}

/** Get content ideas from video_inbox, sorted by priority (high first), capped at limit */
function getVideoInboxByType(ss, sourceType, limit) {
  var sheet = ss.getSheetByName("video_inbox");
  if (!sheet || sheet.getLastRow() < 2) return [];
  var all = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  var headers = all[0];
  var data = all.slice(1);

  var sourceCol = headers.indexOf("source_type");
  var statusCol = headers.indexOf("status");
  var priorityCol = headers.indexOf("priority");
  if (sourceCol === -1 || statusCol === -1) return [];

  var filtered = data.filter(function(row) {
    return row[sourceCol] === sourceType &&
           (row[statusCol] === "pending" || row[statusCol] === "processed");
  });

  var priorityOrder = { high: 0, normal: 1 };
  filtered.sort(function(a, b) {
    return (priorityOrder[a[priorityCol]] || 1) - (priorityOrder[b[priorityCol]] || 1);
  });

  var results = [];
  var cap = Math.min(limit, filtered.length);
  for (var i = 0; i < cap; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = filtered[i][j];
    }
    results.push(row);
  }
  return results;
}

/** Get recent script hooks from the last N days for deduplication */
function getRecentScripts(ss, days) {
  var sheet = ss.getSheetByName("scripts_generated");
  if (!sheet || sheet.getLastRow() < 2) return [];
  var all = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  var headers = all[0];
  var data = all.slice(1);

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  var dateCol = headers.indexOf("generated_date");
  var hookCol = headers.indexOf("hook");
  if (dateCol === -1 || hookCol === -1) return [];

  var results = [];
  for (var i = 0; i < data.length; i++) {
    var d = new Date(data[i][dateCol]);
    if (!isNaN(d.getTime()) && d >= cutoff && data[i][hookCol]) {
      results.push({ hook: data[i][hookCol] });
    }
  }
  return results;
}

/** ── TEXT FORMATTERS ── */

/** Generic: convert array of objects to numbered text lines */
function arrayToText(arr, fields) {
  if (!arr || arr.length === 0) return "(none)";
  var lines = [];
  for (var i = 0; i < arr.length; i++) {
    var parts = [];
    for (var f = 0; f < fields.length; f++) {
      var key = fields[f].key;
      var label = fields[f].label || key;
      var val = arr[i][key];
      if (val === null || val === undefined || val === "") continue;
      parts.push(label + ": " + val);
    }
    lines.push((i + 1) + ". " + parts.join(" | "));
  }
  return lines.join("\n");
}

function formatCompetitorReels(reels) {
  return arrayToText(reels, [
    {key: "hook", label: "hook"},
    {key: "topic", label: "topic"},
    {key: "angle", label: "angle"},
    {key: "views", label: "views"},
    {key: "hookScore", label: "score"},
    {key: "viralityScore", label: "virality"}
  ]);
}

function formatOwnContent(posts) {
  return arrayToText(posts, [
    {key: "reel_url", label: "url"},
    {key: "hook_used", label: "hook"},
    {key: "format", label: "format"},
    {key: "topic", label: "topic"},
    {key: "views", label: "views"},
    {key: "likes", label: "likes"},
    {key: "comments", label: "comments"},
    {key: "shares", label: "shares"},
    {key: "engagement_score", label: "engagement"}
  ]);
}

function formatTopHooks(hooks) {
  return arrayToText(hooks, [
    {key: "hook_text", label: "hook"},
    {key: "score", label: "score"},
    {key: "times_used_by_us", label: "used"},
    {key: "avg_performance_when_used", label: "avg_perf"}
  ]);
}

function formatRecentScripts(scripts) {
  if (!scripts || scripts.length === 0) return "(none)";
  var lines = [];
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].hook) lines.push((i + 1) + ". " + scripts[i].hook);
  }
  return lines.length > 0 ? lines.join("\n") : "(none)";
}

/** Get competitor reels from the last N days, sorted by view_rate descending */
function getRecentReels(ss, days, limit) {
  var sheet = ss.getSheetByName("competitor_reels");
  if (!sheet || sheet.getLastRow() < 2) return [];
  var all = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  var headers = all[0];
  var data = all.slice(1);

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  var dateCol = headers.indexOf("scraped_date");
  var viewRateCol = headers.indexOf("viralityScore");
  if (dateCol === -1 || viewRateCol === -1) return [];

  var filtered = data.filter(function(row) {
    var d = new Date(row[dateCol]);
    return !isNaN(d.getTime()) && d >= cutoff;
  });

  filtered.sort(function(a, b) {
    return (b[viewRateCol] || 0) - (a[viewRateCol] || 0);
  });

  var results = [];
  var cap = Math.min(limit, filtered.length);
  for (var i = 0; i < cap; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = filtered[i][j];
    }
    results.push(row);
  }
  return results;
}

/** ── NEW GETTERS ── */


/** Analyze own content for recurring patterns and return data-driven rules */
function getPatternRules(ss) {
  var sheet = ss.getSheetByName("own_content");
  if (!sheet || sheet.getLastRow() < 2) return { rules: ["Not enough data yet. Rules generate after 10+ posts have day-7 metrics."], stats: {}, sample_size: 0 };
  var all = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  var headers = all[0];
  var data = all.slice(1);

  var scoreCol = headers.indexOf("engagement_score");
  var formatCol = headers.indexOf("format");
  var topicCol = headers.indexOf("topic");
  var hookCol = headers.indexOf("hook_used");
  var likesCol = headers.indexOf("likes");
  var commentsCol = headers.indexOf("comments");
  var sharesCol = headers.indexOf("shares");
  if (scoreCol === -1) return { rules: ["No engagement_score column found."], stats: {}, sample_size: 0 };

  var scored = data.filter(function(row) { return (row[scoreCol] || 0) > 0; });
  if (scored.length < 10) {
    return { rules: ["Not enough data yet (" + scored.length + " posts tracked). Rules generate after 10+ posts have day-7 metrics."], stats: {}, sample_size: scored.length };
  }

  var rules = [];
  var stats = {};

  // Hook type detection
  var hookTypes = { stat: [], question: [], howto: [], controversy: [], story: [] };
  for (var i = 0; i < scored.length; i++) {
    var hook = String(scored[i][hookCol] || "").toLowerCase();
    var score = scored[i][scoreCol] || 0;
    if (/^\d|[\d]+ /.test(hook) || /\d+[xk%]/.test(hook)) hookTypes.stat.push(score);
    else if (/\?/.test(hook) || /^(do you|have you|what if|why do|how do)/.test(hook)) hookTypes.question.push(score);
    else if (/^(how to|here'?s how|the exact|step)/.test(hook)) hookTypes.howto.push(score);
    else if (/^(stop|don'?t|never|nobody|most people)/.test(hook)) hookTypes.controversy.push(score);
    else hookTypes.story.push(score);
  }

  var hookAvgs = {};
  for (var type in hookTypes) {
    if (hookTypes[type].length >= 2) {
      var sum = 0;
      for (var j = 0; j < hookTypes[type].length; j++) sum += hookTypes[type][j];
      hookAvgs[type] = { avg: Math.round(sum / hookTypes[type].length), count: hookTypes[type].length };
    }
  }
  stats.hook_types = hookAvgs;

  var sortedHookTypes = Object.keys(hookAvgs).sort(function(a, b) { return hookAvgs[b].avg - hookAvgs[a].avg; });
  if (sortedHookTypes.length >= 2) {
    var best = sortedHookTypes[0];
    var second = sortedHookTypes[1];
    var ratio = (hookAvgs[best].avg / hookAvgs[second].avg).toFixed(1);
    rules.push("PREFER " + best + " hooks -- " + ratio + "x higher avg engagement than " + second + " hooks (" + hookAvgs[best].count + " posts, avg: " + hookAvgs[best].avg + ")");
  }

  // Format analysis
  var formatGroups = {};
  for (var i = 0; i < scored.length; i++) {
    var fmt = String(scored[i][formatCol] || "unknown").trim();
    if (!formatGroups[fmt]) formatGroups[fmt] = [];
    formatGroups[fmt].push(scored[i][scoreCol] || 0);
  }

  var formatAvgs = {};
  for (var fmt in formatGroups) {
    if (formatGroups[fmt].length >= 2) {
      var sum = 0;
      for (var j = 0; j < formatGroups[fmt].length; j++) sum += formatGroups[fmt][j];
      formatAvgs[fmt] = { avg: Math.round(sum / formatGroups[fmt].length), count: formatGroups[fmt].length };
    }
  }
  stats.formats = formatAvgs;

  var sortedFormats = Object.keys(formatAvgs).sort(function(a, b) { return formatAvgs[b].avg - formatAvgs[a].avg; });
  if (sortedFormats.length >= 1) {
    var topFmt = sortedFormats[0];
    var pct = Math.round((formatAvgs[topFmt].count / scored.length) * 100);
    rules.push("TOP FORMAT: " + topFmt + " -- avg engagement " + formatAvgs[topFmt].avg + " (" + pct + "% of your top posts use it)");
  }

  // Topic analysis
  var topicGroups = {};
  for (var i = 0; i < scored.length; i++) {
    var topic = String(scored[i][topicCol] || "unknown").trim().toLowerCase();
    if (!topicGroups[topic]) topicGroups[topic] = [];
    topicGroups[topic].push(scored[i][scoreCol] || 0);
  }

  var topicAvgs = {};
  for (var topic in topicGroups) {
    if (topicGroups[topic].length >= 2) {
      var sum = 0;
      for (var j = 0; j < topicGroups[topic].length; j++) sum += topicGroups[topic][j];
      topicAvgs[topic] = { avg: Math.round(sum / topicGroups[topic].length), count: topicGroups[topic].length };
    }
  }
  stats.topics = topicAvgs;

  var sortedTopics = Object.keys(topicAvgs).sort(function(a, b) { return topicAvgs[b].avg - topicAvgs[a].avg; });
  for (var t = 0; t < Math.min(3, sortedTopics.length); t++) {
    var tp = sortedTopics[t];
    rules.push("HOT TOPIC: " + tp + " -- avg engagement " + topicAvgs[tp].avg + " (" + topicAvgs[tp].count + " posts)");
  }

  // Engagement breakdown for top 5
  scored.sort(function(a, b) { return (b[scoreCol] || 0) - (a[scoreCol] || 0); });
  var shareCount = 0, commentCount = 0, likeCount = 0;
  var top5 = Math.min(5, scored.length);
  for (var i = 0; i < top5; i++) {
    var likes = scored[i][likesCol] || 0;
    var comments = scored[i][commentsCol] || 0;
    var shares = scored[i][sharesCol] || 0;
    var weighted = (likes * 2) + (comments * 5) + (shares * 10);
    if (weighted > 0) {
      if ((shares * 10) / weighted > 0.4) shareCount++;
      else if ((comments * 5) / weighted > 0.4) commentCount++;
      else likeCount++;
    }
  }

  if (shareCount >= commentCount && shareCount >= likeCount) {
    rules.push("ENGAGEMENT PATTERN: Your top posts are share-heavy (utility content). Optimize for 'I need to send this to someone' reactions.");
  } else if (commentCount >= shareCount && commentCount >= likeCount) {
    rules.push("ENGAGEMENT PATTERN: Your top posts are comment-heavy (debate content). Lean into controversial takes and questions.");
  } else {
    rules.push("ENGAGEMENT PATTERN: Your top posts are like-heavy (agreement content). Your audience validates your takes but doesn't share or discuss deeply.");
  }

  return { rules: rules, stats: stats, sample_size: scored.length };
}


/** ── NEW TEXT FORMATTERS ── */


function formatPatternRules(patterns) {
  if (!patterns || !patterns.rules || patterns.rules.length === 0) return "(none)";
  var lines = [];
  for (var i = 0; i < patterns.rules.length; i++) {
    lines.push("RULE: " + patterns.rules[i]);
  }
  lines.push("(based on " + (patterns.sample_size || 0) + " tracked posts)");
  return lines.join("\n");
}

