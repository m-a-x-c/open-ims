import { ConfigProvider } from 'antd';
import { Button } from 'antd';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          colorPrimary: '#37352f',
          colorText: '#37352f',
          colorTextSecondary: '#787774',
          colorBorder: '#e9e9e7',
          colorBgContainer: '#ffffff',
          colorBgLayout: '#ffffff',
          borderRadius: 4,
          fontSize: 14,
          controlHeight: 32,
        },
      }}
    >
      <div style={{ padding: 32 }}>
        <h1>Inventory Management System</h1>
        <p>Theme configured ✓</p>
        <Button type='primary'>Test button</Button>
      </div>
    </ConfigProvider>
  );
};

export default App;
