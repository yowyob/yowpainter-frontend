"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CartPage() {
  const t = useTranslations("Cart");
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-16 sm:pb-24 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-foreground/5 flex items-center justify-center mb-6 sm:mb-8 animate-in fade-in zoom-in duration-700">
          <ShoppingBag size={40} className="text-foreground/20" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 tracking-tighter">{t("emptyTitle")}</h1>
        <p className="text-foreground/40 max-w-sm mb-8 sm:mb-10 font-light text-sm sm:text-base">
          {t("emptyDescription")}
        </p>
        <Link 
          href="/shop" 
          className="bg-accent text-white px-8 sm:px-10 py-3.5 sm:py-4 text-xs uppercase tracking-[0.4em] font-black hover:bg-foreground transition-all shadow-xl"
        >
          {t("discoverShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 sm:mb-16 reveal">
        <Link href="/shop" className="p-2 rounded-full border border-foreground/10 hover:border-accent hover:text-accent transition-all">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl tracking-tighter italic">{t("title")}</h1>
        <div className="h-[1px] flex-1 min-w-[40px] bg-foreground/10 mx-2 sm:mx-4 hidden sm:block"></div>
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-foreground/30 w-full sm:w-auto">
          {getItemCount()} {getItemCount() > 1 ? t("articles") : t("article")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-10">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-5 sm:gap-8 pb-8 sm:pb-10 border-b border-foreground/5 group reveal">
              {/* Product Image */}
              <div className="relative w-full sm:w-48 aspect-[4/5] rounded-2xl overflow-hidden border border-foreground/5 bg-foreground/[0.02]">
                <SafeImage 
                  src={item.imageUrl} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col py-2">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium mb-1 group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 italic">
                      {t("byArtist", { artist: item.artistName })}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-foreground/20 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 sm:gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 p-1 rounded-full border border-foreground/10 bg-foreground/[0.02]">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="block text-[9px] uppercase tracking-widest text-foreground/30 font-black mb-1">{t("unitPrice")}</span>
                    <span className="font-display text-xl sm:text-2xl font-black text-accent tracking-tighter">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass-elegant border border-foreground/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] sticky top-24 sm:top-32 reveal">
            <h2 className="font-serif text-2xl sm:text-3xl mb-6 sm:mb-10 tracking-tight">{t("summary")}</h2>
            
            <div className="space-y-5 sm:space-y-6 mb-8 sm:mb-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/40 font-light">{t("subtotal")}</span>
                <span className="font-bold">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/40 font-light">{t("shipping")}</span>
                <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">{t("free")}</span>
              </div>
              <div className="h-[1px] bg-foreground/10"></div>
              <div className="flex justify-between items-end gap-3">
                <span className="font-serif text-lg sm:text-xl italic text-foreground/60">{t("total")}</span>
                <span className="font-display text-3xl sm:text-4xl font-black text-accent tracking-tighter">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="w-full flex items-center justify-center py-5 bg-ink text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-accent transition-all hover:translate-y-[-2px]"
            >
              {t("checkout")}
            </Link>

            <p className="mt-8 text-[10px] text-center text-foreground/30 font-bold uppercase tracking-widest leading-relaxed px-4">
              {t("securePayment")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
