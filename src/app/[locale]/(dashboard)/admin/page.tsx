'use client';

import { useQuery } from '@tanstack/react-query';
import { Link } from '@/i18n/navigation';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { AdminArtistService } from '@/services/admin/artist.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart3, Palette, Building2, Users, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => AdministrationService.getGlobalStats(),
    });

    const { data: pendingArtists, isLoading: pendingLoading } = useQuery({
        queryKey: ['admin', 'artists', 'pending'],
        queryFn: () => AdminArtistService.getPendingArtists(),
    });

    const pendingCount = pendingArtists?.length ?? 0;

    const cards = [
        {
            title: 'Artistes en attente',
            value: pendingCount,
            icon: Palette,
            href: '/admin/artists',
            color: 'text-accent',
        },
        {
            title: 'Organisations',
            value: stats?.totalTenants ?? stats?.tenants ?? '—',
            icon: Building2,
            href: '/admin/tenants',
            color: 'text-emerald-600',
        },
        {
            title: 'Utilisateurs',
            value: stats?.totalUsers ?? stats?.users ?? '—',
            icon: Users,
            href: '/admin/users',
            color: 'text-blue-600',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Tableau de bord</h1>
                <p className="text-foreground/50 text-sm">Vue d&apos;ensemble de la plateforme YowPainter.</p>
            </div>

            {pendingCount > 0 && (
                <div className="mb-6 p-5 rounded-2xl border border-accent/30 bg-accent/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-sm font-semibold">
                        {pendingCount} artiste(s) en attente d&apos;approbation
                    </p>
                    <Link
                        href="/admin/artists"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-accent/90"
                    >
                        Gérer <ArrowRight size={14} />
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                                    {card.title}
                                </span>
                                <Icon size={20} className={card.color} />
                            </div>
                            {statsLoading || pendingLoading ? (
                                <Skeleton className="h-10 w-16" />
                            ) : (
                                <p className={`font-serif text-4xl font-bold ${card.color}`}>
                                    {String(card.value)}
                                </p>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-foreground/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-foreground/10 flex items-center gap-2">
                    <BarChart3 size={18} className="text-accent" />
                    <h2 className="font-semibold text-sm">Statistiques détaillées</h2>
                </div>
                <div className="p-6">
                    {statsLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-20 rounded-xl" />
                            ))}
                        </div>
                    ) : stats && Object.keys(stats).length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(stats).map(([key, value]) => (
                                <div key={key} className="p-4 rounded-xl bg-foreground/5">
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">{key}</p>
                                    <p className="font-serif text-2xl text-accent">{String(value)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-foreground/50 italic text-sm">Aucune statistique disponible.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
