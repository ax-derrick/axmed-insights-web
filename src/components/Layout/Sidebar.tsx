import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  MessageOutlined,
  LineChartOutlined,
  CheckSquareOutlined,
  BulbOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/chat',
    icon: <MessageOutlined />,
    label: 'Submit & Chat',
  },
  {
    key: '/insights',
    icon: <LineChartOutlined />,
    label: 'Insights',
  },
  {
    key: '/action-items',
    icon: <CheckSquareOutlined />,
    label: 'Action Items',
  },
  {
    key: '/feature-requests',
    icon: <BulbOutlined />,
    label: 'Feature Requests',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];

function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={220}
      collapsedWidth={80}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {/* Logo area */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 16px' : '0 20px',
          borderBottom: '1px solid #f0f0f0',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#261C7A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>A</span>
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#0a1929',
                whiteSpace: 'nowrap',
              }}
            >
              Axmed
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#595959',
                whiteSpace: 'nowrap',
              }}
            >
              CX Insights
            </div>
          </div>
        )}
      </div>

      {/* Navigation menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          border: 'none',
          padding: '8px 0',
          background: 'transparent',
        }}
      />
    </Sider>
  );
}

export default Sidebar;
