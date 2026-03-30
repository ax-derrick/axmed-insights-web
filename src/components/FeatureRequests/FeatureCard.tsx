import { Card, Typography, Space, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import type { FeatureRequest } from '../../types';

const { Text, Paragraph } = Typography;

interface FeatureCardProps {
  feature: FeatureRequest;
}

function FeatureCard({ feature }: FeatureCardProps) {
  const sourceCount = parseInt(feature.sourceCount) || 0;

  return (
    <Card
      size="small"
      style={{ marginBottom: '12px' }}
      hoverable
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Paragraph strong style={{ fontSize: '15px', marginBottom: '8px' }}>
            {feature.title}
          </Paragraph>

          <Space size="large">
            <Badge
              count={sourceCount}
              style={{ backgroundColor: '#1890ff' }}
              overflowCount={99}
            >
              <Space>
                <MessageOutlined />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Mentions
                </Text>
              </Space>
            </Badge>
          </Space>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            minWidth: '80px',
          }}
        >
          <Text style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
            {sourceCount}
          </Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            requests
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default FeatureCard;
