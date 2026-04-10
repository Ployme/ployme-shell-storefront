export interface ThirdPartyScript {
  id: string;
  src?: string;
  inline?: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
  position?: "head" | "body";
}

// Empty by default — the engine populates this per customer.
export const THIRD_PARTY_SCRIPTS: ThirdPartyScript[] = [];
