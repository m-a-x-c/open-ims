import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { sidebarItems } from '../../constant/sidebarItems';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getCurrentUser, logoutUser } from '../../redux/services/authSlice';
import { useLowStockCountQuery } from '../../redux/features/management/productApi';

const { Content, Sider } = Layout;

const Sidebar = () => {
  const [showFooter, setShowFooter] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(getCurrentUser);
  const { data: lowStockData } = useLowStockCountQuery(undefined, { skip: !user });
  const lowStockCount: number = lowStockData?.data?.total ?? 0;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const initial = (user?.email || 'U').toString().charAt(0).toUpperCase();
  const displayName = user?.email || 'Workspace';

  // Inject a red count badge into the Products row when there are low-stock items.
  const decoratedItems = sidebarItems.map((item) => {
    if (item.key === 'Manage Products' && lowStockCount > 0) {
      return {
        ...item,
        label: (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {item.label}
            <span
              title={`${lowStockCount} item${lowStockCount === 1 ? '' : 's'} at or below low-stock threshold`}
              style={{
                marginLeft: 8,
                background: '#fff1f0',
                color: '#a8071a',
                border: '1px solid #ffccc7',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 600,
                padding: '0 6px',
                minWidth: 18,
                height: 16,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {lowStockCount}
            </span>
          </span>
        ),
      };
    }
    return item;
  });

  return (
    <Layout style={{ height: '100vh', background: '#ffffff' }}>
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onCollapse={(collapsed, type) => {
          if (type === 'responsive' || type === 'clickTrigger') {
            setShowFooter(!collapsed);
          }
        }}
        width={240}
        style={{
          background: '#fbfbfa',
          borderRight: '1px solid #e9e9e7',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 12px 10px 12px',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              background: '#37352f',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#37352f',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {displayName}
          </span>
        </div>

        <Menu
          mode='inline'
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0 6px',
            fontSize: 14,
          }}
          defaultSelectedKeys={['Dashboard']}
          items={decoratedItems}
        />

        {showFooter && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '8px 12px 14px 12px',
              borderTop: '1px solid #e9e9e7',
            }}
          >
            {lowStockCount > 0 && (
              <button
                type='button'
                onClick={() => navigate('/products')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '6px 8px',
                  marginBottom: 4,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  color: '#a8071a',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'background 120ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#cf1322' }} />
                {lowStockCount} item{lowStockCount === 1 ? '' : 's'} low on stock
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '6px 8px',
                background: 'transparent',
                border: 'none',
                borderRadius: 4,
                color: '#787774',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background 120ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f1ef')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogoutOutlined style={{ fontSize: 14 }} />
              Log out
            </button>
          </div>
        )}
      </Sider>

      <Layout style={{ background: '#ffffff' }}>
        <Content
          style={{
            background: '#ffffff',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '48px 64px',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
