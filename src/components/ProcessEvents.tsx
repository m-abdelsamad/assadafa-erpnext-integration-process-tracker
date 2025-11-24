// src/components/ProcessEvents.tsx
import React from 'react';
import { ProcessEventDto, PagedList } from '../types';
import { formatDateWithSeconds, getEventStatusLabel } from '../utils/formatters';
import { AlertCircleIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';

interface ProcessEventsProps {
  events: PagedList<ProcessEventDto> | null;
  loading: boolean;
}

export function ProcessEvents({ events, loading }: ProcessEventsProps) {
  if (loading) {
    return <div className="text-gray-600">Loading audit logs...</div>;
  }

  if (!events || events.items.length === 0) {
    return (
      <div className="text-gray-500">
        No audit logs found for this process
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.items.map(event => (
        <div
          key={event.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              {event.status === 1 ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              ) : event.status === 2 ? (
                <AlertTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
              ) : (
                <AlertCircleIcon className="w-5 h-5 text-red-500 mr-2" />
              )}
              <h3 className="text-sm font-semibold text-gray-900">
                {event.eventType}
              </h3>
            </div>
            <span className="text-xs text-gray-500">
              {formatDateWithSeconds(event.receivedAt)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Message ID:</span>
              <span className="ml-2 text-gray-900 font-mono text-xs">
                {event.mqMessageId || '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  event.status === 1
                    ? 'bg-green-100 text-green-800'
                    : event.status === 2
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {getEventStatusLabel(event.status)}
              </span>
            </div>
          </div>
          {event.status === 0 && event.errorMessages.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs font-medium text-red-800 mb-1">Errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {event.errorMessages.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {event.status === 2 && event.warningMessages.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs font-medium text-yellow-800 mb-1">
                Warnings:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {event.warningMessages.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}