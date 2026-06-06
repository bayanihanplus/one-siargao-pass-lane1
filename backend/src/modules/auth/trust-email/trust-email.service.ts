import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import {
  buildOspTrustEmailUrl,
  OSP_TRUST_EMAIL_TEMPLATES,
  OspTrustEmailTemplateKey,
} from './trust-email.registry';

export type OspTrustEmailInput = {
  templateKey: OspTrustEmailTemplateKey;
  to?: string | null;
  travelerName?: string | null;
  passCode?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  appBaseUrl?: string | null;
  ctaPathOverride?: string | null;
};

type TrustEmailPayload = {
  event: OspTrustEmailTemplateKey;
  to: string;
  subject: string;
  roleFamily: string;
  eyebrow: string;
  ctaLabel: string;
  ctaUrl: string;
  travelerName: string | null;
  passCode: string | null;
  validFrom: string | null;
  validUntil: string | null;
  bodyIntro: string;
  bodySupport: string;
  securityLock: string;
};

@Injectable()
export class TrustEmailService {
  private readonly logger = new Logger(TrustEmailService.name);

  async sendTrustEmail(input: OspTrustEmailInput) {
    const template = OSP_TRUST_EMAIL_TEMPLATES[input.templateKey];

    if (!input.to) {
      this.logger.warn(`[OSP_TRUST_EMAIL_SKIPPED] ${JSON.stringify({
        reason: 'missing-recipient',
        templateKey: input.templateKey,
      })}`);
      return { status: 'SKIPPED', reason: 'missing-recipient' };
    }

    const appBaseUrl =
      input.appBaseUrl ||
      process.env.PUBLIC_APP_BASE_URL ||
      process.env.NEXT_PUBLIC_APP_BASE_URL ||
      process.env.OSP_PUBLIC_APP_URL ||
      'http://localhost:3000';

    const payload: TrustEmailPayload = {
      event: input.templateKey,
      to: input.to,
      subject: template.subject,
      roleFamily: template.roleFamily,
      eyebrow: template.eyebrow,
      ctaLabel: template.ctaLabel,
      ctaUrl: buildOspTrustEmailUrl(appBaseUrl, input.ctaPathOverride || template.ctaPath),
      travelerName: input.travelerName || null,
      passCode: input.passCode || null,
      validFrom: input.validFrom || null,
      validUntil: input.validUntil || null,
      bodyIntro: template.bodyIntro,
      bodySupport: template.bodySupport,
      securityLock: 'No JWT, magic login token, or QR secret is included in this email.',
    };

    const provider = String(process.env.OSP_TRUST_EMAIL_PROVIDER || 'console').trim().toLowerCase();

    if (provider === 'resend') {
      return this.sendViaResend(payload);
    }

    if (provider === 'webhook') {
      return this.sendViaWebhook(payload);
    }

    this.logger.log(`[OSP_TRUST_EMAIL_READY] ${JSON.stringify(payload)}`);
    return { status: 'READY', provider: 'console', payload };
  }


  private async sendViaResend(payload: TrustEmailPayload) {
    const apiKey = process.env.RESEND_API_KEY || process.env.OSP_RESEND_API_KEY;
    const from = process.env.OSP_TRUST_EMAIL_FROM || 'One Siargao Pass <noreply@onesiargao.online>';

    if (!apiKey) {
      this.logger.warn(`[OSP_TRUST_EMAIL_PROVIDER_MISSING] ${JSON.stringify({
        provider: 'resend',
        event: payload.event,
        to: payload.to,
        reason: 'missing-api-key',
      })}`);

      this.logger.log(`[OSP_TRUST_EMAIL_READY] ${JSON.stringify(payload)}`);
      return { status: 'READY', provider: 'console-fallback', payload };
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: this.renderHtml(payload),
      text: this.renderText(payload),
    });

    if (error) {
      this.logger.warn(`[OSP_TRUST_EMAIL_FAILED] ${JSON.stringify({
        provider: 'resend',
        event: payload.event,
        to: payload.to,
        error,
      })}`);

      return { status: 'FAILED', provider: 'resend', error };
    }

    this.logger.log(`[OSP_TRUST_EMAIL_SENT] ${JSON.stringify({
      provider: 'resend',
      event: payload.event,
      to: payload.to,
      providerMessageId: data?.id || null,
      ctaLabel: payload.ctaLabel,
      ctaUrl: payload.ctaUrl,
    })}`);

    return { status: 'SENT', provider: 'resend', providerMessageId: data?.id || null };
  }

  private async sendViaWebhook(payload: TrustEmailPayload) {
    const webhookUrl = process.env.OSP_TRUST_EMAIL_WEBHOOK_URL || process.env.EMAIL_WEBHOOK_URL;

    if (!webhookUrl) {
      this.logger.warn(`[OSP_TRUST_EMAIL_PROVIDER_MISSING] ${JSON.stringify({
        provider: 'webhook',
        event: payload.event,
        to: payload.to,
      })}`);

      this.logger.log(`[OSP_TRUST_EMAIL_READY] ${JSON.stringify(payload)}`);
      return { status: 'READY', provider: 'console-fallback', payload };
    }

    const deliveryPayload = {
      ...payload,
      html: this.renderHtml(payload),
      text: this.renderText(payload),
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deliveryPayload),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      this.logger.warn(`[OSP_TRUST_EMAIL_FAILED] ${JSON.stringify({
        provider: 'webhook',
        event: payload.event,
        to: payload.to,
        status: res.status,
        body: body.slice(0, 240),
      })}`);

      return { status: 'FAILED', provider: 'webhook', statusCode: res.status };
    }

    this.logger.log(`[OSP_TRUST_EMAIL_SENT] ${JSON.stringify({
      provider: 'webhook',
      event: payload.event,
      to: payload.to,
      ctaLabel: payload.ctaLabel,
      ctaUrl: payload.ctaUrl,
    })}`);

    return { status: 'SENT', provider: 'webhook' };
  }

  private renderText(payload: TrustEmailPayload) {
    return [
      payload.eyebrow,
      '',
      `Hi ${payload.travelerName || 'there'},`,
      '',
      payload.bodyIntro,
      payload.passCode ? `Pass Code: ${payload.passCode}` : null,
      payload.validFrom && payload.validUntil ? `Valid Dates: ${payload.validFrom} to ${payload.validUntil}` : null,
      '',
      payload.bodySupport,
      '',
      `${payload.ctaLabel}: ${payload.ctaUrl}`,
      '',
      'For your safety, never share your login details.',
      '',
      'Made in Siargao. Built for Siargao.',
      'One Siargao Pass',
    ].filter(Boolean).join('\n');
  }

  private renderHtml(payload: TrustEmailPayload) {
    const safeName = payload.travelerName || 'there';
    const passBlock = payload.passCode
      ? `<p style="margin:12px 0 0;color:#013863;"><strong>Pass Code:</strong> ${payload.passCode}</p>`
      : '';
    const validBlock = payload.validFrom && payload.validUntil
      ? `<p style="margin:6px 0 0;color:#013863;"><strong>Valid Dates:</strong> ${payload.validFrom} to ${payload.validUntil}</p>`
      : '';

    return `<!doctype html>
<html>
  <body style="margin:0;background:#f4fcfa;font-family:Arial,sans-serif;color:#013863;">
    <div style="max-width:560px;margin:0 auto;padding:28px 18px;">
      <div style="background:#ffffff;border:1px solid #d7f1ef;border-radius:24px;padding:24px;box-shadow:0 18px 45px rgba(1,56,99,0.10);">
        <p style="margin:0 0 10px;color:#0596A5;font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:12px;">${payload.eyebrow}</p>
        <h1 style="margin:0;color:#013863;font-size:26px;line-height:1.1;">Welcome to One Siargao Pass</h1>
        <p style="margin:18px 0 0;">Hi ${safeName},</p>
        <p style="margin:12px 0 0;">${payload.bodyIntro}</p>
        ${passBlock}
        ${validBlock}
        <p style="margin:18px 0 0;color:#50668B;line-height:1.5;">${payload.bodySupport}</p>
        <p style="margin:24px 0;">
          <a href="${payload.ctaUrl}" style="display:inline-block;background:#013863;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 22px;font-weight:800;">
            ${payload.ctaLabel}
          </a>
        </p>
        <p style="margin:18px 0 0;color:#50668B;font-size:13px;">For your safety, never share your login details.</p>
        <p style="margin:22px 0 0;color:#013863;font-weight:700;">Made in Siargao. Built for Siargao.</p>
      </div>
    </div>
  </body>
</html>`;
  }
}
