import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { z } from "zod";

import { SiteFooter, SiteHeader } from "@/components/site-header";
import { formatMoney } from "@/lib/catalog";
import { getCheckoutResult } from "@/lib/checkout.functions";

export const Route = createFileRoute("/pago-exitoso")({
  validateSearch: z.object({ session_id: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Pago aprobado — RecargasYa" },
      { name: "description", content: "Confirmación de tu pago y de la recarga en camino." },
      { property: "og:title", content: "Pago aprobado — RecargasYa" },
      { property: "og:description", content: "Confirmación de tu pago y de la recarga en camino." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagoExitoso,
});

function PagoExitoso() {
  const { session_id: sessionId } = Route.useSearch();
  const fetchResult = useServerFn(getCheckoutResult);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["checkout-result", sessionId],
    queryFn: () => fetchResult({ data: { sessionId: sessionId! } }),
    enabled: Boolean(sessionId),
    retry: 1,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          {isLoading && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand" />
              <h1 className="mt-4 text-xl font-bold text-card-foreground">
                Confirmando tu pago…
              </h1>
            </>
          )}

          {!isLoading && (isError || !sessionId || !data?.paid) && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-destructive" />
              <h1 className="mt-4 text-xl font-bold text-card-foreground">
                No pudimos confirmar el pago
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Si te llegó el débito en tu tarjeta, escribinos y lo resolvemos.
              </p>
            </>
          )}

          {!isLoading && data?.paid && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
              <h1 className="mt-4 text-2xl font-extrabold text-card-foreground">
                ¡Pago aprobado!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu recarga de {data.operator} está en camino.
              </p>
              <div className="mt-6 space-y-2 rounded-xl bg-surface-tint p-4 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operador</span>
                  <span className="font-semibold text-card-foreground">{data.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Línea</span>
                  <span className="font-semibold text-card-foreground">{data.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagaste</span>
                  <span className="font-semibold text-card-foreground">
                    {formatMoney(data.charged)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Crédito a acreditar</span>
                  <span className="font-bold text-success">{formatMoney(data.credit)}</span>
                </div>
              </div>
            </>
          )}

          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
