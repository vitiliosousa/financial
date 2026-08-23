import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserFinanceData } from "@/lib/dal";
import { FinanceStoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/toaster";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getUserFinanceData(session.user.id);
  if (!data) redirect("/api/session-reset");

  return (
    <FinanceStoreProvider data={data}>
      <OnboardingScreen />
      <Toaster />
    </FinanceStoreProvider>
  );
}
