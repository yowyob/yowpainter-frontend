import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import GalerieClient from "./GalerieClient";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { configureServerApi } from "@/lib/serverApiInit";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Gallery" });

    return {
        title: t("metadataTitle"),
        description: t("metadataDescription"),
        openGraph: {
            title: t("metadataTitle"),
            description: t("metadataDescription"),
            images: ["/images/og-gallery.png"],
        },
    };
};

export default async function GaleriePage(
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }
) {
    configureServerApi();

    const searchParams = await props.searchParams;
    const queryClient = new QueryClient();

    const filters = {
        technique: (searchParams.technique as string) || undefined,
        style: (searchParams.style as string) || undefined,
        search: (searchParams.search as string) || undefined,
    };

    // Prefetch data for SSR/ISR to match useArtworks client hook exactly
    await queryClient.prefetchQuery({
        queryKey: ["artworks", filters, undefined],
        queryFn: async () => {
            if (filters.search) {
                const { GlobalSearchService } = await import("@/lib/services/GlobalSearchService");
                const results = await GlobalSearchService.globalSearch(filters.search);
                return results.artworks || [];
            }
            return await ArtworksService.getLatestArtworks();
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <GalerieClient initialFilters={filters} />
        </HydrationBoundary>
    );
}
