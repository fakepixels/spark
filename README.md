# Spark - AI-Powered Presentation Builder

Build beautiful, zero-dependency HTML presentations through natural language conversation with Claude.

## Features

- **Conversational Interface**: Chat with Claude to create presentations
- **Smart Content Discovery**: Guided questions to understand your needs
- **Style Previews**: Choose from 3 unique design styles
- **Real-time Preview**: See your presentation as it's built
- **Single HTML Export**: Download as a standalone HTML file
- **Iterative Editing**: Request changes conversationally

## Architecture

```
spark/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
└── shared/           # Shared type definitions
```

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Daytona account ([Sign up here](https://www.daytona.io/))

### 1. Clone and Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example backend/.env

# Edit backend/.env and add your keys:
# - DAYTONA_API_KEY=your_key_here
```

### 3. Daytona Setup

1. Sign up at https://www.daytona.io/
2. Create API Key in Settings → API Keys
3. Create workspace template "spark-html-generator":
   - Base image: `node:20-alpine`
   - CPU: 0.5 cores
   - Memory: 512 MB
   - Timeout: 30 minutes
4. Add API key to `backend/.env`

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173

## Usage

1. Open the app and enter your Anthropic API key
2. Answer 3 content discovery questions
3. Select from 3 generated style previews
4. Watch as Claude generates your presentation
5. Request modifications ("make title bigger")
6. Export as a single HTML file

## Project Status

Currently implementing Phase 0 (Project Setup) ✓

### Roadmap

- [x] Phase 0: Project Setup & Configuration
- [ ] Phase 1: Authentication & API Key Flow
- [ ] Phase 2: Basic Chat Interface
- [ ] Phase 3: Content Discovery Questions
- [ ] Phase 4: Style Preview Generation
- [ ] Phase 5: Full HTML Generation
- [ ] Phase 6: Iteration & Export
- [ ] Phase 7: Polish & Error Handling

## Technology Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- Axios (HTTP client)

**Backend:**
- Node.js 20+
- Express 5
- TypeScript
- Anthropic SDK
- Daytona SDK (planned)

## License

MIT
