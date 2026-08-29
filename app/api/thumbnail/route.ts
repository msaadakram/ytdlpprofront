import { NextRequest } from "next/server";

/**
 * GET /api/thumbnail?url=<cdn image url>&filename=<name>
 *
 * Server-side proxy that streams a media thumbnail back as a file download.
 * Needed because thumbnail CDNs (ytimg, tiktokcdn, …) are cross-origin:
 * the HTML `download` attribute is ignored there and an <a> click would
 * navigate/open a new tab instead of saving the file.
 *
 * Guards: http(s) only, private/loopback hosts blocked (SSRF), image
 * content-type enforced, hard size cap.
 */

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB — generous for any thumbnail

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  // Bare IP literals — block private/loopback/link-local ranges
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true; // multicast/reserved
  }
  if (h === "[::1]" || h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return false;
}

function sanitizeFilename(name: string, fallbackExt: string): string {
  const clean = name.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 120);
  return clean || `thumbnail.${fallbackExt}`;
}

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("url");
  if (!src) {
    return Response.json({ error: "Missing `url` query parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return Response.json({ error: "Invalid `url`" }, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return Response.json({ error: "Only http(s) URLs are allowed" }, { status: 400 });
  }
  if (isBlockedHost(parsed.hostname)) {
    return Response.json({ error: "Blocked host" }, { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      headers: {
        // Some CDNs (e.g. ytimg) require a browser-like UA
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "image/*,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return Response.json({ error: "Failed to fetch thumbnail" }, { status: 502 });
  }

  if (!upstream.ok) {
    return Response.json({ error: `Upstream responded ${upstream.status}` }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  if (!contentType.toLowerCase().startsWith("image/")) {
    return Response.json({ error: "URL did not return an image" }, { status: 415 });
  }

  const buf = await upstream.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) {
    return Response.json({ error: "Image too large" }, { status: 413 });
  }

  const fallbackExt = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const filename = sanitizeFilename(req.nextUrl.searchParams.get("filename") || "", fallbackExt);

  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buf.byteLength),
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}