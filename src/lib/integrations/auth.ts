import "server-only";

import type { Customer } from "@/lib/types";
import { SAMPLE_CUSTOMER } from "@/lib/data/sample-customer";

export interface Session {
  userId: string;
  email: string;
  expiresAt: string; // ISO
}

export interface AuthProvider {
  readonly name: string;

  getCurrentSession(): Promise<Session | null>;
  getCurrentCustomer(): Promise<Customer | null>;
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
}

export class MockAuthProvider implements AuthProvider {
  readonly name = "mock";

  async getCurrentSession(): Promise<Session> {
    return {
      userId: SAMPLE_CUSTOMER.id,
      email: SAMPLE_CUSTOMER.email,
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    };
  }

  async getCurrentCustomer(): Promise<Customer> {
    return SAMPLE_CUSTOMER;
  }

  async signIn(_email: string, _password: string): Promise<Session> {
    return this.getCurrentSession();
  }

  async signOut(): Promise<void> {
    // no-op
  }
}
