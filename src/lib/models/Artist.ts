/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GrantedAuthority } from './GrantedAuthority';
export type Artist = {
    id?: string;
    email?: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
    bio?: string;
    role?: Artist.role;
    createdAt?: string;
    resetToken?: string;
    resetTokenExpiry?: string;
    kernelUserId?: string;
    slug?: string;
    artistName?: string;
    bannerUrl?: string;
    location?: string;
    status?: string;
    tenantId?: string;
    organizationId?: string;
    payoutPhone?: string;
    payoutNetwork?: string;
    enabled?: boolean;
    password?: string;
    accountNonLocked?: boolean;
    authorities?: Array<GrantedAuthority>;
    username?: string;
    accountNonExpired?: boolean;
    credentialsNonExpired?: boolean;
};
export namespace Artist {
    export enum role {
        ROLE_ADMIN = 'ROLE_ADMIN',
        ROLE_ARTIST = 'ROLE_ARTIST',
        ROLE_BUYER = 'ROLE_BUYER',
    }
}

