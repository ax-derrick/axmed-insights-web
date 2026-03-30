import { Typography } from 'antd';
import type { ReactNode } from 'react';

const { Text } = Typography;

interface SectionHeaderProps {
  title: string;           // e.g., "How are we doing?"
  subtitle?: string;       // e.g., "Key health indicators"
  action?: ReactNode;      // Optional right-side action (link, button)
}

function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div>
        <Text
          strong
          style={{
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#595959',
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            type="secondary"
            style={{
              display: 'block',
              fontSize: '12px',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </Text>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default SectionHeader;
