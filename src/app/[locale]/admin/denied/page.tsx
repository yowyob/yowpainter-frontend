'use client';

import { Link } from '@/i18n/navigation';
import { ShieldAlert } from 'lucide-react';

export default function AdminDeniedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="max-w-md text-center">
                <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-500 mb-6">
                    <ShieldAlert size={32} />
                </div>
                <h1 className="font-serif text-3xl font-bold mb-3">Accès refusé</h1>
                <p className="text-foreground/50 text-sm mb-8">
                    Vous n&apos;avez pas les droits administrateur requis pour accéder à cette section.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-accent text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-accent/90"
                >
                    Retour à l&apos;accueil
                </Link>
            </div>
        </div>
    );
}
