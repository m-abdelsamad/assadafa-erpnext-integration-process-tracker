export interface ProcessDto {
  id: number;
  correlationId: string;
  requesterEmail: string;
  route: number;
  status: number;
  customerName: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface ProcessEventDto {
  id: number;
  correlationId: string;
  mqMessageId: string | null;
  eventType: string;
  receivedAt: string;
  status: number;
  errorMessages: string[];
  warningMessages: string[];
}
export interface RfqStateDto {
  id: number;
  correlationId: string;
  requesterEmail: string;
  customerName: string | null;
  requestedItemsJson: string | null;
  foundItemsJson: string | null;
  missingItemsJson: string | null;
  lookupErrorsJson: string | null;
  requestedCount: number;
  foundCount: number;
  missingCount: number;
  quotationName: string | null;
  quotationCreatedUtc: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface PoStateDto {
  id: number;
  correlationId: string;
  requesterEmail: string;
  customerName: string | null;
  poNumber: string | null;
  requestedItemsJson: string | null;
  orderedItemsJson: string | null;
  missingItemsJson: string | null;
  lookupErrorsJson: string | null;
  requestedCount: number;
  orderedCount: number;
  missingCount: number;
  salesOrderNumber: string | null;
  salesOrderCreatedUtc: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface PagedList<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage?: number | null;
  previousPage?: number | null;
}
export interface ContactProcurementItemRequest {
  partNumber: string;
  description: string | null;
  quantity: number;
}

export interface ContactProcurementRequest {
  requesterEmail: string;
  correlationId: string;
  customerName: string | null;
  items: ContactProcurementItemRequest[];
}

export interface ContactProcurementResponse {
  correlationId: string;
  message: string;
  customerName: string | null;
  validItems: ContactProcurementItemRequest[];
}