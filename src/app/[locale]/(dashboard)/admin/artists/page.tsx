'use client';

import { useState } from 'react';
import { usePendingArtists } from '@/hooks/admin/usePendingArtists';
import ArtistApprovalModal from '@/components/admin/ArtistApprovalModal';
import { Skeleton } from '@/components/ui/Skeleton';
import type { PendingArtist } from '@/types/admin';
import { RefreshCw, CheckCircle, Search } from 'lucide-react';

export default function AdminArtistsPage() {
    const { data: artists, isLoading, error, refetch, isFetching } = usePendingArtists();
    const [search, setSearch] = useState('');
    const [selectedArtist, setSelectedArtist] = useState<PendingArtist | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const filtered = (artists ?? []).filter((a) => {
        const q = search.toLowerCase();
        return [a.firstName, a.lastName, a.artistName, a.email, a.slug]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q));
    });

    const handleApprove = (artist: PendingArtist) => {
        setSelectedArtist(artist);
        setModalOpen(true);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-bold mb-1">Artistes en attente</h1>
                    <p className="text-foreground/50 text-sm">
                        GET /api/admin/artists/pending — Approuver via POST /approve
                    </p>
                </div>
                <button
                    onClick={() => void refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-foreground/20 rounded-full text-xs uppercase tracking-widest font-bold hover:border-accent transition-all"
                >
                    <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
                    Actualiser
                </button>
            </div>

            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par nom, email, slug…"
                    className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-sm outline-none focus:border-accent"
                />
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">
                    Impossible de charger les artistes en attente.
                </div>
            )}

            <div className="rounded-2xl border border-foreground/10 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-foreground/5 text-left">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">Artiste</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">Email</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">Slug</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">Statut</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">Inscription</th>
                                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((artist) => (
                                    <tr key={artist.id} className="border-t border-foreground/5 hover:bg-foreground/[0.02]">
                                        <td className="px-4 py-3">
                                            <p className="font-semibold">{artist.artistName || '—'}</p>
                                            <p className="text-xs text-foreground/40">{artist.firstName} {artist.lastName}</p>
                                        </td>
                                        <td className="px-4 py-3 text-foreground/60">{artist.email}</td>
                                        <td className="px-4 py-3 font-mono text-xs">@{artist.slug}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                                                {artist.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-foreground/50 text-xs">
                                            {artist.createdAt
                                                ? new Date(artist.createdAt).toLocaleDateString('fr-FR')
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleApprove(artist)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent/90"
                                            >
                                                <CheckCircle size={14} />
                                                Approuver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <p className="p-8 text-center text-foreground/50 italic">
                                Aucun artiste en attente.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <ArtistApprovalModal
                artist={selectedArtist}
                open={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedArtist(null); }}
                onSuccess={() => void refetch()}
            />
        </div>
    );
}
