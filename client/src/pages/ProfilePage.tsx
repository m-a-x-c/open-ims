import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import userProPic from '../assets/User.png';
import Loader from '../components/Loader';
import { useGetSelfProfileQuery } from '../redux/features/authApi';
import { profileKeys } from '../constant/profile';

const ProfilePage = () => {
  const { data, isLoading } = useGetSelfProfileQuery(undefined);

  if (isLoading) return <Loader />;

  const profile = data?.data || {};
  const displayName = profile.name || profile.email || 'Unnamed';

  const personal = ['name', 'email', 'title', 'description', 'status'];
  const contact  = ['address', 'phone', 'city', 'country'];
  const social   = ['facebook', 'twitter', 'linkedin', 'instagram'];

  return (
    <div>
      <div
        style={{
          height: 140,
          background:
            'linear-gradient(135deg, #f6f5f3 0%, #ecebe8 100%)',
          borderRadius: 6,
          marginBottom: 0,
          marginLeft: -16,
          marginRight: -16,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: -36, marginBottom: 24 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: '#ffffff',
            border: '3px solid #ffffff',
            boxShadow: '0 1px 3px rgba(15, 15, 15, 0.1)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img
            src={profile.avatar || userProPic}
            alt='user'
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
          <h1 style={{ marginBottom: 2 }}>{displayName}</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {profile.title || profile.email}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        <Link to='/edit-profile'>
          <Button type='default' icon={<EditOutlined />}>Edit profile</Button>
        </Link>
        <Link to='/change-password'>
          <Button type='default' icon={<LockOutlined />}>Change password</Button>
        </Link>
      </div>

      <Section title='Personal'>
        {personal.map((k) => (
          <ProfileRow key={k} keyName={k} value={profile[k]} />
        ))}
      </Section>

      <Section title='Contact'>
        {contact.map((k) => (
          <ProfileRow key={k} keyName={k} value={profile[k]} />
        ))}
      </Section>

      <Section title='Social'>
        {social.map((k) => (
          <ProfileRow key={k} keyName={k} value={profile[k]} />
        ))}
      </Section>

      {/* keep import compatibility — silence unused */}
      <span style={{ display: 'none' }}>{profileKeys.length}</span>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 28 }}>
    <h3
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-faint)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
      }}
    >
      {title}
    </h3>
    <div style={{ borderTop: '1px solid var(--border)' }}>{children}</div>
  </div>
);

const ProfileRow = ({ keyName, value }: { keyName: string; value?: string }) => {
  const filled = value !== undefined && value !== null && value !== '';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        alignItems: 'center',
        gap: 16,
        padding: '8px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: 'var(--text-muted)',
          textTransform: 'capitalize',
        }}
      >
        {keyName}
      </div>
      <div
        style={{
          fontSize: 14,
          color: filled ? 'var(--text)' : 'var(--text-faint)',
        }}
      >
        {filled ? value : 'Empty'}
      </div>
    </div>
  );
};

export default ProfilePage;
