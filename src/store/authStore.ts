import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '@/lib/models/AuthResponse';
import { AuthenticationService } from '@/lib/services/AuthenticationService';
import { AdminAuthenticationService } from '@/lib/services/AdminAuthenticationService';
import { ArtistsService } from '@/lib/services/ArtistsService';
import { BuyerProfileService } from '@/lib/services/BuyerProfileService';
import { LoginRequest } from '@/lib/models/LoginRequest';
import { RegisterRequest } from '@/lib/models/RegisterRequest';
import type { AdminRegisterRequest } from '@/lib/models/AdminRegisterRequest';

/** Returns the dashboard path based on the user role */
export function getDashboardRoute(role?: string): string {
    if (role === 'ROLE_ARTIST') return '/artdashboard';
    if (role === 'ROLE_ADMIN') return '/admin';
    return '/amadashboard';
}

export interface ExtendedAuthResponse extends AuthResponse {
    id?: string;
    slug?: string;
    bio?: string;
    profilePictureUrl?: string;
    canAccessDashboard?: boolean;
    pendingReason?: string;
    nextAction?: string;
    refreshAllowed?: boolean;
    kernelVerificationUrl?: string;
}

interface AuthState {
    user: ExtendedAuthResponse | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    register: (data: RegisterRequest) => Promise<AuthResponse>;
    adminLogin: (credentials: LoginRequest) => Promise<AuthResponse>;
    adminRegister: (data: AdminRegisterRequest) => Promise<AuthResponse>;
    refreshAccessToken: () => Promise<string | null>;
    refreshProfile: () => Promise<void>;
    setActiveOrganization: (organizationId: string) => void;
    setAuth: (response: AuthResponse) => void;
    logout: () => Promise<void>;
}

// Store the refresh promise to avoid multiple calls at once
let refreshPromise: Promise<string | null> | null = null;

function clearLegacyTenantStorage() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('currentTenantSlug');
    }
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,

            login: async (credentials) => {
                const response = await AuthenticationService.login(credentials);
                set({
                    user: response,
                    token: response.accessToken || null,
                    refreshToken: response.refreshToken || null,
                    isAuthenticated: !!response.accessToken,
                });
                clearLegacyTenantStorage();

                if (response.accessToken) {
                    try {
                        await get().refreshProfile();
                    } catch (e) {
                        console.warn('Could not refresh profile after login:', e);
                    }
                }
                return get().user as AuthResponse;
            },

            register: async (data) => {
                const response = await AuthenticationService.register(data);
                set({
                    user: response,
                    token: response.accessToken || null,
                    refreshToken: response.refreshToken || null,
                    isAuthenticated: !!response.accessToken,
                });
                clearLegacyTenantStorage();

                if (response.accessToken) {
                    try {
                        await get().refreshProfile();
                    } catch (e) {
                        console.warn('Could not refresh profile after registration:', e);
                    }
                }
                return response;
            },

            adminLogin: async (credentials) => {
                const response = await AdminAuthenticationService.login1(credentials);
                if (!response.accessToken) {
                    throw new Error(
                        response.message ||
                            'Connexion admin impossible : aucun jeton reçu du serveur.',
                    );
                }
                set({
                    user: response,
                    token: response.accessToken,
                    refreshToken: response.refreshToken || null,
                    isAuthenticated: true,
                });
                clearLegacyTenantStorage();
                return response;
            },

            adminRegister: async (data) => {
                const response = await AdminAuthenticationService.register1({
                    ...data,
                    imageURL: data.imageURL ?? '',
                });
                if (!response.accessToken) {
                    throw new Error(
                        response.message ||
                            'Inscription admin impossible : le serveur n\'a pas renvoyé de jeton d\'accès.',
                    );
                }
                set({
                    user: response,
                    token: response.accessToken,
                    refreshToken: response.refreshToken || null,
                    isAuthenticated: true,
                });
                clearLegacyTenantStorage();
                return response;
            },

            refreshAccessToken: async () => {
                if (refreshPromise) return refreshPromise;

                refreshPromise = (async () => {
                    const { refreshToken } = get();
                    if (!refreshToken) {
                        await get().logout();
                        return null;
                    }

                    try {
                        const response = await AuthenticationService.refresh(
                            refreshToken,
                            { refreshToken },
                        );
                        const newToken = response.accessToken || null;
                        const newRefreshToken = response.refreshToken || null;

                        set({
                            token: newToken,
                            refreshToken: newRefreshToken,
                            isAuthenticated: !!newToken,
                            user: {
                                ...get().user,
                                ...response,
                            },
                        });

                        return newToken;
                    } catch (error) {
                        console.error('Failed to refresh token:', error);
                        await get().logout();
                        return null;
                    } finally {
                        refreshPromise = null;
                    }
                })();

                return refreshPromise;
            },

            refreshProfile: async () => {
                const { user } = get();
                if (!user) return;

                if (user.role === 'ROLE_ADMIN') return;

                try {
                    if (user.role === 'ROLE_ARTIST') {
                        const profile = await ArtistsService.getMyProfile();
                        const status = profile.status || 'ORGANIZATION_VALIDATION_REQUIRED';
                        
                        let canAccessDashboard = true;
                        let pendingReason: string | undefined = undefined;
                        let nextAction: string | undefined = undefined;
                        let refreshAllowed = true;
                        let kernelVerificationUrl: string | undefined = undefined;

                        if (status === 'PENDING_EMAIL') {
                            canAccessDashboard = false;
                            pendingReason = 'EMAIL_NOT_VERIFIED';
                            nextAction = 'VERIFY_EMAIL';
                            refreshAllowed = true;
                            kernelVerificationUrl = 'https://kernel-core.yowyob.com';
                        } else if (status === 'EMAIL_VERIFIED') {
                            canAccessDashboard = false;
                            pendingReason = 'ORGANIZATION_NOT_CREATED';
                            nextAction = 'WAIT_ORGANIZATION_VALIDATION';
                            refreshAllowed = true;
                        } else if (status === 'ORGANIZATION_VALIDATION_REQUIRED' || status === 'PENDING_APPROVAL') {
                            canAccessDashboard = false;
                            pendingReason = 'ORGANIZATION_PENDING_VALIDATION';
                            nextAction = 'WAIT_ORGANIZATION_VALIDATION';
                            refreshAllowed = true;
                        } else if (status === 'ORGANIZATION_REJECTED' || status === 'REJECTED') {
                            canAccessDashboard = false;
                            pendingReason = 'ORGANIZATION_REJECTED';
                            nextAction = 'CONTACT_SUPPORT';
                            refreshAllowed = false;
                        } else if (status === 'ORGANIZATION_SUSPENDED' || status === 'SUSPENDED') {
                            canAccessDashboard = false;
                            pendingReason = 'ORGANIZATION_SUSPENDED';
                            nextAction = 'CONTACT_SUPPORT';
                            refreshAllowed = false;
                        }

                        set((state) => ({
                            user: {
                                ...state.user,
                                id: profile.id ?? state.user?.id,
                                firstName: profile.firstName ?? state.user?.firstName,
                                lastName: profile.lastName ?? state.user?.lastName,
                                profilePictureUrl: profile.profilePictureUrl ?? state.user?.profilePictureUrl,
                                artistName: profile.artistName ?? state.user?.artistName,
                                bio: profile.bio ?? state.user?.bio,
                                slug: profile.slug ?? state.user?.slug,
                                registrationStatus: status === 'PENDING_APPROVAL' ? 'ORGANIZATION_VALIDATION_REQUIRED' : status,
                                canAccessDashboard,
                                pendingReason,
                                nextAction,
                                refreshAllowed,
                                kernelVerificationUrl,
                            },
                        }));
                    } else {
                        const profile = await BuyerProfileService.getMe();
                        set((state) => ({
                            user: {
                                ...state.user,
                                id: profile.id ?? state.user?.id,
                                firstName: profile.firstName ?? state.user?.firstName,
                                lastName: profile.lastName ?? state.user?.lastName,
                                profilePictureUrl: profile.profilePictureUrl ?? state.user?.profilePictureUrl,
                                bio: profile.bio ?? state.user?.bio,
                            },
                        }));
                    }
                } catch (e) {
                    console.warn('refreshProfile failed:', e);
                }
            },

            setActiveOrganization: (organizationId) => {
                set((state) => ({
                    user: state.user
                        ? { ...state.user, organizationId }
                        : state.user,
                }));
            },

            setAuth: (response) => {
                set({
                    user: response,
                    token: response.accessToken || null,
                    refreshToken: response.refreshToken || null,
                    isAuthenticated: !!response.accessToken,
                });
            },

            logout: async () => {
                const { refreshToken } = get();

                if (refreshToken) {
                    try {
                        await AuthenticationService.logout({ refreshToken });
                    } catch (e) {
                        console.warn('Logout API call failed:', e);
                    }
                }

                clearLegacyTenantStorage();

                // Supprimer tous les cookies sauf NEXT_LOCALE pour garder la langue
                if (typeof document !== 'undefined') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf('=');
                        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
                        if (name && name !== 'NEXT_LOCALE') {
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                        }
                    }
                }

                // Vider le sessionStorage
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.clear();
                }

                const role = get().user?.role;

                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });

                // Rediriger physiquement pour forcer le nettoyage du cache React Query et des états en mémoire
                if (typeof window !== 'undefined') {
                    const loginPath = role === 'ROLE_ADMIN' ? '/admin/login' : '/login';
                    const pathSegments = window.location.pathname.split('/');
                    const potentialLocale = pathSegments[1];
                    const locales = ['fr', 'en', 'de'];
                    const currentLocale = locales.includes(potentialLocale) ? potentialLocale : 'fr';
                    
                    window.location.href = `/${currentLocale}${loginPath}`;
                }
            },
        }),
        {
            name: 'yowpainter-auth',
            onRehydrateStorage: () => () => {
                clearLegacyTenantStorage();
            },
        }
    )
);
