import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Same-origin proxy to the ytback API. Forwards the Authorization header when
 * present so authenticated user routes (auth, dashboard, billing, etc.) work,
 * while leaving anonymous requests (info/download/audio) unaffected.
 */
async function forward(
  method: string,
  req: NextRequest,
  pathStr: string,
  hasBody: boolean,
) {
  const url = `${API_BASE}/api/${pathStr}`;
  const token = req.headers.get("authorization");

  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = token;
    const init: RequestInit = { method, headers };

    if (hasBody) {
      headers["Content-Type"] = "application/json";
      try {
        init.body = JSON.stringify(await req.json());
      } catch {
        init.body = await req.text();
      }
    }

    const res = await fetch(url, init);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "PROXY_ERROR", message: "Failed to reach backend service" } },
      { status: 502 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward("GET", req, path.join("/"), false);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward("POST", req, path.join("/"), true);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward("PATCH", req, path.join("/"), true);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward("DELETE", req, path.join("/"), false);
}
