import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type AttendanceBody = {
  supervisorName: string;
  employeeName: string;
  infractionDate: string;
  eventName: string;
  infractionType: string;
  minutesLate: string;
  reasonProvided: string;
  actionTaken: string;
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

    const body: AttendanceBody = await request.json();

    if (!body.supervisorName || !body.employeeName || !body.infractionDate || !body.eventName || !body.infractionType || !body.actionTaken) {
      return NextResponse.json(
        { error: 'Supervisor Name, Employee Name, Date, Event Name, Infraction Type, and Action Taken are required' },
        { status: 400 }
      );
    }

    const payload = {
      supervisorName: body.supervisorName?.trim() || '',
      employeeName: body.employeeName?.trim() || '',
      infractionDate: body.infractionDate?.trim() || '',
      eventName: body.eventName?.trim() || '',
      infractionType: body.infractionType?.trim() || '',
      minutesLate: body.minutesLate?.trim() || '',
      reasonProvided: body.reasonProvided?.trim() || '',
      actionTaken: body.actionTaken?.trim() || '',
      submittedBy: user.email,
    };

    const webAppUrl = process.env.GOOGLE_SHEETS_ATTENDANCE_INFRACTION_URL;

    if (webAppUrl?.startsWith('https://')) {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Attendance Sheets error:', res.status, errText);
        return NextResponse.json(
          { error: 'Failed to append to Google Sheet' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Attendance infraction API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
