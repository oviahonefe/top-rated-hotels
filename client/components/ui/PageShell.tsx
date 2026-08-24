type PageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function PageShell({ description, eyebrow, title }: PageShellProps) {
  return (
    <section className="bg-background pt-20">
      <div className="section-shell min-h-[calc(100vh-5rem)] py-16">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
