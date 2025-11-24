import React, { useState } from 'react';
import { XIcon, PlusIcon, FilterIcon } from 'lucide-react';
export interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string;
}
interface FilterBuilderProps {
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
  onApply: () => void;
  onClear: () => void;
  appliedCount: number;
}
const FIELD_OPTIONS = [{
  value: 'correlationId',
  label: 'Correlation ID'
}, {
  value: 'customerName',
  label: 'Customer'
}, {
  value: 'requesterEmail',
  label: 'Requester Email'
}, {
  value: 'route',
  label: 'Route'
}, {
  value: 'status',
  label: 'Status'
}, {
  value: 'createdAt',
  label: 'Created At'
}];
const STRING_OPERATORS = [{
  value: 'like',
  label: 'Like'
}, {
  value: 'equals',
  label: 'Equals'
}, {
  value: 'notLike',
  label: 'Not Like'
}, {
  value: 'notEquals',
  label: 'Not Equals'
}];
const ENUM_OPERATORS = [{
  value: 'equals',
  label: 'Equals'
}];
const ROUTE_OPTIONS = [{
  value: '0',
  label: 'Other'
}, {
  value: '1',
  label: 'Awaiting Classification'
}, {
  value: '2',
  label: 'RFQ'
}, {
  value: '3',
  label: 'PO'
}, {
  value: '4',
  label: 'Unknown'
}];
const STATUS_OPTIONS = [{
  value: '10',
  label: 'In Progress'
}, {
  value: '20',
  label: 'Completed'
}, {
  value: '21',
  label: 'Partially Completed'
}, {
  value: '30',
  label: 'Skipped'
}, {
  value: '31',
  label: 'Unknown'
}, {
  value: '90',
  label: 'Failed'
}];
const DATE_OPTIONS = [{
  value: 'today',
  label: 'Today'
}, {
  value: 'past3days',
  label: 'Past 3 Days'
}, {
  value: 'pastWeek',
  label: 'Past Week'
}, {
  value: 'pastMonth',
  label: 'Past Month'
}];
export function FilterBuilder({
  filters,
  onFiltersChange,
  onApply,
  onClear,
  appliedCount
}: FilterBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const addFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      field: 'correlationId',
      operator: 'like',
      value: ''
    };
    onFiltersChange([...filters, newFilter]);
  };
  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };
  const updateFilter = (id: string, updates: Partial<Omit<Filter, 'id'>>) => {
    onFiltersChange(filters.map(f => {
      if (f.id === id) {
        const updated = {
          ...f,
          ...updates
        };
        // Reset operator and value when field changes
        if (updates.field && updates.field !== f.field) {
          if (updates.field === 'route' || updates.field === 'status' || updates.field === 'createdAt') {
            updated.operator = 'equals';
            updated.value = '';
          } else {
            updated.operator = 'like';
            updated.value = '';
          }
        }
        return updated;
      }
      return f;
    }));
  };
  const getOperatorOptions = (field: string) => {
    if (field === 'route' || field === 'status' || field === 'createdAt') {
      return ENUM_OPERATORS;
    }
    return STRING_OPERATORS;
  };
  const getValueInput = (filter: Filter) => {
    if (filter.field === 'route') {
      return <select value={filter.value} onChange={e => updateFilter(filter.id, {
        value: e.target.value
      })} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
          <option value="">Select Route</option>
          {ROUTE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>)}
        </select>;
    }
    if (filter.field === 'status') {
      return <select value={filter.value} onChange={e => updateFilter(filter.id, {
        value: e.target.value
      })} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
          <option value="">Select Status</option>
          {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>)}
        </select>;
    }
    if (filter.field === 'createdAt') {
      return <select value={filter.value} onChange={e => updateFilter(filter.id, {
        value: e.target.value
      })} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
          <option value="">Select Date Range</option>
          {DATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>)}
        </select>;
    }
    return <input type="text" value={filter.value} onChange={e => updateFilter(filter.id, {
      value: e.target.value
    })} placeholder="Enter value" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />;
  };
  const getButtonText = () => {
    if (appliedCount === 0) return 'Filter';
    if (appliedCount === 1) return '1 filter';
    return `${appliedCount} filters`;
  };
  const hasActiveFilters = appliedCount > 0;
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center px-3 py-1.5 text-sm font-medium border rounded transition-colors ${hasActiveFilters ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
        <FilterIcon className="w-4 h-4 mr-1.5" />
        {getButtonText()}
      </button>
      {isOpen && <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-4 space-y-3">
              {filters.map(filter => <div key={filter.id} className="flex items-center gap-2">
                  <select value={filter.field} onChange={e => updateFilter(filter.id, {
              field: e.target.value
            })} className="w-40 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                    {FIELD_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>)}
                  </select>
                  <select value={filter.operator} onChange={e => updateFilter(filter.id, {
              operator: e.target.value
            })} className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                    {getOperatorOptions(filter.field).map(opt => <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>)}
                  </select>
                  {getValueInput(filter)}
                  <button onClick={() => removeFilter(filter.id)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>)}
              <button onClick={addFilter} className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <PlusIcon className="w-4 h-4 mr-1" />
                Add a Filter
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <button onClick={() => {
            onClear();
            setIsOpen(false);
          }} className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Clear Filters
              </button>
              <button onClick={() => {
            onApply();
            setIsOpen(false);
          }} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </>}
    </div>;
}