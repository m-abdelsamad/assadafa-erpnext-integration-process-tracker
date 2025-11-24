// ProcessList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessDto, PagedList } from '../types';
import { formatDate, getRouteLabel, getStatusLabel } from '../utils/formatters';
import { FilterBuilder, Filter } from '../components/FilterBuilder';
import { FilterXIcon } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const DEFAULT_PAGE_SIZE = 500;

export function ProcessList() {
  const [allProcesses, setAllProcesses] = useState<ProcessDto[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<{
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [quickFilters, setQuickFilters] = useState({
    correlationId: '',
    requesterEmail: '',
    customerName: ''
  });

  const [advancedFilters, setAdvancedFilters] = useState<Filter[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);

  const navigate = useNavigate();

  // Our generic API hook for GET /processes
  const { execute: fetchProcesses, error: apiError } = useApi<PagedList<ProcessDto>, void>({
    path: '/processes',
    method: 'GET'
  });

  // Initial load: page 1
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialPage() {
      try {
        setLoading(true);

        const response = await fetchProcesses({
          query: {
            pageNumber: 1,
            pageSize: DEFAULT_PAGE_SIZE
          }
        });

        if (isCancelled) return;

        setAllProcesses(response.items);
        setPaginationInfo({
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage
        });
        setCurrentPage(response.pageNumber);
      } catch (err) {
        // error already stored in apiError; you can also log/handle here
        console.error('Failed to load processes', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialPage();

    return () => {
      isCancelled = true;
    };
  }, [fetchProcesses]);

  const loadMoreProcesses = async () => {
    if (!paginationInfo?.hasNextPage) {
      return;
    }

    const nextPage = currentPage + 1;

    try {
      setLoadingMore(true);

      const response = await fetchProcesses({
        query: {
          pageNumber: nextPage,
          pageSize: DEFAULT_PAGE_SIZE
        }
      });

      setAllProcesses(previous => [...previous, ...response.items]);
      setPaginationInfo({
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage
      });
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Failed to load more processes', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const applyAdvancedFilters = () => {
    setAppliedFilters(advancedFilters);
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters([]);
    setAppliedFilters([]);
  };

  const clearAllFilters = () => {
    setQuickFilters({
      correlationId: '',
      requesterEmail: '',
      customerName: ''
    });
    setAdvancedFilters([]);
    setAppliedFilters([]);
  };

  const hasAnyFilters =
    quickFilters.correlationId ||
    quickFilters.requesterEmail ||
    quickFilters.customerName ||
    appliedFilters.length > 0;

  const matchesFilter = (process: ProcessDto, filter: Filter): boolean => {
    const fieldValue = (() => {
      switch (filter.field) {
        case 'correlationId':
          return process.correlationId.toLowerCase();
        case 'customerName':
          return (process.customerName || '').toLowerCase();
        case 'requesterEmail':
          return process.requesterEmail.toLowerCase();
        case 'route':
          return process.route.toString();
        case 'status':
          return process.status.toString();
        case 'createdAt':
          return process.createdAt;
        default:
          return '';
      }
    })();

    const filterValue = filter.value.toLowerCase();

    if (filter.field === 'createdAt') {
      const processDate = new Date(process.createdAt);
      const now = new Date();
      const dayInMs = 24 * 60 * 60 * 1000;

      switch (filter.value) {
        case 'today':
          return processDate.toDateString() === now.toDateString();
        case 'past3days':
          return now.getTime() - processDate.getTime() <= 3 * dayInMs;
        case 'pastWeek':
          return now.getTime() - processDate.getTime() <= 7 * dayInMs;
        case 'pastMonth':
          return now.getTime() - processDate.getTime() <= 30 * dayInMs;
        default:
          return true;
      }
    }

    switch (filter.operator) {
      case 'like':
        return fieldValue.includes(filterValue);
      case 'equals':
        return fieldValue === filterValue;
      case 'notLike':
        return !fieldValue.includes(filterValue);
      case 'notEquals':
        return fieldValue !== filterValue;
      default:
        return true;
    }
  };

  const filteredProcesses = allProcesses.filter(process => {
    const matchesQuickFilters =
      (!quickFilters.correlationId ||
        process.correlationId
          .toLowerCase()
          .includes(quickFilters.correlationId.toLowerCase())) &&
      (!quickFilters.requesterEmail ||
        process.requesterEmail
          .toLowerCase()
          .includes(quickFilters.requesterEmail.toLowerCase())) &&
      (!quickFilters.customerName ||
        process.customerName
          ?.toLowerCase()
          .includes(quickFilters.customerName.toLowerCase()));

    const matchesAdvancedFilters = appliedFilters.every(filter =>
      matchesFilter(process, filter)
    );

    return matchesQuickFilters && matchesAdvancedFilters;
  });

  const displayedCount = filteredProcesses.length;
  const totalCount = paginationInfo?.totalCount || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">
          Loading processes...
        </div>
      </div>
    );
  }

  // Optional: show API error banner
  // (purely visual, you can tweak or remove)
  const errorBanner = apiError ? (
    <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
      {apiError.error}: {apiError.message}
    </div>
  ) : null;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span className="text-gray-900 font-medium">Processes</span>
        </div>

        {errorBanner}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  placeholder="Correlation ID"
                  value={quickFilters.correlationId}
                  onChange={e =>
                    setQuickFilters({
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
                    setQuickFilters({
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
                    setQuickFilters({
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
                  appliedCount={appliedFilters.length}
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correlation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProcesses.map(process => (
                  <tr
                    key={process.id}
                    onClick={() =>
                      navigate(`/processes/${process.correlationId}`)
                    }
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                      title={process.correlationId}
                    >
                      {process.correlationId.length > 35
                        ? `${process.correlationId.substring(0, 35)}...`
                        : process.correlationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {getRouteLabel(process.route)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          process.status === 20 || process.status === 21
                            ? 'bg-green-100 text-green-800'
                            : process.status === 90
                            ? 'bg-red-100 text-red-800'
                            : process.status === 30
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {getStatusLabel(process.status)}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      title={process.customerName || '-'}
                    >
                      {process.customerName
                        ? process.customerName.length > 25
                          ? `${process.customerName.substring(0, 25)}...`
                          : process.customerName
                        : '-'}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      title={process.requesterEmail}
                    >
                      {process.requesterEmail.length > 25
                        ? `${process.requesterEmail.substring(0, 25)}...`
                        : process.requesterEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(process.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProcesses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No processes found matching the filters
            </div>
          )}

          {!hasAnyFilters &&
            paginationInfo?.hasNextPage &&
            filteredProcesses.length > 0 && (
              <div className="border-t border-gray-200 py-4 flex justify-end px-6">
                <button
                  onClick={loadMoreProcesses}
                  disabled={loadingMore}
                  className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
