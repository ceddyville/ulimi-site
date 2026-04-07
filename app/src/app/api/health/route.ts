import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const results: Record<string, unknown> = {
    env_set: !!apiUrl,
    api_url: apiUrl ?? "(not set)",
  };

  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/concepts/?page_size=1`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      results.status = res.status;
      results.ok = res.ok;
      results.content_type = res.headers.get("content-type");
      const body = await res.text();
      results.body_preview = body.slice(0, 300);
    } catch (e: unknown) {
      results.error = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json(results);
}
