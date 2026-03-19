import React from 'react';
import { NotificationButton, AccountButton } from './NavComponents';

export function DocWebNav() {
  return (
    <div style={{
      width: '100%',
      height: '64px',
      background: 'var(--surface-900)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-8)',
      fontFamily: 'var(--core-font-family-base)',
      boxSizing: 'border-box',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h2)',
          fontWeight: 'var(--font-weight-extrabold)' as any,
          color: 'var(--foreground)',
          letterSpacing: '-0.04em',
        }}>
          docweb
        </span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        <NotificationButton />
        <AccountButton name="Wugweb Stays" role="super-admin" />
      </div>
    </div>
  );
}
