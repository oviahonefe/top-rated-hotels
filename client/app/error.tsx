"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
          Something went wrong
        </p>

        <h1 className="mt-4 text-4xl font-extrabold text-primary">
          We could not load this page.
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {error.message || "Please try again or return to the previous page."}
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Try again
        </button>
      </div>
    </section>
  );
}