import { Smartphone } from "lucide-react";

const NAV = [
  { label: "Inicio", href: "#inicio" },
  { label: "Recargas", href: "#recargar" },
  { label: "Ofertas semanales", href: "#ofertas" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Contacto", href: "#contacto" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Smartphone className="h-6 w-6 text-sky" strokeWidth={2.2} />
      <span className="text-xl font-extrabold tracking-tight text-navy-foreground">
        Recarga<span className="text-sky">Ya</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="bg-navy-deep">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4 lg:px-8">
        <Logo />
        <nav className="order-3 -mx-1 flex w-full items-center gap-1 overflow-x-auto text-sm lg:order-2 lg:mx-6 lg:w-auto lg:flex-1">
          {NAV.map((item, i) => (
            <a
              key={item}
              href="#"
              className={`whitespace-nowrap rounded-md px-3 py-2 transition-colors ${
                i === 0
                  ? "bg-white/10 font-semibold text-navy-foreground"
                  : "text-navy-foreground/70 hover:text-navy-foreground"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="order-2 ml-auto flex items-center gap-3 lg:order-3">
          <button className="rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-navy-foreground transition-colors hover:bg-white/10">
            Iniciar sesión
          </button>
          <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90">
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-navy-foreground/60">Tu celular, siempre conectado</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-foreground/75">
          {NAV.map((item) => (
            <a key={item} href="#" className="hover:text-navy-foreground">
              {item}
            </a>
          ))}
        </nav>
        <p className="text-xs text-navy-foreground/50">
          © 2026 RecargaYa. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
