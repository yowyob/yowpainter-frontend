/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { ProfileImageUploadResponse } from '../models/ProfileImageUploadResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Réinitialiser le mot de passe avec le jeton
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static resetPassword(
        requestBody: ResetPasswordRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Inscription d'un nouvel utilisateur (Artiste ou Acheteur)
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static register(
        requestBody: RegisterRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Rafraichir le token JWT
     * @param refreshToken
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static refresh(
        refreshToken?: string,
        requestBody?: RefreshTokenRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
            query: {
                'refreshToken': refreshToken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Se deconnecter
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static logout(
        requestBody?: RefreshTokenRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Connexion et recuperation du token JWT
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static login(
        requestBody: LoginRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Demander la réinitialisation du mot de passe
     * @param requestBody
     * @returns AuthResponse OK
     * @throws ApiError
     */
    public static forgotPassword(
        requestBody: ForgotPasswordRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lister les roles disponibles pour l'inscription
     * @returns string OK
     * @throws ApiError
     */
    public static getRoles(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/roles',
        });
    }
    /**
     * Uploader un avatar temporaire avant inscription
     * @param formData
     * @returns ProfileImageUploadResponse OK
     * @throws ApiError
     */
    public static uploadRegistrationAvatar(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ProfileImageUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register/avatar',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
