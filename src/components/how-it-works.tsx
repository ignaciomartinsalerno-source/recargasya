import { CheckCircle2, CreditCard, ListChecks, Smartphone } from "lucide-react";

const STEPS = [
  {
    icon: Smartphone,
    title: "1. Elegí tu compañía",
    text: "Movistar, Claro, Personal o Tuenti. Ingresá el número de línea a recargar.",
  },
  {
    icon: ListChecks,
    title: "2. Seleccioná el monto",
    text: "Mirá las ofertas de la semana y elegí el monto que más crédito te da.",
  },
  {
    icon: CreditCard,
    title: "3. Pagá con tarjeta",
    text: "Crédito o débito. El total y el crédito a acreditar se muestran antes de confirmar.",
  },
  {
    icon: CheckCircle2,
    title: "4. Recibí tu saldo",
    text: "Te confirmamos la operación y el crédito llega a la línea en segundos.",
  },
];

const FAQ = [
  {
    q: "¿Cuánto tarda en acreditarse la recarga?",
    a: "En general es inmediata. En momentos de mucha demanda puede demorar unos minutos.",
  },
  {
    q: "¿Puedo recargar una línea que no es mía?",
    a: "Sí. Solo necesitás el número y la compañía de esa línea.",
  },
  {
    q: "¿Cómo funcionan las ofertas semanales?",
    a: "Cada compañía define montos promocionales que multiplican tu crédito. Se renuevan todos los lunes.",
  },
  {
    q: "¿Cómo obtengo el bono de $5000?",
    a: "Se suma automáticamente en tu primer pago con tarjeta, junto con la promo del monto elegido.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-surface-tint">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Cómo funciona</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Recargar te lleva menos de un minuto. Así de simple:
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                <Icon className="h-6 w-6 text-brand" />
              </span>
              <h3 className="mt-4 text-base font-bold text-card-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <h3 className="text-xl font-bold text-foreground lg:col-span-2">Preguntas frecuentes</h3>
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-card-foreground">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
