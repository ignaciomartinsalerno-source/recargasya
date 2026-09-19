import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  CreditCard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Search,
  Bell,
  Zap,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listOrders, checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin · RecargasYa" },
      { name: "description", content: "Gestión de pedidos de recarga." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Order = {
  id: string;
  operator: string;
  phone: string;
  amount_charged: number;
  credit_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pagado: "bg-emerald-500/15 text-emerald-400",
  acreditado: "bg-blue-500/15 text-blue-400",
  pendiente: "bg-amber-500/15 text-amber-400",
  cancelado: "bg-rose-500/15 text-rose-400",
};

const NAV = [
  { icon: Home, label: "Inicio" },
  { icon: Users, label: "Clientes" },
  { icon: CreditCard, label: "Pagos" },
  { icon: ArrowLeftRight, label: "Transacciones" },
  { icon: BarChart3, label: "Reportes" },
  { icon: Settings, label: "Configuración" },
];

function AdminPage() {
  const navigate = useNavigate();
  const listOrdersFn = useServerFn(listOrders);
  const checkIsAdminFn = useServerFn(checkIsAdmin);

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => checkIsAdminFn(),
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [active, setActive] = useState("Inicio");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const ordersQuery = useQuery({
    queryKey: ["orders", debouncedSearch],
    queryFn: () => listOrdersFn({ data: { search: debouncedSearch } }),
    enabled: roleQuery.data?.isAdmin === true,
  });

  const filtered: Order[] = ordersQuery.data?.orders ?? [];

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (roleQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] text-sm text-slate-400">
        Cargando panel...
      </div>
    );
  }

  if (roleQuery.data && !roleQuery.data.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-white">Sin acceso</h1>
          <p className="mt-2 text-sm text-slate-400">
            Tu cuenta no tiene permisos de administrador. Pedile al dueño del sitio que te asigne el
            rol admin.
          </p>
          <button
            onClick={handleSignOut}
            className="mt-6 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const orders: Order[] = ordersQuery.data?.orders ?? [];
  const totalCargado = orders.reduce((s, o) => s + o.amount_charged, 0);
  const totalCredito = orders.reduce((s, o) => s + o.credit_amount, 0);
  const pagados = orders.filter((o) => o.status === "pagado" || o.status === "acreditado").length;

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-slate-200">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800/80 bg-[#0b1120]">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white">RecargasYa</p>
            <p className="text-xs text-slate-500">Panel Admin</p>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active === item.label
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="m-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5">
          <p className="flex items-center gap-2 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Sistema en línea
          </p>
          <p className="mt-0.5 text-xs text-slate-500">v1.0.0</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-800/80 px-6 py-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por teléfono, operador o estado..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/70 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-slate-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                A
              </div>
              <span className="text-sm font-medium text-slate-200">Admin</span>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              Salir
            </button>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pedidos" value={orders.length.toString()} />
            <StatCard label="Pagos confirmados" value={pagados.toString()} />
            <StatCard label="Cobrado" value={`$${totalCargado.toLocaleString("es-AR")}`} />
            <StatCard label="Crédito otorgado" value={`$${totalCredito.toLocaleString("es-AR")}`} />
          </div>

          {/* Orders card */}
          <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d1426]">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  Pedidos de recarga
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Todos los pedidos recibidos desde la web.
                </p>
              </div>
              <button
                onClick={() => ordersQuery.refetch()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium">Operador</th>
                    <th className="px-5 py-3 font-medium">Línea</th>
                    <th className="px-5 py-3 font-medium">Cobrado</th>
                    <th className="px-5 py-3 font-medium">Crédito</th>
                    <th className="px-5 py-3 font-medium">Pago</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersQuery.isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-slate-500">
                        Cargando pedidos...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-slate-500">
                        No hay pedidos todavía.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr
                        key={o.id}
                        className="border-t border-slate-800/70 transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                          {o.id.slice(0, 8)}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">
                          {new Date(o.created_at).toLocaleString("es-AR")}
                        </td>
                        <td className="px-5 py-3.5 font-medium capitalize text-slate-200">
                          {o.operator}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-300">{o.phone}</td>
                        <td className="px-5 py-3.5 text-slate-200">
                          ${o.amount_charged.toLocaleString("es-AR")}
                        </td>
                        <td className="px-5 py-3.5 text-slate-200">
                          ${o.credit_amount.toLocaleString("es-AR")}
                        </td>
                        <td className="px-5 py-3.5 capitalize text-slate-400">{o.payment_method}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                              STATUS_STYLES[o.status] ?? "bg-slate-700/40 text-slate-300"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1426] p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
