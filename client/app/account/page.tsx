import AccountGate from "@/components/account/AccountGate";
import AccountDashboard from "@/components/account/AccountDashboard";
import SiteContainer from "@/components/ui/SiteContainer";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="py-12 lg:py-16">
        <AccountGate>
          <AccountDashboard />
        </AccountGate>
      </SiteContainer>
    </main>
  );
}