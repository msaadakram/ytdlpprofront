import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CodeBlock } from "@/components/api/CodeBlock";
import { CodeTabs } from "@/components/api/CodeTabs";
import { ApiPageToc } from "@/components/api/ApiPageToc";
import {
  ArrowLeft,
  ArrowRight,
  Terminal,
  Key,
  Link2,
  AlertTriangle,
  Gauge,
  ChevronRight,
} from "lucide-react";
import {
  API_BASE_URL,
  buildQuickStartSnippets,
  buildAuthSnippets,
  buildEndpointSnippets,
} from "@/lib/api-examples";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "API Documentation — DownForge",
  description:
    "DownForge API documentation. Download videos, audio, and thumbnails programmatically using curl, Python, Node.js, JavaScript, Java, or Go.",
};

const tocItems = [
  { id: "quick-start", label: "Quick Start" },
  { id: "authentication", label: "Authentication" },
  { id: "base-url", label: "Base URL" },
  { id: "endpoints", label: "Endpoints" },
  { id: "errors", label: "Errors" },
  { id: "rate-limits", label: "Rate Limits" },
];

const endpoints = [
  {
    method: "POST" as const,
    path: "/api/:platform/info",
    desc: "Get available formats and metadata for a URL. Use the returned format_id to start a download.",
    kind: "info" as const,
    methodColor: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    response: `{
  "success": true,
  "data": {
    "title": "Rick Astley - Never Gonna Give You Up",
    "duration": 212,
    "best_format": { "format_id": "137", "ext": "mp4", "quality": "1080p" },
    "video_formats": [
      { "format_id": "137", "ext": "mp4", "quality_label": "1080p" },
      { "format_id": "136", "ext": "mp4", "quality_label": "720p" }
    ]
  }
}`,
  },
  {
    method: "POST" as const,
    path: "/api/:platform/download",
    desc: "Start a download job. Returns a job_id you can poll for progress and the final result.",
    kind: "download" as const,
    methodColor: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    response: `{
  "success": true,
  "data": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "queued"
  }
}`,
  },
  {
    method: "GET" as const,
    path: "/api/job/:id",
    desc: "Poll a job for status and progress. Status values: queued, downloading, processing, completed, failed, expired.",
    kind: "status" as const,
    methodColor: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    response: `{
  "success": true,
  "data": {
    "status": "downloading",
    "progress": 45.2,
    "speed": "12.5 MiB/s",
    "eta": "0:15"
  }
}`,
  },
  {
    method: "GET" as const,
    path: "/api/job/:id/result",
    desc: "Get the download URL when the job status is \"completed\". The URL is valid for 60 minutes.",
    kind: "result" as const,
    methodColor: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    response: `{
  "success": true,
  "data": {
    "status": "completed",
    "download_url": "https://api.downforge.me/download/video.mp4",
    "filename": "Rick Astley - Never Gonna Give You Up.mp4",
    "size": 52428800
  }
}`,
  },
];

const errors = [
  { status: "400", code: "VALIDATION_ERROR", desc: "Request body failed schema validation. See the details field." },
  { status: "400", code: "BAD_REQUEST", desc: "Malformed request — missing required fields or invalid JSON." },
  { status: "401", code: "UNAUTHORIZED", desc: "Missing or invalid Authorization header / API key." },
  { status: "404", code: "NOT_FOUND", desc: "Unknown endpoint or job id." },
  { status: "429", code: "RATE_LIMIT", desc: "Rate limit exceeded. Check the Retry-After header." },
  { status: "422", code: "DOWNLOAD_FAILED", desc: "yt-dlp could not fetch the requested URL." },
  { status: "500", code: "INTERNAL", desc: "Unexpected server error. Try again or contact support." },
];

const rateLimits = [
  { label: "Global", value: "60 req / min", desc: "Across all endpoints per API key." },
  { label: "Info", value: "30 req / min", desc: "Per /:platform/info calls." },
  { label: "Download", value: "20 req / min", desc: "Per /:platform/download calls." },
];

export default function ApiPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          {/* Hero */}
          <div className="mb-12">
            <div className="w-14 h-14 rounded-2xl bg-[#5baab8]/20 flex items-center justify-center mb-5">
              <Terminal className="w-7 h-7 text-[#5baab8]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-3 font-heading tracking-tight">
              API Documentation
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl font-sans">
              Integrate video downloading into your own applications. Our REST API supports
              200+ platforms with copy-paste examples in cURL, Python, Node.js, JavaScript, Java, and Go.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#0d1f26] text-white px-5 py-3 rounded-full hover:bg-[#1a3545] transition-colors font-sans"
              >
                <Key className="w-4 h-4" /> Get an API key
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-foreground border border-border px-5 py-3 rounded-full hover:bg-muted/60 transition-colors font-sans"
              >
                View dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Desktop two-column layout */}
          <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
            {/* Sticky TOC sidebar — desktop only */}
            <aside className="hidden lg:block">
              <ApiPageToc items={tocItems} />
            </aside>

            {/* Mobile TOC (horizontal pills) — renders inside content area on mobile */}
            <div className="lg:hidden mb-8">
              <ApiPageToc items={tocItems} />
            </div>

            {/* Main content */}
            <div className="max-w-3xl space-y-16">
              {/* ─── Quick Start ─── */}
              <section id="quick-start" className="scroll-mt-24">
                <SectionHeading
                  eyebrow="01"
                  title="Quick Start"
                  desc="Copy, paste, run. This end-to-end example fetches formats, starts a download, polls until done, and gets the final URL."
                />
                <div className="mt-6">
                  <CodeTabs snippets={buildQuickStartSnippets()} />
                </div>
              </section>

              {/* ─── Authentication ─── */}
              <section id="authentication" className="scroll-mt-24">
                <SectionHeading
                  eyebrow="02"
                  title="Authentication"
                  desc="Every request must include your API key as a Bearer token in the Authorization header."
                />
                <div className="mt-6 grid gap-4">
                  <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#5baab8]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Key className="w-3.5 h-3.5 text-[#5baab8]" />
                      </div>
                      <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                        Create a key in the{" "}
                        <Link href="/dashboard" className="text-foreground font-medium underline underline-offset-2 hover:text-[#5baab8]">
                          dashboard &rarr; API Keys
                        </Link>{" "}
                        tab. The full key is shown only once — store it securely.
                      </p>
                    </div>
                  </div>
                  <CodeTabs snippets={buildAuthSnippets()} />
                </div>
              </section>

              {/* ─── Base URL ─── */}
              <section id="base-url" className="scroll-mt-24">
                <SectionHeading
                  eyebrow="03"
                  title="Base URL"
                  desc="All endpoints are prefixed with this URL."
                />
                <div className="mt-6">
                  <CodeBlock code={API_BASE_URL} language="text" />
                </div>
              </section>

              {/* ─── Endpoints ─── */}
              <section id="endpoints" className="scroll-mt-24">
                <SectionHeading
                  eyebrow="04"
                  title="Endpoints"
                  desc="The download flow is four simple steps: get info, start download, poll status, fetch result."
                />
                <div className="mt-6 space-y-6">
                  {endpoints.map((ep) => (
                    <div key={ep.path} className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 hover:border-border transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md font-mono w-fit", ep.methodColor)}>
                          {ep.method}
                        </span>
                        <code className="text-sm text-foreground font-mono break-all">{ep.path}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-5 font-sans leading-relaxed">{ep.desc}</p>
                      <div className="grid gap-5">
                        <div>
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block font-mono">
                            Request
                          </span>
                          <CodeTabs snippets={buildEndpointSnippets(ep.kind)} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block font-mono">
                            Response
                          </span>
                          <CodeBlock code={ep.response} language="json" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ─── Errors ─── */}
              <section id="errors" className="scroll-mt-24">
                <SectionHeading
                  eyebrow="05"
                  title="Errors"
                  desc="Errors use conventional HTTP status codes and a consistent JSON shape. The error code is in the code field."
                />
                <div className="mt-6">
                  <CodeBlock
                    language="json"
                    code={`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "url is required",
    "details": [{ "field": "url", "issue": "required" }]
  }
}`}
                  />
                </div>
                {/* Cards on mobile, table on sm+ */}
                <div className="mt-6 hidden sm:block overflow-x-auto rounded-xl border border-border/80">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-semibold text-foreground font-sans text-xs uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 font-semibold text-foreground font-sans text-xs uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 font-semibold text-foreground font-sans text-xs uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errors.map((e) => (
                        <tr key={e.code} className="border-t border-border/60 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-foreground font-medium">{e.status}</td>
                          <td className="px-4 py-3">
                            <code className="font-mono text-xs bg-muted/80 px-2 py-0.5 rounded-md text-foreground">{e.code}</code>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground font-sans">{e.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 sm:hidden grid gap-3">
                  {errors.map((e) => (
                    <div key={e.code} className="bg-card border border-border/80 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs text-foreground font-bold">{e.status}</span>
                        <code className="font-mono text-xs bg-muted/80 px-1.5 py-0.5 rounded text-foreground">{e.code}</code>
                      </div>
                      <p className="text-xs text-muted-foreground font-sans leading-relaxed">{e.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ─── Rate Limits ─── */}
              <section id="rate-limits" className="scroll-mt-24">
                <SectionHeading
                  eyebrow="06"
                  title="Rate Limits"
                  desc="Limits reset every minute. When exceeded, you'll get HTTP 429 with a Retry-After header."
                />
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {rateLimits.map((r) => (
                    <div key={r.label} className="bg-card border border-border/80 rounded-2xl p-5 hover:border-border transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-[#5baab8]/10 flex items-center justify-center">
                          <Gauge className="w-3.5 h-3.5 text-[#5baab8]" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                          {r.label}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-foreground font-heading">{r.value}</p>
                      <p className="text-xs text-muted-foreground mt-1.5 font-sans leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-yellow-800 dark:text-yellow-200 font-sans">
                    HTTP 429 responses include a{" "}
                    <code className="font-mono bg-yellow-100 dark:bg-yellow-900/50 px-1 py-0.5 rounded">Retry-After</code>{" "}
                    header (seconds). Back off and retry — don't hammer the endpoint.
                  </p>
                </div>
              </section>

              {/* ─── Footer CTA ─── */}
              <section className="bg-gradient-to-br from-card to-muted/30 border border-border/80 rounded-2xl p-8 sm:p-10 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#5baab8]/15 flex items-center justify-center mx-auto mb-4">
                  <Terminal className="w-6 h-6 text-[#5baab8]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading mb-2">
                  Ready to build?
                </h2>
                <p className="text-sm text-muted-foreground mb-6 font-sans max-w-md mx-auto leading-relaxed">
                  Create a free account, generate an API key, and ship your integration today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#0d1f26] text-white px-6 py-3 rounded-full hover:bg-[#1a3545] transition-all duration-200 font-sans shadow-sm hover:shadow-md"
                  >
                    Get an API key <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/api-disclaimer"
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground px-6 py-3 rounded-full border border-border hover:bg-muted/60 transition-all duration-200 font-sans"
                  >
                    <Link2 className="w-4 h-4" /> API disclaimer
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Helper component for section headers ── */

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div>
      <span className="inline-block text-[10px] font-bold font-mono text-[#5baab8] uppercase tracking-[0.2em] mb-2">
        {eyebrow}
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-heading tracking-tight">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground font-sans max-w-2xl mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}
