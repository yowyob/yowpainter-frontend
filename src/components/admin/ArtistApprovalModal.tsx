'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { PendingArtist } from '@/types/admin';
import { useApproveArtist } from '@/hooks/admin/useApproveArtist';
import { useConfirmMfa } from '@/hooks/admin/useConfirmMfa';
import { getApiErrorMessage } from '@/lib/api-error-handler';
import { toast } from '@/lib/toast';

type Step = 'confirm' | 'approving' | 'mfa' | 'success' | 'error';

interface ArtistApprovalModalProps {
    artist: PendingArtist | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ArtistApprovalModal({
    artist,
    open,
    onClose,
    onSuccess,
}: ArtistApprovalModalProps) {
    const approveMutation = useApproveArtist();
    const confirmMfaMutation = useConfirmMfa();

    const [step, setStep] = useState<Step>('confirm');
    const [error, setError] = useState<string | null>(null);
    const [bootstrapMfaCode, setBootstrapMfaCode] = useState('');
    const [kernelActorId, setKernelActorId] = useState('');
    const [mfaCode, setMfaCode] = useState('');

    useEffect(() => {
        if (open && artist) {
            setStep('confirm');
            setError(null);
            setBootstrapMfaCode('');
            setKernelActorId(artist.kernelActorId ?? '');
            setMfaCode('');
        }
    }, [open, artist]);

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [open]);

    if (!open || !artist) return null;

    const handleApprove = async () => {
        setStep('approving');
        setError(null);

        try {
            const request: { bootstrapMfaCode?: string; kernelActorId?: string } = {};
            if (bootstrapMfaCode.trim()) request.bootstrapMfaCode = bootstrapMfaCode.trim();
            if (kernelActorId.trim()) request.kernelActorId = kernelActorId.trim();

            const res = await approveMutation.mutateAsync({
                artistId: artist.id,
                request: Object.keys(request).length > 0 ? request : undefined,
            });

            if (res.status === 'MFA_REQUIRED') {
                setStep('mfa');
            } else if (res.status === 'ACTIVE') {
                setStep('success');
                toast.success('Artiste approuvé avec succès');
            } else {
                setStep('error');
                setError(res.message || 'Réponse inattendue du serveur.');
            }
        } catch (err) {
            setStep('error');
            setError(getApiErrorMessage(err));
        }
    };

    const handleMfaSubmit = async () => {
        if (mfaCode.length !== 6) {
            setError('Le code MFA doit comporter 6 chiffres.');
            return;
        }

        setError(null);
        try {
            const res = await confirmMfaMutation.mutateAsync({
                artistId: artist.id,
                request: { mfaCode },
            });

            if (res.status === 'ACTIVE') {
                setStep('success');
                toast.success('Artiste approuvé avec succès');
            } else if (res.status === 'MFA_REQUIRED') {
                setStep('mfa');
                setError('Code incorrect ou expiré. Réessayez.');
            } else {
                setStep('error');
                setError(res.message || 'Échec de la confirmation MFA.');
            }
        } catch (err) {
            setError(getApiErrorMessage(err));
        }
    };

    const handleFinish = () => {
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background w-full max-w-lg rounded-2xl shadow-2xl border border-foreground/10 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-foreground/10">
                    <h2 className="font-serif text-xl font-bold">
                        {step === 'confirm' && 'Approuver l\'artiste'}
                        {step === 'approving' && 'Provisioning en cours…'}
                        {step === 'mfa' && 'Validation MFA'}
                        {step === 'success' && 'Approbation réussie'}
                        {step === 'error' && 'Erreur'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-foreground/30 hover:text-foreground">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {step === 'confirm' && (
                        <>
                            <p className="text-sm text-foreground/70">
                                Valider le compte de{' '}
                                <strong>{artist.firstName} {artist.lastName}</strong>{' '}
                                ({artist.artistName}) — {artist.email}
                            </p>

                            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-sm">
                                <div className="flex items-start gap-2">
                                    <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
                                    <p className="text-foreground/70">
                                        Cette action crée l&apos;organisation Kernel, le tenant PostgreSQL et active l&apos;accès artiste.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                                        Code MFA bootstrap (optionnel)
                                    </label>
                                    <input
                                        value={bootstrapMfaCode}
                                        onChange={(e) => setBootstrapMfaCode(e.target.value)}
                                        placeholder="123456"
                                        maxLength={6}
                                        className="mt-1 w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                                        Kernel Actor ID (optionnel)
                                    </label>
                                    <input
                                        value={kernelActorId}
                                        onChange={(e) => setKernelActorId(e.target.value)}
                                        placeholder="99dd041f-ae4d-4668-93c8-0917f8e12927"
                                        className="mt-1 w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-accent"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 'approving' && (
                        <div className="flex flex-col items-center py-8 gap-3">
                            <Loader2 className="animate-spin text-accent" size={32} />
                            <p className="text-sm text-foreground/50">Communication avec le Kernel…</p>
                        </div>
                    )}

                    {step === 'mfa' && (
                        <>
                            <p className="text-sm text-foreground/70">
                                Le Kernel requiert un code MFA. Saisissez le code reçu par e-mail.
                            </p>
                            <input
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                maxLength={6}
                                autoFocus
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-accent"
                            />
                        </>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center py-6 gap-3">
                            <CheckCircle2 size={48} className="text-accent" />
                            <p className="font-semibold">L&apos;artiste est maintenant actif.</p>
                        </div>
                    )}

                    {step === 'error' && error && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                            <AlertTriangle size={20} className="text-rose-500 shrink-0" />
                            <p className="text-sm text-rose-600">{error}</p>
                        </div>
                    )}

                    {step === 'mfa' && error && (
                        <p className="text-xs text-rose-500">{error}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-foreground/10">
                    {step === 'confirm' && (
                        <>
                            <button onClick={onClose} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/50 hover:bg-foreground/5">
                                Annuler
                            </button>
                            <button
                                onClick={() => void handleApprove()}
                                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent text-white hover:bg-accent/90"
                            >
                                Confirmer
                            </button>
                        </>
                    )}

                    {step === 'mfa' && (
                        <>
                            <button onClick={onClose} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/50 hover:bg-foreground/5">
                                Annuler
                            </button>
                            <button
                                onClick={() => void handleMfaSubmit()}
                                disabled={confirmMfaMutation.isPending}
                                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent text-white hover:bg-accent/90 disabled:opacity-50 flex items-center gap-2"
                            >
                                {confirmMfaMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                                Valider MFA
                            </button>
                        </>
                    )}

                    {step === 'error' && (
                        <>
                            <button onClick={onClose} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/50 hover:bg-foreground/5">
                                Fermer
                            </button>
                            <button
                                onClick={() => { setStep('confirm'); setError(null); }}
                                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent text-white hover:bg-accent/90"
                            >
                                Réessayer
                            </button>
                        </>
                    )}

                    {step === 'success' && (
                        <button
                            onClick={handleFinish}
                            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent text-white hover:bg-accent/90"
                        >
                            Terminer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
