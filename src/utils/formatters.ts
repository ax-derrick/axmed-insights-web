// Date formatting utilities
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(dateString);
}

// Number formatting utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

// Text formatting utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Sentiment color mapping
// Uses blue for positive (accessibility - avoids red/green colorblindness issues)
// Matches CSS variables: --color-sentiment-positive, --color-sentiment-neutral, --color-sentiment-negative
export function getSentimentColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return '#1890ff'; // blue instead of green for accessibility
    case 'negative':
      return '#ff4d4f';
    case 'neutral':
    default:
      return '#faad14';
  }
}

// Priority color mapping
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return '#f5222d';
    case 'high':
      return '#fa8c16';
    case 'medium':
      return '#faad14';
    case 'low':
    default:
      return '#52c41a';
  }
}

// Status color mapping
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#52c41a';
    case 'in_progress':
      return '#1890ff';
    case 'planned':
      return '#722ed1';
    case 'under_review':
      return '#fa8c16';
    case 'open':
    case 'new':
    default:
      return '#d9d9d9';
  }
}
