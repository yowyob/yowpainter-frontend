// components/events/TicketReservation.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { reserveTicket } from '@/lib/api/events';
import { PaymentsService } from '@/lib/services/PaymentsService';
import type { Event } from '@/lib/types/event';

interface TicketReservationProps {
    event: Event;
    artistSlug?: string;
    onSuccess?: () => void;
}

export function TicketReservation({ event, artistSlug, onSuccess }: TicketReservationProps) {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(user?.email || '');
    const [name, setName] = useState(user ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.artistName || user.firstName || user.email?.split('@')[0] || '')) : '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const isSoldOut = event.status === 'FULL' || (event.maxAttendees
        ? event.currentAttendees >= event.maxAttendees
        : false);

    /**
     * Interroge le backend (qui rafraîchit auprès du Kernel) jusqu'à ce que le
     * paiement soit confirmé, puis redirige vers le billet. Le paiement lui-même
     * se déroule dans la fenêtre `paymentWindow` (page hébergée MyCoolPay).
     */
    const pollPaymentStatus = (reservationId: string, paymentWindow: Window | null) => {
        setPaymentProcessing(true);
        let attempts = 0;
        const maxAttempts = 100; // ~5 min à 3 s

        const timer = setInterval(async () => {
            attempts += 1;

            // Le payeur a fermé la fenêtre sans finir : on arrête d'attendre.
            if (paymentWindow && paymentWindow.closed && attempts > 2) {
                clearInterval(timer);
                setPaymentProcessing(false);
                setLoading(false);
                setError("Fenêtre de paiement fermée. Si vous avez déjà payé, votre billet sera validé sous peu.");
                return;
            }

            try {
                const res = await PaymentsService.getPaymentStatus(reservationId);
                if (res.status === 'SUCCEEDED') {
                    clearInterval(timer);
                    try { paymentWindow?.close(); } catch { /* ignore */ }
                    if (onSuccess) onSuccess();
                    router.push(`/tickets/${reservationId}`);
                    return;
                }
                if (res.status === 'FAILED') {
                    clearInterval(timer);
                    try { paymentWindow?.close(); } catch { /* ignore */ }
                    setPaymentProcessing(false);
                    setLoading(false);
                    setError("Le paiement a échoué ou a été annulé. Aucun montant n'a été débité.");
                    return;
                }
            } catch {
                // Erreur réseau ponctuelle : on continue de poller.
            }

            if (attempts >= maxAttempts) {
                clearInterval(timer);
                setPaymentProcessing(false);
                setLoading(false);
                setError("Délai de confirmation dépassé. Si vous avez payé, votre billet sera validé sous peu (consultez « Mes billets »).");
            }
        }, 3000);
    };

    const handleReservation = async () => {
        if (!name || !email || (event.eventType === 'PAID' && !phoneNumber)) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Pour un événement payant, on ouvre la fenêtre de paiement SYNCHRONEMENT
        // (dans le handler du clic) afin d'éviter le blocage des popups : les
        // navigateurs bloquent window.open appelé après un await.
        let paymentWindow: Window | null = null;
        if (event.eventType === 'PAID') {
            paymentWindow = window.open('', 'yowpainter_payment', 'width=480,height=760');
        }

        setLoading(true);
        if (event.eventType === 'PAID') setPaymentProcessing(true);
        setError('');

        try {
            const reservation = await reserveTicket(event.id, {
                userName: name,
                userEmail: email,
                phoneNumber: phoneNumber || undefined,
                artistSlug: artistSlug,
            });

            // Sauvegarder le billet enrichi avec les infos saisies (car le backend ne renvoie pas tjs l'email/nom dans la réponse initiale)
            const enrichedTicket = {
                ...reservation,
                userName: name,
                userEmail: email,
                eventTitle: event.title,
                purchasedAt: new Date().toISOString()
            };
            localStorage.setItem(`ticket_${reservation.id}`, JSON.stringify(enrichedTicket));

            // Événement payant : le paiement Mobile Money se finalise sur la page
            // hébergée du PSP. Le backend renvoie une redirectUrl (MyCoolPay) qu'il
            // faut charger dans la fenêtre de paiement, puis on POLL le statut pour
            // rediriger vers le billet dès que le Kernel confirme l'encaissement
            // (c'est aussi ce qui crédite le portefeuille de l'artiste).
            if (event.eventType === 'PAID') {
                const redirectUrl = (reservation as { checkout?: { redirectUrl?: string } })?.checkout?.redirectUrl;
                if (redirectUrl) {
                    if (paymentWindow) {
                        paymentWindow.location.href = redirectUrl;
                    } else {
                        // Popup bloqué : repli sur la fenêtre courante. Au retour,
                        // la page /payment/return vérifiera le statut.
                        window.location.href = redirectUrl;
                        return;
                    }
                    pollPaymentStatus(reservation.id, paymentWindow);
                    return;
                }
                // Pas de redirectUrl → le PSP a refusé d'initier l'encaissement
                // (montant trop bas ou numéro Mobile Money invalide).
                try { paymentWindow?.close(); } catch { /* ignore */ }
                setError("Le paiement n'a pas pu être initié. Vérifiez votre numéro Mobile Money (MTN/Orange) et un montant d'au moins 100 FCFA.");
                setLoading(false);
                setPaymentProcessing(false);
                return;
            }

            if (onSuccess) onSuccess();

            // Événement gratuit → billet immédiat.
            router.push(`/tickets/${reservation.id}`);
            setLoading(false);

        } catch (err: any) {
            try { paymentWindow?.close(); } catch { /* ignore */ }
            setError(err.message || 'Erreur lors de la réservation');
            setLoading(false);
            setPaymentProcessing(false);
        }
    };

    if (isSoldOut) {
        return (
            <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] p-8 text-center backdrop-blur-sm">
                <p className="text-red-600 font-serif text-xl italic mb-1">Épuisé</p>
                <p className="text-red-500/60 text-xs uppercase tracking-widest font-bold">Toutes les places ont été réservées</p>
            </div>
        );
    }

    if (!user) {
        const redirectPath = artistSlug ? `/${artistSlug}/events/${event.id}` : `/events/${event.id}`;
        return (
            <div className="space-y-6">
                <button
                    onClick={() => window.location.href = `/login?redirect=${redirectPath}`}
                    className="w-full py-5 bg-accent text-white rounded-[2rem] font-bold text-sm uppercase tracking-[0.3em] hover:bg-accent/90 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(var(--accent-rgb),0.3)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                >
                    Réserver mon billet
                </button>
                <p className="text-[10px] text-foreground/40 text-center uppercase tracking-widest font-medium">
                    Connexion requise pour réserver
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white dark:border-white/10 shadow-inner">
            <h3 className="font-serif text-2xl font-light mb-8 uppercase tracking-tight text-foreground/80">
                {event.eventType === 'FREE' ? 'Réservation' : 'Billetterie'}
            </h3>

            {event.eventType === 'PAID' && (
                <div className="mb-8 p-6 bg-accent/10 rounded-[2rem] border border-accent/20">
                    <p className="text-4xl font-black text-accent tracking-tighter">
                        {event.price?.toLocaleString()} <span className="text-sm font-normal opacity-60">CFA</span>
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-accent/60 mt-1 font-bold">Tarif unique</p>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 ml-4">VOTRE NOM</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading || paymentProcessing}
                        className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-foreground/5 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
                        placeholder="Ex: Jean Dupont"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 ml-4">VOTRE EMAIL</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading || paymentProcessing}
                        className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-foreground/5 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
                        placeholder="jean@exemple.com"
                    />
                </div>

                {event.eventType === 'PAID' && (
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 ml-4">NUMÉRO MOBILE MONEY</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={loading || paymentProcessing}
                            className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-foreground/5 dark:border-white/10 rounded-2xl focus:outline-none focus:border-accent/40 focus:bg-white dark:focus:bg-white/10 transition-all text-sm font-medium disabled:opacity-50"
                            placeholder="6xx xxx xxx"
                        />
                        <p className="text-[9px] text-foreground/40 mt-2 ml-4 italic">Un prompt de validation apparaîtra sur votre téléphone</p>
                    </div>
                )}

                {error && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-100 dark:border-red-900/20">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleReservation}
                    disabled={loading || paymentProcessing}
                    className="relative w-full py-5 bg-foreground text-background rounded-3xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all duration-500 shadow-xl disabled:opacity-30 disabled:pointer-events-none mt-4 overflow-hidden"
                >
                    {paymentProcessing ? (
                        <span className="flex items-center justify-center gap-3">
                            <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Validation USSD en cours...
                        </span>
                    ) : loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Traitement...
                        </span>
                    ) : (
                        event.eventType === 'FREE' ? 'Confirmer la réservation' : 'Payer et réserver'
                    )}
                </button>
            </div>

            {/* PAYMENT PROCESSING OVERLAY */}
            {paymentProcessing && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 rounded-[2.5rem]">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="font-serif text-xl italic text-foreground/80 mb-2">Sécurisation du paiement</p>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-black animate-pulse">Ne pas fermer cette fenêtre</p>
                </div>
            )}

            <p className="text-[10px] text-foreground/30 text-center mt-8 italic">
                Un billet sécurisé vous sera transmis instantanément
            </p>
        </div>
    );
}