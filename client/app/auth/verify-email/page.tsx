import Link from "next/link";
import EmailVerificationForm from "@/components/auth/EmailVerificationForm";
import SiteContainer from "@/components/ui/SiteContainer";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;

  if (!email) {
    return (
      <main className="min-h-screen bg-surface pt-20">
        <SiteContainer className="py-20">
          <h1 className="text-3xl font-extrabold text-primary">
            Verification link is incomplete
          </h1>
          <Link
            href="/auth/register"
            className="mt-5 inline-flex font-bold text-accent"
          >
            Create an account again
          </Link>
        </SiteContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="flex min-h-[calc(100svh-5rem)] items-center py-10">
        <section className="mx-auto w-full max-w-xl border border-border bg-background p-6 sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Verify your email
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-primary">
            Enter your security code
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We sent a six-digit code to <strong>{email}</strong>.
          </p>

          <EmailVerificationForm email={email} />
        </section>
      </SiteContainer>
    </main>
  );
}