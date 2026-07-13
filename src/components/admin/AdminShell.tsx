'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { useAuthStore } from '@/store/authStore';
import {
    LayoutDashboard,
    Users,
    Building2,
    ScrollText,
    UserCircle,
    Palette,
    LogOut,
    Shield,
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
    { href: '/admin/artists', label: 'Artistes en attente', icon: Palette },
    { href: '/admin/tenants', label: 'Organisations', icon: Building2 },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/logs', label: 'Logs d\'audit', icon: ScrollText },
    { href: '/admin/profile', label: 'Mon profil', icon: UserCircle },
];

interface AdminShellProps {
    children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href || pathname.endsWith(href);
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-foreground/10 bg-foreground/[0.02]">
                <div className="p-6 border-b border-foreground/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="font-serif font-bold text-lg leading-tight">YowPainter</p>
                            <p className="text-[10px] uppercase tracking-widest text-foreground/40">Administration</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href, item.exact);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    active
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                                }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-foreground/10">
                    <div className="px-4 py-3 mb-2">
                        <p className="text-sm font-semibold truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-foreground/40 truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={() => void logout()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-foreground/10">
                    <div className="flex items-center gap-2">
                        <Shield size={20} className="text-accent" />
                        <span className="font-serif font-bold">Admin</span>
                    </div>
                    <button
                        onClick={() => void logout()}
                        className="text-xs text-rose-500 font-bold uppercase tracking-widest"
                    >
                        Quitter
                    </button>
                </header>

                <nav className="md:hidden flex gap-1 p-2 overflow-x-auto border-b border-foreground/10">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`shrink-0 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                                    active ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground/50'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
