import React from 'react';
import { AlertCircleIcon, XIcon } from 'lucide-react';
interface ErrorBannerProps {
  statusCode?: number;
  error?: string;
  message: string;
  onDismiss?: () => void;
}
export function ErrorBanner({
  statusCode,
  error,
  message,
  onDismiss
}: ErrorBannerProps) {
  return <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-red-900">
              {error || 'Error'}
              {statusCode && ` (${statusCode})`}
            </h3>
            {onDismiss && <button onClick={onDismiss} className="text-red-600 hover:text-red-800 transition-colors">
                <XIcon className="w-4 h-4" />
              </button>}
          </div>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>;
}