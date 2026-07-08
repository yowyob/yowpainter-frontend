"use client";

import { Link } from "@/i18n/navigation";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

export default function ConfirmationPage() {
  const locale = useLocale();
  const t = useTranslations("ShopModule");

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <section className="reveal mb-8 rounded-[2rem] border border-foreground/10 bg-background/80 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">{t("success")}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{t("confirmedTitle")}</h1>
        <p className="mt-4 max-w-2xl text-foreground/70 mx-auto">
          {t("confirmedDescription")}
        </p>
      </section>

      <ShopModuleNav />

      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <section className="space-y-5 rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">{t("reference")}</p>
            <p className="mt-2 font-serif text-3xl">YWP-{new Date().getFullYear()}-XXXX</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">{t("paidAmount")}</p>
              <p className="mt-2 text-xl font-semibold">{formatPrice(0)}</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">{t("paymentMode")}</p>
              <p className="mt-2 text-xl font-semibold font-serif italic">{t("secure")}</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">{t("orderDate")}</p>
              <p className="mt-2 text-xl font-semibold">{new Date().toLocaleDateString(locale)}</p>
            </article>
            <article className="rounded-2xl border border-foreground/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/45">{t("estimatedDelivery")}</p>
              <p className="mt-2 text-xl font-semibold">{t("deliveryWindow")}</p>
            </article>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-foreground/10 bg-background/80 p-6">
          <h2 className="font-serif text-3xl">{t("next")}</h2>
          <div className="mt-5 space-y-3">
            <Link href="/shop/purchases" className="block rounded-full border border-foreground/15 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] hover:border-accent hover:text-accent font-bold transition-all">
              {t("viewPurchases")}
            </Link>
            <Link href="/shop/disputes" className="block rounded-full border border-foreground/15 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] hover:border-accent hover:text-accent font-medium">
              {t("openDispute")}
            </Link>
            <Link href="/shop" className="block rounded-full bg-accent px-4 py-2 text-center text-xs uppercase tracking-[0.2em] text-white font-bold hover:shadow-lg transition-all">
              {t("returnShop")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
