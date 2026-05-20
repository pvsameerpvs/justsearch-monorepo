function getDateParts(value: number | string) {
  const ts = typeof value === 'string' ? new Date(value).getTime() : value;
  if (Number.isNaN(ts)) {
    return { day: '--', month: '--', hour: '--', minute: '--' };
  }
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(ts);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    day: read('day'),
    month: read('month'),
    hour: read('hour'),
    minute: read('minute'),
  };
}

export function formatOrderCompletionTime(value: number | string) {
  const { day, month, hour, minute } = getDateParts(value);
  return `${day} ${month} at ${hour}:${minute}`;
}

export function formatOrderPlacedTime(value: number | string) {
  const ts = typeof value === 'string' ? new Date(value).getTime() : value;
  if (Number.isNaN(ts)) {
    return 'Unknown time';
  }
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(ts);
}

export function splitOrderAddress(address: string) {
  return address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
