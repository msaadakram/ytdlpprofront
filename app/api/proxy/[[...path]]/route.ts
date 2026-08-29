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
  // Normalize base: strip trailing slashes and avoid double /api if API_BASE
  // already ends with /api (common misconfiguration in env).
  const normalizedBase = API_BASE.replace(/\/+$/, '');
  const hasApiSuffix = normalizedBase.endsWith('/api');
  // Special handling for file downloads - they are served from /download/ not /api/download/
  const isFileDownload = pathStr.startsWith('download/');
  const url = isFileDownload
    ? `${normalizedBase}/${pathStr}`
    : hasApiSuffix
      ? `${normalizedBase}/${pathStr}`
      : `${normalizedBase}/api/${pathStr}`;
  const token = req.headers.get("authorization");
  const range = req.headers.get("range");

  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = token;
    if (range && isFileDownload) headers["Range"] = range;
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
    
    // For file downloads, stream the response instead of parsing JSON
    if (isFileDownload) {
      const headers = new Headers();
      const contentType = res.headers.get('Content-Type');
      const contentDisposition = res.headers.get('Content-Disposition');
      const contentLength = res.headers.get('Content-Length');
      const acceptRanges = res.headers.get('Accept-Ranges');
      const cacheControl = res.headers.get('Cache-Control');
      const contentRange = res.headers.get('Content-Range');
      
      if (contentType) headers.set('Content-Type', contentType);
      if (contentDisposition) headers.set('Content-Disposition', contentDisposition);
      if (contentLength) headers.set('Content-Length', contentLength);
      if (acceptRanges) headers.set('Accept-Ranges', acceptRanges);
      if (cacheControl) headers.set('Cache-Control', cacheControl);
      if (contentRange) headers.set('Content-Range', contentRange);
      
      return new NextResponse(res.body, {
        status: res.status,
        headers,
      });
    }
    
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
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  return forward("GET", req, path?.join("/") || "", false);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  return forward("POST", req, path?.join("/") || "", true);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  return forward("PATCH", req, path?.join("/") || "", true);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  return forward("DELETE", req, path?.join("/") || "", false);
}
