import React from 'react';
import { AreaChart, BarChart, LineChart, PieChart, RadarChart, RadialChart, DataTable } from '../../design-system/components';
import { BarChart2, TrendingUp, Activity } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';

/**
 * ChartsOverview Component
 * 
 * Landing page for Charts section showing all available charts.
 * Uses CSS variables from /styles/globals.css for theming.
 */
export function ChartsOverview() {
  const sampleData = [
    { month: 'Jan', sales: 4000, revenue: 2400, users: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398, users: 2210 },
    { month: 'Mar', sales: 2000, revenue: 9800, users: 2290 },
    { month: 'Apr', sales: 2780, revenue: 3908, users: 2000 },
    { month: 'May', sales: 1890, revenue: 4800, users: 2181 },
    { month: 'Jun', sales: 2390, revenue: 3800, users: 2500 },
  ];

  const pieData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 200 },
    { name: 'Product D', value: 100 },
  ];

  const radarData = [
    { subject: 'Design', A: 120, B: 110 },
    { subject: 'Development', A: 98, B: 130 },
    { subject: 'Marketing', A: 86, B: 130 },
    { subject: 'Sales', A: 99, B: 100 },
    { subject: 'Support', A: 85, B: 90 },
  ];

  const handleNavigate = (chartId: string) => {
    // This would be connected to actual navigation
    console.log('Navigate to:', chartId);
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <PageHeader>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: '6px 16px',
            background: 'var(--accent-subtle)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          <BarChart2 size={16} />
          6 Chart Types + Data Table
        </div>
        <h1
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            margin: 0,
            marginBottom: 'var(--spacing-4)',
            lineHeight: 1.1,
          }}
        >
          Beautiful Charts & Data Visualization
        </h1>
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-xl)',
            color: 'var(--muted-foreground)',
            margin: 0,
            marginBottom: 'var(--spacing-6)',
            maxWidth: '800px',
            lineHeight: 1.6,
          }}
        >
          Production-ready chart components powered by Recharts. Fully customizable with CSS variables,
          responsive, and accessible out of the box.
        </p>

        {/* Features */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-8)',
          }}
        >
          {[
            {
              icon: <TrendingUp size={20} />,
              title: 'Fully Responsive',
              description: 'Charts adapt to any screen size automatically',
            },
            {
              icon: <Activity size={20} />,
              title: 'CSS Variables',
              description: 'Theme all charts by updating your design tokens',
            },
            {
              icon: <BarChart2 size={20} />,
              title: 'Rich Features',
              description: 'Tooltips, legends, grids, and more built-in',
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: 'var(--spacing-4)',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  marginBottom: 'var(--spacing-2)',
                  color: 'var(--accent)',
                }}
              >
                {feature.icon}
                <h3
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--foreground)',
                    margin: 0,
                  }}
                >
                  {feature.title}
                </h3>
              </div>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* Chart Gallery */}
      <PageSection>
        <h2
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-6)',
          }}
        >
          Available Charts
        </h2>

        <PageGrid>
          {/* Area Chart */}
          <PageCard
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                Area Chart
              </h3>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                }}
              >
                Show trends over time with filled areas
              </p>
            </div>
            <div style={{ padding: 'var(--spacing-4)' }}>
              <AreaChart
                data={sampleData}
                xAxisKey="month"
                dataKeys={[
                  { key: 'sales', name: 'Sales' },
                  { key: 'revenue', name: 'Revenue' },
                ]}
                height={250}
              />
            </div>
          </PageCard>

          {/* Bar Chart */}
          <PageCard
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                Bar Chart
              </h3>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                }}
              >
                Compare values across categories
              </p>
            </div>
            <div style={{ padding: 'var(--spacing-4)' }}>
              <BarChart
                data={sampleData}
                xAxisKey="month"
                dataKeys={[
                  { key: 'sales', name: 'Sales' },
                  { key: 'revenue', name: 'Revenue' },
                ]}
                height={250}
              />
            </div>
          </PageCard>

          {/* Line Chart */}
          <PageCard
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                Line Chart
              </h3>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                }}
              >
                Display continuous data and trends
              </p>
            </div>
            <div style={{ padding: 'var(--spacing-4)' }}>
              <LineChart
                data={sampleData}
                xAxisKey="month"
                dataKeys={[
                  { key: 'sales', name: 'Sales' },
                  { key: 'users', name: 'Users' },
                ]}
                height={250}
              />
            </div>
          </PageCard>

          {/* Pie Chart */}
          <PageCard
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                Pie Chart
              </h3>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                }}
              >
                Show proportions and percentages
              </p>
            </div>
            <div style={{ padding: 'var(--spacing-4)' }}>
              <PieChart
                data={pieData}
                dataKey="value"
                nameKey="name"
                height={250}
              />
            </div>
          </PageCard>

          {/* Radar Chart */}
          <PageCard
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                Radar Chart
              </h3>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                }}
              >
                Compare multiple variables
              </p>
            </div>
            <div style={{ padding: 'var(--spacing-4)' }}>
              <RadarChart
                data={radarData}
                dataKeys={[
                  { key: 'A', name: 'Team A' },
                  { key: 'B', name: 'Team B' },
                ]}
                angleKey="subject"
                height={250}
              />
            </div>
          </PageCard>

          {/* Radial Chart */}
          <PageCard
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
              <h3
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                Radial Chart
              </h3>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted-foreground)',
                  margin: 0,
                }}
              >
                Circular progress and metrics
              </p>
            </div>
            <div style={{ padding: 'var(--spacing-4)' }}>
              <RadialChart
                data={[{ name: 'Progress', value: 75, fill: '#FFBE1A' }]}
                dataKey="value"
                height={250}
              />
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>

      {/* Quick Start */}
      <div
        style={{
          padding: 'var(--spacing-8)',
          background: 'var(--accent-subtle)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--radius-lg)',
          marginTop: 'var(--spacing-12)',
        }}
      >
        <h2
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          Quick Start
        </h2>
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-base)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          All charts are ready to use. Simply import and pass your data:
        </p>
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground)',
            background: 'var(--background)',
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            overflow: 'auto',
          }}
        >
          {`import { AreaChart } from './components/design-system/components';

const data = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 2000 },
];

<AreaChart
  data={data}
  xAxisKey="month"
  dataKeys={[{ key: 'sales', name: 'Sales' }]}
/>`}
        </pre>
      </div>
    </PageWrapper>
  );
}