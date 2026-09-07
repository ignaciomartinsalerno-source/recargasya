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
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | null>(null);
  const [notice, setNotice] = useState(false);

  const totalCredit = formatMoney(parseAmount(amount) + 5000);

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
              <span>{amount}</span>
            </div>
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
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Esta es una demostración: todavía no se procesan recargas reales.
        </p>
      )}
    </div>
  );
}
