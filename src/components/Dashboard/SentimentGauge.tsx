import { Card, Progress, Typography } from 'antd';
import type { SentimentBreakdown } from '../../types';

const { Text } = Typography;

interface SentimentGaugeProps {
  data: SentimentBreakdown;
  loading?: boolean;
}

function SentimentGauge({ data, loading }: SentimentGaugeProps) {
  const total = data.positive + data.neutral + data.negative;

  // Calculate sentiment score: 0-100 scale
  // Formula: (positive * 100 + neutral * 50) / total
  // This gives: all positive = 100, all neutral = 50, all negative = 0
  const score = total > 0
    ? Math.round((data.positive * 100 + data.neutral * 50) / total)
    : 50;

  // Determine color based on score
  // Uses blue for good scores (accessibility - avoids red/green colorblindness)
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#1890ff'; // Blue (good)
    if (score >= 40) return '#faad14'; // Yellow (warning)
    return '#ff4d4f'; // Red (critical)
  };

  // Get label based on score
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 40) return 'Needs Attention';
    return 'Critical';
  };

  return (
    <Card title="Sentiment Score" size="small" loading={loading}>
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <Progress
          type="dashboard"
          percent={score}
          strokeColor={getScoreColor(score)}
          format={(percent) => (
            <div>
              <div style={{ fontSize: '28px', fontWeight: 600 }}>{percent}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>/ 100</div>
            </div>
          )}
          size={140}
        />
        <div style={{ marginTop: '12px' }}>
          <Text strong style={{ color: getScoreColor(score), fontSize: '16px' }}>
            {getScoreLabel(score)}
          </Text>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <span style={{ color: '#1890ff' }}>●</span> {data.positive} positive
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <span style={{ color: '#faad14' }}>●</span> {data.neutral} neutral
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <span style={{ color: '#ff4d4f' }}>●</span> {data.negative} negative
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default SentimentGauge;
