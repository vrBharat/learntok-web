import { Navbar } from "@/components/Navbar";
import { Header } from "@/components/Header";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <Navbar />
            <main className="flex-1 md:ml-64 flex flex-col">
                <Header />
                <div className="flex-1 pb-20 md:pb-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
