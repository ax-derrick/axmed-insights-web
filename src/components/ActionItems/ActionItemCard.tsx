import { Card, Tag, Typography, Space, Button, Dropdown } from 'antd';
import { MoreOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ActionItem } from '../../types';
import { formatRelativeTime, getPriorityColor, getStatusColor, capitalizeFirst } from '../../utils/formatters';

const { Text, Paragraph } = Typography;

interface ActionItemCardProps {
  item: ActionItem;
  onStatusChange: (id: string, status: ActionItem['status']) => void;
}

function ActionItemCard({ item, onStatusChange }: ActionItemCardProps) {
  const menuItems: MenuProps['items'] = [
    {
      key: 'open',
      label: 'Mark as Open',
      disabled: item.status === 'open',
    },
    {
      key: 'in_progress',
      label: 'Mark as In Progress',
      disabled: item.status === 'in_progress',
    },
    {
      key: 'completed',
      label: 'Mark as Completed',
      disabled: item.status === 'completed',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    onStatusChange(item.id, key as ActionItem['status']);
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: '12px',
        borderLeft: `4px solid ${getPriorityColor(item.priority)}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Text strong>{item.title}</Text>
            <Tag color={getPriorityColor(item.priority)}>
              {capitalizeFirst(item.priority)}
            </Tag>
            <Tag color={getStatusColor(item.status)}>
              {item.status === 'in_progress' ? 'In Progress' : capitalizeFirst(item.status)}
            </Tag>
          </div>

          {item.description && (
            <Paragraph type="secondary" style={{ marginBottom: '8px' }} ellipsis={{ rows: 2 }}>
              {item.description}
            </Paragraph>
          )}

          <Space size="middle">
            {item.assignee && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Assigned to: {item.assignee}
              </Text>
            )}
            {item.dueDate && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <ClockCircleOutlined /> Due: {formatRelativeTime(item.dueDate)}
              </Text>
            )}
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Created: {formatRelativeTime(item.createdAt)}
            </Text>
          </Space>
        </div>

        <Space>
          {item.status !== 'completed' && (
            <Button
              type="text"
              icon={<CheckOutlined />}
              onClick={() => onStatusChange(item.id, 'completed')}
              title="Mark as completed"
            />
          )}
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      </div>
    </Card>
  );
}

export default ActionItemCard;
