import { Card, Switch, Select, Typography, Space, Divider } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  BellOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { EmailSubscription } from '../../types';

const { Text, Paragraph } = Typography;

interface EmailSubscriptionsProps {
  subscription: EmailSubscription;
  onChange: (updates: Partial<EmailSubscription>) => void;
  loading?: boolean;
}

const timeOptions = Array.from({ length: 24 }, (_, i) => ({
  value: `${i.toString().padStart(2, '0')}:00`,
  label: `${i.toString().padStart(2, '0')}:00`,
}));

const dayOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

function EmailSubscriptions({ subscription, onChange, loading }: EmailSubscriptionsProps) {
  return (
    <Card title="Email Subscriptions" loading={loading}>
      <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
        Configure email notifications to stay updated on insights and activity.
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Daily Digest */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <Space>
                <MailOutlined style={{ color: '#1890ff' }} />
                <Text strong>Daily Digest</Text>
              </Space>
              <Paragraph type="secondary" style={{ margin: '4px 0 0 24px', fontSize: '13px' }}>
                Receive a daily summary of yesterday's submissions, action items, and sentiment overview.
              </Paragraph>
            </div>
            <Switch
              checked={subscription.dailyDigest}
              onChange={(checked) => onChange({ dailyDigest: checked })}
            />
          </div>
          {subscription.dailyDigest && (
            <div style={{ marginLeft: '24px', marginTop: '8px' }}>
              <Space>
                <Text type="secondary">Send at:</Text>
                <Select
                  value={subscription.dailyDigestTime || '09:00'}
                  onChange={(value) => onChange({ dailyDigestTime: value })}
                  options={timeOptions}
                  style={{ width: 100 }}
                />
              </Space>
            </div>
          )}
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Weekly Report */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <Space>
                <CalendarOutlined style={{ color: '#722ed1' }} />
                <Text strong>Weekly Report</Text>
              </Space>
              <Paragraph type="secondary" style={{ margin: '4px 0 0 24px', fontSize: '13px' }}>
                Comprehensive weekly analysis with trends, top pain points, and feature request updates.
              </Paragraph>
            </div>
            <Switch
              checked={subscription.weeklyReport}
              onChange={(checked) => onChange({ weeklyReport: checked })}
            />
          </div>
          {subscription.weeklyReport && (
            <div style={{ marginLeft: '24px', marginTop: '8px' }}>
              <Space>
                <Text type="secondary">Send on:</Text>
                <Select
                  value={subscription.weeklyReportDay || 'monday'}
                  onChange={(value) => onChange({ weeklyReportDay: value })}
                  options={dayOptions}
                  style={{ width: 120 }}
                />
              </Space>
            </div>
          )}
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Instant Alerts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Space>
                <BellOutlined style={{ color: '#f5222d' }} />
                <Text strong>Instant Alerts</Text>
              </Space>
              <Paragraph type="secondary" style={{ margin: '4px 0 0 24px', fontSize: '13px' }}>
                Get notified immediately when negative sentiment is detected or urgent action items are created.
              </Paragraph>
            </div>
            <Switch
              checked={subscription.instantAlerts}
              onChange={(checked) => onChange({ instantAlerts: checked })}
            />
          </div>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Monthly Insights */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Space>
                <FileTextOutlined style={{ color: '#52c41a' }} />
                <Text strong>Monthly Insights</Text>
              </Space>
              <Paragraph type="secondary" style={{ margin: '4px 0 0 24px', fontSize: '13px' }}>
                Detailed monthly report with trends, comparisons, and strategic recommendations.
              </Paragraph>
            </div>
            <Switch
              checked={subscription.monthlyInsights}
              onChange={(checked) => onChange({ monthlyInsights: checked })}
            />
          </div>
        </div>
      </Space>
    </Card>
  );
}

export default EmailSubscriptions;
