import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface LineChartProps {
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
  curved?: boolean;
  showDots?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * LineChart Component
 * 
 * Line chart visualization using recharts.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <LineChart
 *   data={chartData}
 *   xAxisKey="month"
 *   dataKeys={[
 *     { key: 'users', name: 'Users', color: '#FFBE1A' },
 *     { key: 'sessions', name: 'Sessions', color: '#4CAF50' }
 *   ]}
 *   curved
 * />
 */
export function LineChart({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  curved = false,
  showDots = true,
  className = '',
  style = {},
}: LineChartProps) {
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
        <RechartsLineChart
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
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
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
            <Line
              key={`line-${item.key}-${index}`}
              type={curved ? 'monotone' : 'linear'}
              dataKey={item.key}
              name={item.name}
              stroke={item.color || defaultColors[index % defaultColors.length]}
              strokeWidth={2}
              dot={showDots}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}