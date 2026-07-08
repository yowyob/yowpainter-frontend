"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { AnimatedBlob } from "@/components/ui/AnimatedBlob";

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "";
  const t = useTranslations("RegisterSuccess");

  return (
    <div className="w-full max-w-xl bg-background/60 backdrop-blur-xl border border-foreground/5 p-8 md:p-12 shadow-2xl relative rounded-sm text-center">
      {/* Subtle geometric art accents */}
      <div className="absolute top-4 right-4 w-12 h-12 text-accent/10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0 100 L100 0 L100 100 Z" /></svg>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-accent/20 blur-md animate-pulse"></div>
          <div className="relative bg-background border border-accent/20 text-accent p-6 rounded-full shadow-inner flex items-center justify-center">
            <Mail className="w-12 h-12 stroke-[1.5]" />
          </div>
        </div>
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4">
        {t("title")}
      </h1>

      <div className="flex items-center justify-center gap-2 mb-8 text-emerald-500 font-medium text-sm tracking-wider uppercase">
        <CheckCircle2 size={16} />
        {t("successMessage")}
      </div>

      <p className="text-foreground/70 font-light leading-relaxed mb-6">
        {t("explanation")}
      </p>

      {email && (
        <div className="bg-foreground/5 border border-foreground/5 py-4 px-6 rounded-sm mb-10 font-mono text-sm tracking-tight text-foreground/80 break-all">
          {email}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {(role === "ROLE_ARTIST" || role === "ARTIST") && (
          <a
            href="https://kernel-core.yowyob.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-accent text-white py-5 px-8 text-xs uppercase tracking-[0.4em] font-bold hover:bg-foreground hover:shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)] transition-all duration-500 shadow-xl group flex items-center justify-center gap-4 mb-2"
          >
            Ouvrir la page de vérification
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </a>
        )}
        <Link
          href="/login"
          className="w-full bg-foreground text-background py-5 px-8 text-xs uppercase tracking-[0.4em] font-bold hover:bg-accent hover:text-white hover:shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)] transition-all duration-500 shadow-xl group flex items-center justify-center gap-4"
        >
          {t("backToLogin")}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-screen w-full canvas-texture canvas-grain items-center justify-center relative overflow-hidden px-6 py-20">
      {/* Background blobs for premium glassmorphism vibe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
        <AnimatedBlob className="top-[10%] left-[20%] w-[30rem] h-[30rem]" color="accent" />
        <AnimatedBlob className="bottom-[10%] right-[20%] w-[25rem] h-[25rem]" color="accent" />
      </div>

      <Suspense fallback={
        <div className="w-full max-w-xl bg-background/60 backdrop-blur-xl border border-foreground/5 p-8 md:p-12 shadow-2xl rounded-sm text-center flex items-center justify-center min-h-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        </div>
      }>
        <RegisterSuccessContent />
      </Suspense>
    </div>
  );
}
