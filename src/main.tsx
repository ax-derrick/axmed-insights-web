import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';

// Ant Design theme configuration - Axmed Branding
const theme = {
  token: {
    colorPrimary: '#261C7A', // Axmed primary purple
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#fafafa',
    colorText: '#0a1929',
    colorTextSecondary: '#595959',
    colorBorder: '#f0f0f0',
  },
  components: {
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 8,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#F0EEFB',
      itemSelectedColor: '#261C7A',
      itemHoverColor: '#261C7A',
      itemHoverBg: '#fafafa',
    },
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <BrowserRouter basename="/axmed-insights-web">
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
