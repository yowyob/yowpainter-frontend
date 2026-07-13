'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/lib/toast';

export default function AdminTenantsPage() {
    const t = useTranslations('AdminDashboard');
    const queryClient = useQueryClient();

    const { data: tenants, isLoading } = useQuery({
        queryKey: ['admin', 'tenants'],
        queryFn: () => AdministrationService.getAllTenants(),
    });

    const handleStatus = async (id: string, status: string) => {
        try {
            await AdministrationService.updateTenantStatus(id, status);
            toast.success(t('statusUpdated'));
            queryClient.invalidateQueries({ queryKey: ['admin', 'tenants'] });
        } catch (err) {
            toast.error(err, t('statusError'));
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold mb-1">{t('tabTenants')}</h1>
                <p className="text-foreground/50 text-sm">
                    GET /api/admin/tenants — PATCH /api/admin/tenants/{'{id}'}/status
                </p>
            </div>

            <div className="rounded-2xl border border-foreground/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-8"><Skeleton className="h-40 w-full" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-foreground/5 text-left">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colId')}</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colName')}</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colStatus')}</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(tenants || []).map((tenant) => {
                                    const id = String(tenant.id ?? tenant.organizationId ?? '');
                                    const name = String(tenant.name ?? tenant.displayName ?? tenant.slug ?? id);
                                    const status = String(tenant.status ?? 'ACTIVE');
                                    return (
                                        <tr key={id} className="border-t border-foreground/5">
                                            <td className="px-4 py-3 font-mono text-xs">{id}</td>
                                            <td className="px-4 py-3">{name}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded-full bg-foreground/5 text-xs">{status}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => void handleStatus(id, 'ACTIVE')}
                                                        className="text-xs text-emerald-600 font-bold hover:underline"
                                                    >
                                                        {t('activate')}
                                                    </button>
                                                    <button
                                                        onClick={() => void handleStatus(id, 'SUSPENDED')}
                                                        className="text-xs text-rose-600 font-bold hover:underline"
                                                    >
                                                        {t('suspend')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {(!tenants || tenants.length === 0) && (
                            <p className="p-8 text-center text-foreground/50 italic">{t('noTenants')}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
