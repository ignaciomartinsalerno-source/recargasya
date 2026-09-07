import { useState } from "react";
import { ArrowRight, CreditCard, Flame, Gift, Smartphone } from "lucide-react";

import movistarLogo from "@/assets/logos/movistar.svg";
import claroLogo from "@/assets/logos/claro.svg";
import personalLogo from "@/assets/logos/personal.svg";
import tuentiLogo from "@/assets/logos/tuenti.svg";

export interface Offer {
  load: number;
  receive: number;
  tag: string;
}

export const OPERATORS: { name: string; logo: string; offers: Offer[] }[] = [
  {
    name: "Movistar",
    logo: movistarLogo,
    offers: [
      { load: 2000, receive: 4000, tag: "¡Se duplica!" },
      { load: 5000, receive: 12000, tag: "¡x2,4 de regalo!" },
      { load: 10000, receive: 25000, tag: "¡Super promo!" },
    ],
  },
  {
    name: "Claro",
    logo: claroLogo,
    offers: [
      { load: 1000, receive: 2000, tag: "¡Se duplica!" },
      { load: 2000, receive: 5000, tag: "¡x2,5 de regalo!" },
      { load: 5000, receive: 11000, tag: "¡Imperdible!" },
    ],
  },
  {
    name: "Personal",
    logo: personalLogo,
    offers: [
      { load: 1000, receive: 2200, tag: "¡x2,2 de regalo!" },
      { load: 2000, receive: 4000, tag: "¡Se duplica!" },
      { load: 10000, receive: 22000, tag: "¡Mega promo!" },
    ],
  },
  {
    name: "Tuenti",
    logo: tuentiLogo,
    offers: [
      { load: 500, receive: 1200, tag: "¡x2,4 de regalo!" },
      { load: 1000, receive: 2500, tag: "¡x2,5 de regalo!" },
      { load: 5000, receive: 10000, tag: "¡Se duplica!" },
    ],
  },
];

const AMOUNTS = [500, 1000, 2000, 5000, 10000];

const PAYMENT_METHODS = [
  { id: "credit", label: "Tarjeta de crédito", icon: CreditCard },
  { id: "debit", label: "Tarjeta de débito", icon: CreditCard },
];

export function formatMoney(value: number): string {
  return "$" + value.toLocaleString("es-AR");
}

export function RechargeCard() {
  const [operator, setOperator] = useState("Movistar");
  const [amount, setAmount] = useState(1000);
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | null>(null);
  const [notice, setNotice] = useState(false);

  const current = OPERATORS.find((op) => op.name === operator) ?? OPERATORS[0]!;
  const activeOffer = current.offers.find((offer) => offer.load === amount);
  const bonus = (activeOffer ? activeOffer.receive - activeOffer.load : 0) + 5000;
  const totalCredit = formatMoney(amount + bonus);

  return (
    <div className="rounded-2xl bg-card p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-card-foreground">Hacé tu recarga</h2>

      <p className="mt-5 text-sm font-semibold text-card-foreground">1. Seleccioná un operador</p>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {OPERATORS.map((op) => (
          <button
            key={op.name}
            onClick={() => setOperator(op.name)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
              operator === op.name
                ? "border-brand bg-brand/5"
                : "border-border hover:border-brand/40"
            }`}
          >
            <span className="flex h-8 w-full items-center justify-center">
              <img src={op.logo} alt={`Logo de ${op.name}`} className="max-h-6 max-w-full object-contain" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">{op.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-brand/25 bg-brand/5 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
          <Flame className="h-3.5 w-3.5" /> Ofertas {current.name}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {current.offers.map((offer) => (
            <button
              key={offer.load}
              onClick={() => setAmount(offer.load)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                amount === offer.load
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-brand/30 bg-card text-card-foreground hover:border-brand/60"
              }`}
            >
              {formatMoney(offer.load)} → {formatMoney(offer.receive)}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-card-foreground">2. Ingresá el número</p>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border px-3 py-3">
        <Smartphone className="h-4 w-4 text-muted-foreground" />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          placeholder="Ej: 11 1234 5678"
          className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <p className="mt-5 text-sm font-semibold text-card-foreground">3. Elegí el monto</p>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {AMOUNTS.map((a) => {
          const offer = current.offers.find((o) => o.load === a);
          return (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`relative rounded-xl border px-1 py-2.5 text-xs font-semibold transition-colors ${
                amount === a
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border text-card-foreground hover:border-brand/40"
              }`}
            >
              {formatMoney(a)}
              {offer && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-success px-1.5 py-0.5 text-[9px] font-bold text-white">
                  ¡x2!
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeOffer && (
        <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-xs font-semibold text-success">
          {activeOffer.tag} Recargás {formatMoney(activeOffer.load)} y recibís{" "}
          {formatMoney(activeOffer.receive)}.
        </p>
      )}

      <p className="mt-5 text-sm font-semibold text-card-foreground">4. Elegí cómo pagar</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id as "credit" | "debit")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
              paymentMethod === method.id
                ? "border-brand bg-brand/5"
                : "border-border hover:border-brand/40"
            }`}
          >
            <method.icon className="h-6 w-6 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">{method.label}</span>
          </button>
        ))}
      </div>

      {paymentMethod && (
        <div className="mt-5 rounded-xl border border-success/30 bg-success/10 p-4">
          <div className="flex items-center gap-2 text-success">
            <Gift className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Promo primer abono</span>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between text-card-foreground">
              <span>Recarga</span>
              <span>{formatMoney(amount)}</span>
            </div>
            {activeOffer && (
              <div className="flex justify-between font-semibold text-success">
                <span>Oferta {current.name}</span>
                <span>+{formatMoney(activeOffer.receive - activeOffer.load)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-success">
              <span>Bono de bienvenida</span>
              <span>+$5.000</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-success/20 pt-2 font-bold text-card-foreground">
              <span>Total a recibir</span>
              <span>{totalCredit}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setNotice(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
      >
        Recargar ahora <ArrowRight className="h-4 w-4" />
      </button>
      {notice && (
        <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-center text-xs font-semibold text-success">
          ¡Recarga enviada! En breve recibirás el crédito en tu línea.
        </p>
      )}
    </div>
  );
}
