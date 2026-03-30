import { Card, Empty } from 'antd';
import type { ChartDataPoint } from '../../types';
import { formatDate } from '../../utils/formatters';

interface SentimentTrendProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

function SentimentTrend({ data, loading }: SentimentTrendProps) {
  if (data.length === 0 && !loading) {
    return (
      <Card title="Sentiment Trend" size="small">
        <Empty description="No trend data available" />
      </Card>
    );
  }

  // Simple bar visualization (can be replaced with a charting library)
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.positive, d.neutral, d.negative]),
    1
  );

  return (
    <Card title="Sentiment Trend Over Time" size="small" loading={loading}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px', minWidth: 'fit-content', padding: '8px 0' }}>
          {data.map((point, index) => (
            <div key={index} style={{ minWidth: '80px', textAlign: 'center' }}>
              <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '2px', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '16px',
                    height: `${(point.positive / maxValue) * 100}px`,
                    backgroundColor: '#1890ff',
                    borderRadius: '2px 2px 0 0',
                  }}
                  title={`Positive: ${point.positive}`}
                />
                <div
                  style={{
                    width: '16px',
                    height: `${(point.neutral / maxValue) * 100}px`,
                    backgroundColor: '#faad14',
                    borderRadius: '2px 2px 0 0',
                  }}
                  title={`Neutral: ${point.neutral}`}
                />
                <div
                  style={{
                    width: '16px',
                    height: `${(point.negative / maxValue) * 100}px`,
                    backgroundColor: '#ff4d4f',
                    borderRadius: '2px 2px 0 0',
                  }}
                  title={`Negative: ${point.negative}`}
                />
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#888' }}>
                {point.date ? formatDate(point.date) : `Week ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#1890ff', borderRadius: '2px', marginRight: '4px' }} /> Positive</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#faad14', borderRadius: '2px', marginRight: '4px' }} /> Neutral</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ff4d4f', borderRadius: '2px', marginRight: '4px' }} /> Negative</span>
      </div>
    </Card>
  );
}

export default SentimentTrend;
