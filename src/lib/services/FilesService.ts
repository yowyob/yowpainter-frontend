import type { ProfileImageUploadResponse } from '../models/ProfileImageUploadResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FilesService {
    /**
     * Uploader la photo de profil via le kernel (multipart)
     * @param formData
     * @returns ProfileImageUploadResponse OK
     * @throws ApiError
     */
    public static uploadProfilePicture(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ProfileImageUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/me/profile-picture',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Uploader un fichier générique sous le contexte de l'utilisateur connecté
     * @param formData
     * @param documentType
     * @returns ProfileImageUploadResponse OK
     * @throws ApiError
     */
    public static uploadFile(
        formData?: {
            file: Blob;
        },
        documentType?: string,
    ): CancelablePromise<ProfileImageUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/me/files/upload',
            query: {
                'documentType': documentType,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
