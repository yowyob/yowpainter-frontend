'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { Skeleton } from '@/components/ui/Skeleton';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from '@/lib/toast';
import { Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
    const t = useTranslations('AdminDashboard');
    const queryClient = useQueryClient();
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => AdministrationService.getAllUsers(),
    });

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await AdministrationService.deleteUser(deleteTarget.id);
            toast.success('Utilisateur supprimé');
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            setDeleteTarget(null);
        } catch (err) {
            toast.error(err, 'Suppression');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold mb-1">{t('tabUsers')}</h1>
                <p className="text-foreground/50 text-sm">
                    GET /api/admin/users — DELETE /api/admin/users/{'{id}'}
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
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colEmail')}</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colName')}</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colRole')}</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">ID</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">{t('colActions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(users || []).map((u, index) => {
                                    const id = String(u.id ?? index);
                                    const email = String(u.email ?? '—');
                                    return (
                                        <tr key={id} className="border-t border-foreground/5">
                                            <td className="px-4 py-3">{email}</td>
                                            <td className="px-4 py-3">
                                                {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 rounded-full bg-foreground/5 text-xs">
                                                    {String(u.role ?? '—')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-foreground/40">{id}</td>
                                            <td className="px-4 py-3">
                                                {u.id && (
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: String(u.id), email })}
                                                        className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold hover:underline"
                                                    >
                                                        <Trash2 size={14} />
                                                        Supprimer
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {(!users || users.length === 0) && (
                            <p className="p-8 text-center text-foreground/50 italic">{t('noUsers')}</p>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => void handleDelete()}
                title="Supprimer l'utilisateur"
                message={`Supprimer définitivement ${deleteTarget?.email} ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                variant="danger"
                isLoading={deleting}
            />
        </div>
    );
}
