import { Card, Statistic, Tooltip } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

type StatusType = 'good' | 'warning' | 'critical' | 'neutral';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: ReactNode;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  // New props for cognitive landmarks
  target?: string | number;      // e.g., "75" or "target: 75"
  comparison?: string;           // e.g., "avg: 8/week" or "typical: 1-2"
  // New props for status indication
  status?: StatusType;           // Drives left border color
  // New props for drill-down
  onClick?: () => void;
  // New props for tooltips
  tooltip?: ReactNode;           // Hover tooltip content
}

const statusColors: Record<StatusType, string> = {
  good: '#1890ff',
  warning: '#faad14',
  critical: '#ff4d4f',
  neutral: '#d9d9d9',
};

function StatCard({
  title,
  value,
  prefix,
  suffix,
  trend,
  loading,
  target,
  comparison,
  status,
  onClick,
  tooltip,
}: StatCardProps) {
  const isClickable = !!onClick;

  const cardContent = (
    <Card
      className="stat-card"
      size="small"
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        borderLeft: status ? `3px solid ${statusColors[status]}` : undefined,
        transition: 'all 0.2s ease',
      }}
      onClick={onClick}
      hoverable={isClickable}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            loading={loading}
          />

          {/* Trend indicator */}
          {trend && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: trend.isPositive ? '#1890ff' : '#ff4d4f',
              }}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </div>
          )}

          {/* Cognitive landmarks: target or comparison */}
          {(target || comparison) && (
            <div
              style={{
                marginTop: trend ? '4px' : '8px',
                fontSize: '12px',
                color: '#999',
              }}
            >
              {target && (
                <span>
                  {typeof target === 'number' ? `target: ${target}` : target}
                </span>
              )}
              {target && comparison && <span style={{ margin: '0 6px' }}>·</span>}
              {comparison && <span>{comparison}</span>}
            </div>
          )}
        </div>

        {/* Drill-down indicator */}
        {isClickable && (
          <div
            style={{
              color: '#999',
              fontSize: '12px',
              marginLeft: '8px',
              opacity: 0.6,
            }}
          >
            <RightOutlined />
          </div>
        )}
      </div>
    </Card>
  );

  // Wrap with tooltip if provided
  if (tooltip) {
    return (
      <Tooltip
        title={tooltip}
        placement="top"
        overlayStyle={{ maxWidth: '300px' }}
      >
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
}

export default StatCard;
