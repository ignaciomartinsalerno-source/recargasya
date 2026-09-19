DROP POLICY IF EXISTS "Actualizar estado por session id" ON public.recharge_orders;
DROP POLICY IF EXISTS "Cualquiera puede crear un pedido" ON public.recharge_orders;
REVOKE INSERT, UPDATE, DELETE ON public.recharge_orders FROM anon, authenticated;
GRANT ALL ON public.recharge_orders TO service_role;