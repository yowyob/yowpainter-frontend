"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { useAuthStore, getDashboardRoute } from "@/store/authStore";
import { toast } from "@/lib/toast";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/lib/api-error-handler";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("Admin");
  const adminLogin = useAuthStore((state) => state.adminLogin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await adminLogin({ email, password });
      toast.success(t("loginSuccess"), t("loginWelcome", { name: user.firstName || user.email || "" }));
      router.push(getDashboardRoute(user.role));
    } catch (err: unknown) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(err, t("loginTitle"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-white/10 rounded-3xl p-10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-accent/20 text-accent">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="font-serif text-3xl">{t("loginTitle")}</h1>
            <p className="text-white/50 text-sm">{t("loginSubtitle")}</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">{t("emailLabel")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">{t("passwordLabel")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-xl text-xs uppercase tracking-[0.3em] font-bold hover:bg-accent/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : t("loginSubmit")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/40">
          {t("noAccount")}{" "}
          <Link href="/admin/register" className="text-accent hover:underline">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
