import React from 'react';
import { Copy, Check, ChevronRight, Info, FileCode, Code2, Settings, Download, Trash2, Edit, ChevronDown, Check as CheckIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { MenuItem } from '../../wugweb/MenuItem';
import { copyToClipboard as safeCopyToClipboard } from '../../../utils/clipboard';

export function MenuItemDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [selectedState, setSelectedState] = React.useState<'default' | 'hover' | 'pressed' | 'selected' | 'disabled'>('default');
  const [iconPosition, setIconPosition] = React.useState<'none' | 'leading' | 'trailing'>('leading');
  const [selectedTone, setSelectedTone] = React.useState<'default' | 'destructive' | 'subtle'>('default');
  const [showShortcut, setShowShortcut] = React.useState(true);
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);
  const [expandedCodeBlocks, setExpandedCodeBlocks] = React.useState<{ [key: string]: boolean }>({
    react: true,
    html: false,
    css: false,
  });

  const copyToClipboard = async (text: string, label: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      setCopiedCode(label);
      toast.success(`Copied ${label}`);
      setTimeout(() => setCopiedCode(null), 2000);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const toggleCodeBlock = (key: string) => {
    setExpandedCodeBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const coreTokens = [
    { name: 'Default Text', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Hover Background', token: '--surface-700', value: 'rgba(38, 38, 38, 1.00)', category: 'Color' },
    { name: 'Selected Background', token: '--surface-700', value: 'rgba(38, 38, 38, 1.00)', category: 'Color' },
    { name: 'Pressed Background', token: '--surface-600', value: 'rgba(28, 28, 28, 1.00)', category: 'Color' },
    { name: 'Disabled Text', token: '--muted-foreground', value: 'rgba(161, 161, 161, 1.00)', category: 'Color' },
    { name: 'Destructive Text', token: '--destructive', value: 'rgba(239, 68, 68, 1.00)', category: 'Color' },
    { name: 'Destructive Hover', token: '--destructive-subtle', value: 'rgba(239, 68, 68, 0.1)', category: 'Color' },
    { name: 'Selection Indicator', token: '--accent', value: 'rgba(255, 190, 26, 1.00)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-sm', value: '4px', category: 'Border' },
    { name: 'Padding (md)', token: '--spacing-2 / --spacing-3', value: '16px / 24px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Size (sm)', token: '--text-xs', value: '12px', category: 'Typography' },
    { name: 'Font Size (md)', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Font Size (lg)', token: '--text-base', value: '16px', category: 'Typography' },
    { name: 'Font Weight (selected)', token: '--font-weight-medium', value: '500', category: 'Typography' },
    { name: 'Font Weight (normal)', token: '--font-weight-normal', value: '400', category: 'Typography' },
    { name: 'Padding (sm)', token: '--spacing-1 / --spacing-2', value: '8px / 16px', category: 'Spacing' },
    { name: 'Padding (lg)', token: '--spacing-3 / --spacing-4', value: '24px / 32px', category: 'Spacing' },
    { name: 'Gap (sm)', token: '--spacing-1', value: '8px', category: 'Spacing' },
    { name: 'Gap (md/lg)', token: '--spacing-2', value: '16px', category: 'Spacing' },
    { name: 'Min Height (sm)', token: '32px', value: '32px', category: 'Spacing' },
    { name: 'Min Height (md)', token: '36px', value: '36px', category: 'Spacing' },
    { name: 'Min Height (lg)', token: '44px', value: '44px', category: 'Spacing' },
    { name: 'Transition Duration', token: '--motion-duration-fast', value: '80ms', category: 'Motion' },
    { name: 'Transition Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
    { name: 'Focus Ring', token: '--ring', value: 'rgba(255, 190, 26, 0.5)', category: 'Color' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const reactCode = `import { MenuItem } from './components/wugweb/MenuItem';
import { Settings } from 'lucide-react';

function MyMenu() {
  return (
    <div>
      <MenuItem
        label="Settings"
        icon={Settings}
        iconPosition="${iconPosition}"
        ${showShortcut ? 'shortcut="⌘S"' : ''}
        size="${selectedSize}"
        tone="${selectedTone}"
        ${selectedState === 'selected' ? 'selected' : ''}
        ${selectedState === 'disabled' ? 'disabled' : ''}
        onClick={() => console.log('Clicked')}
      />
    </div>
  );
}`;

  const htmlCode = `<div role="menuitem" tabindex="0" aria-disabled="false">
  <!-- Selection Indicator (if selected) -->
  <div class="selection-indicator"></div>
  
  <!-- Leading Icon (optional) -->
  <svg class="menu-item-icon leading">
    <!-- Icon SVG -->
  </svg>
  
  <!-- Label -->
  <span class="menu-item-label">Settings</span>
  
  <!-- Shortcut (optional) -->
  <span class="menu-item-shortcut">⌘S</span>
  
  <!-- Trailing Icon (optional) -->
  <svg class="menu-item-icon trailing">
    <!-- Icon SVG -->
  </svg>
</div>`;

  const cssCode = `/* Menu Item Base Styles */
.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  min-height: 36px;
  font-size: var(--text-sm);
  font-family: Inter Tight, sans-serif;
  color: var(--foreground);
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* Hover State */
.menu-item:hover:not([aria-disabled="true"]) {
  background: var(--surface-700);
}

/* Pressed State */
.menu-item:active:not([aria-disabled="true"]) {
  background: var(--surface-600);
  transform: scale(0.98);
}

/* Selected State */
.menu-item[aria-checked="true"],
.menu-item.selected {
  background: var(--surface-700);
  font-weight: var(--font-weight-medium);
}

/* Disabled State */
.menu-item[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus State */
.menu-item:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Selection Indicator */
.selection-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

/* Icon Styles */
.menu-item-icon {
  flex-shrink: 0;
  color: currentColor;
}

/* Label */
.menu-item-label {
  flex: 1;
  line-height: 1.5;
}

/* Shortcut */
.menu-item-shortcut {
  font-size: var(--text-xs);
  color: var(--muted-foreground);
  font-family: monospace;
  opacity: 0.7;
  flex-shrink: 0;
}

/* Tone Variants */
.menu-item.destructive {
  color: var(--destructive);
}

.menu-item.destructive:hover:not([aria-disabled="true"]) {
  background: var(--destructive-subtle);
}

.menu-item.subtle {
  color: var(--muted-foreground);
}

/* Size Variants */
.menu-item.sm {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--text-xs);
  gap: var(--spacing-1);
  min-height: 32px;
}

.menu-item.lg {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
  gap: var(--spacing-2);
  min-height: 44px;
}`;

  return (
    <>
      {/* Responsive Styles */}
      <style>{`
        .menuitem-doc-root {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          font-family: Inter Tight, sans-serif;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .menuitem-doc-section {
          margin-bottom: var(--spacing-8);
          width: 100%;
          max-width: 100%;
        }

        .menuitem-doc-card {
          background: var(--surface-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-5);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .menuitem-doc-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-5);
          width: 100%;
          max-width: 100%;
        }

        .menuitem-doc-grid-auto {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
          max-width: 100%;
        }

        .menuitem-doc-token-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-3);
          width: 100%;
          max-width: 100%;
        }

        .menuitem-doc-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
          max-width: 100%;
        }

        .anatomy-card {
          padding: var(--spacing-3);
          background: var(--surface-900);
          border: 2px dashed var(--accent);
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .anatomy-card-label {
          font-size: var(--text-xs);
          color: var(--accent);
          margin-bottom: var(--spacing-2);
          font-weight: var(--font-weight-medium);
        }

        .menuitem-preview-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .menuitem-preview-inner {
          width: 100%;
          max-width: 400px;
        }

        /* Token card specific styles */
        .token-card-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4);
          background: var(--surface-900);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--motion-duration-fast) var(--motion-easing-standard);
          text-align: left;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }

        .token-card-content {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .token-card-icon {
          flex-shrink: 0;
          margin-left: var(--spacing-2);
        }

        @media (max-width: 680px) {
          .menuitem-doc-token-grid,
          .menuitem-doc-grid-auto {
            grid-template-columns: 1fr;
          }
        }

        /* Tablet - 768px to 1024px */
        @media (max-width: 1024px) {
          .menuitem-doc-section {
            margin-bottom: var(--spacing-6);
          }

          .menuitem-doc-grid-2 {
            grid-template-columns: 1fr;
            gap: var(--spacing-4);
          }
          
          .menuitem-doc-card {
            padding: var(--spacing-4);
          }
          
          .menuitem-doc-token-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .menuitem-doc-grid-auto {
            grid-template-columns: 1fr;
          }

          .menuitem-preview-inner {
            max-width: 100%;
          }
        }

        /* Mobile - up to 768px */
        @media (max-width: 768px) {
          .menuitem-doc-section {
            margin-bottom: var(--spacing-5);
          }

          .menuitem-doc-card {
            padding: var(--spacing-3);
          }

          .menuitem-doc-grid-2,
          .menuitem-doc-grid-auto {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          .menuitem-doc-token-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-2);
          }

          .menuitem-doc-controls {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          h1 {
            font-size: var(--text-2xl) !important;
          }

          h2 {
            font-size: var(--text-xl) !important;
          }

          h3 {
            font-size: var(--text-lg) !important;
          }

          .menuitem-preview-display {
            padding: var(--spacing-3) !important;
          }

          p {
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .menuitem-doc-grid-2 > div {
            min-width: 0;
          }

          .anatomy-card {
            padding: var(--spacing-2);
          }

          .anatomy-card-label {
            font-size: var(--text-xs) !important;
            margin-bottom: var(--spacing-1) !important;
          }
        }

        /* Extra small mobile - up to 480px */
        @media (max-width: 480px) {
          .menuitem-doc-card {
            padding: var(--spacing-2);
          }

          .menuitem-doc-section {
            margin-bottom: var(--spacing-4);
          }

          .menuitem-doc-token-grid {
            grid-template-columns: 1fr;
          }

          .menuitem-doc-grid-2 {
            gap: var(--spacing-2);
          }

          .menuitem-doc-controls {
            gap: var(--spacing-2);
          }

          h1 {
            font-size: var(--text-xl) !important;
          }

          h2 {
            font-size: var(--text-lg) !important;
          }

          button {
            white-space: nowrap;
            min-width: auto;
          }

          .menuitem-preview-display {
            padding: var(--spacing-2) !important;
          }
        }

        @media (max-width: 375px) {
          .anatomy-card {
            padding: var(--spacing-1) !important;
          }

          .menuitem-preview-display {
            padding: var(--spacing-2) !important;
          }

          .token-card-button {
            padding: var(--spacing-2) !important;
          }

          h1 {
            font-size: var(--text-lg) !important;
          }

          .menuitem-doc-card {
            padding: var(--spacing-2) !important;
          }
        }

        /* Ensure all flex containers are responsive */
        @media (max-width: 768px) {
          .menuitem-doc-root * {
            max-width: 100%;
          }
        }

        /* General text overflow protection */
        .menuitem-doc-root p,
        .menuitem-doc-root li,
        .menuitem-doc-root h1,
        .menuitem-doc-root h2,
        .menuitem-doc-root h3,
        .menuitem-doc-root span {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .menuitem-doc-root code {
          word-break: break-all;
          white-space: pre-wrap;
        }

        /* Section title responsive */
        .section-title {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* Header responsive */
        @media (max-width: 768px) {
          header {
            margin-bottom: var(--spacing-6) !important;
            padding-bottom: var(--spacing-4) !important;
          }
        }

        @media (max-width: 480px) {
          header {
            margin-bottom: var(--spacing-4) !important;
            padding-bottom: var(--spacing-3) !important;
          }
        }

        /* Button group responsive */
        @media (max-width: 480px) {
          .control-button span {
            display: inline-block;
          }
        }

        @media (max-width: 360px) {
          .control-button {
            padding: 4px 8px !important;
            font-size: 11px !important;
          }

          .control-select {
            padding: 4px 8px !important;
            font-size: 11px !important;
          }
        }

        /* Info banner responsive */
        .info-banner {
          display: flex;
          gap: var(--spacing-2);
          padding: var(--spacing-4);
          background: var(--accent-subtle);
          border: 1px solid var(--accent);
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .info-banner {
            flex-direction: column;
            padding: var(--spacing-3);
          }
        }

        @media (max-width: 480px) {
          .info-banner {
            padding: var(--spacing-2);
          }
        }

        /* Button responsive styles */
        .control-button {
          padding: 8px 16px;
          font-size: var(--text-sm);
          font-family: Inter Tight, sans-serif;
          font-weight: var(--font-weight-medium);
          border: 1px solid;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--motion-duration-fast) var(--motion-easing-standard);
          white-space: nowrap;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .control-button {
            padding: 6px 12px;
            font-size: var(--text-xs);
          }
        }

        @media (max-width: 480px) {
          .control-button {
            padding: 6px 10px;
            font-size: var(--text-xs);
          }
        }

        /* Select responsive styles */
        .control-select {
          width: 100%;
          padding: 8px 12px;
          font-size: var(--text-sm);
          font-family: Inter Tight, sans-serif;
          background: var(--surface-700);
          color: var(--foreground);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .control-select {
            padding: 6px 10px;
            font-size: var(--text-xs);
          }
        }

        /* Ensure code examples don't overflow */
        @media (max-width: 768px) {
          pre {
            padding: var(--spacing-3) !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 480px) {
          pre {
            padding: var(--spacing-2) !important;
            font-size: 11px !important;
          }
        }

        /* Checkbox control wrapper */
        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          width: 100%;
          box-sizing: border-box;
        }

        .checkbox-label {
          font-size: var(--text-sm);
          color: var(--foreground);
          font-family: Inter Tight, sans-serif;
          user-select: none;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .checkbox-label {
            font-size: var(--text-xs);
          }
        }

        .code-block-collapsed {
          max-height: 0;
          overflow: hidden;
          transition: max-height 180ms var(--motion-easing-emphasized);
        }

        .code-block-expanded {
          max-height: 1500px;
          overflow: hidden;
          transition: max-height 180ms var(--motion-easing-emphasized);
        }
      `}</style>

      <div className="menuitem-doc-root">
        
        {/* Header */}
        <header style={{
          marginBottom: 'var(--spacing-8)',
          paddingBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--border)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            marginBottom: 'var(--spacing-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            flexWrap: 'wrap',
          }}>
            <span>Components</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--foreground)' }}>Menu Item</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--spacing-4)',
            flexWrap: 'wrap',
            width: '100%',
          }}>
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                margin: 0,
                marginBottom: 'var(--spacing-2)',
                color: 'var(--foreground)',
              }}>
                Menu Item
              </h1>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--muted-foreground)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                An interactive list item component for menus, dropdowns, and navigation lists. Supports icons, shortcuts, selection states, and multiple visual tones.
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'inline-flex',
                padding: '8px 16px',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--accent)',
                flexShrink: 0,
              }}>
                v1.0.0
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                padding: '8px 16px',
                background: 'var(--success-subtle)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--success)',
                flexShrink: 0,
              }}>
                <FileCode size={14} />
                Component
              </div>
            </div>
          </div>
        </header>

        {/* Anatomy Section */}
        <section className="menuitem-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Anatomy
          </h2>

          <div className="menuitem-doc-card">
            <div className="menuitem-doc-grid-2">
              {/* Visual Anatomy */}
              <div style={{ width: '100%' }}>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Menu Item Structure
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-4)',
                  width: '100%',
                }}>
                  {/* Basic Menu Item */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label">
                      Default State
                    </div>
                    <div className="menuitem-preview-wrapper">
                      <div className="menuitem-preview-inner">
                        <MenuItem label="Settings" icon={Settings} iconPosition="leading" size="md" />
                      </div>
                    </div>
                  </div>

                  {/* With Shortcut */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label">
                      With Shortcut
                    </div>
                    <div className="menuitem-preview-wrapper">
                      <div className="menuitem-preview-inner">
                        <MenuItem label="Download" icon={Download} iconPosition="leading" shortcut="⌘D" size="md" />
                      </div>
                    </div>
                  </div>

                  {/* Selected State */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label">
                      Selected State
                    </div>
                    <div className="menuitem-preview-wrapper">
                      <div className="menuitem-preview-inner">
                        <MenuItem label="Edit" icon={Edit} iconPosition="leading" shortcut="⌘E" selected size="md" />
                      </div>
                    </div>
                  </div>

                  {/* Destructive Tone */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label">
                      Destructive Tone
                    </div>
                    <div className="menuitem-preview-wrapper">
                      <div className="menuitem-preview-inner">
                        <MenuItem label="Delete" icon={Trash2} iconPosition="leading" shortcut="⌫" tone="destructive" size="md" />
                      </div>
                    </div>
                  </div>

                  {/* Size Variants */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label" style={{
                      marginBottom: 'var(--spacing-3)',
                    }}>
                      Size Variants
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)',
                      width: '100%',
                      maxWidth: '100%',
                    }}>
                      <div style={{ width: '100%', maxWidth: '100%' }}>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: 'var(--spacing-1)',
                        }}>
                          Small (32px min height)
                        </div>
                        <div className="menuitem-preview-wrapper">
                          <div className="menuitem-preview-inner">
                            <MenuItem label="Settings" icon={Settings} iconPosition="leading" size="sm" />
                          </div>
                        </div>
                      </div>
                      <div style={{ width: '100%', maxWidth: '100%' }}>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: 'var(--spacing-1)',
                        }}>
                          Medium (36px min height)
                        </div>
                        <div className="menuitem-preview-wrapper">
                          <div className="menuitem-preview-inner">
                            <MenuItem label="Settings" icon={Settings} iconPosition="leading" size="md" />
                          </div>
                        </div>
                      </div>
                      <div style={{ width: '100%', maxWidth: '100%' }}>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: 'var(--spacing-1)',
                        }}>
                          Large (44px min height)
                        </div>
                        <div className="menuitem-preview-wrapper">
                          <div className="menuitem-preview-inner">
                            <MenuItem label="Settings" icon={Settings} iconPosition="leading" size="lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anatomy Labels */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
                width: '100%',
              }}>
                <AnatomyItem
                  label="Container"
                  description="Flex container with rounded corners"
                  token="border-radius: var(--radius-sm)"
                />
                <AnatomyItem
                  label="Selection Indicator"
                  description="Left border when item is selected"
                  token="background: var(--accent), width: 3px"
                />
                <AnatomyItem
                  label="Leading Icon"
                  description="Optional icon at start"
                  token="size: 14px (sm), 16px (md), 18px (lg)"
                />
                <AnatomyItem
                  label="Label Text"
                  description="Main text content"
                  token="font: Inter Tight, flex: 1"
                />
                <AnatomyItem
                  label="Shortcut Text"
                  description="Optional keyboard shortcut"
                  token="font: monospace, color: muted"
                />
                <AnatomyItem
                  label="Trailing Icon"
                  description="Optional icon at end"
                  token="same as leading icon"
                />
                <AnatomyItem
                  label="Hover Background"
                  description="Background on hover"
                  token="background: var(--surface-700)"
                />
                <AnatomyItem
                  label="Focus Ring"
                  description="Keyboard focus indicator"
                  token="outline: 2px var(--ring)"
                />
                <AnatomyItem
                  label="Padding"
                  description="Internal spacing"
                  token="var(--spacing-2) var(--spacing-3)"
                />
                <AnatomyItem
                  label="Min Height"
                  description="Accessible touch target"
                  token="44px (lg) meets WCAG"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Preview */}
        <section className="menuitem-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Interactive Preview
          </h2>

          <div className="menuitem-doc-card">
            {/* Controls */}
            <div className="menuitem-doc-controls" style={{
              marginBottom: 'var(--spacing-5)',
            }}>
              {/* Size Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Size
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <button
                      key={size}
                      className="control-button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        background: selectedSize === size ? 'var(--accent)' : 'var(--surface-700)',
                        color: selectedSize === size ? 'var(--accent-foreground)' : 'var(--foreground)',
                        borderColor: selectedSize === size ? 'var(--accent)' : 'var(--border)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as any)}
                  className="control-select"
                >
                  <option value="default">Default</option>
                  <option value="selected">Selected</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Icon Position Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Icon Position
                </label>
                <select
                  value={iconPosition}
                  onChange={(e) => setIconPosition(e.target.value as any)}
                  className="control-select"
                >
                  <option value="none">None</option>
                  <option value="leading">Leading</option>
                  <option value="trailing">Trailing</option>
                </select>
              </div>

              {/* Tone Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Tone
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {(['default', 'destructive', 'subtle'] as const).map((tone) => (
                    <button
                      key={tone}
                      className="control-button"
                      onClick={() => setSelectedTone(tone)}
                      style={{
                        background: selectedTone === tone ? 'var(--accent)' : 'var(--surface-700)',
                        color: selectedTone === tone ? 'var(--accent-foreground)' : 'var(--foreground)',
                        borderColor: selectedTone === tone ? 'var(--accent)' : 'var(--border)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Options
                </label>
                <label className="checkbox-wrapper" style={{
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={showShortcut}
                    onChange={(e) => setShowShortcut(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />
                  <span className="checkbox-label">Show shortcut</span>
                </label>
              </div>
            </div>

            {/* Preview Display */}
            <div className="menuitem-preview-display" style={{
              background: 'var(--surface-900)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-6)',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}>
              <div style={{
                marginBottom: 'var(--spacing-3)',
                fontSize: 'var(--text-xs)',
                color: 'var(--muted-foreground)',
              }}>
                Live Preview
              </div>
              <div className="menuitem-preview-wrapper">
                <div className="menuitem-preview-inner">
                  <MenuItem
                    label={selectedTone === 'destructive' ? 'Delete' : 'Settings'}
                    icon={selectedTone === 'destructive' ? Trash2 : Settings}
                    iconPosition={iconPosition}
                    shortcut={showShortcut ? '⌘S' : undefined}
                    size={selectedSize}
                    tone={selectedTone}
                    selected={selectedState === 'selected'}
                    disabled={selectedState === 'disabled'}
                    onClick={() => toast.success('Menu item clicked!')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="menuitem-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Code Examples
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
            width: '100%',
          }}>
            <CodeBlock
              title="React"
              code={reactCode}
              language="tsx"
              copied={copiedCode === 'React code'}
              onCopy={() => copyToClipboard(reactCode, 'React code')}
              expanded={expandedCodeBlocks.react}
              onToggle={() => toggleCodeBlock('react')}
            />

            <CodeBlock
              title="HTML"
              code={htmlCode}
              language="html"
              copied={copiedCode === 'HTML code'}
              onCopy={() => copyToClipboard(htmlCode, 'HTML code')}
              expanded={expandedCodeBlocks.html}
              onToggle={() => toggleCodeBlock('html')}
            />

            <CodeBlock
              title="CSS with Design Tokens"
              code={cssCode}
              language="css"
              copied={copiedCode === 'CSS code'}
              onCopy={() => copyToClipboard(cssCode, 'CSS code')}
              expanded={expandedCodeBlocks.css}
              onToggle={() => toggleCodeBlock('css')}
            />
          </div>

          {/* Props Documentation */}
          <div style={{
            marginTop: 'var(--spacing-5)',
            padding: 'var(--spacing-4)',
            background: 'var(--surface-800)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              margin: 0,
              marginBottom: 'var(--spacing-3)',
              color: 'var(--foreground)',
            }}>
              Component Props
            </h3>
            <div style={{
              display: 'grid',
              gap: 'var(--spacing-2)',
            }}>
              <PropItem name="label" type="string" required description="The text content of the menu item" />
              <PropItem name="icon" type="LucideIcon" description="Icon component to display" />
              <PropItem name="iconPosition" type="'leading' | 'trailing' | 'none'" default="'none'" description="Position of the icon" />
              <PropItem name="shortcut" type="string" description="Keyboard shortcut to display" />
              <PropItem name="selected" type="boolean" default="false" description="Whether the item is selected" />
              <PropItem name="disabled" type="boolean" default="false" description="Whether the item is disabled" />
              <PropItem name="onClick" type="() => void" description="Click handler function" />
              <PropItem name="size" type="'sm' | 'md' | 'lg'" default="'md'" description="Size variant" />
              <PropItem name="tone" type="'default' | 'destructive' | 'subtle'" default="'default'" description="Visual tone" />
              <PropItem name="ariaRole" type="'menuitem' | 'menuitemradio' | 'menuitemcheckbox'" default="'menuitem'" description="ARIA role for accessibility" />
            </div>
          </div>
        </section>

        {/* Design Tokens */}
        <section className="menuitem-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Design Tokens
          </h2>

          <div className="menuitem-doc-card">
            <div className="menuitem-doc-token-grid">
              {allTokens.map((token) => (
                <button
                  key={token.name}
                  className="token-card-button"
                  onClick={() => copyToClipboard(typeof token.token === 'string' && token.token.startsWith('--') ? `var(${token.token})` : token.token, token.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'var(--surface-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--surface-900)';
                  }}
                >
                  <div className="token-card-content">
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      background: 'var(--surface-800)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      marginBottom: '6px',
                    }}>
                      {token.category}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      marginBottom: '4px',
                      fontWeight: 'var(--font-weight-medium)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {token.name}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'monospace',
                      color: 'var(--accent)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {token.token.startsWith('--') ? `var(${token.token})` : token.token}
                    </div>
                  </div>
                  <div className="token-card-icon">
                    {copiedCode === token.name ? (
                      <Check size={18} style={{ color: 'var(--success)' }} />
                    ) : (
                      <Copy size={18} style={{ color: 'var(--muted-foreground)' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Show More Toggle */}
            <div style={{
              marginTop: 'var(--spacing-4)',
              textAlign: 'center',
            }}>
              <button
                onClick={() => setShowAdvancedTokens(!showAdvancedTokens)}
                className="control-button"
                style={{
                  background: 'var(--surface-700)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                }}
              >
                {showAdvancedTokens ? 'Show Less' : 'Show Advanced Tokens'}
              </button>
            </div>

            <div className="info-banner" style={{
              marginTop: 'var(--spacing-5)',
            }}>
              <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: '1.6',
              }}>
                All menu item tokens are defined in <code style={{
                  padding: '3px 8px',
                  background: 'var(--surface-900)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'monospace',
                  color: 'var(--accent)',
                  wordBreak: 'break-all',
                }}>/styles/globals.css</code>. Update token values to theme the entire design system.
              </p>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="menuitem-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Usage Guidelines
          </h2>

          <div className="menuitem-doc-grid-auto">
            <GuidelineCard
              title="✅ DO: Use consistent icon sizing"
              description="Keep icons the same size within a menu. Use leading icons for actions and trailing icons for navigation or expansion states."
              type="do"
            />
            <GuidelineCard
              title="✅ DO: Show keyboard shortcuts"
              description="Display shortcuts for frequently used actions to help users learn and work faster. Use standard platform conventions (⌘ for Mac, Ctrl for Windows)."
              type="do"
            />
            <GuidelineCard
              title="❌ DON'T: Mix different tones randomly"
              description="Don't use destructive tone for non-destructive actions. Reserve destructive styling for delete, remove, or other irreversible operations."
              type="dont"
            />
            <GuidelineCard
              title="❌ DON'T: Make items too small on mobile"
              description="Ensure menu items meet the 44×44px minimum touch target on mobile devices. Use the 'lg' size variant for touch interfaces."
              type="dont"
            />
          </div>
        </section>

        {/* Accessibility */}
        <section className="menuitem-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Accessibility
          </h2>

          <div className="menuitem-doc-card">
            <div style={{
              display: 'grid',
              gap: 'var(--spacing-5)',
              width: '100%',
            }}>
              <AccessibilityItem
                title="Semantic HTML & ARIA"
                items={[
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">role="menuitem"</code> for standard menu items',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">role="menuitemradio"</code> for single-selection items',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">role="menuitemcheckbox"</code> for multi-selection items',
                  'Add <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-checked</code> for selected state in radio/checkbox items',
                  'Set <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-disabled="true"</code> on disabled items',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">tabindex="0"</code> for focusable items, <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">-1</code> for disabled',
                ]}
              />
              <AccessibilityItem
                title="Keyboard Navigation"
                items={[
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">↑</kbd> / <kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">↓</kbd> - Navigate between menu items',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Enter</kbd> or <kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Space</kbd> - Activate the focused menu item',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Esc</kbd> - Close the menu (when in a dropdown context)',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Home</kbd> / <kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">End</kbd> - Jump to first/last item',
                  'Type-ahead: pressing letter keys jumps to items starting with that letter',
                  'Visible focus indicator required (2px outline with var(--ring))',
                ]}
              />
              <AccessibilityItem
                title="Screen Reader Support"
                items={[
                  'Screen reader announces role: "Settings, menu item"',
                  'Selected items announced as "checked" or "selected"',
                  'Disabled items announced as "dimmed" or "unavailable"',
                  'Shortcuts are announced after the label',
                  'Icon-only items must have aria-label describing the action',
                  'Menu containers should have <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">role="menu"</code> wrapper',
                ]}
              />
              <AccessibilityItem
                title="Visual Accessibility"
                items={[
                  'Text must have at least 4.5:1 contrast ratio (WCAG AA)',
                  'Destructive items must have 3:1 contrast with default items',
                  'Focus ring must be visible with 3:1 contrast against background',
                  'Don\'t rely on color alone—use selection indicator and font weight',
                  'Selected state uses both background color and left indicator',
                  'Disabled items use 50% opacity for clear distinction',
                ]}
              />
              <AccessibilityItem
                title="Mobile & Touch"
                items={[
                  'Touch targets must be at least 44×44px (use lg size on mobile)',
                  'Adequate spacing between items (minimum 8px gap)',
                  'Hover states convert to press/active states on touch devices',
                  'Press feedback with scale transform (0.98) for tactile response',
                  'Large enough text for mobile readability (14px minimum)',
                  'Support for long-press actions where appropriate',
                ]}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function AnatomyItem({ label, description, token }: { label: string; description: string; token: string }) {
  return (
    <div style={{
      padding: 'var(--spacing-4)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--foreground)',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--muted-foreground)',
        marginBottom: 'var(--spacing-2)',
        lineHeight: '1.5',
      }}>
        {description}
      </div>
      <code style={{
        fontSize: 'var(--text-xs)',
        fontFamily: 'monospace',
        color: 'var(--accent)',
        background: 'var(--surface-800)',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-block',
      }}>
        {token}
      </code>
    </div>
  );
}

function PropItem({ name, type, required, default: defaultValue, description }: { 
  name: string; 
  type: string; 
  required?: boolean;
  default?: string;
  description: string;
}) {
  return (
    <div style={{
      padding: 'var(--spacing-3)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        marginBottom: 'var(--spacing-1)',
        flexWrap: 'wrap',
      }}>
        <code style={{
          fontSize: 'var(--text-sm)',
          fontFamily: 'monospace',
          color: 'var(--accent)',
          fontWeight: 'var(--font-weight-medium)',
        }}>
          {name}
        </code>
        {required && (
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--destructive)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            required
          </span>
        )}
        {defaultValue && (
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-foreground)',
          }}>
            default: {defaultValue}
          </span>
        )}
      </div>
      <div style={{
        fontSize: 'var(--text-xs)',
        fontFamily: 'monospace',
        color: 'var(--muted-foreground)',
        marginBottom: 'var(--spacing-1)',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {type}
      </div>
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--foreground)',
        lineHeight: '1.5',
      }}>
        {description}
      </div>
    </div>
  );
}

function CodeBlock({ 
  title, 
  code, 
  language, 
  copied, 
  onCopy,
  expanded,
  onToggle,
}: { 
  title: string; 
  code: string; 
  language: string; 
  copied: boolean; 
  onCopy: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-3)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-900)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-2)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
        }}>
          {title}
        </span>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-2)',
        }}>
          <button
            onClick={onToggle}
            className="control-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              background: 'var(--surface-700)',
              color: 'var(--foreground)',
              borderColor: 'var(--border)',
            }}
          >
            <Code2 size={16} />
            <span>{expanded ? 'Hide' : 'Show'}</span>
          </button>
          <button
            onClick={onCopy}
            className="control-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              background: copied ? 'var(--success-subtle)' : 'var(--surface-700)',
              color: copied ? 'var(--success)' : 'var(--foreground)',
              borderColor: copied ? 'var(--success)' : 'var(--border)',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className={expanded ? 'code-block-expanded' : 'code-block-collapsed'}>
        <pre style={{
          margin: 0,
          padding: 'var(--spacing-5)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'monospace',
          color: 'var(--foreground)',
          overflowX: 'auto',
          lineHeight: '1.7',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

function GuidelineCard({ title, description, type }: { title: string; description: string; type: 'do' | 'dont' }) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '2px solid',
      borderColor: type === 'do' ? 'var(--success)' : 'var(--destructive)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-5)',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-3)',
        color: type === 'do' ? 'var(--success)' : 'var(--destructive)',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {title}
      </h3>
      <p style={{
        margin: 0,
        fontSize: 'var(--text-base)',
        color: 'var(--foreground)',
        lineHeight: '1.6',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {description}
      </p>
    </div>
  );
}

function AccessibilityItem({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{
      padding: 'var(--spacing-5)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-4)',
        color: 'var(--foreground)',
        wordWrap: 'break-word',
      }}>
        {title}
      </h3>
      <ul style={{
        margin: 0,
        paddingLeft: 'var(--spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        width: '100%',
        maxWidth: '100%',
      }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.7',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ul>
    </div>
  );
}
