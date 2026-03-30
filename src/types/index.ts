// Submission Types
export type SubmissionType = 'transcript' | 'meeting_notes' | 'feedback';
export type SentimentType = 'positive' | 'neutral' | 'negative' | 'Positive' | 'Neutral' | 'Negative';

export interface Submission {
  id: string;
  content: string;
  type: SubmissionType;
  submittedBy: string;
  submittedAt: string;
  summary?: string;
  sentiment?: SentimentType;
  actionItems?: ActionItem[];
  painPoints?: string[];
  featureRequests?: string[];
}

// Dashboard Summary (from /webhook/webhook/dashboard-summary)
export interface DashboardSummary {
  total_submissions: string;
  today_submissions: string;
  weekly_submissions: string;
  last_week_submissions?: string;
  positive: string;
  neutral: string;
  negative: string;
  open_actions: string;
  last_week_open_actions?: string;
}

// Top Participant (from /webhook/webhook/top-participants)
export interface TopParticipant {
  name: string;
  count: number;
}

// Resolution Time Stats (from /webhook/webhook/resolution-time)
export interface ResolutionTimeStats {
  avgDays: number;
  minDays: number;
  maxDays: number;
  totalResolved: number;
}

// Pain Point (from /webhook/webhook/top-pain-points)
export interface PainPoint {
  pain_point: string;
  count: string;
}

// Recent Activity (from /webhook/webhook/recent-activity)
export interface ActivityItem {
  id: string;
  title: string;
  summary: string;
  sentiment?: SentimentType;
  timestamp: string;
  type: 'submission' | 'action_item' | 'feature_request' | 'transcript' | string;
}

// Sentiment Trend (from /webhook/webhook/sentiment-trend)
export interface SentimentDataPoint {
  period: string;
  positive: string;
  neutral: string;
  negative: string;
}

// Keyword Cloud (from /webhook/webhook/keywords-cloud)
export interface KeywordItem {
  keyword: string;
  count: string;
}

// Sentiment Breakdown (for charts)
export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

// Urgency Distribution (from /webhook/webhook/urgency-distribution)
export interface UrgencyData {
  high: number;
  medium: number;
  low: number;
}

// Resolution Stats (from /webhook/webhook/resolution-stats)
export interface ResolutionStats {
  completed: number;
  inProgress: number;
  newRequests: number;
  total: number;
}

// Generic display types for components
export interface WordCloudItem {
  text: string;
  count: number;
}

export interface ChartDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

// Competitor (from /webhook/webhook/competitors-mentioned)
export interface CompetitorItem {
  competitor: string;
  mentions: string;
}

// Feature Request (from /webhook/webhook/feature-requests-aggregated)
export interface FeatureRequest {
  title: string;
  sourceCount: string;
}

// Action Item (from /webhook/webhook/action-items - cx_asana_data)
export type ActionItemStatus = 'open' | 'in_progress' | 'completed' | 'New Requests';
export type ActionItemPriority = 'low' | 'medium' | 'high' | 'urgent' | 'Low priority' | 'Medium priority' | 'High priority';

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  status: ActionItemStatus;
  priority: ActionItemPriority;
  assignee?: string;
  dueDate?: string;
  category?: string;
  sentiment?: SentimentType;
  asanaUrl?: string;
  createdAt: string;
}

// Email Subscription Types
export interface EmailSubscription {
  userId: string;
  email: string;
  dailyDigest: boolean;
  dailyDigestTime?: string;
  weeklyReport: boolean;
  weeklyReportDay?: string;
  instantAlerts: boolean;
  monthlyInsights: boolean;
}

// Chat Types
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  submission?: Submission;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Filter Types
export interface ActionItemFilters {
  status?: ActionItemStatus;
  priority?: ActionItemPriority;
  assignee?: string;
}

export interface InsightsFilters {
  startDate?: string;
  endDate?: string;
  sentiment?: SentimentType;
}

// Transcript (from /webhook/webhook/transcripts - cx_analyzed_transcript)
export interface Transcript {
  id: string;
  call_date: string;
  participants?: string;
  ai_summary?: string;
  ai_sentiments?: string;
  ai_urgency?: string;
  ai_pain_points?: string;
  ai_feature_requests?: string;
  ai_action_items?: string;
}
