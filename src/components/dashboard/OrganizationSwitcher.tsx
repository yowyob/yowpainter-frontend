'use client';

import { useAuthStore } from '@/store/authStore';
import type { OrganizationAccessResponse } from '@/lib/models/OrganizationAccessResponse';

interface OrganizationSwitcherProps {
    organizations: OrganizationAccessResponse[];
    activeOrganizationId?: string;
}

export function OrganizationSwitcher({ organizations, activeOrganizationId }: OrganizationSwitcherProps) {
    const setActiveOrganization = useAuthStore((state) => state.setActiveOrganization);

    if (organizations.length <= 1) return null;

    return (
        <label className="flex items-center gap-2 text-xs text-foreground/60">
            <span className="uppercase tracking-widest font-bold shrink-0">Organisation</span>
            <select
                value={activeOrganizationId || organizations[0]?.organizationId || ''}
                onChange={(e) => setActiveOrganization(e.target.value)}
                className="bg-background border border-foreground/10 rounded-lg px-2 py-1 text-foreground text-xs max-w-[180px] truncate"
            >
                {organizations.map((org) => (
                    <option key={org.organizationId} value={org.organizationId}>
                        {org.displayName || org.organizationCode || org.organizationId}
                    </option>
                ))}
            </select>
        </label>
    );
}
