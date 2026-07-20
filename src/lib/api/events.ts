// lib/api/events.ts
import { EventsService } from '../services/EventsService';
import { ArtistsService } from '../services/ArtistsService';
import type { EventResponse } from '../models/EventResponse';
import type { Event, TicketReservation } from '@/lib/types/event';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

/**
 * Mapper pour convertir EventResponse (Backend) vers Event (Frontend)
 */
async function mapEventResponseToEvent(res: EventResponse): Promise<Event> {
    let artistName = 'Artiste YP';
    let artistSlug = 'artiste';

    if (res.artistId) {
        try {
            const artist = await ArtistsService.getArtistById(res.artistId);
            artistName = artist.artistName || `${artist.firstName} ${artist.lastName}` || 'Artiste YP';
            artistSlug = artist.slug || 'artiste';
        } catch (e) {
            console.warn(`Impossible de récupérer l'artiste ${res.artistId}`, e);
        }
    }

    return {
        id: res.id || '',
        title: res.name || 'Sans titre',
        description: res.description || '',
        startDate: res.startDateTime || new Date().toISOString(),
        endDate: res.endDateTime || new Date().toISOString(),
        location: res.location || 'Lieu non spécifié',
        latitude: res.latitude ?? null,
        longitude: res.longitude ?? null,
        locationType: (res.location?.toLowerCase().includes('zoom') || res.location?.toLowerCase().includes('ligne')) ? 'VIRTUAL' : 'PHYSICAL',
        posterUrl: res.posterUrl || 'https://images.unsplash.com/photo-1579710838505-4cfa69f0bd2c?w=800&q=80',
        eventType: (res.ticketPrice && res.ticketPrice > 0) ? 'PAID' : 'FREE',
        status: (res.status as Event['status']) || 'PUBLISHED',
        maxAttendees: res.maxCapacity || null,
        currentAttendees: res.reservedCount || 0,
        price: res.ticketPrice || null,
        artistId: res.artistId || '',
        artistName: artistName,
        artistSlug: artistSlug,
        isRegistered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export async function getPublicEvents(filters?: {
    eventType?: string;
    upcoming?: boolean;
    search?: string;
    artistId?: string;
}): Promise<Event[]> {
    let responses: EventResponse[] = [];

    if (filters?.artistId) {
        responses = await EventsService.getEventsByArtist(filters.artistId);
    } else if (filters?.search) {
        responses = await EventsService.searchEvents(filters.search);
    } else {
        responses = await EventsService.getUpcomingEvents();
    }

    if (filters?.eventType) {
        responses = responses.filter(r => {
            const type = (r.ticketPrice && r.ticketPrice > 0) ? 'PAID' : 'FREE';
            return type === filters.eventType;
        });
    }

    return Promise.all(responses.map(mapEventResponseToEvent));
}

export async function getEventById(id: string): Promise<Event> {
    const res = await EventsService.getEvent(id);
    return mapEventResponseToEvent(res);
}

export async function reserveTicket(eventId: string, data: {
    userName: string;
    userEmail: string;
    phoneNumber?: string;
    artistSlug?: string;
}): Promise<any> {
    const reservation = await EventsService.reserveEvent(eventId);
    if (!reservation.id) throw new Error('Erreur lors de la réservation');

    if (data.phoneNumber) {
        try {
            const digitsOnly = data.phoneNumber.replace(/\D/g, '');
            const formattedPhone = digitsOnly.length === 9 ? `237${digitsOnly}` : digitsOnly;

            const checkoutData = await EventsService.checkoutReservation(reservation.id, formattedPhone);
            return {
                ...reservation,
                checkout: checkoutData,
            };
        } catch (error: unknown) {
            console.error('Erreur lors du checkout:', error);
            const message = error instanceof Error ? error.message : 'Erreur lors de l\'initialisation du paiement';
            throw new Error(message);
        }
    }

    return reservation;
}

export async function getMyTickets(eventId?: string): Promise<TicketReservation[]> {
    if (typeof window === 'undefined') return [];

    try {
        // Tenter de récupérer les réservations sécurisées depuis le backend
        const responses = await __request(OpenAPI, {
            method: 'GET',
            url: '/api/events/reservations/me',
        }) as any[];

        if (Array.isArray(responses)) {
            const mappedTickets: TicketReservation[] = responses.map((r: any) => ({
                id: r.id,
                eventId: r.eventId,
                eventTitle: r.eventName || 'Événement',
                userName: r.userName || 'Visiteur',
                userEmail: r.userEmail || '',
                qrCodeData: r.qrCodeData || r.id,
                isScanned: r.status === 'CONFIRMED' ? false : true,
                purchasedAt: r.createdAt || new Date().toISOString(),
                price: r.ticketPrice || 0,
                eventLocation: r.eventLocation || '',
            }));

            if (eventId) {
                return mappedTickets.filter(t => t.eventId === eventId);
            }
            return mappedTickets;
        }
    } catch (err) {
        console.warn('Impossible de récupérer les tickets depuis le backend, repli sur localStorage:', err);
    }

    // Repli (Fallback) sur localStorage si non connecté ou erreur réseau
    const tickets: TicketReservation[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('ticket_')) {
            try {
                const ticket = JSON.parse(localStorage.getItem(key) || '');
                if (!eventId || ticket.eventId === eventId || ticket.event?.id === eventId) {
                    tickets.push({
                        id: ticket.id,
                        eventId: ticket.eventId || ticket.event?.id,
                        eventTitle: ticket.eventTitle || ticket.event?.name || 'Événement',
                        userName: ticket.userName || 'Invité',
                        userEmail: ticket.userEmail || '',
                        qrCodeData: ticket.qrCodeData || ticket.id,
                        isScanned: ticket.isScanned || false,
                        purchasedAt: ticket.purchasedAt || ticket.createdAt || new Date().toISOString(),
                        price: ticket.price || 0,
                        eventLocation: ticket.eventLocation || '',
                    });
                }
            } catch (e) {
                console.error('Erreur parsing ticket local', e);
            }
        }
    }

    return tickets.sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
}

export async function validateTicket(qrCodeData: string): Promise<{ valid: boolean; message: string }> {
    const res = await EventsService.validateTicket(qrCodeData);
    return {
        valid: !!res.id,
        message: res.id ? 'Billet valide !' : 'Billet invalide.',
    };
}
