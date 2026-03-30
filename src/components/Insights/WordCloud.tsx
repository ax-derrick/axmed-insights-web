import { Card, Tag } from 'antd';
import type { WordCloudItem } from '../../types';

interface WordCloudProps {
  items: WordCloudItem[];
  loading?: boolean;
  title?: string;
  color?: string;
}

function WordCloud({ items, loading, title = 'Pain Points', color = '#f5222d' }: WordCloudProps) {
  const maxCount = items.length > 0 ? Math.max(...items.map((p) => p.count)) : 1;
  const minCount = items.length > 0 ? Math.min(...items.map((p) => p.count)) : 0;

  // Calculate font size based on count
  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 14;
    const normalized = (count - minCount) / (maxCount - minCount);
    return Math.round(12 + normalized * 12); // 12px to 24px
  };

  // Calculate opacity based on count
  const getOpacity = (count: number) => {
    if (maxCount === minCount) return 1;
    const normalized = (count - minCount) / (maxCount - minCount);
    return 0.5 + normalized * 0.5; // 0.5 to 1
  };

  return (
    <Card title={title} size="small" loading={loading}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {items.map((item, index) => (
          <Tag
            key={index}
            style={{
              fontSize: `${getFontSize(item.count)}px`,
              opacity: getOpacity(item.count),
              padding: '4px 12px',
              border: 'none',
              backgroundColor: color,
              color: '#fff',
              cursor: 'default',
            }}
          >
            {item.text}
            <span style={{ marginLeft: '4px', opacity: 0.7 }}>({item.count})</span>
          </Tag>
        ))}
        {items.length === 0 && (
          <span style={{ color: '#888' }}>No data available</span>
        )}
      </div>
    </Card>
  );
}

export default WordCloud;
