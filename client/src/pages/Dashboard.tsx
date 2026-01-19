import { useCountProductsQuery } from '../redux/features/management/productApi';
import { useYearlySaleQuery } from '../redux/features/management/saleApi';
import DailyChart from '../components/Charts/DailyChart';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { data: products, isLoading } = useCountProductsQuery(undefined);
  const { data: yearlyData, isLoading: isLoading1 } = useYearlySaleQuery(undefined);

  if (isLoading && isLoading1) return <Loader />;

  const totalStock = products?.data?.totalQuantity || 0;
  const totalSold = yearlyData?.data?.reduce(
    (acc: number, cur: { totalQuantity: number }) => acc + cur.totalQuantity,
    0
  ) || 0;
  const totalRevenue = yearlyData?.data?.reduce(
    (acc: number, cur: { totalRevenue: number }) => acc + cur.totalRevenue,
    0
  ) || 0;

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
        Overview of your stock, sales and revenue.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <StatCard label='Total stock' value={totalStock.toLocaleString()} />
        <StatCard label='Items sold' value={totalSold.toLocaleString()} />
        <StatCard label='Revenue' value={`$${totalRevenue.toLocaleString()}`} />
      </div>

      <ChartCard title='Daily sales and revenue' subtitle='Last 30 days'>
        <DailyChart />
      </ChartCard>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      padding: '16px 18px',
      border: '1px solid var(--border)',
      borderRadius: 6,
      background: 'var(--bg)',
      transition: 'background 120ms',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-soft)')}
    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg)')}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-faint)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 28,
        fontWeight: 600,
        color: 'var(--text)',
        letterSpacing: '-0.01em',
      }}
    >
      {value}
    </div>
  </div>
);

const ChartCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      padding: 20,
      border: '1px solid var(--border)',
      borderRadius: 6,
      background: 'var(--bg)',
      marginBottom: 16,
    }}
  >
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{title}</h3>
      {subtitle && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</div>
      )}
    </div>
    {children}
  </div>
);

export default Dashboard;
