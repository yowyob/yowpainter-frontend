import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AtelierFab from "@/components/layout/AtelierFab";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <AtelierFab />
            <main className="min-h-screen relative pt-16 sm:pt-20">
                {children}
            </main>
            <Footer />
        </>
    );
}
