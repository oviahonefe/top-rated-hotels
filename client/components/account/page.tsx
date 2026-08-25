import AccountGate from "@/components/account/AccountGate";
import FavoritesList from "@/components/account/FavoritesList";
import SiteContainer from "@/components/ui/SiteContainer";

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="py-12 lg:py-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
          Your travel account
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-primary">
          Saved stays
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          These properties are stored against your actual account.
        </p>

        <div className="mt-10">
          <AccountGate>{() => <FavoritesList />}</AccountGate>
        </div>
      </SiteContainer>
    </main>
  );
}