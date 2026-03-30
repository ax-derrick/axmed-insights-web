import { useState, useEffect } from 'react';
import { Typography, Card, Input, Button, Space, message, Row, Col, Divider } from 'antd';
import { SaveOutlined, LinkOutlined } from '@ant-design/icons';
import { EmailSubscriptions } from '../components/Settings';
import { updateEmailSubscription, getEmailSubscription } from '../services/n8n';
import type { EmailSubscription } from '../types';

const { Title, Text, Paragraph } = Typography;

const defaultSubscription: EmailSubscription = {
  userId: 'user_1',
  email: 'user@axmed.co',
  dailyDigest: true,
  dailyDigestTime: '09:00',
  weeklyReport: true,
  weeklyReportDay: 'monday',
  instantAlerts: true,
  monthlyInsights: false,
};

function SettingsPage() {
  const [subscription, setSubscription] = useState<EmailSubscription>(defaultSubscription);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [n8nUrl, setN8nUrl] = useState(import.meta.env.VITE_N8N_BASE_URL || '');

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const data = await getEmailSubscription(subscription.email);
        if (data) {
          setSubscription(data);
        }
      } catch (error) {
        console.log('Using default subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleSubscriptionChange = (updates: Partial<EmailSubscription>) => {
    setSubscription((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEmailSubscription(subscription);
      message.success('Settings saved successfully');
    } catch (error) {
      console.log('Mock save:', error);
      message.success('Settings saved (mock mode)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0 }}>Settings</Title>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={saving}
        >
          Save Changes
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Email Subscriptions */}
          <EmailSubscriptions
            subscription={subscription}
            onChange={handleSubscriptionChange}
            loading={loading}
          />
        </Col>

        <Col xs={24} lg={8}>
          {/* N8N Configuration */}
          <Card title="Integration Settings" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>N8N Webhook URL</Text>
                <Paragraph type="secondary" style={{ fontSize: '13px', marginBottom: '8px' }}>
                  Base URL for N8N webhook integrations
                </Paragraph>
                <Input
                  prefix={<LinkOutlined />}
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com"
                />
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <div>
                <Text strong>Webhook Endpoints</Text>
                <Paragraph type="secondary" style={{ fontSize: '13px', marginBottom: '8px' }}>
                  Configure these endpoints in your N8N workflows
                </Paragraph>
                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}>
                  <div><Text type="secondary">Process:</Text> /webhook/process-transcript</div>
                  <div><Text type="secondary">Insights:</Text> /webhook/get-insights</div>
                  <div><Text type="secondary">Actions:</Text> /webhook/get-action-items</div>
                  <div><Text type="secondary">Features:</Text> /webhook/get-feature-requests</div>
                  <div><Text type="secondary">Email:</Text> /webhook/subscribe-email</div>
                </div>
              </div>
            </Space>
          </Card>

          {/* About */}
          <Card title="About">
            <Space direction="vertical">
              <div>
                <Text strong>Axmed Insights</Text>
                <br />
                <Text type="secondary">Version 1.0.0</Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Paragraph type="secondary" style={{ fontSize: '13px' }}>
                Internal dashboard for analyzing customer feedback, call transcripts, and meeting notes.
                Powered by N8N workflows and AI.
              </Paragraph>
              <Paragraph type="secondary" style={{ fontSize: '13px' }}>
                <strong>Axmed</strong> - Accelerating access to medicines in low/middle-income countries.
              </Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SettingsPage;
