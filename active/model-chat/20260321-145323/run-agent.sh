#!/bin/bash
# Usage: bash run-agent.sh <agent_id> <round> <basedir>
# Framing is read from $basedir/framing_$agent_id.txt

unset CLAUDECODE

AGENT_ID="$1"
ROUND="$2"
BASEDIR="$3"

TOPIC=$(cat "$BASEDIR/topic.txt")
FRAMING=$(cat "$BASEDIR/framing_${AGENT_ID}.txt")

if [ "$ROUND" -eq 1 ]; then
  TRANSCRIPT_SECTION="This is round 1. No prior discussion yet. Open with your initial take on the topic."
else
  TRANSCRIPT_SECTION=$(cat "$BASEDIR/transcript.txt")
fi

cat <<ENDPROMPT | claude -p --model sonnet --output-format text --no-session-persistence --tools "" > "$BASEDIR/round${ROUND}_${AGENT_ID}.txt" 2>/dev/null
You are one of 5 AI participants in a collaborative debate room. Your role is to help solve a problem through genuine intellectual discourse.

${FRAMING}

Rules of engagement:
- Read all previous messages carefully before responding.
- Build on, challenge, or refine what others have said -- do not just repeat your own position.
- If you agree with someone, say so briefly and add something new.
- If you disagree, explain WHY with concrete reasoning.
- Be concise. 150-300 words max per response. No filler.
- Use your unique perspective -- that is why you are here.
- Address other participants directly when responding to their points.
- It is fine to change your mind if someone makes a compelling argument.

Format: Start your response with [${AGENT_ID}]: then your contribution. No preamble.

Topic for debate:
${TOPIC}

Debate transcript so far:
${TRANSCRIPT_SECTION}

It is your turn. Respond to the discussion above. Build on, challenge, or refine what has been said.
ENDPROMPT

echo "Done: $AGENT_ID round $ROUND"
