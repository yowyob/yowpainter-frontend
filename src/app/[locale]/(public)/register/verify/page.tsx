"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Home } from "lucide-react";
import { AnimatedBlob } from "@/components/ui/AnimatedBlob";

function RegisterVerifyContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const errorType = searchParams.get("errorType") || "invalid";
  const message = searchParams.get("message") || "";
  const t = useTranslations("EmailVerification");

  // Determine state rendering details
  let icon = <CheckCircle2 className="w-12 h-12 stroke-[1.5] text-emerald-500" />;
  let title = t("successTitle");
  let subtitle = t("successSubtitle");
  let description = t("successDescription");
  let actionText = t("buttonLogin");
  let actionLink = "/login";
  let statusColorClass = "text-emerald-500";

  if (!success) {
    if (errorType === "already_verified") {
      icon = <CheckCircle2 className="w-12 h-12 stroke-[1.5] text-emerald-500" />;
      title = t("alreadyVerifiedTitle");
      subtitle = "";
      description = t("alreadyVerifiedDescription");
      actionText = t("buttonLogin");
      actionLink = "/login";
      statusColorClass = "text-emerald-500";
    } else if (errorType === "expired") {
      icon = <AlertTriangle className="w-12 h-12 stroke-[1.5] text-amber-500" />;
      title = t("expiredTitle");
      subtitle = "";
      description = t("expiredDescription");
      actionText = t("buttonHome");
      actionLink = "/";
      statusColorClass = "text-amber-500";
    } else if (errorType === "network") {
      icon = <XCircle className="w-12 h-12 stroke-[1.5] text-rose-500" />;
      title = t("networkErrorTitle");
      subtitle = "";
      description = t("networkErrorDescription");
      actionText = t("buttonHome");
      actionLink = "/";
      statusColorClass = "text-rose-500";
    } else {
      // invalid or fallback
      icon = <XCircle className="w-12 h-12 stroke-[1.5] text-rose-500" />;
      title = t("invalidTitle");
      subtitle = "";
      description = t("invalidDescription");
      actionText = t("buttonHome");
      actionLink = "/";
      statusColorClass = "text-rose-500";
    }
  }

  return (
    <div className="w-full max-w-xl bg-background/60 backdrop-blur-xl border border-foreground/5 p-8 md:p-12 shadow-2xl relative rounded-sm text-center">
      {/* Subtle geometric art accents */}
      <div className="absolute top-4 right-4 w-12 h-12 text-accent/10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor"><path d="M0 100 L100 0 L100 100 Z" /></svg>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-accent/20 blur-md animate-pulse"></div>
          <div className="relative bg-background border border-foreground/5 p-6 rounded-full shadow-inner flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4">
        {title}
      </h1>

      {subtitle && (
        <div className={`font-medium text-sm tracking-wider uppercase mb-8 ${statusColorClass}`}>
          {subtitle}
        </div>
      )}

      <p className="text-foreground/70 font-light leading-relaxed mb-10">
        {description || message}
      </p>

      <div className="flex flex-col gap-4">
        <Link
          href={actionLink}
          className="w-full bg-foreground text-background py-5 px-8 text-xs uppercase tracking-[0.4em] font-bold hover:bg-accent hover:text-white hover:shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)] transition-all duration-500 shadow-xl group flex items-center justify-center gap-4"
        >
          {actionText}
          {actionLink === "/login" ? (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          ) : (
            <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
          )}
        </Link>
      </div>
    </div>
  );
}

export default function RegisterVerifyPage() {
  return (
    <div className="flex min-h-screen w-full canvas-texture canvas-grain items-center justify-center relative overflow-hidden px-6 py-20">
      {/* Background blobs for premium glassmorphism vibe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
        <AnimatedBlob className="top-[10%] left-[20%] w-[30rem] h-[30rem]" color="accent" />
        <AnimatedBlob className="bottom-[10%] right-[20%] w-[25rem] h-[25rem]" color="slate" />
      </div>

      <Suspense fallback={
        <div className="w-full max-w-xl bg-background/60 backdrop-blur-xl border border-foreground/5 p-8 md:p-12 shadow-2xl rounded-sm text-center flex items-center justify-center min-h-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        </div>
      }>
        <RegisterVerifyContent />
      </Suspense>
    </div>
  );
}
