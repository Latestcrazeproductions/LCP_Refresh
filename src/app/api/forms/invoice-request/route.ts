import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type InvoiceRequestBody = {
  salesperson: string;
  lassoEventUrl: string;
  eventName: string;
  nameToSendInvoiceTo: string;
  emailToSendInvoiceTo: string;
  invoicingMethod: string;
  urgency: string;
  additionalNotes: string;
  sendCopyOfResponses: boolean;
};

/**
 * Maps form data to Google Sheet column order (Form_Responses).
 * Columns: Event Name, Leads Event URL, Status, Invoice #, Due Date, Total Amount,
 * Terms, Name of Person(s) to, Email Address(es), Additional Notes,
 * Any Special Terms For The Client, Invoicing Method
 */
function buildSheetRow(body: InvoiceRequestBody): string[] {
  const notesWithMeta = [
    body.additionalNotes.trim(),
    body.urgency ? `Urgency: ${body.urgency}` : '',
    body.salesperson ? `Salesperson: ${body.salesperson}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  return [
    body.eventName?.trim() || '',
    body.lassoEventUrl?.trim() || '',
    'Invoice Requested',
    '', // Invoice #
    '', // Due Date
    '', // Total Amount
    '', // Terms
    body.nameToSendInvoiceTo?.trim() || '',
    body.emailToSendInvoiceTo?.trim() || '',
    notesWithMeta,
    '', // Any Special Terms For The Client
    body.invoicingMethod?.trim() || '',
  ];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: InvoiceRequestBody = await request.json();

    if (!body.eventName || !body.emailToSendInvoiceTo || !body.invoicingMethod) {
      return NextResponse.json(
        { error: 'Event Name, Email, and Invoicing Method are required' },
        { status: 400 }
      );
    }

    const webAppUrl = process.env.GOOGLE_SHEETS_INVOICE_REQUEST_URL;
    const row = buildSheetRow(body);

    if (webAppUrl?.startsWith('https://')) {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Google Sheets web app error:', res.status, errText);
        return NextResponse.json(
          { error: 'Failed to append to Google Sheet. Check GOOGLE_SHEETS_INVOICE_REQUEST_URL setup.' },
          { status: 502 }
        );
      }
    } else {
      console.warn('GOOGLE_SHEETS_INVOICE_REQUEST_URL not configured. Invoice request data:', row);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Invoice request API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
