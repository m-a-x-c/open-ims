import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { ConfigProvider } from 'antd';

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
          boxShadow: 'none',
          boxShadowSecondary: 'none',
          fontSize: 14,
          controlHeight: 32,
        },
        components: {
          Button: {
            primaryShadow: 'none',
            defaultShadow: 'none',
          },
          Menu: {
            itemHoverBg: '#f1f1ef',
            itemSelectedBg: '#ebebea',
            itemSelectedColor: '#37352f',
            itemColor: '#37352f',
            itemHoverColor: '#37352f',
            itemHeight: 32,
            iconSize: 16,
          },
          Layout: {
            siderBg: '#fbfbfa',
            bodyBg: '#ffffff',
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
