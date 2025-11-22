#!/bin/bash

# Load GEMINI_API_KEY from env.json if not already set
if [ -z "$GEMINI_API_KEY" ]; then
  if [ -f "env.json" ]; then
    echo "Loading GEMINI_API_KEY from env.json..."
    GEMINI_API_KEY=$(node -p "JSON.parse(require('fs').readFileSync('env.json', 'utf8')).MatchSimulatorFunction.GEMINI_API_KEY")
  fi
fi

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
  echo "Error: GEMINI_API_KEY is not set"
  echo "Please either:"
  echo "  1. Set environment variable: export GEMINI_API_KEY='your-api-key'"
  echo "  2. Add it to env.json file"
  exit 1
fi

# Build and deploy
echo "Building backend..."
pnpm run build
pnpm run sam:build

echo "Deploying to AWS..."
sam deploy \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset \
  --parameter-overrides "GeminiApiKey=${GEMINI_API_KEY}"

echo "Deployment complete!"
