export default function Loading() {
  return (
    <section className="min-h-screen bg-background px-4 pt-32">
      <div className="mx-auto max-w-[82rem]">
        <div className="h-5 w-40 animate-pulse rounded-full bg-surface" />

        <div className="mt-6 h-12 w-full max-w-xl animate-pulse rounded-md bg-surface" />

        <div className="mt-4 h-5 w-full max-w-md animate-pulse rounded-md bg-surface" />
        <div className="mt-3 h-5 w-full max-w-sm animate-pulse rounded-md bg-surface" />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="h-64 animate-pulse rounded-lg bg-surface" />
          <div className="h-64 animate-pulse rounded-lg bg-surface" />
          <div className="h-64 animate-pulse rounded-lg bg-surface" />
        </div>
      </div>
    </section>
  );
}