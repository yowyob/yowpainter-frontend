"use client";

import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

interface SearchBarProps {
    initialValue: string;
    onSearch: (value: string) => void;
}

export default function SearchBar({ initialValue, onSearch }: SearchBarProps) {
    const t = useTranslations("Gallery");
    const { register, handleSubmit } = useForm({
        defaultValues: {
            search: initialValue,
        },
    });

    const onSubmit = (data: { search: string }) => {
        onSearch(data.search);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full max-w-2xl mx-auto group"
        >
            <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/30 group-focus-within:text-accent transition-colors" />
            </div>

            <input
                {...register("search")}
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full bg-white dark:bg-white/5 border border-foreground/10 rounded-full py-3.5 sm:py-5 pl-12 sm:pl-16 pr-24 sm:pr-32 text-base sm:text-lg font-light placeholder:text-foreground/30 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all shadow-sm"
            />

            <button
                type="submit"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-foreground text-background dark:bg-accent dark:text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white dark:hover:bg-foreground transition-all shadow-md"
            >
                {t("searchButton")}
            </button>
        </form>
    );
}
