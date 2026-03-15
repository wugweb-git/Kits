import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from './Button';

// Define card variants using CVA
const cardVariants = cva(
  "flex flex-col overflow-hidden transition-all duration-200 ease-out box-border",
  {
    variants: {
      variant: {
        default: "bg-[var(--card)] border border-[var(--border)]",
        elevated: "bg-[var(--surface-800)] border-transparent",
        outline: "bg-transparent border-2 border-[var(--border)]",
        ghost: "bg-transparent border-transparent hover:bg-[var(--surface-800)]",
        dark: "bg-[var(--surface-900)] border border-[var(--border)]",
      },
      radius: {
        default: "rounded-[var(--radius-lg)]",
        md: "rounded-[var(--radius-md)]",
        none: "rounded-none",
      },
      padding: {
        default: "p-[var(--spacing-4)] md:p-[var(--spacing-6)]", // Responsive: 16px mobile, 24px desktop
        lg: "p-[var(--spacing-3)] md:p-[var(--spacing-4)]", // 24px mobile, 32px desktop
        sm: "p-[var(--spacing-2)]", // 16px all
        none: "p-0",
      }
    },
    defaultVariants: {
      variant: "default",
      radius: "default",
      padding: "default",
    },
  }
);

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  // Content Props (Optional helper mode)
  thumbnail?: string;
  title?: string;
  description?: string;
  tags?: string[];
  actionLabel?: string;
  onAction?: () => void;
  // Slots
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  className,
  variant,
  radius,
  padding,
  // Content props
  thumbnail,
  title,
  description,
  tags,
  actionLabel,
  onAction,
  children,
  header,
  footer,
  style,
  ...props
}: CardProps) {
  
  // If children are provided, render as a container
  const isContainerMode = React.Children.count(children) > 0;

  return (
    <div
      className={cn(cardVariants({ variant, radius, padding }), className)}
      style={style}
      {...props}
    >
      {isContainerMode ? (
        children
      ) : (
        <>
          {/* Helper Mode: Thumbnail */}
          {thumbnail && (
            <div className="w-full aspect-video md:h-[200px] rounded-[var(--radius-md)] overflow-hidden mb-[var(--spacing-3)] bg-[var(--muted)] shrink-0">
               {thumbnail.startsWith('http') || thumbnail.startsWith('/') ? (
                  <img src={thumbnail} alt={title || 'Card thumbnail'} className="w-full h-full object-cover" />
               ) : (
                  <img src={thumbnail} alt={title || 'Card thumbnail'} className="w-full h-full object-cover" />
               )}
            </div>
          )}

          {/* Helper Mode: Header/Title */}
          <div className="flex flex-col gap-[var(--spacing-2)] flex-1 min-h-0">
             {header}
             
             {title && (
               <div className="flex items-center justify-between gap-[var(--spacing-4)]">
                 <h3 className="font-['Inter_Tight'] text-lg md:text-xl font-bold leading-tight text-[var(--foreground)] m-0 truncate">
                   {title}
                 </h3>
               </div>
             )}
             
             {description && (
               <p className="font-['Inter_Tight'] text-sm md:text-base font-normal leading-relaxed text-[var(--muted-foreground)] m-0 line-clamp-3">
                 {description}
               </p>
             )}

             {tags && tags.length > 0 && (
               <div className="flex flex-wrap gap-[var(--spacing-2)] mt-[var(--spacing-2)]">
                 {tags.map((tag, i) => (
                   <span 
                     key={i}
                     className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-700)] text-[var(--foreground)] border border-[var(--surface-600)]"
                   >
                     {tag}
                   </span>
                 ))}
               </div>
             )}
          </div>

          {/* Helper Mode: Footer/Action */}
          {(actionLabel || footer) && (
            <div className="mt-[var(--spacing-3)] pt-1 md:pt-0">
              {footer ? footer : (
                <Button
                  onClick={onAction}
                  fullWidth
                  variant="secondary"
                  size="md"
                >
                  {actionLabel}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
