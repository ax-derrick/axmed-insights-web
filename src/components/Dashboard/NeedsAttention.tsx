import { Card, List, Tag, Typography, Empty } from 'antd';
import { RightOutlined, WarningOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { formatRelativeTime } from '../../utils/formatters';

const { Text } = Typography;

type UrgencyLevel = 'urgent' | 'high' | 'new';

interface NeedsAttentionItem {
  id: string;
  type: 'action_item' | 'submission' | 'feature_request';
  title: string;
  urgency: UrgencyLevel;
  timestamp: string;
  source?: string;  // e.g., "Acme Corp", "Customer feedback"
}

interface NeedsAttentionProps {
  items: NeedsAttentionItem[];
  loading?: boolean;
  maxItems?: number;
  total?: number;
  onViewAll?: () => void;
  onItemClick?: (item: NeedsAttentionItem) => void;
}

const urgencyConfig: Record<UrgencyLevel, { color: string; icon: React.ReactNode; label: string }> = {
  urgent: {
    color: '#ff4d4f',
    icon: <WarningOutlined />,
    label: 'Urgent',
  },
  high: {
    color: '#fa8c16',
    icon: <ExclamationCircleOutlined />,
    label: 'High',
  },
  new: {
    color: '#1890ff',
    icon: <PlusCircleOutlined />,
    label: 'New',
  },
};

function NeedsAttention({
  items,
  loading,
  maxItems = 4,
  total,
  onViewAll,
  onItemClick,
}: NeedsAttentionProps) {
  const displayItems = items.slice(0, maxItems);
  const totalCount = total ?? items.length;
  const hasMore = totalCount > maxItems;

  if (!loading && items.length === 0) {
    return (
      <Card title="Needs Attention" size="small">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">
              No urgent items right now
            </Text>
          }
        />
      </Card>
    );
  }

  return (
    <Card
      title="Needs Attention"
      size="small"
      extra={
        onViewAll && hasMore ? (
          <Text
            type="secondary"
            style={{ fontSize: 12, cursor: 'pointer' }}
            onClick={onViewAll}
          >
            View all {totalCount} <RightOutlined style={{ fontSize: 10 }} />
          </Text>
        ) : undefined
      }
    >
      <List
        loading={loading}
        dataSource={displayItems}
        renderItem={(item) => {
          const config = urgencyConfig[item.urgency];
          return (
            <List.Item
              style={{
                padding: '12px 0',
                cursor: onItemClick ? 'pointer' : 'default',
              }}
              onClick={() => onItemClick?.(item)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: '12px' }}>
                {/* Urgency indicator */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: config.color,
                    marginTop: '6px',
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Tag
                      color={config.color}
                      style={{ margin: 0, fontSize: 11 }}
                    >
                      {config.label}
                    </Tag>
                    <Text
                      strong
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.source && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.source}
                      </Text>
                    )}
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 'auto' }}>
                      {formatRelativeTime(item.timestamp)}
                    </Text>
                  </div>
                </div>

                {/* Click indicator */}
                {onItemClick && (
                  <RightOutlined
                    style={{
                      color: '#d9d9d9',
                      fontSize: 12,
                      marginTop: '4px',
                    }}
                  />
                )}
              </div>
            </List.Item>
          );
        }}
        locale={{ emptyText: 'No items need attention' }}
      />

      {/* Footer link */}
      {onViewAll && hasMore && (
        <div
          style={{
            textAlign: 'center',
            paddingTop: '12px',
            borderTop: '1px solid #f0f0f0',
            marginTop: '4px',
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: 12, cursor: 'pointer' }}
            onClick={onViewAll}
          >
            View all {totalCount} items <RightOutlined style={{ fontSize: 10 }} />
          </Text>
        </div>
      )}
    </Card>
  );
}

export default NeedsAttention;
export type { NeedsAttentionItem, UrgencyLevel };
