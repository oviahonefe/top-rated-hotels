import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
          404
        </p>

        <h1 className="mt-4 text-4xl font-extrabold text-primary">
          Page not found
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          The page you requested does not exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}