import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Tag, CreditCard } from 'lucide-react';

const INITIAL_ITEMS = [
  { id: 1, name: 'Wugweb Kits Pro License', sku: 'WK-PRO-001', price: 149, qty: 1, category: 'License' },
  { id: 2, name: 'Design Token Starter Pack', sku: 'DT-START-002', price: 49, qty: 2, category: 'Add-on' },
  { id: 3, name: 'Figma Component Library', sku: 'FIG-COMP-003', price: 79, qty: 1, category: 'Resource' },
];

export function CartView() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const updateQty = (id: number, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  return (
    <div style={{
      width: '100%',
      maxWidth: '720px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      fontFamily: 'var(--core-font-family-base)',
      boxShadow: 'var(--core-shadow-md)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
        padding: 'var(--spacing-5) var(--spacing-6)',
        borderBottom: '1px solid var(--border)',
      }}>
        <ShoppingBag size={20} color="var(--accent)" />
        <h3 style={{
          margin: 0,
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-h3)',
          fontWeight: 'var(--font-weight-semibold)' as any,
          color: 'var(--foreground)',
        }}>
          Cart
        </h3>
        <div style={{
          marginLeft: 'auto',
          background: 'var(--accent)',
          borderRadius: 'var(--radius-full)',
          padding: '2px var(--spacing-2)',
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-caption)',
          fontWeight: 'var(--font-weight-bold)' as any,
          color: 'var(--accent-foreground)',
        }}>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.length === 0 ? (
          <div style={{
            padding: 'var(--spacing-12)',
            textAlign: 'center',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--core-font-family-base)',
            fontSize: 'var(--fluid-body-md)',
          }}>
            Your cart is empty.
          </div>
        ) : items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-4)',
              padding: 'var(--spacing-4) var(--spacing-6)',
              borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            {/* Icon placeholder */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Tag size={18} color="var(--accent)" />
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: '0 0 2px 0',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-sm)',
                fontWeight: 'var(--font-weight-semibold)' as any,
                color: 'var(--foreground)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {item.name}
              </p>
              <p style={{
                margin: 0,
                fontFamily: 'var(--core-font-family-mono)',
                fontSize: 'var(--fluid-caption)',
                color: 'var(--muted-foreground)',
              }}>
                {item.sku} · {item.category}
              </p>
            </div>

            {/* Qty controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              background: 'var(--muted)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-1)',
              border: '1px solid var(--border)',
            }}>
              <button
                onClick={() => updateQty(item.id, -1)}
                aria-label="Decrease quantity"
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--foreground)',
                  transition: `background var(--motion-duration-fast) var(--motion-easing-standard)`,
                }}
              >
                <Minus size={12} />
              </button>
              <span style={{
                minWidth: '24px',
                textAlign: 'center',
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-sm)',
                fontWeight: 'var(--font-weight-semibold)' as any,
                color: 'var(--foreground)',
              }}>
                {item.qty}
              </span>
              <button
                onClick={() => updateQty(item.id, 1)}
                aria-label="Increase quantity"
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--foreground)',
                  transition: `background var(--motion-duration-fast) var(--motion-easing-standard)`,
                }}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Price */}
            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '64px' }}>
              <p style={{
                margin: 0,
                fontFamily: 'var(--core-font-family-base)',
                fontSize: 'var(--fluid-body-sm)',
                fontWeight: 'var(--font-weight-semibold)' as any,
                color: 'var(--foreground)',
              }}>
                ${(item.price * item.qty).toFixed(2)}
              </p>
              {item.qty > 1 && (
                <p style={{
                  margin: 0,
                  fontFamily: 'var(--core-font-family-base)',
                  fontSize: 'var(--fluid-caption)',
                  color: 'var(--muted-foreground)',
                }}>
                  ${item.price} × {item.qty}
                </p>
              )}
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
              style={{
                width: '32px',
                height: '32px',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted-foreground)',
                transition: `color var(--motion-duration-fast) var(--motion-easing-standard)`,
                flexShrink: 0,
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: 'var(--spacing-5) var(--spacing-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
      }}>
        {[
          { label: 'Subtotal', value: `$${subtotal.toFixed(2)}`, muted: true },
          { label: 'Tax (10%)', value: `$${tax.toFixed(2)}`, muted: true },
          { label: 'Total', value: `$${total.toFixed(2)}`, muted: false },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: row.muted ? 'var(--fluid-body-sm)' : 'var(--fluid-body-md)',
              color: row.muted ? 'var(--muted-foreground)' : 'var(--foreground)',
              fontWeight: row.muted ? 'var(--font-weight-regular)' as any : 'var(--font-weight-semibold)' as any,
            }}>
              {row.label}
            </span>
            <span style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: row.muted ? 'var(--fluid-body-sm)' : 'var(--fluid-body-md)',
              color: row.muted ? 'var(--muted-foreground)' : 'var(--accent)',
              fontWeight: 'var(--font-weight-semibold)' as any,
            }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Checkout CTA */}
      <div style={{ padding: '0 var(--spacing-6) var(--spacing-6)' }}>
        <button style={{
          width: '100%',
          height: 'var(--btn-height-lg)',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-2)',
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--fluid-body-md)',
          fontWeight: 'var(--font-weight-semibold)' as any,
          color: 'var(--accent-foreground)',
          transition: `opacity var(--motion-duration-fast) var(--motion-easing-standard)`,
        }}>
          <CreditCard size={18} />
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
