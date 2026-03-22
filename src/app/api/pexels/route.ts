import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY as string,
      },
      next: { revalidate: 86400 }, // cache for 24 hours
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Pexels' }, { status: res.status });
    }

    const data = await res.json();
    const imageUrl = data.photos?.[0]?.src?.large2x || data.photos?.[0]?.src?.large || null;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
