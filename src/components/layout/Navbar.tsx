"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuthStore, getDashboardRoute } from "@/store/authStore";
import { User, LogOut, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Navigation");

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("lightMode") : t("darkMode")}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-foreground/20 hover:border-accent hover:text-accent text-foreground/60 transition-all duration-300 hover:rotate-12 hover:scale-110"
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-500"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile à chaque navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Bloquer le scroll body quand le menu est ouvert
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isCompact =
    scrolled ||
    isPublicArtistPage(pathname) ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.includes("dashboard");

  const isGalerieActive = pathname === "/galerie" || pathname?.startsWith("/galerie/");
  const isArtistsActive = pathname === "/artists" || pathname?.startsWith("/artists/");
  const isEventsActive = pathname === "/events" || pathname?.startsWith("/events/");
  const isActualitesActive = pathname === "/actualites" || pathname?.startsWith("/actualites/");
  const isShopActive = pathname === "/shop" || pathname?.startsWith("/shop/");

  const navLinks = [
    { href: "/galerie", label: t("collection"), active: isGalerieActive },
    { href: "/artists", label: t("artists"), active: isArtistsActive },
    { href: "/events", label: t("events"), active: isEventsActive },
    { href: "/actualites", label: t("news"), active: isActualitesActive },
    { href: "/shop", label: t("shop"), active: isShopActive },
  ];

  return (
    <>
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 sm:px-6 md:px-12 pointer-events-none 
      ${isCompact ? "py-3 sm:py-4 glass-elegant backdrop-blur-xl border-b border-foreground/5 shadow-sm" : "py-5 sm:py-8"}`}
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-center pointer-events-auto gap-2">

        {/* Logo */}
        <div className="flex shrink-0 justify-start min-w-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div
              className={`relative transition-all duration-500 overflow-hidden shrink-0 ${
                isCompact ? "w-11 h-11 sm:w-14 sm:h-14" : "w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24"
              }`}
            >
              <Image
                src="/images/logo.png"
                alt="YowPainter Logo"
                fill
                sizes="100px"
                className="object-contain scale-[2] transition-transform duration-500"
                priority
              />
            </div>
            <span
              className={`font-serif italic font-light text-foreground/80 tracking-tight transition-all duration-500 hidden sm:inline ${
                isCompact || scrolled || isPublicArtistPage(pathname)
                  ? "opacity-0 w-0 overflow-hidden text-[0px]"
                  : "opacity-100 w-auto text-lg md:text-xl"
              }`}
            >
              YowPainter
            </span>
          </Link>
        </div>

        {/* Navigation centrale — desktop */}
        <nav className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-6 xl:gap-8 font-serif text-base xl:text-lg italic text-foreground/80 lowercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors relative group ${
                  link.active ? "text-accent" : "text-foreground/80 hover:text-accent"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all ${
                    link.active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>
        </nav>

        {/* Actions droite */}
        <div className="flex shrink-0 justify-end items-center gap-2 sm:gap-3 md:gap-5">
          <ThemeToggle />

          <Link
            href="/cart"
            className="relative p-2 text-foreground/60 hover:text-accent transition-all hover:scale-110"
            title={t("cart")}
          >
            <ShoppingBag size={20} />
            {mounted && itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[9px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                {itemCount}
              </span>
            )}
          </Link>

          {!mounted ? (
            <div className="w-10 h-10" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href={getDashboardRoute(user?.role)} className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-foreground/10 overflow-hidden transition-all group-hover:border-accent shrink-0">
                  {user?.profilePictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profilePictureUrl}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-foreground/5 text-foreground/40">
                      <User size={18} />
                    </div>
                  )}
                </div>
                {!scrolled && (
                  <span className="hidden md:inline text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 group-hover:text-accent">
                    {user?.firstName || t("profile")}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  void logout();
                }}
                className="p-2 text-foreground/40 hover:text-rose-500 transition-colors"
                title={t("logout")}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold text-foreground/70 border border-foreground/20 px-3 md:px-6 py-2 md:py-2.5 hover:border-accent hover:text-accent transition-all duration-300"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className={`hidden md:inline-flex bg-accent text-white px-5 lg:px-8 py-2.5 lg:py-3 text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-bold hover:bg-foreground hover:shadow-xl transition-all shadow-md ${
                  scrolled ? "scale-90 opacity-90" : "scale-100"
                }`}
              >
                {t("register")}
              </Link>
            </>
          )}

          <LanguageSwitcher />

          {/* Bouton hamburger — mobile / tablette */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full border border-foreground/20 text-foreground/70 hover:border-accent hover:text-accent transition-all"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>

      {/* Menu mobile : portal body + z-index inline (au-dessus de tout le contenu) */}
      {mounted &&
        createPortal(
          <div
            className={`lg:hidden fixed inset-0 transition-opacity duration-300 ${
              mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            style={{ zIndex: 2147483000 }}
            aria-hidden={!mobileOpen}
            role="dialog"
            aria-modal={mobileOpen}
          >
            <button
              type="button"
              aria-label="Fermer le menu"
              className="absolute inset-0 bg-black/55"
              onClick={() => setMobileOpen(false)}
            />

            <nav
              className={`absolute top-0 right-0 h-full w-full max-w-[320px] sm:max-w-[380px] border-l border-foreground/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
                mobileOpen ? "translate-x-0" : "translate-x-full"
              }`}
              style={{
                backgroundColor: "var(--background)",
                zIndex: 2147483001,
                isolation: "isolate",
              }}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-foreground/5">
                <span className="font-serif italic text-lg text-foreground/80">YowPainter</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/15 text-foreground/60 hover:text-accent hover:border-accent transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block font-serif text-2xl italic py-3 transition-colors border-b border-foreground/5 ${
                          link.active ? "text-accent" : "text-foreground/80 hover:text-accent"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {isAuthenticated ? (
                  <div className="mt-10 flex flex-col gap-3">
                    <Link
                      href={getDashboardRoute(user?.role)}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-3 text-sm uppercase tracking-[0.2em] font-bold text-foreground/70 hover:text-accent transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full border border-foreground/10 overflow-hidden shrink-0">
                        {user?.profilePictureUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.profilePictureUrl} alt="" className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                      {user?.firstName || t("profile")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        void logout();
                      }}
                      className="flex items-center gap-3 py-3 text-sm uppercase tracking-[0.2em] font-bold text-rose-500/80 hover:text-rose-500 transition-colors text-left"
                    >
                      <LogOut size={18} />
                      {t("logout")}
                    </button>
                  </div>
                ) : (
                  <div className="mt-10 flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center text-xs uppercase tracking-[0.3em] font-bold text-foreground/70 border border-foreground/20 px-6 py-3.5 hover:border-accent hover:text-accent transition-all"
                    >
                      {t("login")}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center bg-accent text-white px-6 py-3.5 text-xs uppercase tracking-[0.3em] font-bold hover:bg-foreground transition-all"
                    >
                      {t("register")}
                    </Link>
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-t border-foreground/5 flex items-center justify-between">
                <LanguageSwitcher />
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 font-bold">
                  © {new Date().getFullYear()}
                </span>
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}

function isPublicArtistPage(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname !== "/" &&
    ![
      "/login",
      "/register",
      "/galerie",
      "/artists",
      "/events",
      "/actualites",
      "/shop",
      "/amadashboard",
      "/artdashboard",
    ].some((path) => pathname.startsWith(path))
  );
}
