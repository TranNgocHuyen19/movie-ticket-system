import { createService } from './base.api';

const bookingApi = createService(import.meta.env.VITE_BOOKING_SERVICE_URL);

export default bookingApi;
