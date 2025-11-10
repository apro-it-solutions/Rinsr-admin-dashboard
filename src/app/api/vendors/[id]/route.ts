import { NextResponse } from 'next/server';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://rinsrapi.aproitsolutions.in/api';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const finalUrl = `${BASE_URL.replace(/\/+$/, '')}/vendors/${id}`;

  console.log('📡 Fetching vendor details from:', finalUrl);

  try {
    const res = await fetch(finalUrl, { method: 'GET', cache: 'no-store' });
    const text = await res.text(); // read body only once

    let data;
    try {
      data = JSON.parse(text); // try parsing as JSON
    } catch {
      console.error('❌ Non-JSON response (HTML likely):', text.slice(0, 200));
      return NextResponse.json(
        {
          success: false,
          message: 'Backend returned non-JSON response (likely HTML error)',
          raw: text.slice(0, 200)
        },
        { status: 502 }
      );
    }

    if (!res.ok) {
      console.error('❌ Upstream error (vendor details):', data);
      return NextResponse.json(
        { success: false, message: 'Vendor fetch failed', data },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      vendor: data.vendor || data
    });
  } catch (err) {
    console.error('❌ Vendor fetch error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}
