import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/content';

export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await getSiteContent(), {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
}
