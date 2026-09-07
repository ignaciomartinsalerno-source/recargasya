import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/pago-cancelado")({
  head: () => ({
    meta: [
      { title: "Pago cancelado — RecargasYa" },
      { name: "description", content: "El pago no se completó. Podés intentar la recarga otra vez." },
      { property: "og:title", content: "Pago cancelado — RecargasYa" },
      {
        property: "og:description",
        content: "El pago no se completó. Podés intentar la recarga otra vez.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagoCancelado,
});

function PagoCancelado() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-brand" />
          <h1 className="mt-4 text-2xl font-extrabold text-card-foreground">Pago cancelado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No se hizo ningún cobro. Podés volver e intentar la recarga otra vez.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Volver a intentar
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
