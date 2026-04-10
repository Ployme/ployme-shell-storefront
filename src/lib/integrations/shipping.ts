import "server-only";

import type { Address } from "@/lib/types";

export interface ShippingRate {
  id: string;
  name: string;
  price: number; // in pence
  estimatedDays: string;
}

export interface ShippingLabel {
  id: string;
  trackingNumber: string;
  labelUrl?: string;
}

export interface ShippingProvider {
  readonly name: string;

  getRates(params: {
    destination: Address;
    subtotal: number; // in pence, for free-shipping thresholds
    weight?: number;
  }): Promise<ShippingRate[]>;

  createLabel(params: {
    orderId: string;
    destination: Address;
    rateId: string;
  }): Promise<ShippingLabel>;
}

const UK_COUNTRIES = new Set([
  "GB",
  "UK",
  "United Kingdom",
  "united kingdom",
]);

function isUK(country: string): boolean {
  return UK_COUNTRIES.has(country);
}

export class MockShippingProvider implements ShippingProvider {
  readonly name = "mock";

  async getRates(params: {
    destination: Address;
    subtotal: number;
    weight?: number;
  }): Promise<ShippingRate[]> {
    const uk = isUK(params.destination.country);
    const rates: ShippingRate[] = [];

    if (uk) {
      // If eligible for free shipping, list it first (default pick)
      if (params.subtotal >= 4000) {
        rates.push({
          id: "free-uk",
          name: "Free UK shipping",
          price: 0,
          estimatedDays: "3-5 business days",
        });
      }

      rates.push({
        id: "standard-uk",
        name: "Standard UK",
        price: 450,
        estimatedDays: "2-3 business days",
      });

      rates.push({
        id: "express-uk",
        name: "Express UK",
        price: 950,
        estimatedDays: "1 business day",
      });
    } else {
      rates.push({
        id: "international",
        name: "International",
        price: 1500,
        estimatedDays: "5-10 business days",
      });
    }

    console.log(
      `[MockShippingProvider] getRates: ${rates.length} rates for ${params.destination.country}`
    );
    return rates;
  }

  async createLabel(params: {
    orderId: string;
    destination: Address;
    rateId: string;
  }): Promise<ShippingLabel> {
    const label: ShippingLabel = {
      id: `lbl_mock_${params.orderId}`,
      trackingNumber: `MOCK-${params.orderId}`,
    };

    console.log(
      `[MockShippingProvider] createLabel: ${label.trackingNumber}`
    );
    return label;
  }
}
