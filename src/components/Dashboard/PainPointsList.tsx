import { Card, List, Progress, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import type { WordCloudItem } from '../../types';

const { Text } = Typography;

interface PainPointsListProps {
  items: WordCloudItem[];
  loading?: boolean;
  maxItems?: number;           // Number of items to show (default: 3)
  total?: number;              // Total count for "View all X" link
  onViewAll?: () => void;      // Drill-down handler
}

function PainPointsList({
  items,
  loading,
  maxItems = 3,
  total,
  onViewAll,
}: PainPointsListProps) {
  const displayItems = items.slice(0, maxItems);
  const maxCount = items.length > 0 ? Math.max(...items.map((p) => p.count)) : 1;
  const totalCount = total ?? items.length;
  const hasMore = totalCount > maxItems;

  return (
    <Card
      title="Top Pain Points"
      size="small"
      style={{
        height: '100%',
        cursor: onViewAll ? 'pointer' : 'default',
      }}
      hoverable={!!onViewAll}
      onClick={onViewAll}
      extra={
        onViewAll && hasMore ? (
          <Text
            type="secondary"
            style={{ fontSize: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewAll();
            }}
          >
            View all {totalCount} <RightOutlined style={{ fontSize: 10 }} />
          </Text>
        ) : undefined
      }
    >
      <List
        loading={loading}
        dataSource={displayItems}
        renderItem={(item, index) => (
          <List.Item style={{ padding: '8px 0' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <Text>
                  <span style={{ color: '#888', marginRight: '8px' }}>#{index + 1}</span>
                  {item.text}
                </Text>
                <Text type="secondary">{item.count} mentions</Text>
              </div>
              <Progress
                percent={(item.count / maxCount) * 100}
                showInfo={false}
                strokeColor="#ff4d4f"
                size="small"
              />
            </div>
          </List.Item>
        )}
        locale={{ emptyText: 'No pain points identified yet' }}
      />

      {/* Footer link for mobile or when extra isn't visible */}
      {onViewAll && hasMore && (
        <div
          style={{
            textAlign: 'center',
            paddingTop: '12px',
            borderTop: '1px solid #f0f0f0',
            marginTop: '8px',
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: 12, cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              onViewAll();
            }}
          >
            View all {totalCount} pain points <RightOutlined style={{ fontSize: 10 }} />
          </Text>
        </div>
      )}
    </Card>
  );
}

export default PainPointsList;
