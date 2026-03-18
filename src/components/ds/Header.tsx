import React from 'react';
import { Menu, Search, Moon, Sun, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { useBreakpoint } from '../../hooks/useMediaQuery';
import { useScrollPosition, usePrefersReducedMotion } from '../../hooks/useMotion';
import { typography } from '../../utils/responsive';
import logo from 'figma:asset/5e1c759341d10d01cfc46434d6f5695cb0c730b6.png';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  showMenuButton: boolean;
}

export function Header({ isDarkMode, onToggleTheme, onToggleSidebar, showMenuButton }: HeaderProps) {
  const { isMobile, isTablet, breakpoint } = useBreakpoint();
  const scrollY = useScrollPosition();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Show elevated shadow when scrolled past threshold
  const isScrolled = scrollY > 8;
  
  return (
    <header 
      className="animate-fade-in"
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        width: '100%',
        zIndex: 30,
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--spacing-6)',
        paddingRight: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
        background: 'var(--surface-950)',
        borderBottom: '1px solid var(--surface-800)',
        margin: 0,
        boxSizing: 'border-box',
        // Animated shadow on scroll
        transition: prefersReducedMotion 
          ? 'none' 
          : 'box-shadow var(--motion-duration-short) var(--motion-easing-standard)',
      }}
    >
      {/* Left: Logo + Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 'var(--spacing-3)' : 'var(--spacing-4)' }}>
        {showMenuButton && (
          <button
            onClick={onToggleSidebar}
            className="hover:text-accent smooth-transition button-press"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-2)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--foreground)'
            }}
            aria-label="Toggle navigation menu"
          >
            <Menu size={isMobile ? 20 : 24} />
          </button>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <img 
            src={logo}
            alt="Wugweb Kits Logo"
            style={{
              width: '150px',
              height: '100px',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>

      {/* Center: Search (Desktop and Tablet only) */}
      {!isMobile && (
        <div 
          className="bg-muted border border-border hover:border-accent/40 smooth-transition"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            paddingLeft: 'var(--spacing-3)',
            paddingRight: 'var(--spacing-3)',
            paddingTop: 'var(--spacing-2)',
            paddingBottom: 'var(--spacing-2)',
            borderRadius: 'var(--radius-md)',
            maxWidth: '400px',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          <Search size={16} className="text-muted-foreground" />
          <span 
            className="text-muted-foreground"
            style={{ 
              fontSize: typography.small[breakpoint],
              flex: 1
            }}
          >
            Search documentation...
          </span>
          <kbd 
            className="bg-background border border-border text-muted-foreground"
            style={{
              padding: 'var(--spacing-1) var(--spacing-2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: typography.caption[breakpoint],
              fontFamily: 'Inter Tight, sans-serif'
            }}
          >
            ⌘K
          </kbd>
        </div>
      )}

      {/* Right: Theme Toggle + Docs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 'var(--spacing-1)' : 'var(--spacing-2)' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="button-press hover:text-accent"
          style={{
            padding: isMobile ? '6px' : 'var(--spacing-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={isMobile ? 18 : 20} /> : <Moon size={isMobile ? 18 : 20} />}
        </Button>

        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="button-press hover:text-accent"
            style={{
              padding: 'var(--spacing-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Documentation"
          >
            <BookOpen size={20} />
          </Button>
        )}
      </div>
    </header>
  );
}