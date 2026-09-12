import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Build the backend URL. Strips trailing slashes from API_BASE first —
 * otherwise a value like "https://host/" forwards to "//api/admin/..."
 * which Express won't match (→ "Route POST //api/admin/login not found").
 */
function backendUrl(pathStr: string) {
  return `${API_BASE.replace(/\/+$/, "")}/api/admin/${pathStr}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const token = _req.headers.get("authorization");
  const url = backendUrl(pathStr);

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: token } : {},
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "PROXY_ERROR", message: "Failed to reach backend service" } },
      { status: 502 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const token = req.headers.get("authorization");
  const url = backendUrl(pathStr);

  try {
    const body = await req.json();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "PROXY_ERROR", message: "Failed to reach backend service" } },
      { status: 502 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const token = req.headers.get("authorization");
  const url = backendUrl(pathStr);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: token ? { Authorization: token } : {},
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "PROXY_ERROR", message: "Failed to reach backend service" } },
      { status: 502 },
    );
  }
}
