import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listOrders, checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel · RecargasYa" },
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
  pagado: "bg-emerald-500/15 text-emerald-600",
  acreditado: "bg-blue-500/15 text-blue-600",
  pendiente: "bg-amber-500/15 text-amber-700",
  cancelado: "bg-rose-500/15 text-rose-600",
};

function AdminPage() {
  const navigate = useNavigate();
  const listOrdersFn = useServerFn(listOrders);
  const checkIsAdminFn = useServerFn(checkIsAdmin);

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => checkIsAdminFn(),
  });

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrdersFn(),
    enabled: roleQuery.data?.isAdmin === true,
  });

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const orders: Order[] = ordersQuery.data?.orders ?? [];
    if (!search.trim()) return orders;
    const q = search.trim().toLowerCase();
    return orders.filter(
      (o) =>
        o.phone.toLowerCase().includes(q) ||
        o.operator.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q),
    );
  }, [ordersQuery.data, search]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  useEffect(() => {
    if (roleQuery.data && !roleQuery.data.isAdmin) {
      // logged in but not admin
    }
  }, [roleQuery.data]);

  if (roleQuery.isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Cargando panel...</div>;
  }

  if (roleQuery.data && !roleQuery.data.isAdmin) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-xl font-bold">Sin acceso</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu cuenta no tiene permisos de administrador. Pedile al dueño del sitio que te asigne el
          rol admin.
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 rounded-md border border-input px-4 py-2 text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  const orders: Order[] = ordersQuery.data?.orders ?? [];
  const totalCargado = orders.reduce((s, o) => s + o.amount_charged, 0);
  const totalCredito = orders.reduce((s, o) => s + o.credit_amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Panel RecargasYa</h1>
            <p className="text-xs text-muted-foreground">Pedidos recibidos</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Pedidos" value={orders.length.toString()} />
          <StatCard label="Cobrado" value={`$${totalCargado.toLocaleString("es-AR")}`} />
          <StatCard label="Crédito otorgado" value={`$${totalCredito.toLocaleString("es-AR")}`} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por teléfono, operador o estado"
            className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={() => ordersQuery.refetch()}
            className="rounded-md border border-input px-3 py-2 text-sm hover:bg-accent"
          >
            Actualizar
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Operador</th>
                <th className="px-4 py-3">Línea</th>
                <th className="px-4 py-3">Cobrado</th>
                <th className="px-4 py-3">Crédito</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordersQuery.isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No hay pedidos todavía.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-3 font-medium capitalize">{o.operator}</td>
                    <td className="px-4 py-3 font-mono">{o.phone}</td>
                    <td className="px-4 py-3">${o.amount_charged.toLocaleString("es-AR")}</td>
                    <td className="px-4 py-3">${o.credit_amount.toLocaleString("es-AR")}</td>
                    <td className="px-4 py-3 capitalize">{o.payment_method}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          STATUS_STYLES[o.status] ?? "bg-muted text-foreground"
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
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
