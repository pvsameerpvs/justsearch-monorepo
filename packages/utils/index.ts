export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};
