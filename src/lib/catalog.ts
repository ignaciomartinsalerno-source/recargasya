export interface Offer {
  load: number;
  receive: number;
  tag: string;
}

export interface OperatorCatalogEntry {
  name: string;
  offers: Offer[];
}

/** Catálogo compartido entre el navegador y el servidor. El precio SIEMPRE se recalcula acá. */
export const OPERATOR_CATALOG: OperatorCatalogEntry[] = [
  {
    name: "Movistar",
    offers: [
      { load: 2000, receive: 4000, tag: "¡Se duplica!" },
      { load: 5000, receive: 12000, tag: "¡x2,4 de regalo!" },
      { load: 10000, receive: 25000, tag: "¡Super promo!" },
    ],
  },
  {
    name: "Claro",
    offers: [
      { load: 1000, receive: 2000, tag: "¡Se duplica!" },
      { load: 2000, receive: 5000, tag: "¡x2,5 de regalo!" },
      { load: 5000, receive: 11000, tag: "¡Imperdible!" },
    ],
  },
  {
    name: "Personal",
    offers: [
      { load: 1000, receive: 2200, tag: "¡x2,2 de regalo!" },
      { load: 2000, receive: 4000, tag: "¡Se duplica!" },
      { load: 10000, receive: 22000, tag: "¡Mega promo!" },
    ],
  },
  {
    name: "Tuenti",
    offers: [
      { load: 500, receive: 1200, tag: "¡x2,4 de regalo!" },
      { load: 1000, receive: 2500, tag: "¡x2,5 de regalo!" },
      { load: 5000, receive: 10000, tag: "¡Se duplica!" },
    ],
  },
];

export const OPERATOR_NAMES = OPERATOR_CATALOG.map((op) => op.name);

export const AMOUNTS = [500, 1000, 2000, 5000, 10000];

export const WELCOME_BONUS = 5000;

export const PAYMENT_METHOD_IDS = ["credit", "debit"] as const;
export type PaymentMethodId = (typeof PAYMENT_METHOD_IDS)[number];

export function formatMoney(value: number): string {
  return "$" + value.toLocaleString("es-AR");
}

/** Precio a cobrar y crédito a acreditar, calculado desde el catálogo. */
export function quote(operatorName: string, amount: number) {
  const operator = OPERATOR_CATALOG.find((op) => op.name === operatorName);
  if (!operator) return null;
  if (!AMOUNTS.includes(amount)) return null;

  const offer = operator.offers.find((o) => o.load === amount);
  const offerBonus = offer ? offer.receive - offer.load : 0;
  return {
    operator: operator.name,
    charge: amount,
    offerBonus,
    welcomeBonus: WELCOME_BONUS,
    credit: amount + offerBonus + WELCOME_BONUS,
  };
}
