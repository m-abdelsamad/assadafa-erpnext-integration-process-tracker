// src/pages/ProcessDetail.tsx (or wherever you keep it)

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import {
  ProcessDto,
  ProcessEventDto,
  RfqStateDto,
  PoStateDto,
  PagedList
} from '../types';
import {
  formatDateWithSeconds,
  getRouteLabel,
  getStatusLabel
} from '../utils/formatters';
import { ProcessEvents } from '../components/ProcessEvents';
import { ProcessDetails } from '../components/ProcessDetails';
import { ErrorBanner } from '../components/ErrorBanner';
import { useApi, ApiError } from '../hooks/useApi';

export function ProcessDetail() {
  const { correlationId } = useParams<{ correlationId: string }>();
  const navigate = useNavigate();

  // -------- Process state --------
  const [process, setProcess] = useState<ProcessDto | null>(null);
  const [processLoading, setProcessLoading] = useState(true);
  const [processError, setProcessError] = useState<{
    statusCode?: number;
    error?: string;
    message: string;
  } | null>(null);

  // -------- Events state --------
  const [events, setEvents] = useState<PagedList<ProcessEventDto> | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);

  // -------- RFQ / PO state --------
  const [rfqState, setRfqState] = useState<RfqStateDto | null>(null);
  const [poState, setPoState] = useState<PoStateDto | null>(null);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateError, setStateError] = useState<{
    statusCode?: number;
    error?: string;
    message: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'logs' | 'details'>('logs');

  // -------- API hooks --------

  // GET /api/processes/{correlationId}
  const { execute: fetchProcess } = useApi<ProcessDto, void>({
    path: correlationId ? `/processes/${correlationId}` : '',
    method: 'GET'
  });

  // GET /api/process-events?correlationId=...&pageNumber=1&pageSize=200
  // (We fetch a large page once, then paginate in the UI)
  const { execute: fetchEvents } = useApi<PagedList<ProcessEventDto>, void>({
    path: '/process-events',
    method: 'GET'
  });

  // GET /api/rfq-states/{correlationId}
  const { execute: fetchRfqState } = useApi<RfqStateDto, void>({
    path: correlationId ? `/rfq-states/${correlationId}` : '',
    method: 'GET'
  });

  // GET /api/po-states/{correlationId}
  const { execute: fetchPoState } = useApi<PoStateDto, void>({
    path: correlationId ? `/po-states/${correlationId}` : '',
    method: 'GET'
  });

  // -------- Load process once --------
  useEffect(() => {
    if (!correlationId) return;

    let isCancelled = false;

    async function loadProcess() {
      try {
        setProcessLoading(true);
        setProcessError(null);

        const data = await fetchProcess();

        if (isCancelled) return;

        setProcess(data);
      } catch (err) {
        if (isCancelled) return;

        const apiError = err as ApiError;

        setProcess(null);
        setProcessError({
          statusCode: apiError.statusCode,
          error: apiError.error,
          message:
            apiError.statusCode === 404
              ? `Process with correlation ID "${correlationId}" was not found.`
              : apiError.message
        });
      } finally {
        if (!isCancelled) {
          setProcessLoading(false);
        }
      }
    }

    loadProcess();

    return () => {
      isCancelled = true;
    };
  }, [correlationId, fetchProcess]);

  // -------- Load events once --------
  useEffect(() => {
    if (!correlationId) return;

    let isCancelled = false;

    async function loadEvents() {
      try {
        setEventsLoading(true);

        const response = await fetchEvents({
          query: {
            correlationId,
            pageNumber: 1,
            pageSize: 200 // enough for most processes; UI will page locally
          }
        });

        if (isCancelled) return;

        setEvents(response);
      } catch (err) {
        if (isCancelled) return;

        const apiError = err as ApiError;

        // 404 => just show "No audit logs"
        if (apiError.statusCode === 404) {
          setEvents(null);
        } else {
          console.error('Failed to load process events', apiError);
          setEvents(null);
        }
      } finally {
        if (!isCancelled) {
          setEventsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isCancelled = true;
    };
  }, [correlationId, fetchEvents]);

  // -------- Load RFQ/PO state when process route is known --------
  useEffect(() => {
    if (!process || !correlationId) return;

    let isCancelled = false;

    const route = process.route;

    if (route === 2 || route === 3) {
      async function loadState(routeValue: number) {
        try {
          setStateLoading(true);
          setStateError(null);

          if (routeValue === 2) {
            const state = await fetchRfqState();
            if (isCancelled) return;

            setRfqState(state);
            setPoState(null);
          } else if (routeValue === 3) {
            const state = await fetchPoState();
            if (isCancelled) return;

            setPoState(state);
            setRfqState(null);
          }
        } catch (err) {
          if (isCancelled) return;

          const apiError = err as ApiError;

          const message =
            apiError.statusCode === 404
              ? route === 2
                ? 'RFQ state is not yet created for this process.'
                : 'PO state is not yet created for this process.'
              : apiError.message;

          setStateError({
            statusCode: apiError.statusCode,
            error: apiError.error,
            message
          });

          setRfqState(null);
          setPoState(null);
        } finally {
          if (!isCancelled) {
            setStateLoading(false);
          }
        }
      }

      loadState(route);
    } else {
      // Non RFQ/PO routes => no state to fetch
      setRfqState(null);
      setPoState(null);
      setStateError(null);
      setStateLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [process, correlationId, fetchRfqState, fetchPoState]);

  // -------- TODO: SignalR integration hook point --------
  // Later you can create a custom hook like:
  // useAuditNotifications(correlationId, { setProcess, setEvents, setRfqState, setPoState })
  // which:
  // - connects to /api/hubs/audit
  // - subscribes via SubscribeToCorrelationId(correlationId)
  // - handles:
  //   - ProcessUpdated -> setProcess(dto)
  //   - ProcessEventUpdated -> append dto to events.items
  //   - RfqStateUpdated -> setRfqState(dto)
  //   - PoStateUpdated -> setPoState(dto)

  if (processLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading process details...</div>
      </div>
    );
  }

  if (processError) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <button
              onClick={() => navigate('/processes')}
              className="hover:text-blue-600 transition-colors"
            >
              Processes
            </button>
            <ChevronRightIcon className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">{correlationId}</span>
          </div>
          <ErrorBanner
            statusCode={processError.statusCode}
            error={processError.error}
            message={processError.message}
          />
        </div>
      </div>
    );
  }

  if (!process) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/processes')}
            className="hover:text-blue-600 transition-colors"
          >
            Processes
          </button>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{correlationId}</span>
        </div>

        {/* Summary header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Process Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correlation ID
              </label>
              <p className="mt-1 text-sm text-gray-900 font-medium break-all">
                {process.correlationId}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requester Email
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {process.requesterEmail}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </label>
              <p className="mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                  {getRouteLabel(process.route)}
                </span>
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </label>
              <p className="mt-1">
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
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {process.customerName || '-'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDateWithSeconds(process.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDateWithSeconds(process.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'logs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Audit Logs
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Details
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'logs' && (
              <ProcessEvents events={events} loading={eventsLoading} />
            )}
            {activeTab === 'details' && (
              <ProcessDetails
                process={process}
                rfqState={rfqState}
                poState={poState}
                loading={stateLoading}
                error={stateError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
