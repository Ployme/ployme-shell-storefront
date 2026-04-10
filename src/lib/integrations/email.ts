import "server-only";

export interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailProvider {
  readonly name: string;

  send(message: EmailMessage): Promise<{
    id: string;
    status: "sent" | "queued" | "failed";
  }>;
}

export class MockEmailProvider implements EmailProvider {
  readonly name = "mock";

  async send(
    message: EmailMessage
  ): Promise<{ id: string; status: "sent" | "queued" | "failed" }> {
    console.log(
      `[MockEmailProvider] \u2192 ${message.to}: ${message.subject}`
    );
    return {
      id: `mock-${crypto.randomUUID()}`,
      status: "sent",
    };
  }
}
