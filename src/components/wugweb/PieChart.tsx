import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieChartData[];
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  donut?: boolean;
  innerRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PieChart Component
 * 
 * Pie/Donut chart visualization using recharts.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <PieChart
 *   data={[
 *     { name: 'Desktop', value: 400, color: '#FFBE1A' },
 *     { name: 'Mobile', value: 300, color: '#4CAF50' },
 *     { name: 'Tablet', value: 200, color: '#2196F3' }
 *   ]}
 *   donut
 * />
 */
export function PieChart({
  data,
  height = 300,
  showLegend = true,
  showLabels = true,
  donut = false,
  innerRadius = 60,
  className = '',
  style = {},
}: PieChartProps) {
  const defaultColors = ['#FFBE1A', '#4CAF50', '#2196F3', '#F44336', '#9C27B0', '#FF9800', '#00BCD4'];

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
    return `${entry.name} (${percent}%)`;
  };

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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? renderLabel : false}
            outerRadius={100}
            innerRadius={donut ? innerRadius : 0}
            fill="#8884d8"
            dataKey="value"
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || defaultColors[index % defaultColors.length]}
              />
            ))}
          </Pie>
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
              wrapperStyle={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
