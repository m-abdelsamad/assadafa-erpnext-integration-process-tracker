import React, { useState } from 'react';
import { ProcessDto, RfqStateDto, PoStateDto } from '../types';
import { formatDateWithSeconds } from '../utils/formatters';
import { PackageIcon, CheckCircleIcon, XCircleIcon, LoaderIcon } from 'lucide-react';
import { ErrorBanner } from './ErrorBanner';
import { ProcurementModal } from './ProcurementModal';
import { useApi } from '../hooks/useApi';
import type { ApiError } from '../hooks/useApi';

interface ProcessDetailsProps {
  process: ProcessDto;
  rfqState: RfqStateDto | null;
  poState: PoStateDto | null;
  loading: boolean;
  error: {
    statusCode?: number;
    error?: string;
    message: string;
  } | null;
  // NEW: passed from parent, derived from events
  hasContactedProcurement: boolean;
}

export function ProcessDetails({
  process,
  rfqState,
  poState,
  loading,
  error,
  hasContactedProcurement
}: ProcessDetailsProps) {
  const [selectedMissingItems, setSelectedMissingItems] = useState<Set<number>>(new Set());
  const [isRequestingProcurement, setIsRequestingProcurement] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // API client for POST /api/procurement-requests
  const { execute: contactProcurement } = useApi<any, any>({
    path: '/procurement-requests',
    method: 'POST'
  });

  const handleMissingItemToggle = (index: number) => {
    const newSelected = new Set(selectedMissingItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedMissingItems(newSelected);
  };

  // Reusable handler that takes the current missingItems array
  const handleRequestProcurement = async (missingItems: any[]) => {
    if (missingItems.length === 0 || selectedMissingItems.size === 0) {
      return;
    }

    setIsRequestingProcurement(true);

    try {
      // Build selected items payload
      const selectedItems = missingItems
        .map((item, index) => ({ item, index }))
        .filter(x => selectedMissingItems.has(x.index))
        .map(x => ({
          partNumber: x.item.PartNumber,
          description: x.item.Description ?? null,
          quantity: x.item.Quantity ?? 0
        }));

      if (selectedItems.length === 0) {
        setIsRequestingProcurement(false);
        return;
      }

      const customerName =
        rfqState?.customerName ??
        poState?.customerName ??
        process.customerName ??
        null;

      const requestBody = {
        requesterEmail: process.requesterEmail,
        correlationId: process.correlationId,
        customerName,
        items: selectedItems
      };

      const response = await contactProcurement({ body: requestBody });

      const validItemsCount =
        response?.validItems?.length ??
        response?.ValidItems?.length ??
        selectedItems.length;

      const messageFromServer =
        response?.message ?? response?.Message ?? null;

      setModalSuccess(true);
      setModalMessage(
        messageFromServer ??
          `Procurement has been contacted for ${validItemsCount} selected item${
            validItemsCount !== 1 ? 's' : ''
          }.`
      );
      setModalOpen(true);
      setSelectedMissingItems(new Set());
    } catch (err) {
      console.error('Failed to contact procurement', err);
      const apiError = err as ApiError | Error;

      const message =
        (apiError as ApiError)?.message ??
        (apiError instanceof Error ? apiError.message : undefined) ??
        'Failed to contact procurement. Please try again later.';

      setModalSuccess(false);
      setModalMessage(message);
      setModalOpen(true);
    } finally {
      setIsRequestingProcurement(false);
    }
  };

  // Route 0: Other (skipped process)
  if (process.route === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
              Other
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            This process has been classified as{' '}
            <span className="font-semibold">Other</span>, which does not fall
            into the RFQ or PO categories. It has been skipped and no additional
            details are available.
          </p>
        </div>
      </div>
    );
  }

  // Route 4: Unknown (error during classification)
  if (process.route === 4) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium">
              Unknown
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            This process could not be classified and has been marked as{' '}
            <span className="font-semibold">Unknown</span>. This typically
            indicates an error during classification. No additional details are
            available.
          </p>
        </div>
      </div>
    );
  }

  // Route 1: Awaiting Classification
  if (process.route === 1) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium">
              Awaiting Classification
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            This process is currently{' '}
            <span className="font-semibold">Awaiting Classification</span>.
            Additional details will become available once the classification
            process is complete.
          </p>
        </div>
      </div>
    );
  }

  // Route 2: RFQ
  if (process.route === 2) {
    if (loading) {
      return <div className="text-gray-600">Loading RFQ details...</div>;
    }
    if (error) {
      return (
        <ErrorBanner
          statusCode={error.statusCode}
          error={error.error}
          message={error.message}
        />
      );
    }
    if (!rfqState) {
      return <div className="text-gray-500">No RFQ details available</div>;
    }

    const requestedItems = rfqState.requestedItemsJson
      ? JSON.parse(rfqState.requestedItemsJson)
      : [];
    const foundItems = rfqState.foundItemsJson
      ? JSON.parse(rfqState.foundItemsJson)
      : [];
    const missingItems = rfqState.missingItemsJson
      ? JSON.parse(rfqState.missingItemsJson)
      : [];

    return (
      <>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                Customer Information
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-blue-700 font-medium">
                    Customer Name:
                  </span>
                  <p className="text-sm text-blue-900">
                    {rfqState.customerName || '-'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-3">
                Quotation Details
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-green-700 font-medium">
                    Quotation Name:
                  </span>
                  <p className="text-sm text-green-900">
                    {rfqState.quotationName || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-green-700 font-medium">
                    Created:
                  </span>
                  <p className="text-sm text-green-900">
                    {rfqState.quotationCreatedUtc
                      ? formatDateWithSeconds(rfqState.quotationCreatedUtc)
                      : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-green-700 font-medium">
                    Last Updated:
                  </span>
                  <p className="text-sm text-green-900">
                    {formatDateWithSeconds(rfqState.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <PackageIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {rfqState.requestedCount}
              </p>
              <p className="text-sm text-gray-600">Requested Items</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {rfqState.foundCount}
              </p>
              <p className="text-sm text-gray-600">Quoted Items</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <XCircleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {rfqState.missingCount}
              </p>
              <p className="text-sm text-gray-600">Missing Items</p>
            </div>
          </div>

          {requestedItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Requested Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Part Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requestedItems.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-mono text-xs">
                          {item.PartNumber}
                        </td>
                        <td className="px-4 py-2">
                          {item.Description || '-'}
                        </td>
                        <td className="px-4 py-2">{item.Quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {foundItems.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-3">
                Found Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-100 border-b border-green-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                        Part Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-200">
                    {foundItems.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-mono text-xs text-green-900">
                          {item.PartNumber}
                        </td>
                        <td className="px-4 py-2 text-green-900">
                          {item.Quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {missingItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-red-900">
                  Missing Items
                </h3>
                <button
                  onClick={() => handleRequestProcurement(missingItems)}
                  disabled={
                    selectedMissingItems.size === 0 ||
                    isRequestingProcurement ||
                    hasContactedProcurement
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRequestingProcurement && (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  )}
                  Request From Procurement
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-100 border-b border-red-200">
                    <tr>
                      <th className="px-4 py-2 w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedMissingItems.size === missingItems.length
                          }
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedMissingItems(
                                new Set(
                                  missingItems.map((_: any, i: number) => i)
                                )
                              );
                            } else {
                              setSelectedMissingItems(new Set());
                            }
                          }}
                          className="rounded border-red-300"
                        />
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">
                        Part Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200">
                    {missingItems.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedMissingItems.has(index)}
                            onChange={() => handleMissingItemToggle(index)}
                            className="rounded border-red-300"
                          />
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-red-900">
                          {item.PartNumber}
                        </td>
                        <td className="px-4 py-2 text-red-900">
                          {item.Description || '-'}
                        </td>
                        <td className="px-4 py-2 text-red-900">
                          {item.Quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <ProcurementModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          isSuccess={modalSuccess}
          message={modalMessage}
        />
      </>
    );
  }

  // Route 3: PO
  if (process.route === 3) {
    if (loading) {
      return <div className="text-gray-600">Loading PO details...</div>;
    }
    if (error) {
      return (
        <ErrorBanner
          statusCode={error.statusCode}
          error={error.error}
          message={error.message}
        />
      );
    }
    if (!poState) {
      return <div className="text-gray-500">No PO details available</div>;
    }

    const requestedItems = poState.requestedItemsJson
      ? JSON.parse(poState.requestedItemsJson)
      : [];
    const orderedItems = poState.orderedItemsJson
      ? JSON.parse(poState.orderedItemsJson)
      : [];
    const missingItems = poState.missingItemsJson
      ? JSON.parse(poState.missingItemsJson)
      : [];

    return (
      <>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                Customer Information
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-blue-700 font-medium">
                    Customer Name:
                  </span>
                  <p className="text-sm text-blue-900">
                    {poState.customerName || '-'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-3">
                Sales Order Details
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-green-700 font-medium">
                    Sales Order Number:
                  </span>
                  <p className="text-sm text-green-900">
                    {poState.salesOrderNumber || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-green-700 font-medium">
                    PO Number:
                  </span>
                  <p className="text-sm text-green-900">
                    {poState.poNumber || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-green-700 font-medium">
                    Created:
                  </span>
                  <p className="text-sm text-green-900">
                    {poState.salesOrderCreatedUtc
                      ? formatDateWithSeconds(poState.salesOrderCreatedUtc)
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <PackageIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {poState.requestedCount}
              </p>
              <p className="text-sm text-gray-600">Requested Items</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {poState.orderedCount}
              </p>
              <p className="text-sm text-gray-600">Ordered Items</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <XCircleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {poState.missingCount}
              </p>
              <p className="text-sm text-gray-600">Missing Items</p>
            </div>
          </div>

          {requestedItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Requested Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Part Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requestedItems.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-mono text-xs">
                          {item.PartNumber}
                        </td>
                        <td className="px-4 py-2">
                          {item.Description || '-'}
                        </td>
                        <td className="px-4 py-2">{item.Quantity}</td>
                        <td className="px-4 py-2">
                          ${item.UnitPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-2">
                          ${item.TotalPrice?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {orderedItems.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-3">
                Ordered Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-100 border-b border-green-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                        Part Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-200">
                    {orderedItems.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-mono text-xs text-green-900">
                          {item.PartNumber}
                        </td>
                        <td className="px-4 py-2 text-green-900">
                          {item.Quantity}
                        </td>
                        <td className="px-4 py-2 text-green-900">
                          ${item.UnitPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-2 text-green-900">
                          ${item.TotalPrice?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {missingItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-red-900">
                  Missing Items
                </h3>
                <button
                  onClick={() => handleRequestProcurement(missingItems)}
                  disabled={
                    selectedMissingItems.size === 0 ||
                    isRequestingProcurement ||
                    hasContactedProcurement
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRequestingProcurement && (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  )}
                  Request From Procurement
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-100 border-b border-red-200">
                    <tr>
                      <th className="px-4 py-2 w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedMissingItems.size === missingItems.length
                          }
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedMissingItems(
                                new Set(
                                  missingItems.map((_: any, i: number) => i)
                                )
                              );
                            } else {
                              setSelectedMissingItems(new Set());
                            }
                          }}
                          className="rounded border-red-300"
                        />
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">
                        Part Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200">
                    {missingItems.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedMissingItems.has(index)}
                            onChange={() => handleMissingItemToggle(index)}
                            className="rounded border-red-300"
                          />
                        </td>
                        <td className="px-4 py-2 font-mono text-xs text-red-900">
                          {item.PartNumber}
                        </td>
                        <td className="px-4 py-2 text-red-900">
                          {item.Description || '-'}
                        </td>
                        <td className="px-4 py-2 text-red-900">
                          {item.Quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <ProcurementModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          isSuccess={modalSuccess}
          message={modalMessage}
        />
      </>
    );
  }

  return null;
}
