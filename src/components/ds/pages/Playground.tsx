import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';

const PatternHeader = ({ title, description }: { title: string, description: string }) => (
  <div style={{ marginBottom: 'var(--spacing-6)' }}>
    <h2 style={{
      fontFamily: 'var(--core-font-family-base)',
      fontSize: 'var(--fluid-h2)',
      fontWeight: 600,
      color: 'var(--foreground)',
      marginBottom: 'var(--spacing-2)',
      letterSpacing: '-0.02em'
    }}>
      {title}
    </h2>
    <p style={{
      fontFamily: 'var(--core-font-family-base)',
      fontSize: 'var(--fluid-body-lg)',
      color: 'var(--muted-foreground)',
      maxWidth: '48rem',
      lineHeight: 1.6
    }}>
      {description}
    </p>
  </div>
);

export function Playground() {
  const [borderRadius, setBorderRadius] = React.useState([8]);
  const [padding, setPadding] = React.useState([16]);
  const [buttonSize, setButtonSize] = React.useState([16]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-6)' }}>
        <h1 style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h1)',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-3)',
          letterSpacing: '-0.02em'
        }}>
          Playground
        </h1>
        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-lg)',
          color: 'var(--muted-foreground)',
          maxWidth: '42rem',
          lineHeight: 1.6
        }}>
          Experiment with design tokens in real-time. Adjust values to see how they affect components using strict design system applications.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-8)' }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div style={{
            background: 'var(--surface-900)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-6)',
            boxShadow: 'var(--core-shadow-md)'
          }}>
            <h4 style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--ts-h4-size)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-6)'
            }}>
              Token Controls
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-label)', fontWeight: 500, color: 'var(--foreground)' }}>
                    Border Radius
                  </label>
                  <span style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--ts-code-size)', color: 'var(--muted-foreground)', background: 'var(--surface-800)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                    {borderRadius[0]}px
                  </span>
                </div>
                <Slider value={borderRadius} onValueChange={setBorderRadius} max={24} step={1} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-label)', fontWeight: 500, color: 'var(--foreground)' }}>
                    Padding
                  </label>
                  <span style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--ts-code-size)', color: 'var(--muted-foreground)', background: 'var(--surface-800)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                    {padding[0]}px
                  </span>
                </div>
                <Slider value={padding} onValueChange={setPadding} max={48} step={4} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontFamily: 'var(--core-font-family-base)', fontSize: 'var(--fluid-label)', fontWeight: 500, color: 'var(--foreground)' }}>
                    Button Font Size
                  </label>
                  <span style={{ fontFamily: 'var(--core-font-family-mono)', fontSize: 'var(--ts-code-size)', color: 'var(--muted-foreground)', background: 'var(--surface-800)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                    {buttonSize[0]}px
                  </span>
                </div>
                <Slider value={buttonSize} onValueChange={setButtonSize} min={12} max={24} step={1} />
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--surface-900)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-6)',
            boxShadow: 'var(--core-shadow-md)'
          }}>
            <h4 style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--ts-h4-size)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-4)'
            }}>
              Current Values
            </h4>
            <div style={{
              background: 'var(--surface-950)',
              padding: 'var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <pre style={{
                fontFamily: 'var(--core-font-family-mono)',
                fontSize: 'var(--ts-code-size)',
                color: 'var(--foreground)',
                margin: 0,
                lineHeight: 1.6
              }}>
                <code>{`--radius-custom: ${borderRadius[0]}px;
--padding-custom: ${padding[0]}px;
--font-size-custom: ${buttonSize[0]}px;`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div style={{
            background: 'var(--surface-900)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-6)',
            boxShadow: 'var(--core-shadow-md)'
          }}>
            <h4 style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--ts-h4-size)',
              fontWeight: 600,
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-6)'
            }}>
              Live Preview
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div style={{
                background: 'var(--accent)',
                color: 'var(--foreground)',
                textAlign: 'center',
                borderRadius: `${borderRadius[0]}px`,
                padding: `${padding[0]}px`,
                transition: 'all var(--motion-duration-short) var(--motion-easing-standard)'
              }}>
                <p style={{
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: `${buttonSize[0]}px`,
                  fontWeight: 600,
                  margin: 0
                }}>
                  Preview Box
                </p>
                <p style={{
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-body-sm)',
                  opacity: 0.8,
                  marginTop: 'var(--spacing-2)',
                  marginBottom: 0
                }}>
                  Adjust the controls to see changes
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <button style={{
                  width: '100%',
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  border: 'none',
                  borderRadius: `${borderRadius[0]}px`,
                  padding: `${padding[0]}px`,
                  fontSize: `${buttonSize[0]}px`,
                  fontFamily: 'var(--core-font-family-base)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration-short) var(--motion-easing-standard)'
                }}>
                  Primary Button
                </button>

                <button style={{
                  width: '100%',
                  background: 'transparent',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: `${borderRadius[0]}px`,
                  padding: `${padding[0]}px`,
                  fontSize: `${buttonSize[0]}px`,
                  fontFamily: 'var(--core-font-family-base)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration-short) var(--motion-easing-standard)'
                }}>
                  Outline Button
                </button>

                <div style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: `${borderRadius[0]}px`,
                  padding: `${padding[0]}px`,
                  transition: 'all var(--motion-duration-short) var(--motion-easing-standard)'
                }}>
                  <h4 style={{
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: `${buttonSize[0] * 1.25}px`,
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    margin: 0,
                    marginBottom: 'var(--spacing-2)'
                  }}>
                    Card Header
                  </h4>
                  <p style={{
                    fontFamily: 'var(--core-font-family-base)',
                    fontSize: `${buttonSize[0] * 0.875}px`,
                    color: 'var(--muted-foreground)',
                    margin: 0
                  }}>
                    This card adapts to your token changes dynamically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
