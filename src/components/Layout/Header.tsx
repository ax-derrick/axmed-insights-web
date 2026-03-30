import { Layout, Button, Space, Avatar, Dropdown, Badge } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    label: 'Profile',
  },
  {
    key: 'settings',
    label: 'Settings',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: 'Sign out',
    danger: true,
  },
];

function Header({ collapsed, onToggle }: HeaderProps) {
  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: '64px',
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{
          fontSize: '16px',
          width: 40,
          height: 40,
          color: '#595959',
        }}
      />

      <Space size={16}>
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{
              fontSize: '16px',
              color: '#595959',
              width: 36,
              height: 36,
            }}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Space
            style={{
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
            }}
            className="user-dropdown-trigger"
          >
            <Avatar
              size={32}
              style={{ background: '#261C7A' }}
              icon={<UserOutlined />}
            />
            <div className="hide-mobile" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#0a1929', lineHeight: 1.3 }}>
                Team Member
              </div>
              <div style={{ fontSize: '11px', color: '#999', lineHeight: 1.2 }}>
                Admin
              </div>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

export default Header;
