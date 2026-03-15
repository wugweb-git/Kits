import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
} from 'recharts';

export interface ChartProps {
  /** Type of chart */
  type?: 'bar' | 'line' | 'area';
  /** Data array */
  data: any[];
  /** Key for X axis */
  index: string;
  /** Array of category keys to plot */
  categories: string[];
  /** Colors for categories (defaults to chart tokens) */
  colors?: string[];
  /** Show grid lines */
  showGrid?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Height of the chart */
  height?: number | string;
  /** Custom formatter for values */
  valueFormatter?: (value: number) => string;
}

const defaultColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function Chart({
  type = 'bar',
  data,
  index,
  categories,
  colors = defaultColors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  height = 300,
  valueFormatter = (value: number) => `${value}`,
}: ChartProps) {
  const ChartComponent = {
    bar: RechartsBarChart,
    line: RechartsLineChart,
    area: RechartsAreaChart,
  }[type];

  const renderChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="var(--border)" 
          />
        )}
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          dy={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          tickFormatter={valueFormatter}
          dx={-10}
        />
        {showTooltip && (
          <Tooltip
            cursor={{ fill: 'var(--surface-800)', opacity: 0.4 }}
            contentStyle={{
              backgroundColor: 'var(--popover)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--popover-foreground)',
            }}
            itemStyle={{ color: 'var(--popover-foreground)' }}
            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-1)' }}
          />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType={type === 'line' ? 'plainline' : 'rect'}
          />
        )}
        
        {categories.map((category, i) => {
          const color = colors[i % colors.length];
          
          if (type === 'bar') {
            return (
              <Bar
                key={category}
                dataKey={category}
                fill={color}
                radius={type === 'bar' ? [4, 4, 0, 0] : 0}
              />
            );
          }
          
          if (type === 'line') {
            return (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: 'var(--background)', stroke: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              />
            );
          }
          
          if (type === 'area') {
            return (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stroke={color}
                fill={color}
                fillOpacity={0.2}
              />
            );
          }
          
          return null;
        })}
      </ChartComponent>
    </ResponsiveContainer>
  );

  return (
    <div style={{ height, width: '100%', fontFamily: 'Inter Tight, sans-serif' }}>
      {renderChart()}
    </div>
  );
}
