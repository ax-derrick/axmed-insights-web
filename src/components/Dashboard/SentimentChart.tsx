import { Card, Progress, Space, Typography } from 'antd';
import type { SentimentBreakdown } from '../../types';
import { getSentimentColor, formatPercentage } from '../../utils/formatters';

const { Text } = Typography;

interface SentimentChartProps {
  data: SentimentBreakdown;
  loading?: boolean;
}

function SentimentChart({ data, loading }: SentimentChartProps) {
  const total = data.positive + data.neutral + data.negative;

  const sentiments = [
    { key: 'positive', label: 'Positive', value: data.positive },
    { key: 'neutral', label: 'Neutral', value: data.neutral },
    { key: 'negative', label: 'Negative', value: data.negative },
  ];

  return (
    <Card title="Sentiment Overview" size="small" loading={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {sentiments.map((sentiment) => (
          <div key={sentiment.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Text>{sentiment.label}</Text>
              <Text type="secondary">
                {sentiment.value} ({formatPercentage(sentiment.value, total)})
              </Text>
            </div>
            <Progress
              percent={total > 0 ? (sentiment.value / total) * 100 : 0}
              showInfo={false}
              strokeColor={getSentimentColor(sentiment.key)}
              size="small"
            />
          </div>
        ))}
      </Space>
    </Card>
  );
}

export default SentimentChart;
