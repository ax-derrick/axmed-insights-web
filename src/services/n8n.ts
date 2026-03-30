import type {
  Submission,
  SubmissionType,
  DashboardSummary,
  PainPoint,
  ActivityItem,
  SentimentDataPoint,
  ActionItem,
  FeatureRequest,
  KeywordItem,
  CompetitorItem,
  EmailSubscription,
  UrgencyData,
  ResolutionStats,
  TopParticipant,
  ResolutionTimeStats,
  Transcript,
} from '../types';

// N8N Configuration - Axmed N8N Cloud
const N8N_BASE_URL = 'https://axmed.app.n8n.cloud';

// Date range filter interface
export interface DateRange {
  startDate?: string;
  endDate?: string;
}

// Helper to build query string from date range
function buildDateQuery(dateRange?: DateRange): string {
  if (!dateRange?.startDate || !dateRange?.endDate) return '';
  const params = new URLSearchParams();
  params.set('start_date', dateRange.startDate);
  params.set('end_date', dateRange.endDate);
  return `?${params.toString()}`;
}

const ENDPOINTS = {
  // Data fetching endpoints
  dashboardSummary: '/webhook/webhook/dashboard-summary',
  topPainPoints: '/webhook/webhook/top-pain-points',
  recentActivity: '/webhook/webhook/recent-activity',
  sentimentTrend: '/webhook/webhook/sentiment-trend',
  urgencyDistribution: '/webhook/webhook/urgency-distribution',
  resolutionStats: '/webhook/webhook/resolution-stats',
  topParticipants: '/webhook/webhook/top-participants',
  resolutionTime: '/webhook/webhook/resolution-time',
  actionItems: '/webhook/webhook/action-items',
  featureRequests: '/webhook/webhook/feature-requests-aggregated',
  keywordsCloud: '/webhook/webhook/keywords-cloud',
  competitors: '/webhook/webhook/competitors-mentioned',
  transcripts: '/webhook/webhook/transcripts',
  // Processing endpoints (keep existing for submission)
  processTranscript: import.meta.env.VITE_N8N_PROCESS_TRANSCRIPT || '/webhook/process-transcript',
  subscribeEmail: import.meta.env.VITE_N8N_SUBSCRIBE_EMAIL || '/webhook/subscribe-email',
};

// Helper function to build full URL
function buildUrl(endpoint: string): string {
  return `${N8N_BASE_URL}${endpoint}`;
}

// Generic fetch wrapper with error handling
async function fetchN8N<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`N8N request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Dashboard Summary
export async function getDashboardSummary(dateRange?: DateRange): Promise<DashboardSummary> {
  const query = buildDateQuery(dateRange);
  const response = await fetchN8N<DashboardSummary | DashboardSummary[]>(`${ENDPOINTS.dashboardSummary}${query}`);
  // Handle array response from N8N
  return Array.isArray(response) ? response[0] : response;
}

// Top Pain Points
export async function getTopPainPoints(dateRange?: DateRange): Promise<PainPoint[]> {
  const query = buildDateQuery(dateRange);
  return fetchN8N<PainPoint[]>(`${ENDPOINTS.topPainPoints}${query}`);
}

// Recent Activity
export async function getRecentActivity(dateRange?: DateRange): Promise<ActivityItem[]> {
  const query = buildDateQuery(dateRange);
  return fetchN8N<ActivityItem[]>(`${ENDPOINTS.recentActivity}${query}`);
}

// Sentiment Trend
export async function getSentimentTrend(dateRange?: DateRange): Promise<SentimentDataPoint[]> {
  const query = buildDateQuery(dateRange);
  return fetchN8N<SentimentDataPoint[]>(`${ENDPOINTS.sentimentTrend}${query}`);
}

// Urgency Distribution
interface UrgencyApiResponse {
  high: string;
  medium: string;
  low: string;
}

export async function getUrgencyDistribution(dateRange?: DateRange): Promise<UrgencyData> {
  const query = buildDateQuery(dateRange);
  const response = await fetchN8N<UrgencyApiResponse | UrgencyApiResponse[]>(`${ENDPOINTS.urgencyDistribution}${query}`);
  const data = Array.isArray(response) ? response[0] : response;
  return {
    high: parseInt(data.high) || 0,
    medium: parseInt(data.medium) || 0,
    low: parseInt(data.low) || 0,
  };
}

// Resolution Stats
interface ResolutionApiResponse {
  completed: string;
  in_progress: string;
  new_requests: string;
  total: string;
}

export async function getResolutionStats(dateRange?: DateRange): Promise<ResolutionStats> {
  const query = buildDateQuery(dateRange);
  const response = await fetchN8N<ResolutionApiResponse | ResolutionApiResponse[]>(`${ENDPOINTS.resolutionStats}${query}`);
  const data = Array.isArray(response) ? response[0] : response;
  return {
    completed: parseInt(data.completed) || 0,
    inProgress: parseInt(data.in_progress) || 0,
    newRequests: parseInt(data.new_requests) || 0,
    total: parseInt(data.total) || 0,
  };
}

// Top Participants
interface TopParticipantApiResponse {
  name: string;
  count: string;
}

export async function getTopParticipants(dateRange?: DateRange): Promise<TopParticipant[]> {
  const query = buildDateQuery(dateRange);
  const response = await fetchN8N<TopParticipantApiResponse[]>(`${ENDPOINTS.topParticipants}${query}`);
  return response.map(p => ({
    name: p.name,
    count: parseInt(p.count) || 0,
  }));
}

// Resolution Time Stats
interface ResolutionTimeApiResponse {
  avg_days: string;
  min_days: string;
  max_days: string;
  total_resolved: string;
}

export async function getResolutionTime(dateRange?: DateRange): Promise<ResolutionTimeStats> {
  const query = buildDateQuery(dateRange);
  const response = await fetchN8N<ResolutionTimeApiResponse | ResolutionTimeApiResponse[]>(`${ENDPOINTS.resolutionTime}${query}`);
  const data = Array.isArray(response) ? response[0] : response;
  return {
    avgDays: parseFloat(data.avg_days) || 0,
    minDays: parseFloat(data.min_days) || 0,
    maxDays: parseFloat(data.max_days) || 0,
    totalResolved: parseInt(data.total_resolved) || 0,
  };
}

// Action Items
export async function getActionItems(dateRange?: DateRange): Promise<ActionItem[]> {
  const query = buildDateQuery(dateRange);
  return fetchN8N<ActionItem[]>(`${ENDPOINTS.actionItems}${query}`);
}

// Feature Requests
export async function getFeatureRequests(dateRange?: DateRange): Promise<FeatureRequest[]> {
  const query = buildDateQuery(dateRange);
  return fetchN8N<FeatureRequest[]>(`${ENDPOINTS.featureRequests}${query}`);
}

// Keywords Cloud
export async function getKeywordsCloud(dateRange?: DateRange): Promise<KeywordItem[]> {
  const query = buildDateQuery(dateRange);
  return fetchN8N<KeywordItem[]>(`${ENDPOINTS.keywordsCloud}${query}`);
}

// Competitors Mentioned
export async function getCompetitors(dateRange?: DateRange): Promise<CompetitorItem[]> {
  const query = buildDateQuery(dateRange);
  return fetchN8N<CompetitorItem[]>(`${ENDPOINTS.competitors}${query}`);
}

// Transcripts List
export async function getTranscripts(dateRange?: DateRange, search?: string): Promise<Transcript[]> {
  const params = new URLSearchParams();
  if (dateRange?.startDate) params.set('start_date', dateRange.startDate);
  if (dateRange?.endDate) params.set('end_date', dateRange.endDate);
  if (search) params.set('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  return fetchN8N<Transcript[]>(`${ENDPOINTS.transcripts}${query}`);
}

// Process a transcript/submission through N8N
export async function processTranscript(
  content: string,
  type: SubmissionType,
  submittedBy: string
): Promise<Submission> {
  return fetchN8N<Submission>(ENDPOINTS.processTranscript, {
    method: 'POST',
    body: JSON.stringify({
      content,
      type,
      submittedBy,
      timestamp: new Date().toISOString(),
    }),
  });
}

// Update email subscription preferences
export async function updateEmailSubscription(
  subscription: EmailSubscription
): Promise<{ success: boolean }> {
  return fetchN8N<{ success: boolean }>(ENDPOINTS.subscribeEmail, {
    method: 'POST',
    body: JSON.stringify(subscription),
  });
}

// Get current email subscription settings
export async function getEmailSubscription(
  email: string
): Promise<EmailSubscription | null> {
  try {
    return await fetchN8N<EmailSubscription>(
      `${ENDPOINTS.subscribeEmail}?email=${encodeURIComponent(email)}`
    );
  } catch {
    return null;
  }
}

// Export all functions as a service object for convenience
const n8nService = {
  getDashboardSummary,
  getTopPainPoints,
  getRecentActivity,
  getSentimentTrend,
  getUrgencyDistribution,
  getResolutionStats,
  getTopParticipants,
  getResolutionTime,
  getActionItems,
  getFeatureRequests,
  getKeywordsCloud,
  getCompetitors,
  getTranscripts,
  processTranscript,
  updateEmailSubscription,
  getEmailSubscription,
};

export default n8nService;
