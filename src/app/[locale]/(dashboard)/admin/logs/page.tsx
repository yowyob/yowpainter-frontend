'use client';

import { useQuery } from '@tanstack/react-query';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { Skeleton } from '@/components/ui/Skeleton';
import { ScrollText } from 'lucide-react';

export default function AdminLogsPage() {
    const { data: logs, isLoading, error } = useQuery({
        queryKey: ['admin', 'logs'],
        queryFn: () => AdministrationService.getAuditLogs(),
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold mb-1">Logs d&apos;audit</h1>
                <p className="text-foreground/50 text-sm">GET /api/admin/logs</p>
            </div>

            <div className="rounded-2xl border border-foreground/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-foreground/10 flex items-center gap-2">
                    <ScrollText size={18} className="text-accent" />
                    <span className="text-sm font-semibold">Journal d&apos;activité</span>
                </div>

                {isLoading ? (
                    <div className="p-8 space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                ) : error ? (
                    <p className="p-8 text-rose-500 text-sm">Impossible de charger les logs.</p>
                ) : (
                    <div className="p-6 font-mono text-xs space-y-2 max-h-[60vh] overflow-y-auto">
                        {(logs || []).map((entry, i) => (
                            <div key={i} className="px-3 py-2 rounded-lg bg-foreground/5 text-foreground/70">
                                {typeof entry === 'string' ? entry : JSON.stringify(entry)}
                            </div>
                        ))}
                        {(!logs || logs.length === 0) && (
                            <p className="text-foreground/50 italic">Aucun log disponible.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
