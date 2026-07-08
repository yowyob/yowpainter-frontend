import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LandingArtists } from "@/components/layout/LandingArtists";
import { LandingNews } from "@/components/layout/LandingNews";
import { LandingAcquisitions } from "@/components/layout/LandingAcquisitions";
import { LandingAtelier } from "@/components/layout/LandingAtelier";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="relative w-full canvas-texture canvas-grain pb-24 selection:bg-accent selection:text-white overflow-hidden">

      {/* TÂCHES DE COULEURS ABSTRAITES & DIFFORMES (L'Aquarelle) - TRÈS PROFOND */}
      <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 dark:bg-accent/20 blur-[100px] z-[-20] animate-blob" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}></div>
      <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[60vw] bg-amber-500/10 dark:bg-amber-600/15 blur-[120px] z-[-20] animate-blob-delayed" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}></div>
      <div className="absolute bottom-[10%] left-[10%] w-[45vw] h-[40vw] bg-slate-400/10 dark:bg-slate-500/15 blur-[130px] z-[-20] animate-blob" style={{ borderRadius: "75% 25% 67% 33% / 45% 74% 26% 55%" }}></div>
      <div className="absolute top-[60%] right-[10%] w-[35vw] h-[35vw] bg-rose-400/5 dark:bg-rose-900/20 blur-[100px] z-[-20] animate-blob-delayed" style={{ borderRadius: "46% 54% 21% 79% / 51% 26% 74% 49%" }}></div>

      {/* FIGURES GÉOMÉTRIQUES ABSTRAITES (Type Kandinsky / Miro) - DERRIÈRE LE TEXTE */}
      <div className="absolute inset-0 z-[-10] pointer-events-none overflow-hidden">

        {/* Ligne courbe éclatante - Décalée sur le côté */}
        <svg className="absolute top-[5%] left-[-15%] w-[45vw] h-[45vw] text-foreground/20 opacity-80 transform -rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M10,190 Q90,10 190,190" strokeDasharray="8,12" strokeLinecap="round" />
        </svg>

        {/* Arc géométrique strict - Plus haut */}
        <svg className="absolute top-[2%] right-[5%] w-[25vw] h-[25vw] text-accent/40 opacity-100 animate-spin-slow" style={{ animationDuration: '60s' }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="100 200" strokeLinecap="round" />
        </svg>

        {/* Forme brute asymétrique - Décalée */}
        <svg className="absolute top-[45%] right-[-15%] w-[35vw] h-[35vw] text-foreground/10 opacity-100 transform rotate-45" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <polygon fill="currentColor" points="120,0 20,200 200,90 0,90 180,200" />
        </svg>

        {/* Lignes parallèles hachurées - Déplacées pour éviter "Nouvelles Acquisitions" */}
        <svg className="absolute top-[40%] left-[-5%] w-[15vw] h-[15vw] text-accent/30 opacity-100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="3" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="3" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="3" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="3" />
        </svg>

        {/* Trio de cercles flottants francs - Déplacés */}
        <div className="absolute top-[60%] left-[5%] w-16 h-16 rounded-full border-4 border-foreground/15 opacity-100"></div>
        <div className="absolute top-[62%] left-[3%] w-10 h-10 rounded-full bg-accent/30 opacity-90"></div>
        <div className="absolute top-[65%] left-[7%] w-6 h-6 rounded-full border-2 border-accent opacity-80 bg-foreground/10"></div>

        {/* Tâche géante (Triangle Penché) - Vers le bas */}
        <svg className="absolute top-[85%] left-[-15%] w-[40vw] h-[40vw] text-amber-500/10 opacity-100 transform -rotate-[45deg]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,200 L200,200 L100,0 Z" />
        </svg>

      </div>

      {/* 1. HERO SECTION: Musée Contemporain */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-center pt-16 px-6 sm:px-12 max-w-[1400px] mx-auto z-10">

        {/* Lettrine Géante en Arrière-plan */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 font-serif text-[40rem] font-black text-foreground/[0.03] select-none pointer-events-none z-0 leading-none">
          Y
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">

          {/* Bloc Texte Épuré */}
          <div className="w-full lg:w-1/2 flex flex-col items-start reveal">
            <div className="relative mb-6 reveal-delay-1">
              <p className="text-accent uppercase tracking-[0.4em] text-sm font-bold flex items-center gap-4">
                <span className="w-12 h-[1.5px] bg-accent"></span> {t("eyebrow")}
              </p>
              {/* Éclaboussure de peinture subtile derrière le tag */}
              <svg className="absolute -top-10 -left-10 w-32 h-32 text-accent/10 -z-10 opacity-60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70,-57.9,78.7,-44.5C87.4,-31.1,93.1,-15.5,91.3,-0.9C89.5,13.6,80.3,27.2,71.2,40.1C62.1,53,53.2,65.3,41.4,73.1C29.6,80.9,14.8,84.1,-0.7,85.2C-16.1,86.4,-32.3,85.5,-46.1,78.9C-59.9,72.3,-71.4,60,-79,45.8C-86.6,31.7,-90.4,15.8,-89.4,0.6C-88.3,-14.7,-82.5,-29.3,-74.1,-42.2C-65.7,-55.1,-54.7,-66.2,-41.7,-73.7C-28.7,-81.3,-14.4,-85.2,0.4,-85.9C15.2,-86.6,31.1,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] font-medium leading-[0.95] tracking-tighter mb-10 text-foreground reveal-delay-2">
              {t("heroTitleLine1")} <br />
              <span className="relative">
                {t("heroTitleLine2")}
                <span className="absolute -bottom-2 left-0 w-full h-8 bg-accent/5 -z-10 transform -rotate-1"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-lg font-light leading-relaxed mb-12 border-l-2 border-accent pl-8 py-2 reveal-delay-3">
              {t("heroDescription")}
            </p>

            <div className="flex items-center gap-10">
              <Link href="/galerie" className="group flex items-center gap-6 border-b border-foreground pb-3 hover:border-accent hover:text-accent transition-all duration-500">
                <span className="font-serif text-2xl tracking-tight transition-colors">{t("heroCta")}</span>
                <div className="w-12 h-[1px] bg-foreground group-hover:bg-accent group-hover:w-20 transition-all duration-500"></div>
              </Link>
            </div>
          </div>

          {/* Composition Image Héro (Audacieuse) */}
          <div className="w-full lg:w-1/2 relative h-[600px] lg:h-[800px] mt-12 lg:mt-0 flex items-center justify-center reveal reveal-delay-2">

            {/* Illustration héro (PNG transparent) */}
            <div className="relative w-[380px] md:w-[520px] aspect-[3/4] z-20 parallax-slow">
              <Image
                src="/images/fondlanding-removebg-preview.png"
                alt={t("masterpieceAlt")}
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-contain"
                priority
              />
            </div>

            {/* Forme géométrique décalée */}
            <div className="absolute top-[10%] left-0 w-[200px] h-[300px] bg-accent/5 border border-accent/10 z-10 transform -rotate-12"></div>
            <div className="absolute bottom-[5%] right-0 w-[250px] h-[250px] rounded-full border-[0.5px] border-foreground/10 z-0"></div>

            <div className="absolute right-[-2rem] top-1/3 translate-y-1/2 rotate-90 origin-right hidden lg:block z-30">
              <p className="text-xs tracking-[0.6em] uppercase text-foreground/30 font-bold">{t("sideLabel")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION DRIP / SPLASH */}
      <div className="w-full h-20 flex justify-center items-start overflow-hidden pointer-events-none relative z-10">
        <svg className="w-64 h-full text-accent/10 opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,0 C20,40 40,0 60,60 C80,20 100,80 100,0 L100,0 L0,0 Z" />
        </svg>
      </div>

      {/* 2. PÉPITES ARTISTIQUES: MASONRY ASYMÉTRIQUE */}
      <LandingAcquisitions />

      {/* ACTUALITÉS : Fil d'Ariane & Carrousel */}
      <LandingNews />

      {/* ATELIER : Invitation à l'apprentissage */}
      <LandingAtelier />

      {/* 3. LE HUB DES ARTISTES: Présentation solennelle & Annuaire */}
      <section className="relative z-10 w-full bg-foreground text-background mt-24 py-20 px-6 sm:px-12 overflow-hidden">
        {/* Tâche de peinture abstraite très foncée pour casser le bloc solide */}
        <div className="absolute top-[10%] left-[-10%] w-[30vw] h-[30vw] bg-accent/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}></div>

        <LandingArtists />
      </section>

    </div>
  );
}
