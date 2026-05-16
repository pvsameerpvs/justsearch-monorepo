export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

export * from './qr';
export * from './src/restaurant.types';
