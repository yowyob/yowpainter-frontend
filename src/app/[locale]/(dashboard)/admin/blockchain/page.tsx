'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdministrationService } from '@/lib/services/AdministrationService';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
    Shield, 
    ShieldCheck, 
    ShieldAlert, 
    RefreshCw, 
    Database, 
    Coins, 
    Clock, 
    Hash, 
    FileText 
} from 'lucide-react';

export default function AdminBlockchainPage() {
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');

    // Fetch all tenants
    const { data: tenants, isLoading: tenantsLoading } = useQuery({
        queryKey: ['admin', 'tenants'],
        queryFn: () => AdministrationService.getAllTenants(),
    });

    // Fetch transactions
    const { 
        data: transactions, 
        isLoading: txLoading, 
        refetch: refetchTx 
    } = useQuery({
        queryKey: ['admin', 'blockchain', 'transactions', selectedTenantId],
        queryFn: () => AdministrationService.getBlockchainTransactions(selectedTenantId),
        enabled: !!selectedTenantId,
    });

    // Run/Get chain validation report
    const { 
        data: validationReport, 
        isLoading: validationLoading, 
        refetch: refetchValidation 
    } = useQuery({
        queryKey: ['admin', 'blockchain', 'validate', selectedTenantId],
        queryFn: () => AdministrationService.validateBlockchainChain(selectedTenantId),
        enabled: !!selectedTenantId,
    });

    const handleAuditRefresh = async () => {
        if (!selectedTenantId) return;
        await Promise.all([refetchTx(), refetchValidation()]);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                    <Shield className="text-accent" size={36} />
                    Audit Blockchain
                </h1>
                <p className="text-foreground/50 text-sm">
                    Auditez les transactions financières ancrées sur la blockchain et vérifiez l&apos;intégrité de la chaîne pour chaque organisation.
                </p>
            </div>

            {/* Tenant Selection Card */}
            <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                <label className="block text-xs uppercase tracking-widest text-foreground/50 font-bold mb-3">
                    Sélectionner une organisation / Artiste
                </label>
                {tenantsLoading ? (
                    <Skeleton className="h-10 w-full rounded-xl" />
                ) : (
                    <select
                        value={selectedTenantId}
                        onChange={(e) => setSelectedTenantId(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-3 bg-background border border-foreground/10 rounded-xl text-sm focus:outline-none focus:border-accent transition-all"
                    >
                        <option value="">-- Choisir une organisation --</option>
                        {tenants?.map((tenant) => (
                            <option key={tenant.id} value={tenant.organizationId}>
                                {tenant.name} ({tenant.slug})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {selectedTenantId ? (
                <div className="space-y-6">
                    {/* Validation Integrity Status & Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Integrity card */}
                        <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                                    Intégrité de la chaîne
                                </span>
                                {validationLoading ? (
                                    <RefreshCw className="animate-spin text-accent" size={18} />
                                ) : validationReport?.valid ? (
                                    <ShieldCheck className="text-emerald-500" size={20} />
                                ) : (
                                    <ShieldAlert className="text-rose-500" size={20} />
                                )}
                            </div>
                            <div>
                                {validationLoading ? (
                                    <Skeleton className="h-8 w-24 mb-2" />
                                ) : (
                                    <p className={`font-serif text-3xl font-bold ${validationReport?.valid ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {validationReport?.valid ? 'VALIDE' : 'ALTÉRÉE'}
                                    </p>
                                )}
                                <p className="text-xs text-foreground/40 mt-1">
                                    {validationReport?.valid 
                                        ? 'Toutes les signatures et hachages sont intacts.' 
                                        : 'Alerte: Des anomalies de cohérence ont été détectées.'}
                                </p>
                            </div>
                        </div>

                        {/* Block count card */}
                        <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                                    Total Blocs Audités
                                </span>
                                <Database className="text-blue-500" size={20} />
                            </div>
                            <div>
                                {validationLoading ? (
                                    <Skeleton className="h-8 w-16 mb-2" />
                                ) : (
                                    <p className="font-serif text-3xl font-bold text-accent">
                                        {validationReport?.blockCount ?? 0}
                                    </p>
                                )}
                                <p className="text-xs text-foreground/40 mt-1">
                                    Blocs enregistrés pour ce grand livre.
                                </p>
                            </div>
                        </div>

                        {/* Audit Action card */}
                        <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                                    Actions de contrôle
                                </span>
                                <RefreshCw size={20} className="text-foreground/40" />
                            </div>
                            <div>
                                <button
                                    onClick={handleAuditRefresh}
                                    disabled={validationLoading || txLoading}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-accent/90 disabled:opacity-50 transition-all"
                                >
                                    <RefreshCw size={14} className={validationLoading || txLoading ? 'animate-spin' : ''} />
                                    Lancer l&apos;audit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Hachages de contrôle technique */}
                    {validationReport && (
                        <div className="p-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] space-y-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Hash size={16} className="text-accent" />
                                Détails Techniques d&apos;Intégrité
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                <div className="p-4 rounded-xl bg-foreground/[0.03]">
                                    <span className="text-foreground/40 block mb-1">Dernier Hash de Bloc</span>
                                    <span className="break-all">{validationReport?.lastBlockHash || 'N/A'}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-foreground/[0.03]">
                                    <span className="text-foreground/40 block mb-1">Hachage Général Audit</span>
                                    <span className="break-all">{validationReport?.chainHash || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transaction Audit List */}
                    <div className="rounded-2xl border border-foreground/10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Coins size={18} className="text-accent" />
                                <h2 className="font-semibold text-sm">Transactions du Grand Livre</h2>
                            </div>
                            <span className="text-[10px] bg-accent/10 text-accent font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {transactions?.length ?? 0} Enregistrements
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            {txLoading ? (
                                <div className="p-8 space-y-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : transactions && transactions.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-foreground/[0.02] border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                                            <th className="px-6 py-4">Index / Block</th>
                                            <th className="px-6 py-4">Horodatage</th>
                                            <th className="px-6 py-4">Empreinte Wallet</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Montant</th>
                                            <th className="px-6 py-4">Hash</th>
                                            <th className="px-6 py-4 text-right">Signature</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-foreground/5 text-xs">
                                        {transactions.map((tx: any, idx: number) => (
                                            <tr key={tx.id || idx} className="hover:bg-foreground/[0.01] transition-all">
                                                <td className="px-6 py-4 font-bold text-accent">
                                                    #{tx.blockIndex ?? idx + 1}
                                                </td>
                                                <td className="px-6 py-4 text-foreground/60 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString('fr-FR') : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-[10px] text-foreground/80">
                                                    {tx.walletFingerprint ? `${tx.walletFingerprint.substring(0, 12)}...` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                                                        tx.type === 'SALE' || tx.type === 'CREDIT'
                                                            ? 'bg-emerald-500/10 text-emerald-600'
                                                            : 'bg-rose-500/10 text-rose-600'
                                                    }`}>
                                                        {tx.type || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-serif font-bold whitespace-nowrap">
                                                    {tx.amount ? `${tx.amount.toLocaleString()} XAF` : '—'}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-[10px] text-foreground/50 max-w-[120px] truncate">
                                                    {tx.hash || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-[10px] text-foreground/40 max-w-[120px] truncate">
                                                    {tx.signature || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center text-foreground/40 italic">
                                    Aucune transaction n&apos;est enregistrée sur la blockchain pour cette organisation.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-12 text-center border border-dashed border-foreground/20 rounded-2xl text-foreground/40 flex flex-col items-center justify-center gap-3">
                    <Database size={36} />
                    <span>Sélectionnez une organisation dans la liste pour débuter l&apos;audit blockchain.</span>
                </div>
            )}
        </div>
    );
}
