import "server-only";

export interface PaymentIntent {
  id: string;
  amount: number; // in pence
  currency: string; // "GBP", "USD", etc
  status: "pending" | "succeeded" | "failed";
  clientSecret?: string;
  metadata?: Record<string, string>;
}

export interface PaymentProvider {
  readonly name: string;

  createPaymentIntent(params: {
    amount: number;
    currency: string;
    orderId: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent>;

  capturePayment(intentId: string): Promise<PaymentIntent>;

  refundPayment(
    intentId: string,
    amount?: number
  ): Promise<{
    id: string;
    amount: number;
    status: "succeeded" | "failed";
  }>;
}

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    orderId: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 600));

    const intent: PaymentIntent = {
      id: `pi_mock_${params.orderId}`,
      amount: params.amount,
      currency: params.currency,
      status: "succeeded",
      clientSecret: `cs_mock_${params.orderId}`,
      metadata: params.metadata,
    };

    console.log(
      `[MockPaymentProvider] createPaymentIntent: ${intent.id} — ${params.currency} ${params.amount}`
    );
    return intent;
  }

  async capturePayment(intentId: string): Promise<PaymentIntent> {
    console.log(`[MockPaymentProvider] capturePayment: ${intentId}`);
    return {
      id: intentId,
      amount: 0,
      currency: "GBP",
      status: "succeeded",
    };
  }

  async refundPayment(
    intentId: string,
    amount?: number
  ): Promise<{ id: string; amount: number; status: "succeeded" | "failed" }> {
    console.log(
      `[MockPaymentProvider] refundPayment: ${intentId} amount=${amount ?? "full"}`
    );
    return {
      id: `re_mock_${intentId}`,
      amount: amount ?? 0,
      status: "succeeded",
    };
  }
}
