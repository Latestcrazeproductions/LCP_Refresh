import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type PayablesBody = {
  paymentNotes: string;
  paymentType: string;
  vendorPayeeName: string;
  paymentAmount: string;
  paymentDueDate: string;
  descriptionPurpose: string;
  purchaseOrderNumber: string;
  eventCode: string;
  paymentMethod: string;
  payeePaymentDetails: string;
  invoiceUrl: string;
  sendCopyOfResponses: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: PayablesBody = await request.json();

    if (!body.paymentType || !body.vendorPayeeName || !body.paymentAmount || !body.paymentDueDate || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Payment Type, Vendor/Payee Name, Amount, Due Date, and Payment Method are required' },
        { status: 400 }
      );
    }

    if (!body.invoiceUrl?.trim()) {
      return NextResponse.json(
        { error: 'Please upload the invoice' },
        { status: 400 }
      );
    }

    const payload = {
      paymentNotes: body.paymentNotes?.trim() || '',
      paymentType: body.paymentType?.trim() || '',
      vendorPayeeName: body.vendorPayeeName?.trim() || '',
      paymentAmount: body.paymentAmount?.trim() || '',
      paymentDueDate: body.paymentDueDate?.trim() || '',
      descriptionPurpose: body.descriptionPurpose?.trim() || '',
      purchaseOrderNumber: body.purchaseOrderNumber?.trim() || '',
      eventCode: body.eventCode?.trim() || '',
      paymentMethod: body.paymentMethod?.trim() || '',
      payeePaymentDetails: body.payeePaymentDetails?.trim() || '',
      invoiceUrl: body.invoiceUrl?.trim() || '',
    };

    const webAppUrl = process.env.GOOGLE_SHEETS_PAYABLES_URL;

    if (webAppUrl?.startsWith('https://')) {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Payables Sheets error:', res.status, errText);
        return NextResponse.json(
          { error: 'Failed to append to Google Sheet' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Payables API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
