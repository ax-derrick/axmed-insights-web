import { Drawer, Button, Typography, Divider } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

interface QuickViewDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onViewDetails?: () => void;
  viewDetailsLabel?: string;
  width?: number;
}

function QuickViewDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  onViewDetails,
  viewDetailsLabel = 'View Full Details',
  width = 400,
}: QuickViewDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={width}
      title={
        <div>
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              {subtitle}
            </Text>
          )}
        </div>
      }
      footer={
        onViewDetails ? (
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={onViewDetails}>
              {viewDetailsLabel} <RightOutlined />
            </Button>
          </div>
        ) : undefined
      }
      styles={{
        body: {
          padding: '16px 24px',
        },
        header: {
          borderBottom: '1px solid #f0f0f0',
        },
        footer: {
          borderTop: '1px solid #f0f0f0',
          padding: '12px 24px',
        },
      }}
    >
      {children}
    </Drawer>
  );
}

// Pre-built content sections for common drawer use cases

interface MetricRowProps {
  label: string;
  value: ReactNode;
  color?: string;
}

function MetricRow({ label, value, color }: MetricRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
      <Text type="secondary">{label}</Text>
      <Text strong style={{ color }}>
        {value}
      </Text>
    </div>
  );
}

interface MetricSectionProps {
  title?: string;
  children: ReactNode;
}

function MetricSection({ title, children }: MetricSectionProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {title && (
        <>
          <Text
            strong
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#595959',
            }}
          >
            {title}
          </Text>
          <Divider style={{ margin: '8px 0' }} />
        </>
      )}
      {children}
    </div>
  );
}

export default QuickViewDrawer;
export { MetricRow, MetricSection };
