import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import GalerieClient from "./GalerieClient";
import { ArtworksService } from "@/lib/services/ArtworksService";
import { configureServerApi } from "@/lib/serverApiInit";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Gallery" });

    return pageMetadata({
        locale,
        path: "/galerie",
        title: t("metadataTitle"),
        description: t("metadataDescription"),
    });
};

export default async function GaleriePage(
    props: {
        params: Promise<{ locale: string }>;
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }
) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    configureServerApi();

    const searchParams = await props.searchParams;
    const queryClient = new QueryClient();

    const filters = {
        technique: (searchParams.technique as string) || undefined,
        style: (searchParams.style as string) || undefined,
        search: (searchParams.search as string) || undefined,
    };

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
