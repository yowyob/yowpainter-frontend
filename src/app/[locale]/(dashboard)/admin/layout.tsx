'use client';

import { Loader2 } from 'lucide-react';
import { useRequireRole } from '@/hooks/useRequireRole';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isReady } = useRequireRole('ROLE_ADMIN', '/admin/login');

    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    return <AdminShell>{children}</AdminShell>;
}
