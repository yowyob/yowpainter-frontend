import type { CancelablePromise } from '@/lib/core/CancelablePromise';
import { OpenAPI } from '@/lib/core/OpenAPI';
import { request as __request } from '@/lib/core/request';
import type {
    PendingArtist,
    ApproveArtistRequest,
    ApproveArtistMfaRequest,
    ApproveArtistMfaResponse,
} from '@/types/admin';

export class AdminArtistService {
    public static getPendingArtists(): CancelablePromise<Array<PendingArtist>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/artists/pending',
        });
    }

    public static approveArtist(
        id: string,
        request?: ApproveArtistRequest | null,
    ): CancelablePromise<ApproveArtistMfaResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/artists/{id}/approve',
            path: { id },
            body: request,
        });
    }

    public static confirmApproveArtist(
        id: string,
        request: ApproveArtistMfaRequest,
    ): CancelablePromise<ApproveArtistMfaResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/artists/{id}/approve/confirm',
            path: { id },
            body: request,
        });
    }
}
