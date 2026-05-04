import { Link } from 'react-router-dom';
import MonthlyChart from '../components/Charts/MonthlyChart';
import Loader from '../components/Loader';
import { useCountProductsQuery, useLowStockProductsQuery } from '../redux/features/management/productApi';
import { useYearlySaleQuery } from '../redux/features/management/saleApi';
import DailyChart from '../components/Charts/DailyChart';

const Dashboard = () => {
  const { data: products, isLoading } = useCountProductsQuery(undefined);
  const { data: yearlyData, isLoading: isLoading1 } = useYearlySaleQuery(undefined);
  const { data: lowStockData } = useLowStockProductsQuery(10);
  const lowStockItems: Array<{ _id: string; name: string; sku: string; stock: number; lowStockThreshold?: number }> =
    lowStockData?.data ?? [];

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

      {lowStockItems.length > 0 && (
        <div
          style={{
            padding: 20,
            border: '1px solid #ffccc7',
            background: '#fff8f7',
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: '#a8071a' }}>
                Needs restock — {lowStockItems.length}
              </h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Items at or below their low-stock threshold.
              </div>
            </div>
            <Link to='/products' style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {lowStockItems.slice(0, 5).map((p) => (
              <div
                key={p._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderTop: '1px solid #ffe0dc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      minWidth: 90,
                    }}
                  >
                    {p.sku}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text)' }}>{p.name}</span>
                </div>
                <div style={{ fontSize: 13, color: '#a8071a', fontWeight: 500 }}>
                  {p.stock} / {p.lowStockThreshold ?? 10}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChartCard title='Daily sales and revenue' subtitle='Last 30 days'>
        <DailyChart />
      </ChartCard>

      <ChartCard title='Monthly revenue' subtitle='Year to date'>
        <MonthlyChart />
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
