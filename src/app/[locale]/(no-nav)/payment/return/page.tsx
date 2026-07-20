'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { PaymentsService } from '@/lib/services/PaymentsService';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Page de retour après paiement (PSP MyCoolPay).
 *
 * Deux cas :
 *  - Fenêtre popup (le paiement s'est ouvert dans une nouvelle fenêtre) : la
 *    fenêtre principale fait déjà le polling du statut, donc ici on se contente
 *    de fermer la popup.
 *  - Même fenêtre (repli si le popup a été bloqué) : on interroge le backend
 *    jusqu'à confirmation puis on redirige vers le billet / la commande.
 */
export default function PaymentReturnPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        }>
            <PaymentReturnContent />
        </Suspense>
    );
}

function PaymentReturnContent() {
    const params = useSearchParams();
    const router = useRouter();
    const ref = params.get('ref') || '';
    const type = (params.get('type') || 'RESERVATION').toUpperCase();
    const [state, setState] = useState<'checking' | 'popup' | 'success' | 'failed' | 'timeout'>('checking');

    useEffect(() => {
        // Cas popup : la fenêtre principale poll déjà → on ferme celle-ci.
        if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
            setState('popup');
            const t = setTimeout(() => { try { window.close(); } catch { /* ignore */ } }, 1500);
            return () => clearTimeout(t);
        }

        if (!ref) { setState('failed'); return; }

        // Cas même fenêtre : on poll puis on redirige.
        let attempts = 0;
        const destination = type === 'ORDER' ? '/shop/purchases' : `/tickets/${ref}`;
        const timer = setInterval(async () => {
            attempts += 1;
            try {
                const res = await PaymentsService.getPaymentStatus(ref);
                if (res.status === 'SUCCEEDED') {
                    clearInterval(timer);
                    setState('success');
                    router.push(destination);
                    return;
                }
                if (res.status === 'FAILED') {
                    clearInterval(timer);
                    setState('failed');
                    return;
                }
            } catch { /* réseau : on continue */ }
            if (attempts >= 60) { clearInterval(timer); setState('timeout'); }
        }, 3000);
        return () => clearInterval(timer);
    }, [ref, type, router]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center gap-6">
            {state === 'checking' && (
                <>
                    <Loader2 className="animate-spin text-accent" size={48} />
                    <p className="font-serif text-2xl">Confirmation du paiement…</p>
                    <p className="text-foreground/50 text-sm max-w-md">Merci de patienter, nous vérifions votre paiement auprès de l&apos;opérateur.</p>
                </>
            )}
            {state === 'popup' && (
                <>
                    <CheckCircle2 className="text-green-500" size={48} />
                    <p className="font-serif text-2xl">Paiement traité</p>
                    <p className="text-foreground/50 text-sm max-w-md">Vous pouvez fermer cette fenêtre et revenir à l&apos;onglet précédent.</p>
                </>
            )}
            {state === 'success' && (
                <>
                    <CheckCircle2 className="text-green-500" size={48} />
                    <p className="font-serif text-2xl">Paiement confirmé</p>
                    <p className="text-foreground/50 text-sm">Redirection en cours…</p>
                </>
            )}
            {state === 'failed' && (
                <>
                    <XCircle className="text-red-500" size={48} />
                    <p className="font-serif text-2xl">Paiement non abouti</p>
                    <p className="text-foreground/50 text-sm max-w-md">Le paiement a échoué ou a été annulé. Aucun montant n&apos;a été débité.</p>
                    <button onClick={() => router.push('/events')} className="mt-2 px-8 py-3 rounded-full bg-accent text-white text-xs uppercase tracking-[0.3em] font-bold">Retour aux événements</button>
                </>
            )}
            {state === 'timeout' && (
                <>
                    <Loader2 className="text-foreground/40" size={48} />
                    <p className="font-serif text-2xl">Vérification plus longue que prévu</p>
                    <p className="text-foreground/50 text-sm max-w-md">Si vous avez payé, votre billet sera validé sous peu. Consultez « Mes billets ».</p>
                    <button onClick={() => router.push(`/tickets/${ref}`)} className="mt-2 px-8 py-3 rounded-full border border-foreground/15 text-xs uppercase tracking-[0.3em] font-bold">Voir mon billet</button>
                </>
            )}
        </div>
    );
}
