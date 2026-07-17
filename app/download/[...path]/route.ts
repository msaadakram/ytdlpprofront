import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const url = `${API_BASE}/download/${pathStr}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: { code: "PROXY_ERROR", message: `Backend returned ${res.status}` } },
        { status: res.status },
      );
    }

    const headers = new Headers();
    res.headers.forEach((value, key) => {
      if (["content-type", "content-length", "content-disposition", "accept-ranges"].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "PROXY_ERROR", message: "Failed to reach backend service" } },
      { status: 502 },
    );
  }
}
