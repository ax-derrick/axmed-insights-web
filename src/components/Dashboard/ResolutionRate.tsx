import { Card, Progress, Typography, Space } from 'antd';
import { CheckCircleOutlined, SyncOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { ResolutionStats } from '../../types';

const { Text } = Typography;

interface ResolutionRateProps {
  data: ResolutionStats;
  loading?: boolean;
}

function ResolutionRate({ data, loading }: ResolutionRateProps) {
  const rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

  // Determine color based on rate
  const getRateColor = (rate: number) => {
    if (rate >= 80) return '#52c41a'; // Green
    if (rate >= 50) return '#faad14'; // Yellow
    return '#f5222d'; // Red
  };

  return (
    <Card title="Resolution Rate" size="small" loading={loading}>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <Progress
          type="circle"
          percent={rate}
          strokeColor={getRateColor(rate)}
          format={(percent) => (
            <span style={{ fontSize: '24px', fontWeight: 600 }}>{percent}%</span>
          )}
          size={100}
        />
        <div style={{ marginTop: '16px' }}>
          <Space size="large">
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              <div>
                <Text strong>{data.completed}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '11px' }}>Resolved</Text>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <SyncOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
              <div>
                <Text strong>{data.inProgress}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '11px' }}>In Progress</Text>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PlusCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />
              <div>
                <Text strong>{data.newRequests}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '11px' }}>New</Text>
              </div>
            </div>
          </Space>
        </div>
      </div>
    </Card>
  );
}

export default ResolutionRate;
