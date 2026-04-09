import type { Customer } from "@/lib/types";

export const SAMPLE_CUSTOMER: Customer = {
  id: "cust-001",
  email: "elena.marchetti@example.com",
  name: "Elena Marchetti",
  addresses: [
    {
      line1: "42 Redchurch Street",
      line2: "Flat 3",
      city: "London",
      postcode: "E2 7DP",
      country: "GB",
    },
  ],
};
