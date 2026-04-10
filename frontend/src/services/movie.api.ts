import { createService } from './base.api';

const movieApi = createService(import.meta.env.VITE_MOVIE_SERVICE_URL);

export default movieApi;
