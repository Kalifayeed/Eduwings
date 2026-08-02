import "server-only";

import { Resend } from "resend";

import { siteConfig } from "@/config/site";
import { capabilities, env, siteUrl } from "@/lib/env";
import { logger } from "@/lib/logger";

/**
 * Transactional email.
 *
 * Two rules govern this module:
 *
 *  1. A failure to send must never fail the visitor's request. Their enquiry has
 *     already been validated and persisted; telling them "something went wrong"
 *     because our mail provider is down would be both wrong and likely to
 *     produce a duplicate submission.
 *  2. With no API key configured, sending is a logged no-op. The site is
 *     required to work without secrets, and a hard dependency here would break
 *     every form in local development.
 */

const resend = capabilities.email && env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

async function send({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  if (!resend || !env.EMAIL_FROM) {
    logger.warn("email.skipped", "Email is not configured", { subject });
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    });

    if (error) {
      logger.error("email.send.failed", error, { subject });
      return false;
    }

    return true;
  } catch (error) {
    logger.error("email.send.threw", error, { subject });
    return false;
  }
}

/** Escape interpolated values — form input must never become markup. */
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Shared shell so both notification and acknowledgement mails look the same. */
function layout(heading: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#16233b;">
    <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e3e8ef;">
      <tr>
        <td style="background:linear-gradient(135deg,#0f5f9e,#0b2545);padding:28px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">
            ${escapeHtml(siteConfig.name)}
          </p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
            ${escapeHtml(siteConfig.tagline)}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <h1 style="margin:0 0 20px;font-size:19px;line-height:1.3;">${escapeHtml(heading)}</h1>
          ${body}
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e3e8ef;">
          <p style="margin:0;font-size:12px;color:#64748b;">
            ${escapeHtml(siteConfig.legalName)} ·
            <a href="${siteUrl}" style="color:#0f5f9e;">${siteUrl.replace(/^https?:\/\//, "")}</a> ·
            ${escapeHtml(siteConfig.contact.phone)}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Render a record as a definition table, skipping empty values. */
function detailTable(fields: Record<string, unknown>): string {
  const rows = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#64748b;white-space:nowrap;vertical-align:top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:8px 0;font-size:14px;vertical-align:top;">
            ${escapeHtml(value).replace(/\n/g, "<br />")}
          </td>
        </tr>`,
    )
    .join("");

  return `<table role="presentation" style="width:100%;border-collapse:collapse;">${rows}</table>`;
}

/** Notifies the EduWings inbox that a form was submitted. */
export async function notifyTeam(args: {
  subject: string;
  heading: string;
  fields: Record<string, unknown>;
  replyTo?: string;
}): Promise<boolean> {
  if (!env.EMAIL_TO_ADMIN) return false;

  return send({
    to: env.EMAIL_TO_ADMIN,
    subject: args.subject,
    replyTo: args.replyTo,
    html: layout(args.heading, detailTable(args.fields)),
  });
}

/** Confirms receipt to the person who submitted the form. */
export async function acknowledge(args: {
  to: string;
  subject: string;
  heading: string;
  paragraphs: string[];
}): Promise<boolean> {
  const body = args.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;">${escapeHtml(paragraph)}</p>`,
    )
    .join("");

  return send({ to: args.to, subject: args.subject, html: layout(args.heading, body) });
}
