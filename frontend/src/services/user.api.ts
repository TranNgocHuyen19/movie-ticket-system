import { createService } from './base.api';

const userApi = createService(import.meta.env.VITE_USER_SERVICE_URL);

export default userApi;
