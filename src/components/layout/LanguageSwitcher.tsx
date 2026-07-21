"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const LOCALES = ["fr", "en", "de"] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t("language")}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/20 hover:border-accent hover:text-accent text-foreground/60 transition-all duration-300 hover:rotate-12 hover:scale-110"
      >
        <Globe className="w-[17px] h-[17px]" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-1 w-20 bg-background border border-foreground/10 shadow-lg rounded-xl z-[110] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {LOCALES.map((nextLocale) => (
            <Link
              key={nextLocale}
              href={pathname}
              locale={nextLocale}
              onClick={() => setIsOpen(false)}
              aria-label={`${t("language")}: ${nextLocale.toUpperCase()}`}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors text-center hover:bg-foreground/5 ${
                locale === nextLocale ? "text-accent" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {nextLocale}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
