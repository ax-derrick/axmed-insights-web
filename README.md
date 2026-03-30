# Axmed Insights Web

Internal dashboard for analyzing customer feedback, call transcripts, and meeting notes.

## Features

- **Dashboard** - Overview of submissions, sentiment, and activity
- **Submit & Chat** - Submit transcripts and interact with AI analysis
- **Insights** - Sentiment trends, pain points, topic clusters
- **Action Items** - Track tasks extracted from conversations
- **Feature Requests** - Aggregated customer feature requests
- **Email Subscriptions** - Daily digest, weekly reports, instant alerts

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Ant Design 5.21 (UI components)
- React Router DOM 7 (routing)
- react-markdown + remark-gfm (markdown rendering)
- xlsx (file parsing)
- N8N (backend AI processing)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure N8N webhook URL in .env
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:5173/axmed-insights-web/
```

### Production Build

```bash
# Build for production
npm run build

# Preview build
npm run preview
```

### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

## Configuration

Create a `.env` file with your N8N configuration:

```env
VITE_N8N_BASE_URL=https://your-n8n-instance.com
VITE_N8N_PROCESS_TRANSCRIPT=/webhook/process-transcript
VITE_N8N_GET_INSIGHTS=/webhook/get-insights
VITE_N8N_GET_ACTION_ITEMS=/webhook/get-action-items
VITE_N8N_GET_FEATURE_REQUESTS=/webhook/get-feature-requests
VITE_N8N_SUBSCRIBE_EMAIL=/webhook/subscribe-email
```

## N8N Webhook Integration

The app expects these N8N webhook endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhook/process-transcript` | POST | Submit content for AI analysis |
| `/webhook/get-insights` | GET | Fetch aggregated insights |
| `/webhook/get-action-items` | GET | Retrieve action items |
| `/webhook/get-feature-requests` | GET | Retrieve feature requests |
| `/webhook/subscribe-email` | POST | Manage email subscriptions |

See [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for detailed API contracts.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # App layout (sidebar, header)
│   ├── Dashboard/      # Dashboard widgets
│   ├── Chat/           # Chat interface
│   ├── Insights/       # Analytics visualizations
│   ├── ActionItems/    # Action item cards
│   ├── FeatureRequests/# Feature request cards
│   ├── Settings/       # Settings components
│   └── common/         # Shared components
├── pages/              # Page components
├── services/           # API/N8N integration
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
├── utils/              # Utility functions
└── context/            # React context providers
```

## License

Internal use only - Axmed
