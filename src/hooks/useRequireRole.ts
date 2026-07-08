'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { getDashboardRoute, useAuthStore } from '@/store/authStore';

export function useRequireRole(allowedRole: string, redirectTo = '/login') {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace(redirectTo);
            return;
        }

        if (user?.role !== allowedRole) {
            router.replace(getDashboardRoute(user?.role));
        }
    }, [isAuthenticated, user?.role, allowedRole, redirectTo, router]);

    return {
        user,
        isReady: isAuthenticated && user?.role === allowedRole,
    };
}
