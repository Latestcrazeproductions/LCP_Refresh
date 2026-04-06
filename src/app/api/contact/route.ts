import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSiteContent } from '@/lib/content';
import {
  buildThankYouEmailHtml,
  buildThankYouEmailPlainText,
} from '@/lib/thank-you-email';
import { fetchCmsAppSettingsForContactApi } from '@/lib/cms-app-settings-server';
import { buildStaffInquiryEmailText } from '@/lib/staff-inquiry-email';
import {
  isSmtpConfigured,
  resolveContactFromHeader,
  sendContactSmtp,
  smtpMissingEnvKeys,
} from '@/lib/contact-mail';
import { verifyTurnstileIfConfigured } from '@/lib/turnstile-verify';

/** If logs mention Resend or “domain … verified”, this route is NOT what ran — deploy is stale or wrong project. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      company,
      email,
      phone,
      venue,
      eventLocation,
      eventType,
      eventDate,
      attendeeCount,
      timeline,
      referralSource,
      projectDetails,
      turnstileToken,
    } = body;

    const turnstile = await verifyTurnstileIfConfigured(turnstileToken, request);
    if (!turnstile.ok) {
      return NextResponse.json({ error: turnstile.error }, { status: 400 });
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error: insertError } = await supabase.from('contact_submissions').insert({
      name: String(name).trim(),
      company: company ? String(company).trim() : null,
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : null,
      venue: venue ? String(venue).trim() : null,
      event_location: eventLocation ? String(eventLocation).trim() : null,
      event_type: eventType ? String(eventType).trim() : null,
      event_date: eventDate ? String(eventDate).trim() : null,
      attendee_count: attendeeCount ? String(attendeeCount).trim() : null,
      timeline: timeline ? String(timeline).trim() : null,
      referral_source: referralSource ? String(referralSource).trim() : null,
      project_details: projectDetails ? String(projectDetails).trim() : null,
    });

    if (insertError) {
      console.error('Contact insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    const appSettings = await fetchCmsAppSettingsForContactApi();
    const visitorEmail = String(email).trim();

    const deployMeta = {
      build: 'smtp-only',
      vercelCommit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    };
    console.info('[contact] mailer', deployMeta);

    if (!isSmtpConfigured()) {
      console.warn(
        '[contact] smtp-only: SMTP not configured — set SMTP_USER and SMTP_PASS (and SMTP_HOST for DreamHost) on Production. Missing:',
        smtpMissingEnvKeys()
      );
      return NextResponse.json({ success: true });
    }

    const content = await getSiteContent();
    const fromHeader = resolveContactFromHeader(content.brand.nameFull);

    const willSendStaff = appSettings.staffInquiryEmails.length > 0;
    const willSendThankYou = appSettings.sendThankYouEmail;
    if (!willSendStaff && !willSendThankYou) {
      console.warn(
        '[contact] SMTP is configured but nothing to send: add staff emails in CMS → Settings and/or turn on “Send thank-you emails”'
      );
    }

    const inquiryFields = {
      name: String(name).trim(),
      company: company ? String(company).trim() : null,
      email: visitorEmail,
      phone: phone ? String(phone).trim() : null,
      venue: venue ? String(venue).trim() : null,
      eventLocation: eventLocation ? String(eventLocation).trim() : null,
      eventType: eventType ? String(eventType).trim() : null,
      eventDate: eventDate ? String(eventDate).trim() : null,
      attendeeCount: attendeeCount ? String(attendeeCount).trim() : null,
      timeline: timeline ? String(timeline).trim() : null,
      referralSource: referralSource ? String(referralSource).trim() : null,
      projectDetails: projectDetails ? String(projectDetails).trim() : null,
    };

    if (willSendStaff) {
      const staffText = buildStaffInquiryEmailText(content, inquiryFields);
      const staffResult = await sendContactSmtp({
        fromHeader,
        to: appSettings.staffInquiryEmails,
        subject: `New inquiry: ${String(name).trim()}`,
        text: staffText,
        replyTo: visitorEmail,
      });
      if (!staffResult.ok) {
        console.error('[contact] Staff notification error:', staffResult.errorMessage);
      } else {
        console.info('[contact] Staff notification sent', { id: staffResult.id ?? null });
      }
    }

    if (willSendThankYou) {
      const firstName = String(name).trim().split(' ')[0] || 'there';
      const html = buildThankYouEmailHtml(content, firstName);
      const text = buildThankYouEmailPlainText(content, firstName);
      const tyResult = await sendContactSmtp({
        fromHeader,
        to: [visitorEmail],
        subject: `Thank you for reaching out — ${content.brand.nameFull}`,
        text,
        html,
      });
      if (!tyResult.ok) {
        console.error('[contact] Thank-you error:', tyResult.errorMessage);
      } else {
        const at = visitorEmail.indexOf('@');
        const toDomain = at > 0 ? visitorEmail.slice(at + 1) : '?';
        console.info('[contact] Thank-you email sent', {
          id: tyResult.id ?? null,
          toDomain,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
