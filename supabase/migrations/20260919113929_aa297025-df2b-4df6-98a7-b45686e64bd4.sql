CREATE POLICY "Pedidos privados del sistema"
ON public.recharge_orders
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);