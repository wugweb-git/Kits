import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Fallback initials to display when image is not available */
  fallback?: string;
  /** Optional className for custom styling */
  className?: string;
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  /** Shape variant */
  shape?: 'circle' | 'square';
  /** Border variant */
  bordered?: boolean;
}

const sizeMap = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '64px',
};

const fontSizeMap = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  md: 'var(--text-base)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)',
};

const statusColorMap = {
  online: 'var(--success)',
  offline: 'var(--muted-foreground)',
  away: 'var(--accent)',
  busy: 'var(--destructive)',
  none: 'transparent',
};

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
  status = 'none',
  shape = 'circle',
  bordered = false,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const avatarSize = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const borderRadius = shape === 'circle' ? '50%' : 'var(--radius-md)';

  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const showFallback = !src || imageError;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius,
        border: bordered ? '2px solid var(--border)' : 'none',
        backgroundColor: 'var(--muted)',
      }}
    >
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
        />
      )}

      {showFallback && (
        <div
          className="flex items-center justify-center w-full h-full"
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--muted-foreground)',
          }}
        >
          {fallback ? (
            <span
              style={{
                fontSize,
                fontWeight: 'var(--font-weight-medium)',
                textTransform: 'uppercase',
              }}
            >
              {fallback}
            </span>
          ) : (
            <User size={parseInt(avatarSize) / 2} />
          )}
        </div>
      )}

      {status !== 'none' && (
        <div
          className="absolute bottom-0 right-0 rounded-full border-2 border-white"
          style={{
            width: `calc(${avatarSize} * 0.3)`,
            height: `calc(${avatarSize} * 0.3)`,
            backgroundColor: statusColorMap[status],
          }}
        />
      )}
    </div>
  );
}

export interface AvatarGroupProps {
  /** Array of avatar sources */
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  /** Size variant for all avatars */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Maximum number of avatars to display */
  max?: number;
  /** Optional className for custom styling */
  className?: string;
}

export function AvatarGroup({
  avatars,
  size = 'md',
  max = 5,
  className = '',
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);
  const avatarSize = sizeMap[size];

  return (
    <div className={`flex items-center ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          style={{
            marginLeft: index > 0 ? `calc(-${avatarSize} * 0.25)` : '0',
            zIndex: displayAvatars.length - index,
          }}
        >
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            size={size}
            bordered
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className="flex items-center justify-center bg-[var(--muted)] text-[var(--muted-foreground)] border-2 border-white rounded-full"
          style={{
            width: avatarSize,
            height: avatarSize,
            marginLeft: `calc(-${avatarSize} * 0.25)`,
            fontSize: fontSizeMap[size],
            fontWeight: 'var(--font-weight-medium)',
            zIndex: 0,
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
