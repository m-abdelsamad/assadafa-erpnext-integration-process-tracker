import React from 'react';
import { CheckCircleIcon, XCircleIcon, XIcon } from 'lucide-react';
interface ProcurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
}
export function ProcurementModal({
  isOpen,
  onClose,
  isSuccess,
  message
}: ProcurementModalProps) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <XIcon className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center">
          {isSuccess ? <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Success!
              </h3>
            </> : <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircleIcon className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Request Failed
              </h3>
            </>}
          <p className="text-gray-600 mb-6">{message}</p>
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
            Close
          </button>
        </div>
      </div>
    </div>;
}