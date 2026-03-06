import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { getSiteContent } from '@/lib/content';
import { buildThankYouEmailHtml } from '@/lib/thank-you-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, projectDetails } = body;

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
      project_details: projectDetails ? String(projectDetails).trim() : null,
    });

    if (insertError) {
      console.error('Contact insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: true });
    }

    const content = await getSiteContent();
    const html = buildThankYouEmailHtml(content, String(name).trim().split(' ')[0] || 'there');
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const fromName =
      process.env.RESEND_FROM_NAME ?? content.brand.nameFull;

    const { error: emailError } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [String(email).trim()],
      subject: `Thank you for reaching out — ${content.brand.nameFull}`,
      html,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
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
