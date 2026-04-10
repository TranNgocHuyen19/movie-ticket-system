import { createService } from './base.api';

const paymentApi = createService(import.meta.env.VITE_PAYMENT_SERVICE_URL);

export default paymentApi;
