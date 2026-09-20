import DodoPayments from "dodopayments";

const apiKey = process.env.DODO_PAYMENTS_API_KEY;
const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode";

export const isDodoConfigured = Boolean(apiKey && apiKey.trim() !== "" && !apiKey.includes("your_api_key"));

export const dodoClient = isDodoConfigured
  ? new DodoPayments({
      bearerToken: apiKey!,
      environment: environment,
    })
  : null;

export interface CreateCheckoutParams {
  sponsorshipId: string;
  creatorId: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  durationWeeks: number;
  returnUrl: string;
}

export interface CreateCheckoutResult {
  checkoutUrl: string;
  isMock: boolean;
  sessionId: string | null;
}

export async function createCheckout(params: CreateCheckoutParams): Promise<CreateCheckoutResult> {
  const { sponsorshipId, creatorId, buyerName, buyerEmail, amount, durationWeeks, returnUrl } = params;

  if (!dodoClient || !isDodoConfigured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Payment processing is not configured.");
    }
    return {
      checkoutUrl: `${returnUrl}&mock=true&token=sim_${sponsorshipId.slice(-8)}`,
      isMock: true,
      sessionId: `sim_${sponsorshipId}`,
    };
  }

  const productId = process.env.DODO_PRODUCT_ID || "pdt_banner_sponsor";
  const amountInCents = Math.round(amount * 100);

  const session = await dodoClient.checkoutSessions.create({
    product_cart: [
      {
        product_id: productId,
        quantity: 1,
        amount: amountInCents,
      },
    ],
    customer: {
      email: buyerEmail,
      name: buyerName,
    },
    metadata: {
      sponsorshipId,
      creatorId,
      durationWeeks: String(durationWeeks),
    },
    return_url: returnUrl,
  });

  const checkoutUrl = session.checkout_url;
  if (!checkoutUrl) {
    throw new Error("No checkout_url returned from Dodo Payments");
  }

  const sessionId =
    (session as { session_id?: string; id?: string }).session_id ||
    (session as { id?: string }).id ||
    null;

  return {
    checkoutUrl,
    isMock: false,
    sessionId,
  };
}

export function extractPaymentAmountCents(paymentData: Record<string, unknown>): number | null {
  const candidates = [
    paymentData.total_amount,
    paymentData.amount,
    paymentData.settlement_amount,
    (paymentData.payment as { amount?: number } | undefined)?.amount,
  ];
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value > 1000 ? value : Math.round(value * 100);
    }
  }
  return null;
}
