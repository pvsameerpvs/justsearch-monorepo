export type VoucherDiscount =
  | { kind: 'percent'; value: number }
  | { kind: 'flat'; value: number }
  | { kind: 'free_delivery' };

export type VoucherWalletEntry = {
  id: string;
  code: string;
  title: string;
  discountLabel: string;
  discount: VoucherDiscount;
  expiryLabel: string;
  isUsed: boolean;
  source: 'welcome' | 'order' | 'seed';
  createdAt: number;
  mobile?: string;
  orderId?: string;
};

const DEMO_VOUCHERS: VoucherWalletEntry[] = [
  {
    id: '1',
    code: 'WELCOME20',
    title: 'Welcome Discount',
    discountLabel: '20% OFF',
    discount: { kind: 'percent', value: 20 },
    expiryLabel: 'Valid until Dec 31',
    isUsed: false,
    source: 'welcome',
    createdAt: Date.now(),
  },
  {
    id: '2',
    code: 'BIRTHDAY50',
    title: 'Birthday Special',
    discountLabel: 'AED 50 OFF',
    discount: { kind: 'flat', value: 50 },
    expiryLabel: 'Valid until next birthday',
    isUsed: false,
    source: 'order',
    createdAt: Date.now(),
  },
  {
    id: '3',
    code: 'FREEDEL',
    title: 'Free Delivery',
    discountLabel: 'Free Delivery',
    discount: { kind: 'free_delivery' },
    expiryLabel: 'Valid until Nov 30',
    isUsed: true,
    source: 'seed',
    createdAt: Date.now(),
  },
];

export function useVoucherWallet() {
  return {
    vouchers: DEMO_VOUCHERS,
    addVoucher: () => {},
    markUsed: () => {},
  };
}
