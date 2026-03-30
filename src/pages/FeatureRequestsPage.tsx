import { useState, useEffect } from 'react';
import { Typography, Select, Space, Button, Row, Col, Card, Statistic, List, Tag } from 'antd';
import { ReloadOutlined, BulbOutlined, MessageOutlined } from '@ant-design/icons';
import { getFeatureRequests } from '../services/n8n';
import type { FeatureRequest } from '../types';

const { Title, Text, Paragraph } = Typography;

function FeatureRequestsPage() {
  const [items, setItems] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'sourceCount' | 'title'>('sourceCount');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getFeatureRequests();
      // Handle both array and single object responses
      const itemsArray = Array.isArray(response) ? response : [response];
      setItems(itemsArray);
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'sourceCount') {
      return (parseInt(b.sourceCount) || 0) - (parseInt(a.sourceCount) || 0);
    }
    return a.title.localeCompare(b.title);
  });

  // Calculate stats
  const totalRequests = items.length;
  const totalMentions = items.reduce((sum, item) => sum + (parseInt(item.sourceCount) || 0), 0);
  const topRequest = items.length > 0
    ? items.reduce((max, item) =>
        (parseInt(item.sourceCount) || 0) > (parseInt(max.sourceCount) || 0) ? item : max
      , items[0])
    : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>Feature Requests</Title>
        <Space wrap>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 160 }}
            options={[
              { value: 'sourceCount', label: 'By Mentions' },
              { value: 'title', label: 'Alphabetical' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Unique Requests"
              value={totalRequests}
              prefix={<BulbOutlined style={{ color: '#1890ff' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Total Mentions"
              value={totalMentions}
              prefix={<MessageOutlined style={{ color: '#722ed1' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Top Request Mentions"
              value={topRequest ? parseInt(topRequest.sourceCount) || 0 : 0}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Feature Requests List */}
      <Card>
        <List
          loading={loading}
          dataSource={sortedItems}
          renderItem={(item, index) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>#{index + 1}</Text>
                    <Paragraph style={{ margin: 0, maxWidth: '600px' }} ellipsis={{ rows: 2, expandable: true }}>
                      {item.title}
                    </Paragraph>
                  </div>
                  <Tag color="blue" style={{ marginLeft: '16px', flexShrink: 0 }}>
                    {item.sourceCount} {parseInt(item.sourceCount) === 1 ? 'mention' : 'mentions'}
                  </Tag>
                </div>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'No feature requests found' }}
        />
      </Card>
    </div>
  );
}

export default FeatureRequestsPage;
