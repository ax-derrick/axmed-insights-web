# Axmed Insights Web Application

## Project Overview

Axmed Insights Web is an internal dashboard application for the Axmed team to submit, analyze, and track customer feedback, call transcripts, and meeting notes. It replaces the Teams chatbot interface with a full-featured web application while maintaining the same N8N-powered AI backend.

### Mission Context

Axmed's mission is accelerating access to medicines in low/middle-income countries (LMICs). This tool helps the team:
- Capture customer interactions systematically
- Extract actionable insights from conversations
- Track pain points and feature requests
- Monitor customer sentiment over time

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                      │
├─────────────────────────────────────────────────────────────────┤
│  Pages:                                                          │
│  ├── Dashboard      - Overview widgets, metrics, activity feed   │
│  ├── Chat           - Submit transcripts, interact with AI       │
│  ├── Insights       - Sentiment trends, pain points, topics      │
│  ├── Action Items   - Tasks extracted from calls                 │
│  ├── Feature Reqs   - Aggregated feature requests                │
│  └── Settings       - Email subscriptions, preferences           │
├─────────────────────────────────────────────────────────────────┤
│  Services:                                                       │
│  └── N8N Integration - Webhook calls for AI processing           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     N8N WORKFLOWS (External)                     │
├─────────────────────────────────────────────────────────────────┤
│  Webhooks:                                                       │
│  ├── /process-transcript  - Analyze submitted content            │
│  ├── /get-insights        - Fetch aggregated insights            │
│  ├── /get-action-items    - Retrieve action items                │
│  ├── /get-feature-requests - Retrieve feature requests           │
│  └── /subscribe-email     - Manage email subscriptions           │
├─────────────────────────────────────────────────────────────────┤
│  AI Processing:                                                  │
│  ├── OpenAI/Claude integration                                   │
│  ├── Sentiment analysis                                          │
│  ├── Summary extraction                                          │
│  ├── Action item identification                                  │
│  └── Pain point detection                                        │
├─────────────────────────────────────────────────────────────────┤
│  Data Storage:                                                   │
│  └── Database (configured in N8N - Airtable/Notion/Postgres)     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend Framework** | React | 18.x | UI library |
| **Language** | TypeScript | 5.x | Type safety |
| **Build Tool** | Vite | 5.x | Fast dev server and bundler |
| **UI Components** | Ant Design | 5.21+ | Component library |
| **Icons** | @ant-design/icons | 5.x | Icon library |
| **Routing** | React Router DOM | 7.x | Client-side routing |
| **Markdown** | react-markdown | 9.x | Render AI responses |
| **Markdown Plugin** | remark-gfm | 4.x | GitHub Flavored Markdown |
| **File Parsing** | xlsx | 0.18+ | Excel/CSV bulk upload |
| **Deployment** | gh-pages | 6.x | GitHub Pages deployment |
| **Backend** | N8N | External | AI processing webhooks |

---

## Features

### 1. Dashboard (`/`)
The main overview page showing key metrics and recent activity.

**Widgets:**
- **Submission Stats** - Total transcripts, today's count, weekly trend
- **Sentiment Overview** - Pie/donut chart of positive/neutral/negative
- **Recent Activity Feed** - Latest 10 submissions with quick summaries
- **Open Action Items** - Count and urgency breakdown
- **Top Pain Points** - Top 5 most mentioned issues
- **Pending Feature Requests** - Count by priority

### 2. Chat / Submit (`/chat`)
Interface for submitting new content and interacting with the AI.

**Features:**
- Text input for pasting transcripts/notes
- File upload (drag & drop) for bulk processing
- Real-time AI response with markdown rendering
- Conversation history (session-based)
- Quick actions: "Summarize", "Extract Action Items", "Analyze Sentiment"

### 3. Insights (`/insights`)
Deep dive into analytics and trends.

**Sections:**
- **Sentiment Trends** - Line chart over time
- **Pain Points** - Word cloud + ranked list with frequency
- **Topic Clusters** - Auto-grouped themes
- **Customer Health** - Sentiment by customer/region (if tracked)
- **Filters** - Date range, sentiment type, keyword search

### 4. Action Items (`/action-items`)
Task management for extracted action items.

**Features:**
- List view with status (Open/In Progress/Completed)
- Source linking (which transcript it came from)
- Assignee field
- Due date
- Priority levels
- Filter by status, assignee, date

### 5. Feature Requests (`/feature-requests`)
Aggregated feature requests from customer feedback.

**Features:**
- Request cards with description
- Vote/priority count
- Status (New/Under Review/Planned/Completed)
- Source count (how many customers mentioned it)
- Category tags

### 6. Settings (`/settings`)
User preferences and email subscriptions.

**Email Subscriptions:**
- Daily Digest (toggle + time preference)
- Weekly Report (toggle + day preference)
- Instant Alerts for negative sentiment (toggle)
- Monthly Insights (toggle)

---

## Data Models

### Transcript/Submission
```typescript
interface Submission {
  id: string;
  content: string;
  type: 'transcript' | 'meeting_notes' | 'feedback';
  submittedBy: string;
  submittedAt: string;
  summary?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  actionItems?: ActionItem[];
  painPoints?: string[];
  featureRequests?: string[];
}
```

### Action Item
```typescript
interface ActionItem {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: string;
  sourceId: string; // Reference to submission
  createdAt: string;
  updatedAt: string;
}
```

### Feature Request
```typescript
interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'under_review' | 'planned' | 'in_progress' | 'completed';
  priority: number; // Vote count or calculated priority
  sourceCount: number; // How many submissions mentioned this
  category?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Insight/Analytics
```typescript
interface InsightsSummary {
  totalSubmissions: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topPainPoints: Array<{ text: string; count: number }>;
  topFeatureRequests: Array<{ title: string; count: number }>;
  recentTrend: 'improving' | 'stable' | 'declining';
}
```

### Email Subscription
```typescript
interface EmailSubscription {
  userId: string;
  email: string;
  dailyDigest: boolean;
  dailyDigestTime?: string; // e.g., "09:00"
  weeklyReport: boolean;
  weeklyReportDay?: string; // e.g., "monday"
  instantAlerts: boolean;
  monthlyInsights: boolean;
}
```

---

## N8N Webhook Contracts

### POST /process-transcript
Submit content for AI analysis.

**Request:**
```json
{
  "content": "Call transcript text...",
  "type": "transcript",
  "submittedBy": "user@axmed.co",
  "timestamp": "2024-01-29T10:00:00Z"
}
```

**Response:**
```json
{
  "id": "sub_123",
  "summary": "Customer discussed...",
  "sentiment": "positive",
  "actionItems": [
    { "title": "Follow up on pricing", "priority": "high" }
  ],
  "painPoints": ["Delivery delays", "Documentation unclear"],
  "featureRequests": ["Bulk ordering capability"]
}
```

### GET /get-insights
Fetch aggregated insights.

**Query Params:** `?startDate=2024-01-01&endDate=2024-01-31`

**Response:**
```json
{
  "totalSubmissions": 150,
  "sentimentBreakdown": { "positive": 80, "neutral": 50, "negative": 20 },
  "topPainPoints": [
    { "text": "Delivery delays", "count": 25 },
    { "text": "Pricing concerns", "count": 18 }
  ],
  "sentimentTrend": [
    { "date": "2024-01-01", "positive": 5, "neutral": 3, "negative": 1 }
  ]
}
```

### GET /get-action-items
Fetch action items list.

**Query Params:** `?status=open&assignee=user@axmed.co`

**Response:**
```json
{
  "items": [
    {
      "id": "ai_123",
      "title": "Follow up on pricing",
      "status": "open",
      "priority": "high",
      "sourceId": "sub_123",
      "createdAt": "2024-01-29T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1
}
```

### POST /subscribe-email
Update email subscription preferences.

**Request:**
```json
{
  "email": "user@axmed.co",
  "dailyDigest": true,
  "dailyDigestTime": "09:00",
  "weeklyReport": true,
  "weeklyReportDay": "monday",
  "instantAlerts": true,
  "monthlyInsights": false
}
```

---

## File Structure

```
axmed-insights-web/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppLayout.tsx        # Main layout wrapper
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   ├── Header.tsx           # Top header bar
│   │   │   └── index.ts
│   │   ├── Chat/
│   │   │   ├── ChatInput.tsx        # Message input with file upload
│   │   │   ├── ChatMessage.tsx      # Individual message bubble
│   │   │   ├── ChatHistory.tsx      # Message list
│   │   │   └── index.ts
│   │   ├── Dashboard/
│   │   │   ├── StatCard.tsx         # Metric card widget
│   │   │   ├── SentimentChart.tsx   # Pie/donut chart
│   │   │   ├── ActivityFeed.tsx     # Recent submissions list
│   │   │   ├── PainPointsList.tsx   # Top pain points
│   │   │   └── index.ts
│   │   ├── Insights/
│   │   │   ├── SentimentTrend.tsx   # Line chart over time
│   │   │   ├── WordCloud.tsx        # Pain points visualization
│   │   │   ├── TopicClusters.tsx    # Grouped themes
│   │   │   └── index.ts
│   │   ├── ActionItems/
│   │   │   ├── ActionItemCard.tsx   # Individual item card
│   │   │   ├── ActionItemList.tsx   # Filterable list
│   │   │   └── index.ts
│   │   ├── FeatureRequests/
│   │   │   ├── FeatureCard.tsx      # Individual request card
│   │   │   ├── FeatureList.tsx      # Filterable list
│   │   │   └── index.ts
│   │   ├── Settings/
│   │   │   ├── EmailSubscriptions.tsx
│   │   │   └── index.ts
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── index.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── InsightsPage.tsx
│   │   ├── ActionItemsPage.tsx
│   │   ├── FeatureRequestsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   ├── n8n.ts                   # N8N webhook integration
│   │   └── api.ts                   # API client wrapper
│   ├── hooks/
│   │   ├── useChat.ts               # Chat state management
│   │   ├── useInsights.ts           # Insights data fetching
│   │   └── useSubscription.ts       # Email subscription state
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   ├── formatters.ts            # Date, number formatters
│   │   └── fileParser.ts            # XLSX/CSV parsing
│   ├── context/
│   │   └── AppContext.tsx           # Global app state
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── .env.example                     # Environment variables template
├── .gitignore
├── index.html                       # HTML entry point
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── PROJECT_CONTEXT.md               # This file
└── README.md                        # Setup instructions
```

---

## Environment Variables

```env
# N8N Webhook URLs
VITE_N8N_BASE_URL=https://your-n8n-instance.com
VITE_N8N_PROCESS_TRANSCRIPT=/webhook/process-transcript
VITE_N8N_GET_INSIGHTS=/webhook/get-insights
VITE_N8N_GET_ACTION_ITEMS=/webhook/get-action-items
VITE_N8N_GET_FEATURE_REQUESTS=/webhook/get-feature-requests
VITE_N8N_SUBSCRIBE_EMAIL=/webhook/subscribe-email

# App Configuration
VITE_APP_NAME=Axmed Insights
```

---

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

---

## Deployment

The app is deployed to GitHub Pages using the `gh-pages` package.

1. Update `vite.config.ts` with the correct `base` path
2. Run `npm run deploy`
3. Access at `https://[username].github.io/axmed-insights-web/`

---

## Future Enhancements

- [ ] Microsoft Entra ID authentication
- [ ] Real-time updates via WebSocket
- [ ] Mobile-responsive design improvements
- [ ] Export reports to PDF
- [ ] Slack/Teams integration for notifications
- [ ] Custom dashboard widget arrangement
- [ ] Advanced search with filters
- [ ] Bulk action item management
