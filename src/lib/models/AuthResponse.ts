/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationAccessResponse } from './OrganizationAccessResponse';
export type AuthResponse = {
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    tenantId?: string;
    artistName?: string;
    message?: string;
    kernelUserId?: string;
    organizationId?: string;
    organizations?: Array<OrganizationAccessResponse>;
    imageURL?: string;
    registrationStatus?: string;
    emailVerified?: boolean;
};

