import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { AMOUNTS, OPERATOR_NAMES, PAYMENT_METHOD_IDS, quote } from "./catalog";

function db() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const checkoutInput = z.object({
  operator: z.string().refine((v) => OPERATOR_NAMES.includes(v), "Operador inválido"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 8 && v.length <= 13, "Número de línea inválido"),
  amount: z.number().int().refine((v) => AMOUNTS.includes(v), "Monto inválido"),
  paymentMethod: z.enum(PAYMENT_METHOD_IDS),
});

function stripeKey(): string {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("El cobro con tarjeta todavía no está configurado.");
  return key;
}

async function stripeRequest(path: string, params?: Record<string, string>) {
  const init: RequestInit = {
    method: params ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${stripeKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  if (params) init.body = new URLSearchParams(params).toString();

  const res = await fetch(`https://api.stripe.com/v1/${path}`, init);
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      (json["error"] as { message?: string } | undefined)?.message ?? "Error del procesador de pagos";
    console.error("Stripe error", path, message);
    throw new Error("No pudimos iniciar el pago. Probá de nuevo en unos minutos.");
  }
  return json;
}

function baseUrl(): string {
  const request = getRequest();
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${forwardedHost ?? url.host}`;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutInput.parse(data))
  .handler(async ({ data }) => {
    const priced = quote(data.operator, data.amount);
    if (!priced) throw new Error("La recarga seleccionada no está disponible.");

    const origin = baseUrl();
    const session = await stripeRequest("checkout/sessions", {
      mode: "payment",
      "payment_method_types[0]": "card",
      success_url: `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago-cancelado`,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "ars",
      "line_items[0][price_data][unit_amount]": String(priced.charge * 100),
      "line_items[0][price_data][product_data][name]": `Recarga ${priced.operator} ${priced.charge}`,
      "line_items[0][price_data][product_data][description]": `Línea ${data.phone} · Crédito a acreditar: $${priced.credit}`,
      "metadata[operador]": priced.operator,
      "metadata[linea]": data.phone,
      "metadata[monto_cobrado]": String(priced.charge),
      "metadata[credito_a_acreditar]": String(priced.credit),
      "metadata[tipo_tarjeta]": data.paymentMethod,
    });

    const sessionId = session["id"] as string;
    const { error } = await db()
      .from("recharge_orders")
      .insert({
        operator: priced.operator,
        phone: data.phone,
        amount_charged: priced.charge,
        credit_amount: priced.credit,
        payment_method: data.paymentMethod,
        stripe_session_id: sessionId,
        status: "pendiente",
      });
    if (error) console.error("No se pudo guardar el pedido", error.message);

    return { url: session["url"] as string };
  });

export const getCheckoutResult = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ sessionId: z.string().min(10).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const session = await stripeRequest(`checkout/sessions/${encodeURIComponent(data.sessionId)}`);
    const metadata = (session["metadata"] ?? {}) as Record<string, string>;
    const paid = session["payment_status"] === "paid";

    if (paid) {
      const { error } = await db()
        .from("recharge_orders")
        .update({ status: "pagado" })
        .eq("stripe_session_id", data.sessionId)
        .eq("status", "pendiente");
      if (error) console.error("No se pudo actualizar el pedido", error.message);
    }

    return {
      paid,
      operator: metadata["operador"] ?? "",
      phone: metadata["linea"] ?? "",
      credit: Number(metadata["credito_a_acreditar"] ?? 0),
      charged: Number(metadata["monto_cobrado"] ?? 0),
    };
  });
