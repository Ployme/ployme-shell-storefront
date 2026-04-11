// ---------------------------------------------------------------------------
// VAT rate lookup + helpers.
//
// Existing catalogue prices are inc-VAT for UK customers at the default 20%
// rate (see Product.vatRate). For other regions we compute the VAT amount
// and subtotal-ex-VAT by backing it out of the gross subtotal.
// ---------------------------------------------------------------------------

const UK_COUNTRIES = new Set([
  "GB",
  "UK",
  "United Kingdom",
  "united kingdom",
]);

const IE_COUNTRIES = new Set([
  "IE",
  "Ireland",
  "ireland",
  "Republic of Ireland",
]);

export function getVatRateForCountry(country: string): number {
  if (UK_COUNTRIES.has(country)) return 0.20;
  if (IE_COUNTRIES.has(country)) return 0.23;
  return 0; // Everything else: zero-rated for the reference shell.
}

export function computeVatBreakdown(
  grossSubtotal: number,
  rate: number
): { subtotalExVat: number; vatAmount: number } {
  if (rate <= 0) {
    return { subtotalExVat: grossSubtotal, vatAmount: 0 };
  }
  // Prices are stored inc-VAT at the default rate (20%). When shipping to
  // a region with a different rate we still back out the tax from the
  // displayed gross — the store displays a single gross price and the
  // checkout breaks it down.
  const subtotalExVat = Math.round(grossSubtotal / (1 + rate));
  const vatAmount = grossSubtotal - subtotalExVat;
  return { subtotalExVat, vatAmount };
}
