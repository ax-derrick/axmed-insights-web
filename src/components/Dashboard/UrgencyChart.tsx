import { Card, Progress, Typography, Space } from 'antd';
import { WarningOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface UrgencyData {
  high: number;
  medium: number;
  low: number;
}

interface UrgencyChartProps {
  data: UrgencyData;
  loading?: boolean;
}

function UrgencyChart({ data, loading }: UrgencyChartProps) {
  const total = data.high + data.medium + data.low;

  const urgencyItems = [
    {
      key: 'high',
      label: 'High',
      value: data.high,
      color: '#f5222d',
      icon: <WarningOutlined style={{ color: '#f5222d' }} />,
    },
    {
      key: 'medium',
      label: 'Medium',
      value: data.medium,
      color: '#fa8c16',
      icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />,
    },
    {
      key: 'low',
      label: 'Low',
      value: data.low,
      color: '#52c41a',
      icon: <InfoCircleOutlined style={{ color: '#52c41a' }} />,
    },
  ];

  return (
    <Card title="Urgency Distribution" size="small" loading={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {urgencyItems.map((item) => (
          <div key={item.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Space>
                {item.icon}
                <Text>{item.label}</Text>
              </Space>
              <Text type="secondary">
                {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </Text>
            </div>
            <Progress
              percent={total > 0 ? (item.value / total) * 100 : 0}
              showInfo={false}
              strokeColor={item.color}
              size="small"
            />
          </div>
        ))}
      </Space>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {total} total items
        </Text>
      </div>
    </Card>
  );
}

export default UrgencyChart;
