'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { Skeleton } from '@/components/ui/Skeleton';
import { UserCircle } from 'lucide-react';

export default function AdminProfilePage() {
    const { user } = useAuthStore();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['admin', 'me'],
        queryFn: () => AdministrationService.getMe1(),
    });

    const entries = profile
        ? Object.entries(profile)
        : user
          ? Object.entries({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                organizationId: user.organizationId,
            }).filter(([, v]) => v != null)
          : [];

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold mb-1">Mon profil admin</h1>
                <p className="text-foreground/50 text-sm">GET /api/admin/me</p>
            </div>

            <div className="rounded-2xl border border-foreground/10 overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center border-b border-foreground/10 bg-foreground/[0.02]">
                    <div className="w-20 h-20 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                        <UserCircle size={40} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">
                        {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-foreground/50 text-sm">{user?.email}</p>
                    <span className="mt-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
                        {user?.role ?? 'ROLE_ADMIN'}
                    </span>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <dl className="space-y-3">
                            {entries.map(([key, value]) => (
                                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-4 rounded-xl bg-foreground/5">
                                    <dt className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 sm:w-40 shrink-0">
                                        {key}
                                    </dt>
                                    <dd className="text-sm font-medium break-all">{String(value)}</dd>
                                </div>
                            ))}
                            {entries.length === 0 && (
                                <p className="text-foreground/50 italic text-sm">Profil non disponible.</p>
                            )}
                        </dl>
                    )}
                </div>
            </div>
        </div>
    );
}
