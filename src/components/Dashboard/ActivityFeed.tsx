import { Card, List, Tag, Typography } from 'antd';
import { MessageOutlined, CheckSquareOutlined, BulbOutlined } from '@ant-design/icons';
import type { ActivityItem } from '../../types';
import { formatRelativeTime, getSentimentColor, truncateText } from '../../utils/formatters';

const { Text } = Typography;

interface ActivityFeedProps {
  items: ActivityItem[];
  loading?: boolean;
}

function ActivityFeed({ items, loading }: ActivityFeedProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'submission':
        return <MessageOutlined />;
      case 'action_item':
        return <CheckSquareOutlined />;
      case 'feature_request':
        return <BulbOutlined />;
      default:
        return <MessageOutlined />;
    }
  };

  return (
    <Card
      title="Recent Activity"
      size="small"
      style={{ height: '100%' }}
      styles={{ body: { maxHeight: '400px', overflow: 'auto' } }}
    >
      <List
        loading={loading}
        dataSource={items}
        renderItem={(item) => (
          <List.Item style={{ padding: '12px 0' }}>
            <List.Item.Meta
              avatar={
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getIcon(item.type)}
                </div>
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text strong>{truncateText(item.title, 40)}</Text>
                  {item.sentiment && (
                    <Tag
                      color={getSentimentColor(item.sentiment)}
                      style={{ margin: 0 }}
                    >
                      {item.sentiment}
                    </Tag>
                  )}
                </div>
              }
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {truncateText(item.summary, 60)}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {formatRelativeTime(item.timestamp)}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'No recent activity' }}
      />
    </Card>
  );
}

export default ActivityFeed;
