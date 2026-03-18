import React from 'react';
import { BarChart2, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Search, Settings, Home, Layers, FileText, PieChart, LogOut, ChevronRight } from 'lucide-react';
import { PageWrapper, PageHeader } from '../../PageWrapper';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const F = 'Inter Tight, sans-serif';

const revenueData = [
  { month: 'Jan', revenue: 38000, users: 1200 },
  { month: 'Feb', revenue: 42000, users: 1380 },
  { month: 'Mar', revenue: 39000, users: 1250 },
  { month: 'Apr', revenue: 51000, users: 1620 },
  { month: 'May', revenue: 48000, users: 1540 },
  { month: 'Jun', revenue: 60000, users: 1890 },
  { month: 'Jul', revenue: 65000, users: 2050 },
  { month: 'Aug', revenue: 58000, users: 1820 },
];

const kpiCards = [
  { label: 'Total Revenue', value: '$421,200', change: '+18.2%', up: true, icon: DollarSign, color: 'var(--accent)' },
  { label: 'Active Users', value: '14,830', change: '+9.1%', up: true, icon: Users, color: 'var(--info)' },
  { label: 'New Signups', value: '2,049', change: '-3.4%', up: false, icon: TrendingUp, color: 'var(--success)' },
  { label: 'Conversion', value: '4.72%', change: '+0.8pp', up: true, icon: BarChart2, color: '#8B5CF6' },
];

const recentOrders = [
  { id: '#ORD-8821', customer: 'Aisha Mohammed', product: 'Kits Pro Annual', amount: '$348', status: 'Paid' },
  { id: '#ORD-8820', customer: 'Lucas Ferreira', product: 'Kits Starter', amount: '$0', status: 'Free' },
  { id: '#ORD-8819', customer: 'Priya Nair', product: 'Kits Pro Monthly', amount: '$29', status: 'Paid' },
  { id: '#ORD-8818', customer: 'Tom Eriksson', product: 'Enterprise', amount: 'Custom', status: 'Invoice' },
  { id: '#ORD-8817', customer: 'James Park', product: 'Kits Pro Annual', amount: '$348', status: 'Paid' },
];

const statusColor: Record<string, string> = {
  Paid: 'var(--success)',
  Free: 'var(--muted-foreground)',
  Invoice: 'var(--warning)',
};

const navItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Users, label: 'Users' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: FileText, label: 'Reports' },
  { icon: PieChart, label: 'Revenue' },
  { icon: Layers, label: 'Components' },
  { icon: Settings, label: 'Settings' },
];

function Sidebar() {
  return (
    <aside style={{ width: 220, background: 'var(--card)', borderRight: 'var(--border-default)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: 'var(--spacing-5)', borderBottom: 'var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F, fontSize: 'var(--text-sm)' }}>W</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Wugweb</p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>Analytics</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left',
                background: item.active ? 'var(--accent-subtle)' : 'transparent',
                color: item.active ? 'var(--accent)' : 'var(--muted-foreground)',
                fontSize: 'var(--text-sm)', fontWeight: item.active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                fontFamily: F,
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
      {/* User */}
      <div style={{ padding: 'var(--spacing-4)', borderTop: 'var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>AM</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Aisha M.</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: F }}>Admin</p>
          </div>
          <LogOut size={14} style={{ color: 'var(--muted-foreground)', cursor: 'pointer' }} />
        </div>
      </div>
    </aside>
  );
}

export function DashboardTemplate() {
  return (
    <PageWrapper maxWidth="100%">
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <PageHeader
          badge="Template"
          title="Analytics Dashboard"
          description="Full-featured dashboard template with sidebar navigation, KPI cards, charts, and data table. Every value uses CSS variables."
        />
      </div>

      {/* Full dashboard preview */}
      <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--background)', boxShadow: 'var(--shadow-raised)' }}>
        {/* Browser chrome */}
        <div style={{ background: 'var(--muted)', borderBottom: 'var(--border-default)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          {['var(--destructive)', 'var(--warning)', 'var(--success)'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
          <div style={{ flex: 1, marginLeft: 8, background: 'var(--card)', borderRadius: 'var(--radius-sm)', padding: '3px 10px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>app.wugweb.io/dashboard</div>
        </div>

        {/* App shell */}
        <div style={{ display: 'flex', height: 600, overflow: 'hidden' }}>
          <Sidebar />

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Top bar */}
            <header style={{ height: 56, background: 'var(--card)', borderBottom: 'var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--spacing-6)', flexShrink: 0 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F }}>Dashboard</h2>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>Welcome back, Aisha</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: '5px 10px' }}>
                  <Search size={13} style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>Search...</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Bell size={18} style={{ color: 'var(--muted-foreground)' }} />
                  <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: 'var(--destructive)', border: '1px solid var(--card)' }} />
                </div>
              </div>
            </header>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)' }}>
                {kpiCards.map(card => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{card.label}</p>
                        <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: `color-mix(in srgb, ${card.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={13} style={{ color: card.color }} />
                        </div>
                      </div>
                      <p style={{ margin: '0 0 4px', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>{card.value}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {card.up ? <ArrowUpRight size={12} style={{ color: 'var(--success)' }} /> : <ArrowDownRight size={12} style={{ color: 'var(--destructive)' }} />}
                        <span style={{ fontSize: 'var(--text-xs)', color: card.up ? 'var(--success)' : 'var(--destructive)', fontFamily: F }}>{card.change}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>vs last month</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-4)' }}>
                {/* Area chart */}
                <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Revenue Overview</p>
                      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>Jan – Aug 2025</p>
                    </div>
                    <MoreHorizontal size={16} style={{ color: 'var(--muted-foreground)' }} />
                  </div>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFBE1A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FFBE1A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontFamily: F }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontFamily: F }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                      <Tooltip contentStyle={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, fontFamily: F }} />
                      <Area type="monotone" dataKey="revenue" stroke="#FFBE1A" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar chart */}
                <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-4)' }}>
                  <p style={{ margin: '0 0 var(--spacing-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>New Users</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={revenueData.slice(-5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontFamily: F }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontFamily: F }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, fontFamily: F }} />
                      <Bar dataKey="users" fill="#FFBE1A" radius={[4, 4, 0, 0]} opacity={0.85} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent orders table */}
              <div style={{ background: 'var(--card)', border: 'var(--border-default)', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--spacing-4)', borderBottom: 'var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Recent Orders</p>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F }}>
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--muted)' }}>
                      {['Order', 'Customer', 'Product', 'Amount', 'Status'].map(h => (
                        <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--muted-foreground)', fontFamily: F, borderBottom: 'var(--border-subtle)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((row, i) => (
                      <tr key={row.id} style={{ borderBottom: i < recentOrders.length - 1 ? 'var(--border-subtle)' : 'none' }}>
                        <td style={{ padding: '8px 16px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'var(--core-font-family-mono)' }}>{row.id}</td>
                        <td style={{ padding: '8px 16px', fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: F, fontWeight: 'var(--font-weight-medium)' }}>{row.customer}</td>
                        <td style={{ padding: '8px 16px', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{row.product}</td>
                        <td style={{ padding: '8px 16px', fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: F, fontWeight: 'var(--font-weight-semibold)' }}>{row.amount}</td>
                        <td style={{ padding: '8px 16px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-semibold)', color: statusColor[row.status], background: `color-mix(in srgb, ${statusColor[row.status]} 12%, transparent)`, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontFamily: F }}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
