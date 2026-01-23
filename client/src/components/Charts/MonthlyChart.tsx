import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMonthlySaleQuery } from '../../redux/features/management/saleApi';
import { months } from '../../utils/generateDate';
import { Flex } from 'antd';
import Loader from '../Loader';

const MonthlyChart = () => {
  const { data: monthlyData, isLoading } = useMonthlySaleQuery(undefined);

  if (isLoading)
    return (
      <Flex>
        <Loader />
      </Flex>
    );

  const data = monthlyData?.data.map(
    (item: { month: number; year: number; totalRevenue: number }) => ({
      name: `${months[item.month - 1]} ${item.year}`,
      revenue: item.totalRevenue,
    })
  );

  const axisStyle = { fontSize: 11, fill: '#787774' };

  return (
    <ResponsiveContainer width='100%' height={260}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
        <CartesianGrid stroke='#ebebea' vertical={false} />
        <XAxis
          dataKey='name'
          tick={axisStyle}
          stroke='#e9e9e7'
          tickLine={false}
          axisLine={false}
          label={{
            value: 'Month',
            position: 'insideBottom',
            offset: -16,
            style: { fontSize: 11, fill: '#787774', fontWeight: 500 },
          }}
        />
        <YAxis
          tick={axisStyle}
          stroke='#e9e9e7'
          tickLine={false}
          axisLine={false}
          width={56}
          label={{
            value: 'Revenue ($)',
            angle: -90,
            position: 'insideLeft',
            offset: 12,
            style: { fontSize: 11, fill: '#787774', fontWeight: 500, textAnchor: 'middle' },
          }}
        />
        <Tooltip
          cursor={{ fill: '#f1f1ef' }}
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #e9e9e7',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(15, 15, 15, 0.08)',
            fontSize: 12,
          }}
          labelStyle={{ color: '#787774', fontSize: 11, marginBottom: 4 }}
        />
        <Bar dataKey='revenue' fill='#37352f' radius={[3, 3, 0, 0]} maxBarSize={56} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyChart;
