'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';

/** Redirige l'ancienne route /admindashboard vers /admin */
export default function LegacyAdminDashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="animate-spin text-accent" size={32} />
        </div>
    );
}
