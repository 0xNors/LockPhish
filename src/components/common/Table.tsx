import React from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  className = ''
}: TableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={`overflow-x-auto w-full border border-emerald-900/30 rounded-xl bg-slate-950/70 ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-emerald-900/40 bg-gradient-to-r from-emerald-950/50 to-slate-950">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 font-mono font-bold uppercase tracking-wider text-emerald-400/80 text-[10px] ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-900/20">
          {data.map((row, rowIdx) => {
            const isClickable = Boolean(onRowClick);
            return (
              <tr
                key={keyExtractor(row, rowIdx)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  isClickable
                    ? 'cursor-pointer hover:bg-emerald-950/30'
                    : 'hover:bg-emerald-950/20'
                }`}
              >
                {columns.map((col, colIdx) => {
                  let content: React.ReactNode = null;
                  if (typeof col.accessor === 'function') {
                    content = col.accessor(row);
                  } else if (col.accessor) {
                    content = (row as any)[col.accessor];
                  }

                  return (
                    <td
                      key={colIdx}
                      className={`py-3.5 px-4 text-slate-200 ${col.className || ''}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
