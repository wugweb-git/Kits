import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ChatBubbleProps {
  message: string;
  timestamp?: string;
  sender?: string;
  avatar?: string;
  icon?: LucideIcon;
  variant?: 'sent' | 'received';
  showAvatar?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ChatBubble Component
 * 
 * Message bubble for chat interfaces.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <ChatBubble
 *   message="Hello! How can I help you?"
 *   variant="received"
 *   sender="Support"
 *   timestamp="10:30 AM"
 *   showAvatar
 * />
 */
export function ChatBubble({
  message,
  timestamp,
  sender,
  avatar,
  icon: Icon,
  variant = 'received',
  showAvatar = false,
  className = '',
  style = {},
}: ChatBubbleProps) {
  const isSent = variant === 'sent';
  const iconSize = 16;

  return (
    <div
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        display: 'flex',
        flexDirection: isSent ? 'row-reverse' : 'row',
        gap: 'var(--spacing-3)',
        alignItems: 'flex-end',
        ...style,
      }}
    >
      {/* Avatar */}
      {showAvatar && (
        <div
          style={{
            flexShrink: 0,
            width: 'var(--chat-bubble-avatar-size)',
            height: 'var(--chat-bubble-avatar-size)',
            borderRadius: '50%',
            background: avatar ? `url(${avatar}) center/cover` : 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-foreground)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
          }}
        >
          {!avatar && (Icon ? <Icon size={iconSize} /> : sender?.[0]?.toUpperCase())}
        </div>
      )}

      {/* Message Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSent ? 'flex-end' : 'flex-start',
          maxWidth: 'var(--chat-bubble-max-width)',
        }}
      >
        {/* Sender Name */}
        {sender && !isSent && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--muted-foreground)',
              marginBottom: 'var(--spacing-1)',
              paddingLeft: 'var(--chat-bubble-offset-inline)',
            }}
          >
            {sender}
          </div>
        )}

        {/* Message Bubble */}
        <div
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-regular)',
            padding: 'var(--chat-bubble-padding-block) var(--chat-bubble-padding-inline)',
            background: isSent ? 'var(--accent)' : 'var(--muted)',
            color: isSent ? 'var(--accent-foreground)' : 'var(--foreground)',
            borderRadius: 'var(--chat-bubble-radius)',
            ...(isSent
              ? {
                  borderBottomRightRadius: 'var(--chat-bubble-tail-radius)',
                }
              : {
                  borderBottomLeftRadius: 'var(--chat-bubble-tail-radius)',
                }),
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {message}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--muted-foreground)',
              marginTop: 'var(--spacing-1)',
              paddingLeft: isSent ? '0' : 'var(--chat-bubble-offset-inline)',
              paddingRight: isSent ? 'var(--chat-bubble-offset-inline)' : '0',
            }}
          >
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
