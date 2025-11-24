export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
export function formatDateWithSeconds(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}
export function getRouteLabel(route: number): string {
  const labels: {
    [key: number]: string;
  } = {
    0: 'Other',
    1: 'Awaiting Classification',
    2: 'RFQ',
    3: 'PO',
    4: 'Unknown'
  };
  return labels[route] || 'Unknown';
}
export function getStatusLabel(status: number): string {
  const labels: {
    [key: number]: string;
  } = {
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
  const labels: {
    [key: number]: string;
  } = {
    0: 'Failed',
    1: 'Success',
    2: 'Skipped'
  };
  return labels[status] || 'Unknown';
}