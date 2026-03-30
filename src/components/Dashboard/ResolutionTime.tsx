import { Card, Statistic, Row, Col, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { ResolutionTimeStats } from '../../types';

const { Text } = Typography;

interface ResolutionTimeProps {
  data: ResolutionTimeStats;
  loading?: boolean;
}

function ResolutionTime({ data, loading }: ResolutionTimeProps) {
  // Determine color based on avg days (faster is better)
  const getTimeColor = (days: number) => {
    if (days <= 3) return '#52c41a'; // Green - fast
    if (days <= 7) return '#faad14'; // Yellow - moderate
    return '#f5222d'; // Red - slow
  };

  return (
    <Card title="Avg Resolution Time" size="small" loading={loading}>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <Statistic
          value={data.avgDays.toFixed(1)}
          suffix="days"
          prefix={<ClockCircleOutlined style={{ color: getTimeColor(data.avgDays) }} />}
          valueStyle={{ color: getTimeColor(data.avgDays) }}
        />
        <Row gutter={16} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: '11px' }}>Fastest</Text>
            <div>
              <Text strong style={{ fontSize: '14px' }}>{data.minDays.toFixed(0)}d</Text>
            </div>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: '11px' }}>Slowest</Text>
            <div>
              <Text strong style={{ fontSize: '14px' }}>{data.maxDays.toFixed(0)}d</Text>
            </div>
          </Col>
        </Row>
        <div style={{ marginTop: '8px' }}>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            Based on {data.totalResolved} resolved tickets
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default ResolutionTime;
