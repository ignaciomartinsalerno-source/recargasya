import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No autorizado");
}

export const listOrders = createServerFn({ method: "GET" })
  .inputValidator((data: { search?: string } | undefined) => data ?? {})
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data: input }) => {
    await assertAdmin(context);
    let query = context.supabase
      .from("recharge_orders")
      .select("id, operator, phone, amount_charged, credit_amount, payment_method, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    const search = (input.search ?? "").trim();
    if (search) {
      const safe = search.replace(/[%,()]/g, "");
      query = query.or(
        `phone.ilike.%${safe}%,operator.ilike.%${safe}%,status.ilike.%${safe}%`,
      );
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return { orders: data ?? [] };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });
