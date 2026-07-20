'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | string;
}

interface Props {
  title: string;
  items: SidebarItem[];
  active: string;
  onSelect: (id: string) => void;
}

/**
 * Sidebar de dashboard, moderne et responsive.
 * - Desktop (lg+) : panneau vertical sticky, fixe pendant le scroll.
 * - Mobile : barre compacte + drawer coulissant avec overlay.
 * - Mise en évidence de l'entrée active, icônes Lucide, i18n complet.
 */
export default function DashboardSidebar({ title, items, active, onSelect }: Props) {
  const t = useTranslations('Dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeItem = items.find((i) => i.id === active);

  const List = ({ onPick }: { onPick?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => { onSelect(item.id); onPick?.(); }}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
              isActive
                ? 'bg-accent/10 font-bold text-foreground'
                : 'text-foreground/55 hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            {isActive && <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-accent" />}
            <span className={`shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-foreground/40 group-hover:text-foreground/70'}`}>
              {item.icon}
            </span>
            <span className="tracking-tight">{item.label}</span>
            {item.badge !== undefined && item.badge !== '' && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'bg-accent text-white' : 'bg-foreground/5 text-foreground/60'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop : sidebar fixe */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-[104px]">
          <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/35">{title}</p>
          <List />
        </div>
      </aside>

      {/* Mobile : barre + bouton drawer */}
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-foreground/10 bg-background/70 px-4 py-3 backdrop-blur-sm"
        >
          <span className="flex items-center gap-3 text-sm font-bold">
            <span className="text-accent">{activeItem?.icon}</span>
            {activeItem?.label}
          </span>
          <Menu size={18} className="text-foreground/50" />
        </button>
      </div>

      {/* Mobile : drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[9998] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] animate-in slide-in-from-left duration-300 border-r border-foreground/10 bg-background p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/40">{title}</p>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label={t('close')} className="rounded-full p-1 hover:bg-foreground/5">
                <X size={18} />
              </button>
            </div>
            <List onPick={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
