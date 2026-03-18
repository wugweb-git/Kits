import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: 's' | 'm' | 'l';
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type SortDirection = 'asc' | 'desc' | null;

/**
 * DataTable Component
 * 
 * Advanced table with sorting, searching, and custom rendering.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <DataTable
 *   data={users}
 *   columns={[
 *     { key: 'name', title: 'Name', sortable: true },
 *     { key: 'email', title: 'Email', sortable: true },
 *     { key: 'role', title: 'Role' },
 *   ]}
 *   searchable
 * />
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  emptyText = 'No data available',
  size = 'm',
  striped = false,
  hoverable = true,
  className = '',
  style = {},
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter data based on search
  let filteredData = data;
  if (search) {
    filteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  // Sort data
  if (sortKey && sortDirection) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const sizeStyles = {
    s: {
      fontSize: 'var(--text-sm)',
      padding: 'var(--spacing-2)',
    },
    m: {
      fontSize: 'var(--text-base)',
      padding: 'var(--spacing-3)',
    },
    l: {
      fontSize: 'var(--text-lg)',
      padding: 'var(--spacing-4)',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div className={className} style={{ width: '100%', ...style }}>
      {/* Search Bar */}
      {searchable && (
        <div style={{ marginBottom: 'var(--spacing-4)', position: 'relative' }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted-foreground)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-regular)',
              width: '100%',
              height: '40px',
              paddingLeft: '44px',
              paddingRight: '12px',
              color: 'var(--foreground)',
              background: 'var(--input-background)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--ring)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 190, 26, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      )}

      {/* Table */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <table
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ background: 'var(--muted)' }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    fontSize: currentSize.fontSize,
                    fontWeight: 'var(--font-weight-semibold)',
                    padding: currentSize.padding,
                    textAlign: 'left',
                    color: 'var(--foreground)',
                    borderBottom: '1px solid var(--border)',
                    cursor: column.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    width: column.width,
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                    }}
                  >
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span style={{ color: 'var(--muted-foreground)' }}>
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )
                        ) : (
                          <ChevronsUpDown size={16} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: currentSize.fontSize,
                    padding: 'var(--spacing-8)',
                    textAlign: 'center',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    background: striped && rowIndex % 2 === 1 ? 'var(--muted)' : 'transparent',
                    transition: hoverable ? 'background var(--motion-duration-fast) var(--motion-easing-standard)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (hoverable) {
                      e.currentTarget.style.background = 'var(--secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hoverable) {
                      e.currentTarget.style.background =
                        striped && rowIndex % 2 === 1 ? 'var(--muted)' : 'transparent';
                    }
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{
                        fontSize: currentSize.fontSize,
                        fontWeight: 'var(--font-weight-regular)',
                        padding: currentSize.padding,
                        color: 'var(--foreground)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      {searchable && (
        <div
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            marginTop: 'var(--spacing-3)',
          }}
        >
          Showing {filteredData.length} of {data.length} results
        </div>
      )}
    </div>
  );
}
