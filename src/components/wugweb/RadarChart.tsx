import React from 'react';
import { RadarChart as RechartsRadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface RadarChartProps {
  data: any[];
  dataKeys: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  angleKey: string;
  height?: number;
  showLegend?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RadarChart Component
 * 
 * Radar/Spider chart visualization using recharts.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <RadarChart
 *   data={skillsData}
 *   angleKey="skill"
 *   dataKeys={[
 *     { key: 'current', name: 'Current Level', color: '#FFBE1A' },
 *     { key: 'target', name: 'Target Level', color: '#4CAF50' }
 *   ]}
 * />
 */
export function RadarChart({
  data,
  dataKeys,
  angleKey,
  height = 400,
  showLegend = true,
  className = '',
  style = {},
}: RadarChartProps) {
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
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey={angleKey}
            tick={{ fill: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif', fontSize: 'var(--text-sm)' }}
          />
          <PolarRadiusAxis
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
            <Radar
              key={`radar-${item.key}-${index}`}
              name={item.name}
              dataKey={item.key}
              stroke={item.color || defaultColors[index % defaultColors.length]}
              fill={item.color || defaultColors[index % defaultColors.length]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}