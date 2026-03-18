import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2, Image as ImageIcon, Code } from 'lucide-react';

export interface WYSIWYGProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WYSIWYG Editor Component
 * 
 * Rich text editor with formatting toolbar.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <WYSIWYG
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Start writing..."
 *   minHeight={300}
 * />
 */
export function WYSIWYG({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = 200,
  disabled = false,
  className = '',
  style = {},
}: WYSIWYGProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const toolbarButtonStyle: React.CSSProperties = {
    fontFamily: 'Inter Tight, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    background: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--foreground)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--card)',
        ...style,
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-1)',
          padding: 'var(--spacing-2)',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
          background: 'var(--muted)',
        }}
      >
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => execCommand('bold')}
          disabled={disabled}
          title="Bold"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          disabled={disabled}
          title="Italic"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          disabled={disabled}
          title="Underline"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Underline size={18} />
        </button>

        <div style={{ width: '1px', height: '36px', background: 'var(--border)', margin: '0 4px' }} />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          disabled={disabled}
          title="Bullet List"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          disabled={disabled}
          title="Numbered List"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <ListOrdered size={18} />
        </button>

        <div style={{ width: '1px', height: '36px', background: 'var(--border)', margin: '0 4px' }} />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          disabled={disabled}
          title="Align Left"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          disabled={disabled}
          title="Align Center"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <AlignCenter size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          disabled={disabled}
          title="Align Right"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <AlignRight size={18} />
        </button>

        <div style={{ width: '1px', height: '36px', background: 'var(--border)', margin: '0 4px' }} />

        {/* Insert */}
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) execCommand('createLink', url);
          }}
          disabled={disabled}
          title="Insert Link"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Link2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) execCommand('insertImage', url);
          }}
          disabled={disabled}
          title="Insert Image"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<pre>')}
          disabled={disabled}
          title="Code Block"
          style={toolbarButtonStyle}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = 'var(--secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Code size={18} />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-regular)',
          minHeight: `${minHeight}px`,
          padding: 'var(--spacing-4)',
          color: 'var(--foreground)',
          background: 'var(--input-background)',
          outline: 'none',
          overflowY: 'auto',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <style>
          {`
            [contentEditable=true]:empty:before {
              content: attr(data-placeholder);
              color: var(--muted-foreground);
              pointer-events: none;
            }
          `}
        </style>
      </div>
    </div>
  );
}
