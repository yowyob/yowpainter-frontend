"use client";

import { Link } from "@/i18n/navigation";
import ShopModuleNav from "@/components/shop/ShopModuleNav";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";

const platformFee = 8000;

export default function CartPage() {
  const t = useTranslations("ShopModule");
  const { items, getTotal, removeItem, updateQuantity } = useCartStore();
  
  const subtotal = getTotal();
  const shipping = items.length * 5000; // Placeholder shipping calculation
  const total = subtotal + shipping + platformFee;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-16 sm:pb-24">
      <section className="reveal mb-6 sm:mb-8 rounded-[1.5rem] sm:rounded-[2rem] border border-foreground/10 bg-background/70 p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">{t("cartEyebrow")}</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">{t("cartTitle")}</h1>
        <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-foreground/70">
          {t("cartDescription")}
        </p>
      </section>

      <ShopModuleNav />

      {items.length === 0 ? (
        <div className="py-16 sm:py-20 text-center border border-dashed border-foreground/10 rounded-[2rem]">
            <p className="text-foreground/40 italic mb-8">{t("cartEmpty")}</p>
            <Link href="/shop" className="px-8 py-4 bg-foreground text-background text-xs uppercase tracking-widest font-bold">
                {t("backToShop")}
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
            {items.map((item) => (
                <article key={item.id} className="rounded-2xl sm:rounded-3xl border border-foreground/10 bg-background/80 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="font-serif text-xl sm:text-2xl">{item.title}</p>
                        <p className="text-sm text-foreground/60">
                            {item.artistName}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 sm:gap-6 text-sm">
                            <span>{t("art")}: {formatPrice(item.price)}</span>
                            <span>{t("quantity")}: {item.quantity}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/30 hover:text-rose-500 transition-colors text-sm"
                    >
                        {t("remove")}
                    </button>
                </article>
            ))}
            </section>

            <aside className="h-fit rounded-2xl sm:rounded-3xl border border-foreground/10 bg-background/80 p-5 sm:p-6">
                <h2 className="font-serif text-2xl sm:text-3xl">{t("summary")}</h2>
                <div className="mt-5 space-y-3 text-sm text-foreground/70">
                    <div className="flex justify-between">
                    <span>{t("subtotal")}</span>
                    <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>{t("estimatedShipping")}</span>
                    <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>{t("platformService")}</span>
                    <span>{formatPrice(platformFee)}</span>
                    </div>
                    <div className="mt-4 flex justify-between border-t border-foreground/10 pt-4 text-base font-semibold text-foreground">
                    <span>{t("estimatedTotal")}</span>
                    <span>{formatPrice(total)}</span>
                    </div>
                </div>
                <Link
                    href="/shop/checkout"
                    className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-white font-bold hover:shadow-xl transition-all"
                >
                    {t("goToPayment")}
                </Link>
            </aside>
        </div>
      )}
    </div>
  );
}
