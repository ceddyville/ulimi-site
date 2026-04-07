import { NextRequest, NextResponse } from "next/server";

const API_ORIGIN = process.env.API_ORIGIN ?? "http://178.104.133.115";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${API_ORIGIN}/api/v1/${path.join("/")}${request.nextUrl.search}`;
  const res = await fetch(target, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${API_ORIGIN}/api/v1/${path.join("/")}${request.nextUrl.search}`;
  const body = await request.text();
  const res = await fetch(target, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}
