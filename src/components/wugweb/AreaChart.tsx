import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface AreaChartProps {
  data: any[];
  dataKeys: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AreaChart Component
 * 
 * Area chart visualization using recharts.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <AreaChart
 *   data={chartData}
 *   xAxisKey="month"
 *   dataKeys={[
 *     { key: 'sales', name: 'Sales', color: '#FFBE1A' },
 *     { key: 'revenue', name: 'Revenue', color: '#4CAF50' }
 *   ]}
 * />
 */
export function AreaChart({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  className = '',
  style = {},
}: AreaChartProps) {
  const defaultColors = ['#FFBE1A', '#4CAF50', '#2196F3', '#F44336', '#9C27B0'];

  return (
    <div
      className={className}
      style={{
        width: '100%',
        fontFamily: 'Inter Tight, sans-serif',
        ...style,
      }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0, 0, 0, 0.1)"
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}
            stroke="var(--border)"
          />
          <YAxis
            tick={{ fill: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}
            stroke="var(--border)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
              }}
            />
          )}
          {dataKeys.map((item, index) => (
            <Area
              key={`area-${item.key}-${index}`}
              type="monotone"
              dataKey={item.key}
              name={item.name}
              stackId={stacked ? '1' : undefined}
              stroke={item.color || defaultColors[index % defaultColors.length]}
              fill={item.color || defaultColors[index % defaultColors.length]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}