import { NextRequest, NextResponse } from "next/server";

const API_ORIGIN = process.env.API_ORIGIN ?? "https://api.ulimi.dev";

function buildTarget(path: string[], search: string) {
  return `${API_ORIGIN}/api/v1/${path.join("/")}/${search}`;
}

function buildHeaders(request: NextRequest, withBody = false) {
  const headers: Record<string, string> = { Accept: "application/json" };
  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;
  if (withBody) headers["Content-Type"] = "application/json";
  return headers;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);
  const res = await fetch(target, {
    headers: buildHeaders(request),
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
  const target = buildTarget(path, request.nextUrl.search);
  const body = await request.text();
  const res = await fetch(target, {
    method: "POST",
    headers: buildHeaders(request, true),
    body,
    cache: "no-store",
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);
  const body = await request.text();
  const res = await fetch(target, {
    method: "PATCH",
    headers: buildHeaders(request, true),
    body,
    cache: "no-store",
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);
  const body = await request.text();
  const res = await fetch(target, {
    method: "PUT",
    headers: buildHeaders(request, true),
    body,
    cache: "no-store",
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = buildTarget(path, request.nextUrl.search);
  const res = await fetch(target, {
    method: "DELETE",
    headers: buildHeaders(request),
    cache: "no-store",
  });
  return new NextResponse(null, { status: res.status });
}

