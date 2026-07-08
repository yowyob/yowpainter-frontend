"use client";

import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { useQuery } from "@tanstack/react-query";
import { ShopOrdersService } from "@/lib/services/ShopOrdersService";
import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

export default function PurchasesPage() {
  const locale = useLocale();
  const t = useTranslations("ShopModule");
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["my-purchases"],
    queryFn: () => ShopOrdersService.getMyPurchases(),
  });

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">{t("purchasesEyebrow")}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{t("purchasesTitle")}</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          {t("purchasesDescription")}
        </p>
      </section>

      <ShopModuleNav />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse h-32 bg-foreground/5 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <section className="space-y-4">
          {(purchases || []).length === 0 ? (
            <div className="py-20 text-center border border-dashed border-foreground/10 rounded-[2rem]">
                <p className="text-foreground/40 italic">{t("noPurchases")}</p>
            </div>
          ) : (
            (purchases || []).map((purchase) => (
              <article key={purchase.id} className="rounded-3xl border border-foreground/10 bg-background/80 p-6 transition-all hover:border-accent/20">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="font-serif text-2xl tracking-tighter">{t("ref")}: {purchase.id?.slice(0, 8).toUpperCase()}</p>
                  <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                    {purchase.status ? t(`statuses.${purchase.status}`) : purchase.status}
                  </span>
                </div>
                
                <div className="grid gap-6 text-sm sm:grid-cols-3 border-t border-foreground/5 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-1">{t("totalAmount")}</p>
                    <p className="font-bold">{formatPrice(purchase.totalAmount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-1">{t("items")}</p>
                    <p className="font-medium">{t("artworksCount", { count: purchase.items?.length || 0 })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/30 mb-1">{t("date")}</p>
                    <p className="font-medium">{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString(locale) : t("notAvailable")}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </div>
  );
}
