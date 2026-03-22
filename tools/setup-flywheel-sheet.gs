/**
 * Content Flywheel Database Setup
 *
 * HOW TO USE:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Run > setupFlywheelDatabase
 * 5. Grant permissions when prompted
 * 6. Done. All 8 tabs created, formatted, and pre-filled.
 */

var FORMAT_TAGS = ['talking_head', 'split_screen', 'mural_board', 'b_roll', 'text_overlay', 'screen_share', 'mixed'];
var FUNNEL_POSITIONS = ['TOF', 'MOF', 'BOF'];
var VALIDATION_ROW_LIMIT = 1000;

function setupFlywheelDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Guard: warn if tabs already have data (prevents accidental data wipe)
  var existingTabs = ['config', 'brand_profile', 'competitor_reels', 'hooks_library',
                      'own_content', 'scripts_generated', 'customer_intelligence', 'monthly_outliers'];
  for (var i = 0; i < existingTabs.length; i++) {
    var existing = ss.getSheetByName(existingTabs[i]);
    if (existing && existing.getLastRow() > 1) {
      var ui = SpreadsheetApp.getUi();
      var response = ui.alert('Warning',
        'Tab "' + existingTabs[i] + '" already has data (' + (existing.getLastRow() - 1) + ' rows). ' +
        'Running setup will ERASE all data in all tabs. Continue?',
        ui.ButtonSet.YES_NO);
      if (response !== ui.Button.YES) {
        Logger.log('Setup cancelled by user.');
        return;
      }
      break;
    }
  }

  // Delete default Sheet1 if it exists and is empty
  var defaultSheet = ss.getSheetByName('Sheet1');

  createConfigTab(ss);
  createBrandProfileTab(ss);
  createCompetitorReelsTab(ss);
  createHooksLibraryTab(ss);
  createOwnContentTab(ss);
  createScriptsGeneratedTab(ss);
  createCustomerIntelligenceTab(ss);
  createMonthlyOutliersTab(ss);

  // Delete default sheet after creating others
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) { Logger.log('Could not delete Sheet1: ' + e.message); }
  }

  SpreadsheetApp.flush();
  Logger.log('Flywheel database setup complete.');
}

// ============================================================
// TAB 1: config
// ============================================================
function createConfigTab(ss) {
  var sheet = ss.getSheetByName('config') || ss.insertSheet('config');
  sheet.clear();

  var headers = ['field_name', 'value'];
  sheet.getRange(1, 1, 1, 2).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#e7f5ff');
  sheet.setFrozenRows(1);

  var configData = [
    ['competitor_usernames', 'hormozi, imangadzhi, codiesanchez, matthgray, brockjohnsonofficial, zachpogrob, vanessalau.co, nick_saraev, jordanplatten, charliemorganbiz, aiautomation.cc, lvl_aiautomations, youngsters_worldwide'],
    ['niche_keywords', 'AI automation, content creation systems, SMMA automation, AI agents, content flywheel, creator economy, short-form strategy, Make.com, n8n, workflow automation, AI consulting'],
    ['brand_voice', 'Casual, straight to point, no fluff. Technical but accessible. Talk like a builder showing his work, not a marketer selling a dream. Short sentences. Real examples. No corporate speak.'],
    ['funnel_tof', 'Broad hooks, viral potential, reach. Goal: new followers who don\'t know you. Topics: hot takes on AI, relatable creator/agency problems, surprising results.'],
    ['funnel_mof', 'Authority, expertise, case studies, how-to. Goal: trust and credibility. Topics: system breakdowns, behind-the-scenes, client results, tutorials.'],
    ['funnel_bof', 'Testimonials, offers, specific results. Goal: book a call. Topics: case studies with numbers, before/after, direct offers.'],
    ['icp_creators', 'Content creators doing $10K+/mo who are drowning in manual content work. Post inconsistently, no ideation system, waste hours editing. Want AI to handle grunt work.'],
    ['icp_smma', 'SMMA owners doing $20K+/mo who need automation to scale without hiring. Stuck doing everything manually, can\'t onboard fast enough, want systems that run without them.'],
    ['pillar_1', 'AI automation demos and live builds (show the backend, Make.com scenarios running)'],
    ['pillar_2', 'Content creation systems (flywheel concept, data-driven content, competitor analysis)'],
    ['pillar_3', 'Business results and case studies (what the automation produced, real numbers)'],
    ['pillar_4', 'Behind-the-scenes of running an AI automation business (day in the life, tools)'],
    ['pillar_5', 'Hot takes on AI tools and trends (what\'s useful vs hype, comparisons, predictions)'],
    ['view_rate_threshold', '0.03'],
    ['scripts_per_day', '5'],
    ['mof_ratio', '3'],
    ['tof_ratio', '2']
  ];

  sheet.getRange(2, 1, configData.length, 2).setValues(configData);
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 600);
  sheet.getRange(2, 1, configData.length, 1).setFontWeight('bold');
}

// ============================================================
// TAB 2: brand_profile
// ============================================================
function createBrandProfileTab(ss) {
  var sheet = ss.getSheetByName('brand_profile') || ss.insertSheet('brand_profile');
  sheet.clear();

  var headers = ['field_name', 'value'];
  sheet.getRange(1, 1, 1, 2).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#fff9db');
  sheet.setFrozenRows(1);

  var profileData = [
    ['who_i_am', '[FILL IN] Your background, what you do, how you got here. Example: "I\'m Vu Tran, AI automation freelancer. I build systems using Make.com, Claude, and Google Workspace that help businesses make money or save time. Based in EST."'],
    ['my_offer', '[FILL IN] What you sell, who you sell to, what they get. Example: "I build AI content creation systems for content creators and SMMA owners. Setup fee + monthly retainer. They get a fully automated content flywheel that generates scripts, tracks performance, and compounds results."'],
    ['my_icp', '[FILL IN] Who your ideal client is, in detail. Their pain points in THEIR words. Example: "Content creators doing $10K+/mo who say things like \'I just need someone to tell me what to post\' and \'I spend 20 hours a week on content and still can\'t be consistent.\'"'],
    ['my_voice', '[FILL IN] How you talk. Phrases you use. Phrases you never use. Example: "Casual, straight to point. I say \'here\'s exactly what I built\' not \'unlock your potential.\' I use numbers and specifics. I never say \'leverage\', \'synergy\', or \'game-changer.\' I talk like I\'m showing a friend my work."'],
    ['my_story', '[FILL IN] 1-2 stories from your journey that can be referenced in content. Example: "I started by building automation systems for restaurants. One system saved a client 15 hours per week on influencer outreach. That proved the model. Now I\'m applying the same approach to content creators and agencies."'],
    ['my_differentiator', '[FILL IN] Why you and not someone else. Example: "I actually use these systems myself. This isn\'t theory. I built a content flywheel that scrapes competitors, generates scripts with AI, and doubles down on winners every week. Most people talk about AI. I show the backend running."'],
    ['phrases_to_use', '[FILL IN] Exact phrases that should appear in your content. Example: "here\'s the backend, let me show you, this is what the data says, built this in Make.com, this actually works"'],
    ['phrases_to_avoid', '[FILL IN] Phrases to never use. Example: "game-changer, unlock, leverage, synergy, revolutionary, cutting-edge, next-level, crush it, 10x"']
  ];

  sheet.getRange(2, 1, profileData.length, 2).setValues(profileData);
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 700);
  sheet.getRange(2, 1, profileData.length, 1).setFontWeight('bold');

  // Yellow highlight on all [FILL IN] cells
  var range = sheet.getRange(2, 2, profileData.length, 1);
  var values = range.getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString().indexOf('[FILL IN]') === 0) {
      sheet.getRange(i + 2, 2).setBackground('#fff3cd');
    }
  }
}

// ============================================================
// TAB 3: competitor_reels
// ============================================================
function createCompetitorReelsTab(ss) {
  var sheet = ss.getSheetByName('competitor_reels') || ss.insertSheet('competitor_reels');
  sheet.clear();

  var headers = [
    'username', 'reel_url', 'caption', 'hook', 'body_structure',
    'cta_type', 'format_tag', 'topic', 'angle', 'hook_score',
    'views', 'likes', 'comments', 'view_rate', 'scraped_date'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#f3d9fa');
  sheet.setFrozenRows(1);

  // Data validation for body_structure
  var bodyRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['story', 'listicle', 'problem-solution', 'before-after', 'how-to', 'myth-bust', 'hot-take'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 5, VALIDATION_ROW_LIMIT, 1).setDataValidation(bodyRule);

  // Data validation for cta_type
  var ctaRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['follow', 'comment', 'save', 'link_in_bio', 'dm_me', 'book_a_call', 'none'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 6, VALIDATION_ROW_LIMIT, 1).setDataValidation(ctaRule);

  // Data validation for format_tag
  var formatRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(FORMAT_TAGS)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 7, VALIDATION_ROW_LIMIT, 1).setDataValidation(formatRule);

  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 110);
  sheet.setColumnWidth(8, 180);
  sheet.setColumnWidth(9, 180);
  sheet.setColumnWidth(10, 80);
  sheet.setColumnWidth(14, 80);
  sheet.setColumnWidth(15, 100);
}

// ============================================================
// TAB 4: hooks_library
// ============================================================
function createHooksLibraryTab(ss) {
  var sheet = ss.getSheetByName('hooks_library') || ss.insertSheet('hooks_library');
  sheet.clear();

  var headers = [
    'hook_text', 'source', 'topic', 'format', 'niche',
    'best_view_rate', 'times_used_by_us', 'avg_performance_when_used', 'score'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#f8f0fc');
  sheet.setFrozenRows(1);

  // Data validation for source
  var sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['competitor', 'own'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 2, VALIDATION_ROW_LIMIT, 1).setDataValidation(sourceRule);

  sheet.setColumnWidth(1, 350);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(9, 80);
}

// ============================================================
// TAB 5: own_content
// ============================================================
function createOwnContentTab(ss) {
  var sheet = ss.getSheetByName('own_content') || ss.insertSheet('own_content');
  sheet.clear();

  var headers = [
    'reel_url', 'post_date', 'script_id', 'hook_used', 'format',
    'topic', 'funnel_position', 'views_day1', 'views_day3', 'views_day7',
    'likes', 'comments', 'saves', 'shares', 'follower_delta', 'calls_booked_attributed'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#fff4e6');
  sheet.setFrozenRows(1);

  // Data validation for funnel_position
  var funnelRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(FUNNEL_POSITIONS)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 7, VALIDATION_ROW_LIMIT, 1).setDataValidation(funnelRule);

  // Data validation for format
  var formatRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(FORMAT_TAGS)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 5, VALIDATION_ROW_LIMIT, 1).setDataValidation(formatRule);

  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(6, 180);
}

// ============================================================
// TAB 6: scripts_generated
// ============================================================
function createScriptsGeneratedTab(ss) {
  var sheet = ss.getSheetByName('scripts_generated') || ss.insertSheet('scripts_generated');
  sheet.clear();

  var headers = [
    'script_id', 'generated_date', 'funnel_position', 'hook', 'body',
    'cta', 'format_recommendation', 'topic', 'angle',
    'source_inspiration', 'why_this_will_work', 'status'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#d3f9d8');
  sheet.setFrozenRows(1);

  // Data validation for funnel_position
  var funnelRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(FUNNEL_POSITIONS)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 3, VALIDATION_ROW_LIMIT, 1).setDataValidation(funnelRule);

  // Data validation for status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['generated', 'selected', 'filmed', 'posted', 'skipped'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 12, VALIDATION_ROW_LIMIT, 1).setDataValidation(statusRule);

  // Data validation for format_recommendation
  var formatRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(FORMAT_TAGS)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 7, VALIDATION_ROW_LIMIT, 1).setDataValidation(formatRule);

  // Conditional formatting for status
  var range = sheet.getRange('L2:L1000');
  var rules = [];

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('posted')
    .setBackground('#d3f9d8')
    .setRanges([range])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('skipped')
    .setBackground('#f8f9fa')
    .setFontColor('#868e96')
    .setRanges([range])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('selected')
    .setBackground('#fff9db')
    .setRanges([range])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('filmed')
    .setBackground('#e7f5ff')
    .setRanges([range])
    .build());

  sheet.setConditionalFormatRules(rules);

  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 400);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(10, 250);
  sheet.setColumnWidth(11, 250);
  sheet.setColumnWidth(12, 100);
}

// ============================================================
// TAB 7: customer_intelligence
// ============================================================
function createCustomerIntelligenceTab(ss) {
  var sheet = ss.getSheetByName('customer_intelligence') || ss.insertSheet('customer_intelligence');
  sheet.clear();

  var headers = [
    'source', 'date', 'what_sold_them', 'what_confused_them',
    'content_that_triggered_action', 'pain_point', 'objection', 'language_used'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#fff3e0');
  sheet.setFrozenRows(1);

  // Data validation for source
  var sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['sales_call', 'dm', 'comment', 'form'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 1, VALIDATION_ROW_LIMIT, 1).setDataValidation(sourceRule);

  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 250);
  sheet.setColumnWidth(6, 250);
  sheet.setColumnWidth(7, 250);
  sheet.setColumnWidth(8, 300);
}

// ============================================================
// TAB 8: monthly_outliers
// ============================================================
function createMonthlyOutliersTab(ss) {
  var sheet = ss.getSheetByName('monthly_outliers') || ss.insertSheet('monthly_outliers');
  sheet.clear();

  var headers = [
    'month', 'reel_url', 'views', 'engagement_rate', 'hook',
    'format', 'topic', 'why_it_worked', 'pattern_tags'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold')
    .setBackground('#fff0f6');
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(5, 300);
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 300);
  sheet.setColumnWidth(9, 200);
}
