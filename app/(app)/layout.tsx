import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserFinanceData } from "@/lib/dal";
import { FinanceStoreProvider } from "@/lib/store";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Toaster } from "@/components/ui/toaster";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getUserFinanceData(session.user.id);

  return (
    <FinanceStoreProvider data={data}>
      <div className="flex min-h-screen w-full min-w-0 bg-background">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-8">
            <div className="mx-auto min-w-0 max-w-7xl animate-fade-in">{children}</div>
          </main>
        </div>
        <MobileBottomNav />
        <Toaster />
      </div>
    </FinanceStoreProvider>
  );
}
