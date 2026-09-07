# Cobro real con Stripe Checkout

El cliente arma su recarga en la página y paga en una pantalla de pago alojada por Stripe. Los datos de la tarjeta nunca pasan por el sitio ni quedan guardados: solo vuelve el resultado (aprobado o rechazado).

## Cómo queda el flujo

1. El cliente elige operador, número de línea, monto y tipo de tarjeta.
2. Toca **Pagar** y se abre la pantalla segura de Stripe con el importe de la recarga.
3. Paga con tarjeta de crédito o débito.
4. Vuelve al sitio:
   - Pago aprobado: pantalla de confirmación con el número de línea, el operador y el crédito que va a recibir.
   - Pago rechazado o cancelado: vuelve al formulario con el aviso y puede reintentar.
5. Cada pago aprobado te llega al panel de Stripe con el operador, el número de línea y el monto anotados, para que hagas la carga a mano.

Se saca todo el texto de "simulación" y el formulario propio de tarjeta que había en la página.

## Lo que necesito de vos

- Conectar tu cuenta de Stripe con tu clave secreta (se guarda cifrada, no queda en el código ni la veo yo).
- Confirmar que las promos publicadas (por ejemplo, cargás $2.000 y recibís $4.000) las podés cumplir, porque a partir de ahora el cobro es real.

## Antes de cobrar de verdad

Primero se prueba todo en modo de prueba de Stripe con tarjetas de test. Recién cuando el flujo funcione se pasa a claves reales.

Nota: al ser cobro real y entrega manual, conviene sumar después una forma de ver los pedidos dentro del sitio. Por ahora los ves en el panel de Stripe.

## Detalle técnico

- Integración Stripe BYOK: la clave secreta se guarda como secreto del proyecto y solo se usa del lado del servidor.
- Nueva función de servidor `createCheckoutSession` en `src/lib/checkout.functions.ts`:
  - valida con zod operador (uno de los cuatro), número de línea (solo dígitos, largo razonable), monto (uno de los montos permitidos) y tipo de tarjeta;
  - recalcula el precio en el servidor a partir del catálogo — nunca confía en el importe que manda el navegador;
  - crea una Checkout Session (`mode: "payment"`, moneda ARS, `payment_method_types: ["card"]`) con `metadata` = operador, número de línea, monto cargado y crédito a acreditar;
  - devuelve la URL de la sesión.
- El catálogo de operadores, montos y ofertas se mueve a `src/lib/catalog.ts` para que cliente y servidor usen la misma fuente.
- `src/components/recharge-card.tsx`: se elimina el paso de tarjeta simulado; el botón llama a la función de servidor y redirige a Stripe. Estados de carga y error visibles.
- Rutas nuevas `src/routes/pago-exitoso.tsx` y `src/routes/pago-cancelado.tsx`, con `head()` propio; la de éxito lee el `session_id` y consulta el estado real del pago mediante una función de servidor antes de mostrar la confirmación.
- `src/routes/index.tsx`: se quitan los avisos de simulación.
