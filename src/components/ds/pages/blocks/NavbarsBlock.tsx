import React from 'react';
import { BlockPageShell } from './BlockPageShell';
import { Button } from '../../../design-system/components';
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react';

const F = 'Inter Tight, sans-serif';

const navLink = (label: string, active = false) => (
  <a key={label} href="#" style={{ fontSize: 'var(--text-sm)', fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)', color: active ? 'var(--accent)' : 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F, transition: 'color var(--motion-duration-fast)' }}>
    {label}
  </a>
);

const AppNavbar = () => (
  <header style={{ background: 'var(--card)', borderBottom: 'var(--border-default)', padding: '0 var(--spacing-6)', height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>W</span>
        </div>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Kits</span>
      </div>
      <nav style={{ display: 'flex', gap: 'var(--spacing-5)' }}>
        {['Docs', 'Components', 'Blocks', 'Charts'].map((l, i) => navLink(l, i === 0))}
      </nav>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: '6px 12px' }}>
        <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>Search... ⌘K</span>
      </div>
      <Bell size={18} style={{ color: 'var(--muted-foreground)' }} />
      <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>AM</span>
      </div>
    </div>
  </header>
);

const MarketingNavbar = () => (
  <header style={{ background: 'var(--background)', borderBottom: 'var(--border-default)', padding: '0 var(--spacing-8)', height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
      <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-foreground)', fontFamily: F }}>W</span>
      </div>
      <span style={{ fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Wugweb Kits</span>
    </div>
    <nav style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
      {['Products', 'Pricing', 'Docs', 'Blog'].map(l => (
        <a key={l} href="#" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', textDecoration: 'none', fontFamily: F }}>
          {l}
          {l === 'Products' && <ChevronDown size={12} />}
        </a>
      ))}
    </nav>
    <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
      <Button variant="ghost" size="sm">Sign in</Button>
      <Button variant="default" size="sm">Get started</Button>
    </div>
  </header>
);

const TransparentNavbar = () => (
  <div style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), rgba(10,10,10,0))', padding: 'var(--spacing-4) var(--spacing-8)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Kits</span>
      <nav style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
        {['Features', 'Docs', 'GitHub'].map(l => navLink(l))}
      </nav>
      <Button variant="outline" size="sm" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--foreground)' }}>Sign in</Button>
    </div>
  </div>
);

const MobileNavbar = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <header style={{ background: 'var(--card)', borderBottom: 'var(--border-default)', padding: '0 var(--spacing-4)', height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', fontFamily: F }}>Kits</span>
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', display: 'flex', alignItems: 'center' }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {open && (
        <nav style={{ background: 'var(--card)', borderBottom: 'var(--border-default)', padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {['Docs', 'Components', 'Blocks', 'Pricing'].map(l => (
            <a key={l} href="#" style={{ fontSize: 'var(--ts-body-md-size)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', textDecoration: 'none', fontFamily: F }}>{l}</a>
          ))}
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
            <Button variant="outline" size="sm" style={{ flex: 1 }}>Sign in</Button>
            <Button variant="default" size="sm" style={{ flex: 1 }}>Get started</Button>
          </div>
        </nav>
      )}
    </div>
  );
};

export function NavbarsBlock() {
  return (
    <BlockPageShell
      title="Navbars"
      description="Application and marketing navbars: app shell, marketing site, transparent overlay, and responsive mobile-first patterns."
      category="Application UI"
      count={8}
      variants={[
        { id: 'app', label: 'Application navbar with search', preview: <AppNavbar /> },
        { id: 'marketing', label: 'Marketing site navbar', preview: <MarketingNavbar /> },
        { id: 'transparent', label: 'Transparent overlay navbar', preview: <TransparentNavbar /> },
        { id: 'mobile', label: 'Mobile hamburger navbar', preview: <MobileNavbar /> },
      ]}
    />
  );
}
