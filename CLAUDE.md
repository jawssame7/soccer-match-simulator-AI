# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Soccer Match Simulator - An AI-powered web application that simulates soccer matches using real European league players. Built with React + TypeScript frontend and AWS Lambda backend using Gemini API for match simulation.

## Development Commands

### Package Management (pnpm workspace)

```bash
# Install all dependencies
pnpm install

# Run specific workspace commands
pnpm --filter frontend <command>
pnpm --filter backend <command>
```

### Development

```bash
# Start frontend development server (port 3000)
pnpm dev:frontend

# Watch backend TypeScript compilation
pnpm dev:backend
```

### Building

```bash
# Build both frontend and backend
pnpm build

# Build individually
pnpm build:frontend  # Creates production build in frontend/build/
pnpm build:backend   # Compiles TypeScript to backend/dist/
```

### Code Quality

```bash
# Format, lint, and organize imports (run before commits)
pnpm check

# Individual operations
pnpm format  # Format code with Biome
pnpm lint    # Lint and auto-fix with Biome
```

### Local Development with SAM

```bash
# Prerequisites: Install AWS SAM CLI
# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

# 1. Set up environment variables (first time only)
# Edit backend/env.json and add your GEMINI_API_KEY

# 2. Build the backend
pnpm build:backend

# 3. Start local API server (runs on http://localhost:3001)
pnpm sam:start

# 4. In another terminal, start frontend (runs on http://localhost:3000)
pnpm dev:frontend

# Alternative: Invoke function directly with test event (Man City vs Arsenal)
pnpm sam:invoke
```

**Note**: Frontend is configured to call `http://localhost:3001` via `frontend/.env.local`

### Backend Deployment

```bash
# Option 1: Manual zip upload
cd backend
pnpm run package  # Creates function.zip for Lambda deployment

# Option 2: Deploy with SAM (recommended)
pnpm sam:build
pnpm sam:deploy  # Interactive guided deployment
```

## Architecture

### Monorepo Structure

This is a **pnpm workspace** with two main packages:

- `frontend/` - React SPA that collects team data and displays match results
- `backend/` - AWS Lambda function that calls Gemini API for match simulation

Type definitions are duplicated in both packages (`types.ts` in backend, separate type files in frontend) to maintain independence for deployment.

### Data Flow

1. **User Input (Frontend)** → TeamInput component collects:
   - Team name, manager, formation, 11 players with positions
   - Validates minimum requirements (team names, manager names, 11 players each, at least 1 GK)

2. **API Call (Frontend)** → `services/api.ts`:
   - POSTs to `/simulate-match` endpoint
   - Sends `SimulateMatchRequest` with homeTeam and awayTeam

3. **Lambda Handler (Backend)** → `index.ts`:
   - Validates request structure
   - Passes to MatchSimulator

4. **Match Simulation (Backend)**:
   - `matchSimulator.ts` validates teams (11 players, positions, etc.)
   - `geminiService.ts` builds detailed prompt including:
     - Manager tactical styles and philosophies
     - 2024-25 league trends (Premier League, La Liga, Serie A, Bundesliga)
     - Player names and positions
     - Instructions for AI to generate weather conditions, match flow, goals, highlights, statistics
   - Gemini API returns JSON response
   - Response is parsed and validated

5. **Display Results (Frontend)**:
   - `MatchResult.tsx` shows scoreboard, weather, match flow
   - Goals timeline with scorer, assist, description
   - Highlights with timestamps
   - `Statistics.tsx` displays possession, shots, cards with visual bars

### Key Design Decisions

**Gemini Prompt Engineering**: The prompt in `geminiService.ts` is critical. It instructs the AI to:
- Consider real player abilities and manager tactics
- Apply 2024-25 season league trends (tactical styles vary by league)
- Generate random but realistic weather/pitch conditions
- Ensure variability in match outcomes
- Return structured JSON with all required fields

**Type Safety**: `useImportType` Biome rule enforced - use `import type` for type-only imports to optimize bundle size.

**Form Accessibility**: All labels must have `htmlFor` attributes linking to input `id`s (enforced by Biome's `noLabelWithoutControl` rule).

**Array Keys**: Avoid using array indices as React keys. Use unique identifiers like `goal-${minute}-${scorer}` or `player-${index}-${name}`.

## Environment Variables

### Backend (Lambda)

- `GEMINI_API_KEY` - Required for Gemini API calls (set in Lambda environment)

### Frontend

- `REACT_APP_API_ENDPOINT` - API Gateway URL (optional)
  - Development: Not needed (uses proxy in `package.json` → `http://localhost:3001`)
  - Production: Set to your API Gateway URL in `.env.production`

## Code Style (Biome)

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS/TS, double quotes for JSON
- **Semicolons**: Always required
- **Line width**: 100 characters
- **Import organization**: Auto-organized on save/check

## API Contract

### POST /simulate-match

Request must include `homeTeam` and `awayTeam` objects with:
- `name`: string
- `manager`: string
- `formation`: string (e.g., "4-3-3")
- `players`: array of 11 objects with `name` and `position` (GK/DF/MF/FW)

Response includes:
- `score` (home, away, halfTime scores)
- `matchFlow` (firstHalf, secondHalf narrative)
- `goals` array (minute, team, scorer, assist, description)
- `highlights` array (minute, description)
- `statistics` (possession %, shots, shotsOnTarget, corners, fouls, cards)
- `weather` (condition, temperature, pitchCondition)

## Validation Rules

**Team Validation** (enforced in `matchSimulator.ts`):
- Team name, manager, formation must be non-empty strings
- Exactly 11 players required
- Each player must have non-empty name and position
- At least 1 player must have position "GK"

**Response Validation**:
- Possession percentages (home + away) should sum to ~100 (±1% tolerance)
- All required fields must be present in Gemini response

## Deployment Notes

- Frontend deploys to **S3 + CloudFront** (static files)
- Backend deploys to **AWS Lambda** with API Gateway trigger
- CORS must be enabled on API Gateway for `/simulate-match` endpoint
- Lambda requires Node.js 18+ runtime
- Package backend with `pnpm run package` before deploying to Lambda

## Future Extensions (from spec)

Planned features not yet implemented:
- Formation diagram visualization
- Match history persistence
- Player performance ratings during match
- League/tournament simulations
