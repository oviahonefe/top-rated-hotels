"use client";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
          Admin platform error
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          We could not load this page.
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {error.message || "Please try again or return to the dashboard."}
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-7 h-11 bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Try again
        </button>
      </section>
    </main>
  );
}