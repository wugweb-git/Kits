import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export interface RadialChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface RadialChartProps {
  data: RadialChartData[];
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RadialChart Component
 * 
 * Radial bar chart visualization using recharts.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <RadialChart
 *   data={[
 *     { name: 'Complete', value: 75, fill: '#4CAF50' },
 *     { name: 'In Progress', value: 50, fill: '#FFBE1A' },
 *     { name: 'Pending', value: 25, fill: '#F44336' }
 *   ]}
 * />
 */
export function RadialChart({
  data,
  height = 400,
  showLegend = true,
  innerRadius = 20,
  outerRadius = 140,
  className = '',
  style = {},
}: RadialChartProps) {
  const defaultColors = ['#FFBE1A', '#4CAF50', '#2196F3', '#F44336', '#9C27B0'];

  const chartData = data.map((item, index) => ({
    ...item,
    fill: item.fill || defaultColors[index % defaultColors.length],
  }));

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
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="value"
            cornerRadius={4}
            label={{
              position: 'insideStart',
              fill: '#fff',
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
            }}
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
          />
          {showLegend && (
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
              }}
            />
          )}
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
