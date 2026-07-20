import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InvoicesService {
    /**
     * Consulter ses factures d'achat (Acheteur)
     * @returns any OK
     * @throws ApiError
     */
    public static getMyPurchases(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/invoices/my-purchases',
        });
    }

    /**
     * Consulter ses factures de vente (Artiste)
     * @returns any OK
     * @throws ApiError
     */
    public static getMySales(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/invoices/my-sales',
        });
    }

    /**
     * Récupérer l'URL de téléchargement PDF d'une facture
     */
    public static getInvoicePdfUrl(invoiceNumber: string): string {
        const baseUrl = OpenAPI.BASE || '';
        return `${baseUrl}/api/invoices/${invoiceNumber}/pdf`;
    }
}
