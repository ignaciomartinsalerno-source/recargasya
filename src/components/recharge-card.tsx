import { useState } from "react";
import { ArrowRight, CreditCard, Gift, Smartphone } from "lucide-react";

export const OPERATORS = [
  { name: "Movistar", initials: "M", tone: "bg-brand text-brand-foreground" },
  { name: "Claro", initials: "C", tone: "bg-destructive text-destructive-foreground" },
  { name: "Personal", initials: "P", tone: "bg-sky text-navy-deep" },
  { name: "Tuenti", initials: "T", tone: "bg-navy text-navy-foreground" },
];

const AMOUNTS = ["$500", "$1.000", "$2.000", "$5.000", "$10.000"];

const PAYMENT_METHODS = [
  { id: "credit", label: "Tarjeta de crédito", icon: CreditCard },
  { id: "debit", label: "Tarjeta de débito", icon: CreditCard },
];

function parseAmount(value: string): number {
  return Number(value.replace(/\D/g, ""));
}

function formatMoney(value: number): string {
  return "$" + value.toLocaleString("es-AR");
}

export function RechargeCard() {
  const [operator, setOperator] = useState("Movistar");
  const [amount, setAmount] = useState("$1.000");
  const [phone, setPhone] = useState("");
  const [notice, setNotice] = useState(false);

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
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${op.tone}`}
            >
              {op.initials}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">{op.name}</span>
          </button>
        ))}
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
        {AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(a)}
            className={`rounded-xl border px-1 py-2.5 text-xs font-semibold transition-colors ${
              amount === a
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border text-card-foreground hover:border-brand/40"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <button
        onClick={() => setNotice(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
      >
        Recargar ahora <ArrowRight className="h-4 w-4" />
      </button>
      {notice && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Esta es una demostración: todavía no se procesan recargas reales.
        </p>
      )}
    </div>
  );
}
