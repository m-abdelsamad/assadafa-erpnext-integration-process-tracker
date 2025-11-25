const LIBYA_TIME_ZONE = 'Africa/Tripoli';

function parseUtcDate(dateString: string): Date {
  if (!dateString) {
    return new Date(NaN);
  }

  // If the string already has a timezone (Z or +hh:mm / -hh:mm), let JS handle it.
  if (/Z$|[+-]\d{2}:\d{2}$/.test(dateString)) {
    return new Date(dateString);
  }

  // Otherwise, force it to be interpreted as UTC by appending 'Z'
  // "2025-11-25T12:19:17.463" -> "2025-11-25T12:19:17.463Z"
  return new Date(dateString + 'Z');
}

export function formatDate(dateString: string): string {
  const date = parseUtcDate(dateString);
  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: LIBYA_TIME_ZONE
  });
}

export function formatDateWithSeconds(dateString: string): string {
  const date = parseUtcDate(dateString);
  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: LIBYA_TIME_ZONE
  });
}

export function getRouteLabel(route: number): string {
  const labels: { [key: number]: string } = {
    0: 'Other',
    1: 'Awaiting Classification',
    2: 'RFQ',
    3: 'PO',
    4: 'Unknown'
  };
  return labels[route] || 'Unknown';
}

export function getStatusLabel(status: number): string {
  const labels: { [key: number]: string } = {
    10: 'In Progress',
    20: 'Completed',
    21: 'Partially Completed',
    30: 'Skipped',
    31: 'Unknown',
    90: 'Failed'
  };
  return labels[status] || 'Unknown';
}

export function getEventStatusLabel(status: number): string {
  const labels: { [key: number]: string } = {
    0: 'Failed',
    1: 'Success',
    2: 'Skipped'
  };
  return labels[status] || 'Unknown';
}
