import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export function NotificationButton() {
  return (
    <button
      aria-label="Notifications"
      style={{
        position: 'relative',
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: `background var(--motion-duration-fast) var(--motion-easing-standard)`,
      }}
    >
      <Bell size={16} color="rgba(255,255,255,0.70)" />
      {/* Badge */}
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '8px',
        height: '8px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--accent)',
        border: '1.5px solid var(--surface-900)',
      }} />
    </button>
  );
}

export function AccountButton({ name = 'Wugweb Stays', role = 'super-admin' }: { name?: string; role?: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      padding: 'var(--spacing-1) var(--spacing-2) var(--spacing-1) var(--spacing-1)',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(255,255,255,0.10)',
      cursor: 'pointer',
      flexShrink: 0,
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--foreground)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent)',
        fontFamily: 'var(--core-font-family-base)',
        fontSize: 'var(--fluid-body-sm)',
        fontWeight: 'var(--font-weight-extrabold)' as any,
        flexShrink: 0,
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-sm)',
          fontWeight: 'var(--font-weight-bold)' as any,
          color: 'var(--foreground)',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}>
          {name}
        </span>
        <span style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-caption)',
          fontWeight: 'var(--font-weight-regular)' as any,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.2,
        }}>
          {role}
        </span>
      </div>
      <ChevronDown size={12} color="rgba(255,255,255,0.45)" />
    </div>
  );
}

export function DateTimeDisplay() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <span style={{
        fontFamily: 'var(--core-font-family-base)',
        fontSize: 'var(--fluid-body-sm)',
        fontWeight: 'var(--font-weight-semibold)' as any,
        color: 'var(--foreground)',
        lineHeight: 1.2,
      }}>
        {time}
      </span>
      <span style={{
        fontFamily: 'var(--core-font-family-base)',
        fontSize: 'var(--fluid-caption)',
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.2,
      }}>
        {date}
      </span>
    </div>
  );
}
