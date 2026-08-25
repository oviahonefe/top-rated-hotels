export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 sm:p-8">
      <div className="mx-auto w-full max-w-[82rem] animate-pulse">
        <div className="h-6 w-44 bg-slate-200" />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-32 bg-slate-200" />
          <div className="h-32 bg-slate-200" />
          <div className="h-32 bg-slate-200" />
          <div className="h-32 bg-slate-200" />
        </div>

        <div className="mt-8 h-80 bg-slate-200" />
      </div>
    </main>
  );
}