import "server-only";

import { MockPaymentProvider, type PaymentProvider } from "./payment";
import { MockShippingProvider, type ShippingProvider } from "./shipping";
import { MockEmailProvider, type EmailProvider } from "./email";
import { MockAuthProvider, type AuthProvider } from "./auth";
import { MockDiscountsProvider, type DiscountsProvider } from "./discounts";

export const integrations = {
  payment: new MockPaymentProvider() as PaymentProvider,
  shipping: new MockShippingProvider() as ShippingProvider,
  email: new MockEmailProvider() as EmailProvider,
  auth: new MockAuthProvider() as AuthProvider,
  discounts: new MockDiscountsProvider() as DiscountsProvider,
};

export type {
  PaymentProvider,
  ShippingProvider,
  EmailProvider,
  AuthProvider,
  DiscountsProvider,
};
export type { PaymentIntent } from "./payment";
export type { ShippingRate, ShippingLabel } from "./shipping";
export type { EmailMessage } from "./email";
export type { Session } from "./auth";
export type { Discount, ValidatedDiscount } from "./discounts";
