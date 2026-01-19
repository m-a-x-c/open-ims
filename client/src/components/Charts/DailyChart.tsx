import { Flex } from 'antd';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDailySaleQuery } from '../../redux/features/management/saleApi';
import Loader from '../Loader';
import { months } from '../../utils/generateDate';

export default function DailyChart() {
  const { data: dailyData, isLoading } = useDailySaleQuery(undefined);

  if (isLoading)
    return (
      <Flex>
        <Loader />
      </Flex>
    );

  const data = dailyData?.data.map(
    (item: {
      day: number;
      month: number;
      year: number;
      totalRevenue: number;
      totalQuantity: number;
    }) => ({
      name: `${item.day} ${months[item.month - 1]}`,
      revenue: item.totalRevenue,
      quantity: item.totalQuantity,
    })
  );

  const axisStyle = { fontSize: 11, fill: '#787774' };

  return (
    <ResponsiveContainer width='100%' height={260}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 16, left: 8, bottom: 24 }}
      >
        <defs>
          <linearGradient id='dailyRevenue' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#37352f' stopOpacity={0.18} />
            <stop offset='100%' stopColor='#37352f' stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke='#ebebea' vertical={false} />
        <XAxis
          dataKey='name'
          tick={axisStyle}
          stroke='#e9e9e7'
          tickLine={false}
          axisLine={false}
          interval='preserveStartEnd'
          minTickGap={32}
          label={{
            value: 'Date',
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
          cursor={{ stroke: '#d9d9d7', strokeWidth: 1 }}
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #e9e9e7',
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(15, 15, 15, 0.08)',
            fontSize: 12,
          }}
          labelStyle={{ color: '#787774', fontSize: 11, marginBottom: 4 }}
        />
        <Area
          type='monotone'
          dataKey='revenue'
          stroke='#37352f'
          strokeWidth={1.5}
          fill='url(#dailyRevenue)'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
