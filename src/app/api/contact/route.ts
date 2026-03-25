import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { getSiteContent } from '@/lib/content';
import { buildThankYouEmailHtml } from '@/lib/thank-you-email';
import { fetchCmsAppSettingsForContactApi } from '@/lib/cms-app-settings-server';
import { buildStaffInquiryEmailHtml } from '@/lib/staff-inquiry-email';

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
    } = body;

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

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const content = await getSiteContent();
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const fromName =
      process.env.RESEND_FROM_NAME ?? content.brand.nameFull;
    const fromHeader = `${fromName} <${fromEmail}>`;

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

    if (appSettings.staffInquiryEmails.length > 0) {
      const staffHtml = buildStaffInquiryEmailHtml(content, inquiryFields);
      const { error: staffEmailError } = await resend.emails.send({
        from: fromHeader,
        to: appSettings.staffInquiryEmails,
        replyTo: visitorEmail,
        subject: `New inquiry: ${String(name).trim()}`,
        html: staffHtml,
      });
      if (staffEmailError) {
        console.error('Resend staff notification error:', staffEmailError);
      }
    }

    if (appSettings.sendThankYouEmail) {
      const html = buildThankYouEmailHtml(
        content,
        String(name).trim().split(' ')[0] || 'there'
      );
      const { error: emailError } = await resend.emails.send({
        from: fromHeader,
        to: [visitorEmail],
        subject: `Thank you for reaching out — ${content.brand.nameFull}`,
        html,
      });
      if (emailError) {
        console.error('Resend thank-you error:', emailError);
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
