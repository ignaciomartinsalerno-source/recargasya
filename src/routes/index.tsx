import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CreditCard,
  Eye,
  Facebook,
  Gift,
  Headphones,
  Instagram,
  Lock,
  Mail,
  MessageCircle,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-header";
import { OPERATORS, RechargeCard } from "@/components/recharge-card";
import heroPhone from "@/assets/hero-phone.jpg";
import successPhone from "@/assets/success-phone.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RecargaYa — Recargá tu celular en segundos" },
      {
        name: "description",
        content:
          "Recargá saldo y comprá packs de datos de Movistar, Claro, Personal y Tuenti en segundos. Simple, rápido y seguro.",
      },
      { property: "og:title", content: "RecargaYa — Recargá tu celular en segundos" },
      {
        property: "og:description",
        content:
          "Recargá saldo y comprá packs de datos de Movistar, Claro, Personal y Tuenti en segundos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BENEFITS = [
  { icon: Zap, title: "Recarga inmediata", text: "Tu saldo se acredita en segundos." },
  { icon: CreditCard, title: "Pagá con tarjeta", text: "Crédito o débito, de forma segura." },
  { icon: Gift, title: "Bono de bienvenida", text: "$5000 en tu primer abono con tarjeta." },
  { icon: Headphones, title: "Soporte 24/7", text: "Estamos para ayudarte." },
];

function Index() {
  const [loginNotice, setLoginNotice] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader />

      {/* Portada */}
      <section className="relative overflow-hidden bg-navy">
        <div className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-success/15 px-4 py-2 text-sm font-semibold text-success">
            <Gift className="h-4 w-4" />
            Primera recarga con tarjeta: te regalamos $5000 de crédito de bono
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1fr_420px_240px] lg:items-center lg:px-8 lg:py-14">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-foreground sm:text-5xl lg:text-6xl">
              Recargá tu celular
              <br />
              <span className="text-sky">en segundos</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-navy-foreground/75">
              Simple, rápido y seguro. Recargá saldo, comprá packs de datos y mucho más, desde donde
              estés.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { icon: Zap, label: "Carga inmediata" },
                { icon: Shield, label: "100% seguro" },
                { icon: Smartphone, label: "Desde cualquier dispositivo" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-5 w-5 text-navy-foreground" />
                  </span>
                  <span className="max-w-[7rem] text-sm text-navy-foreground/85">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <RechargeCard />

          <img
            src={heroPhone}
            alt="Celular mostrando una recarga de saldo en curso"
            width={1024}
            height={1280}
            className="mx-auto hidden max-h-[420px] w-auto rounded-2xl object-cover lg:block"
          />
        </div>
      </section>

      {/* Operadores */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Nuestros operadores</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Recargá saldo y comprá packs de datos en las principales compañías.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OPERATORS.map((op) => (
              <div key={op.name} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${op.tone}`}
                  >
                    {op.initials}
                  </span>
                  <span className="text-lg font-bold text-card-foreground">{op.name}</span>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">Saldo, datos y packs</p>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand"
                >
                  Recargar <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-surface-tint">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                <Icon className="h-6 w-6 text-brand" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bloque final */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div className="grid items-center gap-6 rounded-2xl bg-navy p-6 sm:grid-cols-2">
            <img
              src={successPhone}
              alt="Celular con la confirmación de una recarga exitosa"
              loading="lazy"
              width={1024}
              height={1024}
              className="rounded-xl object-cover"
            />
            <div>
              <h2 className="text-2xl font-extrabold leading-tight text-sky">
                ¡Tu recarga
                <br />
                está en camino!
              </h2>
              <p className="mt-3 text-sm text-navy-foreground/80">
                Disfrutá de todos los beneficios de estar siempre conectado.
              </p>
              <button className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90">
                Ver historial
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-card-foreground">Iniciar sesión</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Accedé a tu cuenta para hacer recargas y ver tu historial.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-border px-3 py-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border px-3 py-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
              />
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 accent-[var(--brand)]" />
                Recordarme
              </label>
              <a href="#" className="text-brand">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <button
              onClick={() => setLoginNotice(true)}
              className="mt-5 w-full rounded-xl bg-brand py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Ingresar
            </button>
            {loginNotice && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Esta es una demostración: todavía no se crean cuentas.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="bg-navy-deep">
        <div className="mx-auto flex max-w-7xl justify-end gap-4 px-5 pt-6 text-navy-foreground/70 lg:px-8">
          <Facebook className="h-5 w-5" />
          <Instagram className="h-5 w-5" />
          <MessageCircle className="h-5 w-5" />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
