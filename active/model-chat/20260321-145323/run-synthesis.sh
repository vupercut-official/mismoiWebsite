#!/bin/bash
unset CLAUDECODE

BASEDIR="$1"

SYNTHESIS_PROMPT=$(cat "$BASEDIR/synthesis-prompt.txt")
TRANSCRIPT=$(cat "$BASEDIR/transcript.txt")

FULL_PROMPT="${SYNTHESIS_PROMPT}

## Debate Transcript

${TRANSCRIPT}"

echo "$FULL_PROMPT" | claude -p --model sonnet --output-format text --no-session-persistence --tools "" > "$BASEDIR/synthesis-raw.txt" 2>/dev/null

echo "Synthesis complete."
