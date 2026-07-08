import type { ActuCreateRequest } from '../models/ActuCreateRequest';
import type { ActuResponse } from '../models/ActuResponse';
import type { LandingActuItem } from '../models/LandingActuItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { ArtistsService } from './ArtistsService';

export class ActuService {
    /**
     * Lister les actualités de l'artiste connecté (Dashboard)
     */
    public static getMyActu(): CancelablePromise<Array<ActuResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/news/me',
        });
    }

    /**
     * Créer une actualité (Artiste)
     */
    public static createActu(
        requestBody: ActuCreateRequest,
    ): CancelablePromise<ActuResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/news',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Modifier une actualité (Artiste propriétaire)
     */
    public static updateActu(
        id: string,
        requestBody: ActuCreateRequest,
    ): CancelablePromise<ActuResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/news/{id}',
            path: { id },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Supprimer une actualité (Artiste propriétaire)
     */
    public static deleteActu(id: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/news/{id}',
            path: { id },
        });
    }

    /**
     * Lister les actualités d'un artiste par slug (public)
     */
    public static getActuByArtistSlug(
        artistSlug: string,
    ): CancelablePromise<Array<ActuResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/news',
            path: {
                artistSlug,
            },
        });
    }

    /**
     * Récupérer les dernières actualités publiques (tous artistes confondus)
     */
    public static async getLatestPublicActu(limit = 10): Promise<Array<LandingActuItem>> {
        const artists = await ArtistsService.searchArtists('');
        const artistsWithSlug = artists.filter((artist) => artist.slug).slice(0, 20);

        const batches = await Promise.all(
            artistsWithSlug.map(async (artist) => {
                try {
                    const news = await ActuService.getActuByArtistSlug(artist.slug!);
                    const artistName =
                        artist.artistName ||
                        `${artist.firstName ?? ''} ${artist.lastName ?? ''}`.trim();

                    return news.map((item) => ({
                        ...item,
                        artistSlug: artist.slug,
                        artistName,
                    }));
                } catch {
                    return [];
                }
            }),
        );

        const sorted = batches
            .flat()
            .sort(
                (a, b) =>
                    new Date(b.publishedAt || b.createdAt || 0).getTime() -
                    new Date(a.publishedAt || a.createdAt || 0).getTime(),
            );

        return limit != null ? sorted.slice(0, limit) : sorted;
    }
}
