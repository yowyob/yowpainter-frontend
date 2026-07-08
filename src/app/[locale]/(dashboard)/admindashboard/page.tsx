'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Shield, Users, Building2, BarChart3, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { useRequireRole } from '@/hooks/useRequireRole';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { toast } from '@/lib/toast';

type AdminTab = 'stats' | 'tenants' | 'users';

export default function AdminDashboardPage() {
  const t = useTranslations('AdminDashboard');
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const { isReady } = useRequireRole('ROLE_ADMIN', '/admin/login');
  const [tab, setTab] = useState<AdminTab>('stats');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => AdministrationService.getGlobalStats(),
    enabled: isReady,
  });

  const { data: tenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: () => AdministrationService.getAllTenants(),
    enabled: isReady && tab === 'tenants',
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => AdministrationService.getAllUsers(),
    enabled: isReady && tab === 'users',
  });

  const handleTenantStatus = async (id: string, status: string) => {
    try {
      await AdministrationService.updateTenantStatus(id, status);
      toast.success(t('statusUpdated'));
      queryClient.invalidateQueries({ queryKey: ['admin-tenants'] });
    } catch (err) {
      toast.error(err, t('statusError'));
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'stats', label: t('tabStats'), icon: <BarChart3 size={16} /> },
    { id: 'tenants', label: t('tabTenants'), icon: <Building2 size={16} /> },
    { id: 'users', label: t('tabUsers'), icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-accent/10 text-accent">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="font-serif text-4xl">{t('title')}</h1>
              <p className="text-foreground/50 text-sm">
                {user?.firstName} {user?.lastName} · {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => void logout()}
            className="px-6 py-2.5 border border-foreground/20 rounded-full text-xs uppercase tracking-widest font-bold hover:border-accent hover:text-accent transition-all"
          >
            {t('logout')}
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all shrink-0 ${
                tab === item.id
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))
            ) : (
              Object.entries(stats || {}).map(([key, value]) => (
                <div key={key} className="p-6 rounded-2xl border border-foreground/10 bg-foreground/5">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">{key}</div>
                  <div className="font-serif text-3xl text-accent">{String(value)}</div>
                </div>
              ))
            )}
            {!statsLoading && (!stats || Object.keys(stats).length === 0) && (
              <p className="col-span-full text-foreground/50 italic">{t('noStats')}</p>
            )}
          </div>
        )}

        {tab === 'tenants' && (
          <div className="rounded-2xl border border-foreground/10 overflow-hidden">
            {tenantsLoading ? (
              <div className="p-8"><Skeleton className="h-40 w-full" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-foreground/5 text-left">
                    <tr>
                      <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">{t('colId')}</th>
                      <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">{t('colName')}</th>
                      <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">{t('colStatus')}</th>
                      <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">{t('colActions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tenants || []).map((tenant) => {
                      const id = String(tenant.id ?? tenant.organizationId ?? '');
                      const name = String(tenant.name ?? tenant.displayName ?? tenant.slug ?? id);
                      const status = String(tenant.status ?? 'ACTIVE');
                      return (
                        <tr key={id} className="border-t border-foreground/5">
                          <td className="px-4 py-3 font-mono text-xs">{id.slice(0, 8)}…</td>
                          <td className="px-4 py-3">{name}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full bg-foreground/5 text-xs">{status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => void handleTenantStatus(id, 'ACTIVE')}
                                className="text-xs text-emerald-600 hover:underline"
                              >
                                {t('activate')}
                              </button>
                              <button
                                onClick={() => void handleTenantStatus(id, 'SUSPENDED')}
                                className="text-xs text-rose-600 hover:underline"
                              >
                                {t('suspend')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {(!tenants || tenants.length === 0) && (
                  <p className="p-8 text-foreground/50 italic text-center">{t('noTenants')}</p>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className="rounded-2xl border border-foreground/10 overflow-hidden">
            {usersLoading ? (
              <div className="p-8"><Skeleton className="h-40 w-full" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-foreground/5 text-left">
                    <tr>
                      <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">{t('colEmail')}</th>
                      <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">{t('colName')}</th>
                      <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">{t('colRole')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((u, index) => (
                      <tr key={String(u.id ?? u.email ?? index)} className="border-t border-foreground/5">
                        <td className="px-4 py-3">{String(u.email ?? '—')}</td>
                        <td className="px-4 py-3">
                          {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full bg-foreground/5 text-xs">{String(u.role ?? '—')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!users || users.length === 0) && (
                  <p className="p-8 text-foreground/50 italic text-center">{t('noUsers')}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
