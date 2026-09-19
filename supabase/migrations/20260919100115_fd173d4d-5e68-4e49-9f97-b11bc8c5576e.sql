CREATE TABLE public.recharge_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator TEXT NOT NULL,
  phone TEXT NOT NULL,
  amount_charged INTEGER NOT NULL,
  credit_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.recharge_orders TO anon;
GRANT INSERT, UPDATE ON public.recharge_orders TO anon;
GRANT ALL ON public.recharge_orders TO service_role;

ALTER TABLE public.recharge_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede crear un pedido" ON public.recharge_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Actualizar estado por session id" ON public.recharge_orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER recharge_orders_updated_at BEFORE UPDATE ON public.recharge_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();