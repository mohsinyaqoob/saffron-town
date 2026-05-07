import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

const LOG = "[email:smtp]";

function emailLog(
  kind: string,
  phase: "skip" | "send" | "ok" | "fail",
  detail: string,
  meta?: Record<string, unknown>,
) {
  const payload = { kind, phase, ...meta };
  if (phase === "fail") {
    console.error(`${LOG} ${detail}`, payload);
  } else {
    // stderr — Turbopack/dev terminal reliably shows warn/error more often than stdout for Route Handlers
    console.warn(`${LOG} ${detail}`, payload);
  }
}

let cachedTransporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (cachedTransporter !== undefined) return cachedTransporter;

  const host = process.env.SMTP_HOST?.trim() || "smtp.zoho.in";
  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number(portRaw) : 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();

  if (!user || !pass || !Number.isFinite(port)) {
    cachedTransporter = null;
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
}

/**
 * From address Zoho will accept: authenticated mailbox or verified alias.
 * Order notifications prefer ORDER_NOTIFY_FROM; bulk enquiries prefer
 * BULK_ENQUIRY_FROM but fall back to ORDER_NOTIFY_FROM so a typo in one env
 * does not break the other channel.
 */
export function resolveSmtpFrom(options?: {
  /** Prefer BULK_ENQUIRY_FROM when set (still falls back to ORDER_NOTIFY_FROM). */
  preferBulkAlias?: boolean;
}): string | undefined {
  const smtpUser = process.env.SMTP_USER?.trim();
  const mailboxDefault = smtpUser ? `Saffron Town <${smtpUser}>` : undefined;
  const orderFrom = process.env.ORDER_NOTIFY_FROM?.trim();
  const bulkFrom = process.env.BULK_ENQUIRY_FROM?.trim();

  if (options?.preferBulkAlias) {
    return bulkFrom || orderFrom || mailboxDefault;
  }
  return orderFrom || bulkFrom || mailboxDefault;
}

export type SendSmtpMailOptions = {
  /** Short label for logs, e.g. `order-admin`, `bulk-enquiry`. */
  kind: string;
  to: string;
  subject: string;
  text: string;
  /** Overrides {@link resolveSmtpFrom}; omit to use env resolution. */
  from?: string;
  replyTo?: string;
  bcc?: string | string[];
};

export type SendSmtpMailResult =
  | { ok: true; messageId?: string; response?: string }
  | { ok: false; reason: string };

/**
 * Single nodemailer send path + structured logging (server terminal / hosting logs).
 */
export async function sendSmtpMail(
  opts: SendSmtpMailOptions,
): Promise<SendSmtpMailResult> {
  const transporter = getTransporter();
  if (!transporter) {
    emailLog(opts.kind, "skip", "not configured", {
      hint: "Set SMTP_USER and SMTP_PASSWORD (and valid SMTP_PORT).",
    });
    return { ok: false, reason: "smtp_not_configured" };
  }

  const from = opts.from?.trim() || resolveSmtpFrom();
  if (!from) {
    emailLog(opts.kind, "skip", "no From address", {
      hint: "Set ORDER_NOTIFY_FROM or BULK_ENQUIRY_FROM or SMTP_USER.",
    });
    return { ok: false, reason: "no_from_address" };
  }

  try {
    emailLog(opts.kind, "send", "sending", {
      to: opts.to,
      from,
      subject: opts.subject,
    });

    const info = (await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
      ...(opts.bcc
        ? {
            bcc: Array.isArray(opts.bcc) ? opts.bcc.join(", ") : opts.bcc,
          }
        : {}),
    })) as { messageId?: string; response?: string };

    emailLog(opts.kind, "ok", "sent", {
      to: opts.to,
      messageId: info.messageId,
      response: info.response,
    });

    return {
      ok: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    emailLog(opts.kind, "fail", "SMTP send failed", {
      to: opts.to,
      error: msg,
    });
    if (msg.includes("Invalid login") || msg.includes("535")) {
      console.error(
        `${LOG} Zoho/auth hint: use SMTP_USER as a Zoho mailbox and SMTP_PASSWORD as an app password (not the web login password).`,
      );
    }
    return { ok: false, reason: msg };
  }
}
