import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface Column<T = any> {
  /** Unique identifier for the column */
  key: string;
  /** Column header label */
  label: string;
  /** Custom render function for cell content */
  render?: (value: any, row: T, index: number) => React.ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Width of the column */
  width?: string | number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  /** Array of column definitions */
  columns: Column<T>[];
  /** Array of data rows */
  data: T[];
  /** Whether to show zebra stripes */
  striped?: boolean;
  /** Whether to show borders */
  bordered?: boolean;
  /** Whether to enable row hover effect */
  hoverable?: boolean;
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Default sort column key */
  defaultSortKey?: string;
  /** Default sort direction */
  defaultSortDirection?: 'asc' | 'desc';
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Optional className for custom styling */
  className?: string;
  /** Compact mode */
  compact?: boolean;
}

export function Table<T = any>({
  columns,
  data,
  striped = false,
  bordered = true,
  hoverable = true,
  onRowClick,
  defaultSortKey,
  defaultSortDirection = 'asc',
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  compact = false,
}: TableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(defaultSortKey || null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(defaultSortDirection);

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const getCellAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'flex-start';
    }
  };

  const cellPadding = compact ? 'var(--spacing-1)' : 'var(--spacing-2)';

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table
        className="w-full"
        style={{
          borderCollapse: 'separate',
          borderSpacing: 0,
          backgroundColor: 'var(--surface-800)',
          borderRadius: 'var(--radius-md)',
          border: bordered ? '1px solid var(--border)' : 'none',
          fontFamily: 'Inter Tight, sans-serif',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--surface-900)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {columns.map((column, index) => (
              <th
                key={column.key}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{
                  padding: cellPadding,
                  textAlign: column.align || 'left',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  cursor: column.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                  width: column.width,
                  borderTopLeftRadius: index === 0 ? 'var(--radius-md)' : '0',
                  borderTopRightRadius: index === columns.length - 1 ? 'var(--radius-md)' : '0',
                  position: 'relative',
                }}
              >
                <div
                  className="flex items-center gap-[var(--spacing-1)]"
                  style={{
                    justifyContent: getCellAlignment(column.align),
                  }}
                >
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className="flex items-center">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp size={14} style={{ color: 'var(--accent)' }} />
                        ) : (
                          <ChevronDown size={14} style={{ color: 'var(--accent)' }} />
                        )
                      ) : (
                        <ChevronsUpDown size={14} style={{ color: 'var(--muted-foreground)' }} />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: 'var(--spacing-4)',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Loading...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: 'var(--spacing-4)',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)}
                style={{
                  backgroundColor: striped && rowIndex % 2 === 1 ? 'var(--muted)' : 'transparent',
                  borderBottom: rowIndex < sortedData.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color var(--motion-duration-fast) var(--motion-easing-standard)',
                }}
                onMouseEnter={(e) => {
                  if (hoverable) {
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hoverable) {
                    e.currentTarget.style.backgroundColor = striped && rowIndex % 2 === 1 ? 'var(--muted)' : 'transparent';
                  }
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    style={{
                      padding: cellPadding,
                      textAlign: column.align || 'left',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      width: column.width,
                      borderBottomLeftRadius: rowIndex === sortedData.length - 1 && colIndex === 0 ? 'var(--radius-md)' : '0',
                      borderBottomRightRadius: rowIndex === sortedData.length - 1 && colIndex === columns.length - 1 ? 'var(--radius-md)' : '0',
                    }}
                  >
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
