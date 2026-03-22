#!/usr/bin/env python3
"""
Gemini API client for generating HTML from prompts.
Reads GEMINI_API_KEY from .env file and prompt from stdin.
Outputs generated HTML to stdout.
"""

import sys
import json
import os
import urllib.request
import urllib.error
import re

def parse_env_file(filepath: str = ".env") -> dict:
    """Parse .env file and return dict of key-value pairs.

    Args:
        filepath: Path to .env file

    Returns:
        Dictionary of environment variables
    """
    env_vars = {}
    try:
        with open(filepath, "r") as f:
            for line in f:
                line = line.strip()
                # Skip blank lines and comments
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    env_vars[key.strip()] = value.strip()
    except FileNotFoundError:
        pass
    return env_vars

def get_api_key() -> str:
    """Get GEMINI_API_KEY from environment or .env file.

    Returns:
        API key string

    Raises:
        SystemExit: If API key is not found
    """
    # Check system environment first
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        return api_key

    # Fall back to .env file
    env_vars = parse_env_file()
    api_key = env_vars.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in environment or .env file", file=sys.stderr)
        sys.exit(1)
    return api_key

def call_gemini(prompt_text: str, model: str = "gemini-2.5-flash",
                max_output_tokens: int = 65536, temperature: float = 0.3,
                system_instruction: str = None) -> str:
    """Call Gemini API with the given prompt and return response.

    Args:
        prompt_text: The prompt to send to Gemini
        model: Model ID to use (default: gemini-2.5-flash)
        max_output_tokens: Maximum tokens in response (default: 65536)
        temperature: Sampling temperature (default: 0.3)
        system_instruction: Optional system instruction for the model

    Returns:
        Response text from Gemini API

    Raises:
        SystemExit: If API call fails
    """
    api_key = get_api_key()

    # Use API key in header, not URL (prevents logging in access logs/history)
    # v1beta supports latest models and generationConfig
    api_version = "v1beta" if "2.5" in model else "v1"
    url = f"https://generativelanguage.googleapis.com/{api_version}/models/{model}:generateContent"

    request_body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text}
                ]
            }
        ],
        "generationConfig": {
            "maxOutputTokens": max_output_tokens,
            "temperature": temperature
        }
    }

    if system_instruction:
        request_body["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }

    request_json = json.dumps(request_body)
    request_bytes = request_json.encode("utf-8")

    req = urllib.request.Request(
        url,
        data=request_bytes,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
    )

    try:
        with urllib.request.urlopen(req) as response:
            response_data = json.loads(response.read().decode("utf-8"))

            # Extract text from response with bounds checking
            if "candidates" in response_data and len(response_data["candidates"]) > 0:
                candidate = response_data["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    parts = candidate["content"]["parts"]
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]

            print("ERROR: Unexpected response format from Gemini API", file=sys.stderr)
            print(json.dumps(response_data, indent=2), file=sys.stderr)
            sys.exit(1)

    except urllib.error.HTTPError as e:
        # Safely read error body with fallback
        try:
            error_body = e.read().decode("utf-8")
        except Exception:
            error_body = "[Unable to read error body]"
        print(f"ERROR: HTTP {e.code} from Gemini API", file=sys.stderr)
        print(error_body, file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        # Include exception type for debugging
        print(f"ERROR: {type(e).__name__}: {str(e)}", file=sys.stderr)
        sys.exit(1)

def extract_html(response_text: str) -> str:
    """Extract HTML from Gemini response (handles code blocks).

    Tries patterns in order:
    1. ```html code block with optional whitespace
    2. ``` code block without language tag
    3. Raw <!DOCTYPE HTML
    4. Fallback to full response

    Args:
        response_text: Raw response from Gemini API

    Returns:
        Extracted HTML string
    """
    # Try to extract from ```html code block (permissive whitespace)
    match = re.search(r"```(?:html)?\s*\n(.*?)\n```", response_text, re.DOTALL)
    if match:
        return match.group(1)

    # Try without newline requirement
    match = re.search(r"```(?:html)?\s*(.*?)```", response_text, re.DOTALL)
    if match:
        return match.group(1)

    # If no code block, assume entire response is HTML
    if response_text.strip().startswith("<!DOCTYPE"):
        return response_text.strip()

    # Last resort: find the <html> tag
    match = re.search(r"<!DOCTYPE[^>]*>.*", response_text, re.DOTALL)
    if match:
        return match.group(0)

    return response_text

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate HTML via Gemini API")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Gemini model ID")
    parser.add_argument("--max-tokens", type=int, default=65536, help="Max output tokens")
    parser.add_argument("--temperature", type=float, default=0.3, help="Temperature")
    parser.add_argument("--system", default=None, help="System instruction")
    args = parser.parse_args()

    # Read prompt from stdin
    prompt_text = sys.stdin.read()

    if not prompt_text.strip():
        print("ERROR: No prompt provided on stdin", file=sys.stderr)
        sys.exit(1)

    response = call_gemini(prompt_text, model=args.model,
                           max_output_tokens=args.max_tokens,
                           temperature=args.temperature,
                           system_instruction=args.system)

    # Extract and output HTML
    html = extract_html(response)
    # Use UTF-8 encoding to handle Unicode characters
    sys.stdout.reconfigure(encoding='utf-8')
    print(html)

if __name__ == "__main__":
    main()
