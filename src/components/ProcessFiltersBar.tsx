// src/components/ProcessFiltersBar.tsx
import React from 'react';
import { FilterBuilder, Filter } from './FilterBuilder';
import { FilterXIcon } from 'lucide-react';

type QuickFilters = {
  correlationId: string;
  requesterEmail: string;
  customerName: string;
};

interface ProcessFiltersBarProps {
  quickFilters: QuickFilters;
  onQuickFiltersChange: (next: QuickFilters) => void;

  advancedFilters: Filter[];
  setAdvancedFilters: (filters: Filter[]) => void;

  appliedFiltersCount: number;

  applyAdvancedFilters: () => void;
  clearAdvancedFilters: () => void;
  clearAllFilters: () => void;

  displayedCount: number;
  totalCount: number;
}

export function ProcessFiltersBar({
  quickFilters,
  onQuickFiltersChange,
  advancedFilters,
  setAdvancedFilters,
  appliedFiltersCount,
  applyAdvancedFilters,
  clearAdvancedFilters,
  clearAllFilters,
  displayedCount,
  totalCount
}: ProcessFiltersBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-1">
            <input
              type="text"
              placeholder="Correlation ID"
              value={quickFilters.correlationId}
              onChange={e =>
                onQuickFiltersChange({
                  ...quickFilters,
                  correlationId: e.target.value
                })
              }
              className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Customer"
              value={quickFilters.customerName}
              onChange={e =>
                onQuickFiltersChange({
                  ...quickFilters,
                  customerName: e.target.value
                })
              }
              className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Requester Email"
              value={quickFilters.requesterEmail}
              onChange={e =>
                onQuickFiltersChange({
                  ...quickFilters,
                  requesterEmail: e.target.value
                })
              }
              className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterBuilder
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              onApply={applyAdvancedFilters}
              onClear={clearAdvancedFilters}
              appliedCount={appliedFiltersCount}
            />
            <div className="relative group">
              <button
                onClick={clearAllFilters}
                className="p-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                <FilterXIcon className="w-4 h-4" />
              </button>
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                Clear Filters
                <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-end">
          <div className="text-sm text-gray-600">
            {displayedCount} out of {totalCount}
          </div>
        </div>
      </div>
    </div>
  );
}
