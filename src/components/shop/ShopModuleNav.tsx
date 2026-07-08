"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type NavItem = { href: string; labelKey: string };

const buyerLinks: NavItem[] = [
  { href: "/shop", labelKey: "shop" },
  { href: "/shop/cart", labelKey: "cart" },
  { href: "/shop/checkout", labelKey: "checkout" },
  { href: "/shop/confirmation", labelKey: "confirmation" },
  { href: "/shop/purchases", labelKey: "purchases" },
  { href: "/shop/disputes", labelKey: "disputes" },
];

const artistLinks: NavItem[] = [
  { href: "/artist/shop/listings", labelKey: "listings" },
  { href: "/artist/shop/orders", labelKey: "orders" },
];

function LinkChip({ item, pathname }: { item: NavItem; pathname: string }) {
  const t = useTranslations("ShopModule");
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
        active
          ? "border-accent bg-accent text-white"
          : "border-foreground/15 text-foreground/70 hover:border-accent hover:text-accent"
      }`}
    >
      {t(item.labelKey)}
    </Link>
  );
}

export default function ShopModuleNav() {
  const pathname = usePathname();
  const t = useTranslations("ShopModule");

  return (
    <aside className="mb-10 space-y-4">
      <div className="rounded-3xl border border-foreground/10 bg-background/70 p-5 backdrop-blur">
        <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-foreground/40">
          {t("buyerJourney")}
        </p>
        <div className="flex flex-wrap gap-2">
          {buyerLinks.map((item) => (
            <LinkChip key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-foreground/10 bg-background/70 p-5 backdrop-blur">
        <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-foreground/40">
          {t("artistJourney")}
        </p>
        <div className="flex flex-wrap gap-2">
          {artistLinks.map((item) => (
            <LinkChip key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
    </aside>
  );
}
