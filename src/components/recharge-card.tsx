import { useState } from "react";
import { ArrowRight, CheckCircle2, CreditCard, Flame, Gift, Loader2, Lock, Smartphone } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";

import { saveOrder } from "@/lib/checkout.functions";

import movistarLogo from "@/assets/logos/movistar.svg";
import claroLogo from "@/assets/logos/claro.svg";
import personalLogo from "@/assets/logos/personal.svg";
import tuentiLogo from "@/assets/logos/tuenti.svg";
import {
  AMOUNTS,
  OPERATOR_CATALOG,
  WELCOME_BONUS,
  formatMoney,
  quote,
  type Offer,
  type PaymentMethodId,
} from "@/lib/catalog";


export type { Offer };
export { formatMoney };

const LOGOS: Record<string, string> = {
  Movistar: movistarLogo,
  Claro: claroLogo,
  Personal: personalLogo,
  Tuenti: tuentiLogo,
};

export const OPERATORS = OPERATOR_CATALOG.map((op) => ({
  ...op,
  logo: LOGOS[op.name] ?? movistarLogo,
}));

const PAYMENT_METHODS: { id: PaymentMethodId; label: string; icon: typeof CreditCard }[] = [
  { id: "credit", label: "Tarjeta de crédito", icon: CreditCard },
  { id: "debit", label: "Tarjeta de débito", icon: CreditCard },
];

type CardBrand = "visa" | "mastercard" | "amex" | null;

function detectBrand(digits: string): CardBrand {
  if (/^3[47]/.test(digits)) return "amex";
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
  return null;
}

function VisaBadge({ label }: { label?: string }) {
  return (
    <span
      className="flex h-7 min-w-[52px] items-center justify-center gap-1 rounded-md border border-border bg-white px-2 shadow-sm"
      aria-label={label ? `Visa ${label}` : "Visa"}
    >
      <span className="text-[12px] font-black italic leading-none tracking-wide text-[#1A1F71]">
        VISA
      </span>
      {label && (
        <span className="text-[9px] font-bold uppercase leading-none text-[#1A1F71]/70">
          {label}
        </span>
      )}
    </span>
  );
}

function MastercardBadge() {
  return (
    <span
      className="flex h-7 min-w-[52px] items-center justify-center gap-1 rounded-md border border-border bg-white px-2 shadow-sm"
      aria-label="Mastercard"
    >
      <svg viewBox="0 0 36 22" className="h-4 w-7" aria-hidden="true">
        <circle cx="13" cy="11" r="9" fill="#EB001B" />
        <circle cx="23" cy="11" r="9" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
      <span className="text-[8px] font-bold uppercase leading-none text-muted-foreground">
        Master
      </span>
    </span>
  );
}

function AmexBadge() {
  return (
    <span
      className="flex h-7 min-w-[52px] items-center justify-center rounded-md border border-border bg-[#2E77BC] px-2 shadow-sm"
      aria-label="American Express"
    >
      <span className="text-[11px] font-black leading-none tracking-wide text-white">AMEX</span>
    </span>
  );
}

function CardBrandBadge({ brand }: { brand: CardBrand }) {
  if (brand === "visa") return <VisaBadge />;
  if (brand === "mastercard") return <MastercardBadge />;
  if (brand === "amex") return <AmexBadge />;
  return null;
}

export function RechargeCard() {
  const saveOrderFn = useServerFn(saveOrder);
  const [operator, setOperator] = useState("Movistar");
  const [amount, setAmount] = useState(1000);
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [docId, setDocId] = useState("");

  const current = OPERATORS.find((op) => op.name === operator) ?? OPERATORS[0]!;
  const activeOffer = current.offers.find((offer) => offer.load === amount);
  const priced = quote(current.name, amount);
  const totalCredit = formatMoney(priced?.credit ?? amount + WELCOME_BONUS);

  const digits = phone.replace(/\D/g, "");
  const cardDigits = cardNumber.replace(/\D/g, "");
  const canPay =
    Boolean(paymentMethod) &&
    digits.length === 10 &&
    cardDigits.length >= 15 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvv.length >= 3 &&
    holder.trim().length >= 3;

  function formatCard(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  }

  function handlePay() {
    if (!canPay || loading || !paymentMethod) return;
    setError(null);
    setLoading(true);
    // Solo se guarda operador, línea, monto y medio de pago. Nunca datos de tarjeta.
    saveOrderFn({
      data: { operator: current.name, phone: digits, amount, paymentMethod },
    })
      .catch(() => {
        // El pago simulado continúa aunque falle el guardado
      })
      .finally(() => {
        window.setTimeout(() => {
          setLoading(false);
          setDone(true);
        }, 1200);
      });
  }

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
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric"
          maxLength={10}
          placeholder="Ej: 1122104567"
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-card-foreground">4. Elegí cómo pagar</p>
        <div className="flex items-center gap-1.5" aria-label="Tarjetas aceptadas">
          <VisaBadge label="Crédito" />
          <VisaBadge label="Débito" />
          <MastercardBadge />
          <AmexBadge />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
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
        <div className="mt-5">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-slate-100 shadow-xl ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                === Tarjeta Demo ===
              </span>
              <CreditCard className="h-5 w-5 text-slate-400" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              <p className="text-slate-400">Nombre</p>
              <p className="text-right font-semibold">USUARIO DEMO</p>
              <p className="text-slate-400">DNI</p>
              <p className="text-right font-semibold">00.000.000</p>
              <p className="text-slate-400">Tipo</p>
              <p className="text-right font-semibold">CRÉDITO</p>
              <p className="text-slate-400">Número</p>
              <p className="text-right font-mono font-semibold">XXXX XXXX XXXX XXXX</p>
              <p className="text-slate-400">Vencimiento</p>
              <p className="text-right font-mono font-semibold">XX/XX</p>
              <p className="text-slate-400">CVV</p>
              <p className="text-right font-mono font-semibold">XXX</p>
            </div>
            <div className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                === Solo demostración ===
              </p>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Datos ficticios — no corresponden a una tarjeta real.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-card-foreground">Datos de tu tarjeta</p>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-3 focus-within:border-brand">
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCard(e.target.value))}
                inputMode="numeric"
                placeholder="Número de tarjeta"
                className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
              />
              <CardBrandBadge brand={detectBrand(cardDigits)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                inputMode="numeric"
                placeholder="MM/AA"
                className="w-full rounded-xl border border-border px-3 py-3 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:border-brand"
              />
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                type="password"
                placeholder="CVV"
                className="w-full rounded-xl border border-border px-3 py-3 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:border-brand"
              />
            </div>
            <input
              value={holder}
              onChange={(e) => setHolder(e.target.value.slice(0, 40))}
              placeholder="Nombre del titular"
              className="w-full rounded-xl border border-border px-3 py-3 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:border-brand"
            />
            <input
              value={docId}
              onChange={(e) => setDocId(e.target.value.replace(/\D/g, "").slice(0, 11))}
              inputMode="numeric"
              maxLength={11}
              placeholder="DNI / CUIT (opcional)"
              className="w-full rounded-xl border border-border px-3 py-3 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:border-brand"
            />
          </div>
        </div>
      )}

      {paymentMethod && (
        <div className="mt-5 rounded-xl border border-success/30 bg-success/10 p-4">
          <div className="flex items-center gap-2 text-success">
            <Gift className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Promo primer abono</span>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between text-card-foreground">
              <span>Pagás</span>
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
              <span>+{formatMoney(WELCOME_BONUS)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-success/20 pt-2 font-bold text-card-foreground">
              <span>Total a recibir</span>
              <span>{totalCredit}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={!canPay || loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Procesando el pago…
          </>
        ) : (
          <>
            Pagar {formatMoney(amount)} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {done && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-3 text-xs font-semibold text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            ¡Pago aprobado! Acreditamos {totalCredit} en tu línea {phone || "seleccionada"} de{" "}
            {current.name}.
          </span>
        </div>
      )}

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
        <Lock className="h-3.5 w-3.5" /> Pago seguro con cifrado. No guardamos los datos de tu tarjeta.
      </p>


      {error && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
