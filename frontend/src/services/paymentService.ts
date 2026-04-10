import paymentApi from './payment.api';
import type { PaymentRequest, PaymentResponse } from '../types';

export const paymentService = {
  processPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    return await paymentApi.post<PaymentResponse>('/api/v1/payments', data);
  },
};

