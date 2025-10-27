import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { sidebarItems } from '../../constant/sidebarItems';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getCurrentUser, logoutUser } from '../../redux/services/authSlice';

const { Content, Sider } = Layout;

const Sidebar = () => {
  const [showFooter, setShowFooter] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(getCurrentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const initial = (user?.email || 'U').toString().charAt(0).toUpperCase();
  const displayName = user?.email || 'Workspace';

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
          items={sidebarItems}
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
