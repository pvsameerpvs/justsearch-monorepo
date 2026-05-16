import { apiClient } from './client';

export type OtpRequestPayload = {
  name: string;
  mobile: string;
};

export type OtpRequestResponse = {
  requestId: string;
  expiresIn: number;
};

export type OtpVerifyPayload = {
  requestId: string;
  otp: string;
};

export type OtpVerifyResponse = {
  token: string;
  user: { id: string; name: string; phone: string };
};

export async function requestOtp(payload: OtpRequestPayload, host?: string): Promise<OtpRequestResponse> {
  return apiClient<OtpRequestResponse>('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify(payload),
    tenantHost: host,
  });
}

export async function verifyOtp(payload: OtpVerifyPayload): Promise<OtpVerifyResponse> {
  return apiClient<OtpVerifyResponse>('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
