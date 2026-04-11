export type OtpRequestRecord = {
  requestId: string;
  name: string;
  mobile: string;
  otp: string;
  createdAt: number;
  attempts: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __justsearchOtpRequests: Map<string, OtpRequestRecord> | undefined;
}

export function getOtpRequestsStore(): Map<string, OtpRequestRecord> {
  const store: Map<string, OtpRequestRecord> =
    globalThis.__justsearchOtpRequests ?? new Map<string, OtpRequestRecord>();
  globalThis.__justsearchOtpRequests = store;
  return store;
}

export {};
