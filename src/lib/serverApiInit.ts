import { OpenAPI } from './core/OpenAPI';
import { API_BASE_URL } from './apiConfig';

/** Configure OpenAPI pour les Server Components (SSR). */
export function configureServerApi() {
    OpenAPI.BASE = API_BASE_URL;
}
