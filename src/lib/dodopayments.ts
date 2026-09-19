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
  sponsorId: string;
  companyName: string;
  email: string;
  amount: number; // in USD
  durationType?: string;
  returnUrl: string;
}

export async function createCheckout(params: CreateCheckoutParams): Promise<{ checkoutUrl: string; isMock: boolean }> {
  const { sponsorId, companyName, email, amount, returnUrl } = params;

  // If Dodo Payments is not configured, generate a simulated checkout link
  if (!dodoClient || !isDodoConfigured) {
    const mockUrl = `${returnUrl}&mock=true&token=sim_${sponsorId.slice(-8)}`;
    return {
      checkoutUrl: mockUrl,
      isMock: true,
    };
  }

  const productId = process.env.DODO_PRODUCT_ID || "pdt_banner_sponsor";
  const amountInCents = Math.round(amount * 100);

  try {
    const session = await dodoClient.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          amount: amountInCents,
        },
      ],
      customer: {
        email: email,
        name: companyName,
      },
      metadata: {
        sponsorId,
      },
      return_url: returnUrl,
    });

    if (session.checkout_url) {
      return {
        checkoutUrl: session.checkout_url,
        isMock: false,
      };
    }
    throw new Error("No checkout_url returned from Dodo Payments");
  } catch (error: any) {
    console.error("Dodo checkout error:", error);
    throw error;
  }
}
