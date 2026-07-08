/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtworkCreateRequest } from '../models/ArtworkCreateRequest';
import type { ArtworkImageUploadResponse } from '../models/ArtworkImageUploadResponse';
import type { ArtworkVideoUploadResponse } from '../models/ArtworkVideoUploadResponse';
import type { ArtworkResponse } from '../models/ArtworkResponse';
import type { CommentRequest } from '../models/CommentRequest';
import type { CommentResponse } from '../models/CommentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ArtworksService {
    /**
     * Modifier une oeuvre (Artiste proprietaire)
     * @param id
     * @param requestBody
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static updateArtwork(
        id: string,
        requestBody: ArtworkCreateRequest,
    ): CancelablePromise<ArtworkResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/artworks/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Liker ou unliker une oeuvre dans une boutique spécifique
     * @param artistSlug
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static toggleLike(
        artistSlug: string,
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/public/{artistSlug}/artworks/{id}/like',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
        });
    }
    /**
     * Lister les commentaires d'une oeuvre spécifique
     * @param artistSlug
     * @param id
     * @returns CommentResponse OK
     * @throws ApiError
     */
    public static getComments(
        artistSlug: string,
        id: string,
    ): CancelablePromise<Array<CommentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks/{id}/comments',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
        });
    }
    /**
     * Ajouter un commentaire sur une oeuvre spécifique
     * @param artistSlug
     * @param id
     * @param requestBody
     * @returns CommentResponse OK
     * @throws ApiError
     */
    public static addComment(
        artistSlug: string,
        id: string,
        requestBody: CommentRequest,
    ): CancelablePromise<CommentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/public/{artistSlug}/artworks/{id}/comments',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Créer une oeuvre (Artiste)
     * @param requestBody
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static createArtwork(
        requestBody: ArtworkCreateRequest,
    ): CancelablePromise<ArtworkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artworks',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Uploader une image d'oeuvre via le kernel (mode kernel uniquement)
     * @param formData
     * @returns ArtworkImageUploadResponse OK
     * @throws ApiError
     */
    public static uploadArtworkImage(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ArtworkImageUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artworks/images/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Changer l'etat d'une oeuvre (PUBLISHED, ON_SALE, ARCHIVED...)
     * @param id
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static updateStatus(
        id: string,
        status: 'DRAFT' | 'PUBLISHED' | 'ON_SALE' | 'SUSPENDED' | 'SOLD' | 'ARCHIVED' | 'DELETED',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/artworks/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Mise à jour groupée du statut
     * @param status
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static bulkUpdateStatus(
        status: 'DRAFT' | 'PUBLISHED' | 'ON_SALE' | 'SUSPENDED' | 'SOLD' | 'ARCHIVED' | 'DELETED',
        requestBody: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/artworks/bulk-status',
            query: {
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lister les oeuvres d'une boutique (tenant spécifique)
     * @param artistSlug
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getAllPublicArtworks(
        artistSlug: string,
    ): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks',
            path: {
                'artistSlug': artistSlug,
            },
        });
    }
    /**
     * Voir les details d'une oeuvre dans une boutique
     * @param artistSlug
     * @param id
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getArtwork(
        artistSlug: string,
        id: string,
    ): CancelablePromise<ArtworkResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks/{id}',
            path: {
                'artistSlug': artistSlug,
                'id': id,
            },
        });
    }
    /**
     * Rechercher des oeuvres dans une boutique spécifique
     * @param artistSlug
     * @param q
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static searchArtworks(
        artistSlug: string,
        q: string,
    ): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/public/{artistSlug}/artworks/search',
            path: {
                'artistSlug': artistSlug,
            },
            query: {
                'q': q,
            },
        });
    }
    /**
     * Lister les techniques disponibles pour les filtres
     * @returns string OK
     * @throws ApiError
     */
    public static getTechniques(): CancelablePromise<Array<'OIL' | 'ACRYLIC' | 'WATERCOLOR' | 'GOUACHE' | 'PASTEL' | 'CHARCOAL' | 'PENCIL' | 'MIXED_MEDIA' | 'OTHER'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/metadata/techniques',
        });
    }
    /**
     * Lister les styles disponibles pour les filtres
     * @returns string OK
     * @throws ApiError
     */
    public static getStyles(): CancelablePromise<Array<'ABSTRACT' | 'FIGURATIVE' | 'PORTRAIT' | 'LANDSCAPE' | 'STILL_LIFE' | 'SURREALISM' | 'IMPRESSIONISM' | 'POP_ART' | 'CONTEMPORARY' | 'OTHER'>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/metadata/styles',
        });
    }
    /**
     * Recuperer les oeuvres récentes (tous artistes confondus)
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getLatestArtworks(): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/latest',
        });
    }
    /**
     * Recuperer les oeuvres mises en avant
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getFeatured(): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/artworks/featured',
        });
    }
    /**
     * Lister mes oeuvres (Artiste - Dashboard)
     * @returns ArtworkResponse OK
     * @throws ApiError
     */
    public static getMyArtworks(): CancelablePromise<Array<ArtworkResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/artworks/me',
        });
    }
    /**
     * Suppression groupée d'oeuvres
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static bulkDelete(
        requestBody: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/artworks/bulk-delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Uploader une vidéo d'oeuvre via le kernel
     * @param formData
     * @returns ArtworkVideoUploadResponse OK
     * @throws ApiError
     */
    public static uploadArtworkVideo(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ArtworkVideoUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artworks/videos/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Upload custom function using XMLHttpRequest to support upload progress tracking
     */
    public static async uploadFileWithProgress<T>(
        url: string,
        file: Blob,
        onProgress: (percent: number) => void
    ): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const fullUrl = `${OpenAPI.BASE || ''}${url}`;
            
            xhr.open('POST', fullUrl, true);

            // Fetch Token
            let token = '';
            if (typeof OpenAPI.TOKEN === 'function') {
                token = await (OpenAPI.TOKEN as any)();
            } else if (typeof OpenAPI.TOKEN === 'string') {
                token = OpenAPI.TOKEN;
            }
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            // Fetch Headers
            if (typeof OpenAPI.HEADERS === 'function') {
                const headers = await (OpenAPI.HEADERS as any)();
                if (headers) {
                    for (const [key, value] of Object.entries(headers)) {
                        xhr.setRequestHeader(key, value as string);
                    }
                }
            } else if (OpenAPI.HEADERS) {
                for (const [key, value] of Object.entries(OpenAPI.HEADERS)) {
                    xhr.setRequestHeader(key, value as string);
                }
            }

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    onProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        resolve(xhr.responseText as any);
                    }
                } else {
                    reject(new Error(`Upload failed with status: ${xhr.status} ${xhr.statusText}`));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Network error during file upload'));
            };

            const formData = new FormData();
            formData.append('file', file);
            xhr.send(formData);
        });
    }

    public static async uploadArtworkImageWithProgress(
        file: Blob,
        onProgress: (percent: number) => void
    ): Promise<ArtworkImageUploadResponse> {
        return this.uploadFileWithProgress<ArtworkImageUploadResponse>(
            '/api/artworks/images/upload',
            file,
            onProgress
        );
    }

    public static async uploadArtworkVideoWithProgress(
        file: Blob,
        onProgress: (percent: number) => void
    ): Promise<ArtworkVideoUploadResponse> {
        return this.uploadFileWithProgress<ArtworkVideoUploadResponse>(
            '/api/artworks/videos/upload',
            file,
            onProgress
        );
    }
}
