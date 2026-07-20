/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentResponse } from '../models/PaymentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaymentsService {
    /**
     * Point d'entrée pour les callbacks de paiement (Kernel — à venir)
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static handlePaymentCallback(
        requestBody: Record<string, string>,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/callback',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Consulter son historique de paiements
     * @returns PaymentResponse OK
     * @throws ApiError
     */
    public static getPaymentHistory(): CancelablePromise<Array<PaymentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payment/history',
        });
    }
    /**
     * Statut d'un paiement, rafraîchi auprès du Kernel.
     * Utilisé par le polling après redirection vers la page de paiement du PSP.
     * @param referenceId identifiant métier (réservation / commande)
     * @returns { referenceId, status } — status ∈ PENDING | SUCCEEDED | FAILED
     * @throws ApiError
     */
    public static getPaymentStatus(
        referenceId: string,
    ): CancelablePromise<{ referenceId: string; status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payment/status/{referenceId}',
            path: {
                'referenceId': referenceId,
            },
        });
    }
}
