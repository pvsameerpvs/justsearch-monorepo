export interface NewOrderRealtimeMessage {
  type: 'NEW_ORDER';
  orderId: string;
  orderCode: string;
  customerAddress: string;
  total: number;
}

export interface ConnectedRealtimeMessage {
  type: 'CONNECTED';
}

export type DriverRealtimeMessage =
  | NewOrderRealtimeMessage
  | ConnectedRealtimeMessage;
