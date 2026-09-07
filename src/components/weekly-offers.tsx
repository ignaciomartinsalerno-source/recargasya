import { useState } from "react";
import { CalendarClock, Flame, Sparkles } from "lucide-react";

import { formatMoney, OPERATORS } from "@/components/recharge-card";

export function WeeklyOffers() {
  const [active, setActive] = useState(OPERATORS[0].name);
  const operator = OPERATORS.find((op) => op.name === active) ?? OPERATORS[0];

  return (
    <section id="ofertas" className="scroll-mt-20 bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand">
              <Flame className="h-3.5 w-3.5" /> Ofertas semanales
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Cargás menos, recibís más
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Cada compañía tiene sus propias promos. Elegí tu operador y mirá cuánto crédito te
              llevás por cada monto.
            </p>
          </div>
          <p className="flex items-center gap-2 rounded-full bg-surface-tint px-4 py-2 text-xs font-semibold text-muted-foreground">
            <CalendarClock className="h-4 w-4 text-brand" />
            Promos válidas de lunes a domingo
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {OPERATORS.map((op) => (
            <button
              key={op.name}
              onClick={() => setActive(op.name)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                op.name === active
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-card text-muted-foreground hover:border-brand/40"
              }`}
            >
              <img
                src={op.logo}
                alt={`Logo oficial de ${op.name}`}
                className="max-h-5 max-w-[70px] object-contain"
              />
              {op.name}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {operator.offers.map((offer) => {
            const multiplier = offer.receive / offer.load;
            const extra = offer.receive - offer.load;
            return (
              <article
                key={offer.load}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
              >
                <span className="absolute right-4 top-4 rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                  x{multiplier % 1 === 0 ? multiplier : multiplier.toFixed(1)}
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Cargás
                </p>
                <p className="text-2xl font-extrabold text-card-foreground">
                  {formatMoney(offer.load)}
                </p>
                <div className="mt-4 rounded-xl bg-surface-tint px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recibís
                  </p>
                  <p className="text-2xl font-extrabold text-success">
                    {formatMoney(offer.receive)}
                  </p>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
                  {formatMoney(extra)} de crédito extra sin costo
                </p>
                <a
                  href="#recargar"
                  className="mt-5 block rounded-xl bg-brand py-2.5 text-center text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
                >
                  Aprovechar oferta
                </a>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Las promos se acreditan junto con la recarga en la línea que indiques. Un beneficio por
          línea por semana.
        </p>
      </div>
    </section>
  );
}
