import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface BarChartProps {
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
  horizontal?: boolean;
  stacked?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BarChart Component
 * 
 * Bar chart visualization using recharts.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <BarChart
 *   data={chartData}
 *   xAxisKey="category"
 *   dataKeys={[
 *     { key: 'value', name: 'Value', color: '#FFBE1A' }
 *   ]}
 * />
 */
export function BarChart({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  horizontal = false,
  stacked = false,
  className = '',
  style = {},
}: BarChartProps) {
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
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0, 0, 0, 0.1)"
            />
          )}
          {horizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fill: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}
                stroke="var(--border)"
              />
              <YAxis
                dataKey={xAxisKey}
                type="category"
                tick={{ fill: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}
                stroke="var(--border)"
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}
                stroke="var(--border)"
              />
              <YAxis
                tick={{ fill: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}
                stroke="var(--border)"
              />
            </>
          )}
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
            <Bar
              key={`bar-${item.key}-${index}`}
              dataKey={item.key}
              name={item.name}
              stackId={stacked ? '1' : undefined}
              fill={item.color || defaultColors[index % defaultColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}