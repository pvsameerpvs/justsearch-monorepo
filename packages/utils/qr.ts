export const generateRestaurantQR = (
  subdomain: string,
  type: 'delivery' | 'table',
  tableId?: string,
  domain: string = 'mydomain.com'
) => {
  const baseUrl = `https://${subdomain}.${domain}`;

  switch (type) {
    case 'delivery':
      return `${baseUrl}/menu?intent=delivery`;
    case 'table':
      return tableId ? `${baseUrl}/menu?table=${tableId}` : baseUrl;
    default:
      return baseUrl;
  }
};
