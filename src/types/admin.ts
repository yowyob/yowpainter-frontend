export interface PendingArtist {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    artistName: string;
    slug: string;
    status: string;
    kernelUserId?: string;
    kernelActorId?: string;
    organizationId?: string;
    tenantId?: string;
    createdAt: string;
}

export interface ApproveArtistRequest {
    bootstrapMfaCode?: string | null;
    kernelActorId?: string | null;
}

export interface ApproveArtistMfaRequest {
    mfaCode: string;
}

export interface ApproveArtistMfaResponse {
    status: 'ACTIVE' | 'MFA_REQUIRED' | 'ERROR';
    message?: string;
    mfaSessionId?: string;
    organizationId?: string;
    kernelActorId?: string;
}

export type AdminRecord = Record<string, unknown>;
