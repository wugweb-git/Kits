import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Stepper Component
 * 
 * Step-by-step progress indicator.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Stepper
 *   steps={wizardSteps}
 *   currentStep={activeStep}
 *   onStepClick={setActiveStep}
 * />
 */
export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  onStepClick,
  className = '',
  style = {},
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={className}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: isVertical ? 'flex-start' : 'center',
        gap: isVertical ? 'var(--spacing-4)' : 'var(--spacing-2)',
        ...style,
      }}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || isCurrent);

        return (
          <React.Fragment key={step.id}>
            <div
              style={{
                display: 'flex',
                flexDirection: isVertical ? 'row' : 'column',
                alignItems: isVertical ? 'flex-start' : 'center',
                gap: 'var(--spacing-2)',
                flex: isVertical ? undefined : 1,
                cursor: isClickable ? 'pointer' : 'default',
              }}
              onClick={() => isClickable && onStepClick(index)}
            >
              {/* Step Circle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    background: isCompleted || isCurrent ? 'var(--accent)' : 'var(--muted)',
                    color: isCompleted || isCurrent ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                    border: isCurrent ? '2px solid var(--ring)' : 'none',
                    transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
                  }}
                >
                  {isCompleted ? <Check size={18} /> : index + 1}
                </div>

                {/* Step Content */}
                <div style={{ textAlign: isVertical ? 'left' : 'center' }}>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: isCurrent ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      color: isCurrent || isCompleted ? 'var(--foreground)' : 'var(--muted-foreground)',
                      marginBottom: step.description ? 'var(--spacing-1)' : 0,
                    }}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                style={{
                  ...(isVertical
                    ? {
                        width: '2px',
                        height: 'var(--spacing-4)',
                        marginLeft: '15px',
                      }
                    : {
                        flex: 1,
                        height: '2px',
                        minWidth: '40px',
                      }),
                  background: index < currentStep ? 'var(--accent)' : 'var(--border)',
                  transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
