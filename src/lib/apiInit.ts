"use client";

import { OpenAPI } from './core/OpenAPI';
import { API_BASE_URL } from './apiConfig';

/**
 * Initialise le client API.
 * On évite d'importer useAuthStore ici pour ne pas créer de cycles de dépendances
 * ou de problèmes de chunks SSR avec Turbopack.
 */
/** Simple JWT decoder to check expiration */
function isTokenExpired(token: string): boolean {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return true;

        const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
        const exp = payload.exp;

        if (!exp) return false; // If no exp, assume it's valid

        // Expired if current time + 30s margin is greater than expiration time
        const currentTime = Math.floor(Date.now() / 1000);
        return (currentTime + 30) >= exp;
    } catch (e) {
        console.error('Error decoding token:', e);
        return true; // Assume expired if decoding fails
    }
}

export function initializeApi() {
    if (typeof window === 'undefined') return;

    OpenAPI.BASE = API_BASE_URL;

    // Injection dynamique du token (sécurisée pour le SSR)
    OpenAPI.TOKEN = async (options?: any) => {
        if (typeof window !== 'undefined') {
            try {
                const storage = localStorage.getItem('yowpainter-auth');
                if (storage) {
                    const parsed = JSON.parse(storage);
                    let token = parsed.state?.token || '';

                    // Ne pas rafraîchir le token si on appelle des endpoints d'authentification
                    const url = options?.url || '';
                    const isAuthEndpoint = url.includes('/api/auth/') || url.includes('/api/admin/auth/');

                    // Si le token est expiré, on tente de le rafraîchir
                    if (token && isTokenExpired(token) && !isAuthEndpoint) {
                        try {
                            // Import dynamique pour éviter les cycles de dépendances
                            const { useAuthStore } = await import('@/store/authStore');
                            const refreshedToken = await useAuthStore.getState().refreshAccessToken();
                            if (refreshedToken) {
                                token = refreshedToken;
                            }
                        } catch (refreshError) {
                            console.error('API Init: Failed to auto-refresh token', refreshError);
                        }
                    }
                    
                    return token;
                }
            } catch (e) {
                console.warn('Failed to parse auth storage', e);
            }
        }
        return '';
    };

    // Contexte organisation kernel (commerce, fichiers, notifications)
    OpenAPI.HEADERS = async (): Promise<Record<string, string>> => {
        if (typeof window === 'undefined') return {};

        try {
            const storage = localStorage.getItem('yowpainter-auth');
            if (!storage) return {};

            const parsed = JSON.parse(storage);
            const orgId = parsed.state?.user?.organizationId;
            if (orgId) return { 'X-Organization-Id': orgId };
        } catch (e) {
            console.warn('Failed to parse auth storage for org header', e);
        }

        return {};
    };
}
