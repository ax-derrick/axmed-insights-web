import { Card, List, Tag, Typography } from 'antd';
import { FolderOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Topic {
  name: string;
  count: number;
  keywords: string[];
}

interface TopicClustersProps {
  topics: Topic[];
  loading?: boolean;
}

function TopicClusters({ topics, loading }: TopicClustersProps) {
  return (
    <Card title="Topic Clusters" size="small" loading={loading}>
      <List
        dataSource={topics}
        renderItem={(topic) => (
          <List.Item style={{ padding: '12px 0' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FolderOutlined style={{ color: '#1890ff' }} />
                <Text strong>{topic.name}</Text>
                <Tag>{topic.count} mentions</Tag>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginLeft: '24px' }}>
                {topic.keywords.map((keyword, i) => (
                  <Tag key={i} color="blue" style={{ margin: 0 }}>
                    {keyword}
                  </Tag>
                ))}
              </div>
            </div>
          </List.Item>
        )}
        locale={{ emptyText: 'No topics identified yet' }}
      />
    </Card>
  );
}

export default TopicClusters;
