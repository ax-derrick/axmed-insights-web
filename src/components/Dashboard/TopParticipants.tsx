import { Card, List, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TopParticipant } from '../../types';

const { Text } = Typography;

interface TopParticipantsProps {
  participants: TopParticipant[];
  loading?: boolean;
}

function TopParticipants({ participants, loading }: TopParticipantsProps) {
  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card title="Top Contributors" size="small" loading={loading}>
      <List
        size="small"
        dataSource={participants.slice(0, 5)}
        renderItem={(item, index) => (
          <List.Item style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Text style={{ width: '20px', color: '#888' }}>{index + 1}.</Text>
              <Avatar
                size="small"
                style={{ backgroundColor: getAvatarColor(item.name), marginRight: '8px' }}
                icon={<UserOutlined />}
              >
                {getInitials(item.name)}
              </Avatar>
              <Text ellipsis style={{ flex: 1 }}>{item.name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {item.count} submissions
              </Text>
            </div>
          </List.Item>
        )}
        locale={{ emptyText: 'No data' }}
      />
    </Card>
  );
}

export default TopParticipants;
