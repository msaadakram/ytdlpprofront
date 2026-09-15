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

/**
 * Safe JSON parse: backend outages return HTML — never throw on .json().
 * Maps aborts to a 504 so the UI can show "timed out" instead of PROXY_ERROR.
 */
async function safeJson(res: Response) {
  return res.json().catch(() => null);
}

function proxyError(err: unknown) {
  const isAbort = err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError");
  return NextResponse.json(
    {
      success: false,
      error: {
        code: isAbort ? "PROXY_TIMEOUT" : "PROXY_ERROR",
        message: isAbort ? "Backend request timed out" : "Failed to reach backend service",
      },
    },
    { status: isAbort ? 504 : 502 },
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const token = _req.headers.get("authorization");
  // Forward query strings — list pages depend on ?page&limit&search&status.
  const url = backendUrl(pathStr) + (_req.nextUrl.search || "");

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: token } : {},
      signal: AbortSignal.timeout(50_000),
    });
    const data = await safeJson(res);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return proxyError(err);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const token = req.headers.get("authorization");
  const url = backendUrl(pathStr) + (req.nextUrl.search || "");

  try {
    // Some admin POSTs carry no body (e.g. reset-password, confirm) —
    // never 502 on empty payloads.
    const body = await req.json().catch(() => null);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      ...(body !== null ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(50_000),
    });
    const data = await safeJson(res);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return proxyError(err);
  }
}

/**
 * PATCH passthrough (same forwarding as POST). Current admin user updates use
 * POST /users/:id per the backend's admin routes — keep POST there; PATCH
 * exists for future-proofing and any backend routes that expect PATCH.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const token = req.headers.get("authorization");
  const url = backendUrl(pathStr) + (req.nextUrl.search || "");

  try {
    const body = await req.json().catch(() => null);
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      ...(body !== null ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(50_000),
    });
    const data = await safeJson(res);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return proxyError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const token = req.headers.get("authorization");
  // Forward query strings (same as GET/POST) — some DELETEs carry ? params.
  const url = backendUrl(pathStr) + (req.nextUrl.search || "");

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: token ? { Authorization: token } : {},
      signal: AbortSignal.timeout(50_000),
    });
    const data = await safeJson(res);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return proxyError(err);
  }
}
