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
  ShieldCheck,
  Zap,
  Sparkles,
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
    methodColor: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
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
    methodColor: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
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
    methodColor: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
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
    methodColor: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
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
      <main className="pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-sm font-medium text-[#0d1f26]/50 dark:text-white/40 hover:text-[#0d1f26] dark:hover:text-white transition-colors mb-8 sm:mb-10 font-sans"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0d1f26]/5 dark:bg-white/10 hover:bg-[#0d1f26]/10 dark:hover:bg-white/15 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            Back to home
          </Link>

          {/* Hero */}
          <section className="mb-14 sm:mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#5baab8]/20 to-[#5baab8]/10 flex items-center justify-center shadow-inner shadow-[#5baab8]/10">
                <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-[#5baab8]" />
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#0d1f26]/10 to-transparent dark:via-white/10" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5baab8] font-mono">Reference</span>
            </div>

            <h1 className="text-[2.25rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] font-extrabold text-[#0d1f26] dark:text-white mb-5 font-heading tracking-tight leading-[1.05] break-words">
              API Documentation
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-[#0d1f26]/50 dark:text-white/45 max-w-2xl font-sans leading-relaxed">
              Integrate video downloading into your own applications. Our REST API supports 200+ platforms with copy-paste examples in cURL, Python, Node.js, JavaScript, Java, and Go.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2.5 text-sm font-bold bg-[#0d1f26] text-white px-6 py-3.5 rounded-2xl hover:bg-[#163647] transition-all duration-200 shadow-[0_8px_30px_-8px_rgba(13,31,38,0.35)] hover:shadow-[0_12px_40px_-12px_rgba(13,31,38,0.45)] font-sans"
              >
                <Key className="w-4 h-4" /> Get an API key
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2.5 text-sm font-bold text-[#0d1f26] dark:text-white border-2 border-[#0d1f26]/10 dark:border-white/10 px-6 py-3 rounded-2xl hover:bg-[#0d1f26]/5 dark:hover:bg-white/5 transition-all duration-200 font-sans"
              >
                View dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Two-column layout */}
          <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 xl:gap-20">
            {/* Sticky TOC sidebar — desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <ApiPageToc items={tocItems} />
              </div>
            </aside>

            {/* Mobile TOC pills */}
            <div className="lg:hidden mb-10 -mx-2 px-2 overflow-x-auto scrollbar-none">
              <div className="min-w-max">
                <ApiPageToc items={tocItems} />
              </div>
            </div>

            {/* Main content */}
            <article className="max-w-3xl space-y-20 sm:space-y-24">
              {/* Quick Start */}
              <section id="quick-start" className="scroll-mt-28">
                <SectionHeading eyebrow="01" title="Quick Start" desc="Copy, paste, run. This end-to-end example fetches formats, starts a download, polls until done, and gets the final URL." />
                <div className="mt-7">
                  <CodeTabs snippets={buildQuickStartSnippets()} />
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="scroll-mt-28">
                <SectionHeading eyebrow="02" title="Authentication" desc="Every request must include your API key as a Bearer token in the Authorization header." />
                <div className="mt-7 space-y-4">
                  <div className="bg-card dark:bg-[#0d1f26]/30 border border-border/80 dark:border-white/5 rounded-2xl p-5 sm:p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5baab8]/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl pointer-events-none" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-[#5baab8]/10 dark:bg-[#5baab8]/15 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-[#5baab8]" />
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
                        Create a key in the{" "}
                        <Link href="/dashboard" className="text-foreground dark:text-white font-semibold underline underline-offset-2 hover:text-[#5baab8] transition-colors">
                          dashboard &rarr; API Keys
                        </Link>{" "}
                        tab. The full key is shown only once — store it securely.
                      </p>
                    </div>
                  </div>
                  <CodeTabs snippets={buildAuthSnippets()} />
                </div>
              </section>

              {/* Base URL */}
              <section id="base-url" className="scroll-mt-28">
                <SectionHeading eyebrow="03" title="Base URL" desc="All endpoints are prefixed with this URL." />
                <div className="mt-7">
                  <CodeBlock code={API_BASE_URL} language="text" />
                </div>
              </section>

              {/* Endpoints */}
              <section id="endpoints" className="scroll-mt-28">
                <SectionHeading eyebrow="04" title="Endpoints" desc="The download flow is four simple steps: get info, start download, poll status, fetch result." />
                <div className="mt-7 space-y-6">
                  {endpoints.map((ep) => (
                    <div key={ep.path} className="group bg-card dark:bg-[#0d1f26]/30 border border-border/80 dark:border-white/5 rounded-3xl p-5 sm:p-8 overflow-hidden hover:border-[#5baab8]/30 dark:hover:border-[#5baab8]/30 transition-all duration-300 shadow-[0_2px_16px_-4px_rgba(13,31,38,0.05)] dark:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_-8px_rgba(13,31,38,0.1)]">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 min-w-0">
                        <span className={cn("text-xs font-extrabold px-3 py-1.5 rounded-lg font-mono tracking-wider w-fit", ep.methodColor)}>
                          {ep.method}
                        </span>
                        <code className="text-sm sm:text-base text-foreground dark:text-white font-mono break-words leading-snug min-w-0">{ep.path}</code>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed mb-6">{ep.desc}</p>
                      <div className="grid gap-4 sm:gap-6 min-w-0">
                        <div className="overflow-x-auto rounded-xl">
                          <span className="text-[10px] font-extrabold text-[#0d1f26]/40 dark:text-white/30 uppercase tracking-[0.2em] mb-3 block font-mono">Request</span>
                          <CodeTabs snippets={buildEndpointSnippets(ep.kind)} />
                        </div>
                        <div className="overflow-x-auto rounded-xl">
                          <span className="text-[10px] font-extrabold text-[#0d1f26]/40 dark:text-white/30 uppercase tracking-[0.2em] mb-3 block font-mono">Response</span>
                          <CodeBlock code={ep.response} language="json" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Errors */}
              <section id="errors" className="scroll-mt-28">
                <SectionHeading eyebrow="05" title="Errors" desc="Errors use conventional HTTP status codes and a consistent JSON shape. The error code is in the code field." />
                <div className="mt-7">
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
                {/* Responsive error display */}
                <div className="mt-6 hidden sm:block overflow-x-auto rounded-2xl border border-border/80 dark:border-white/5">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 dark:bg-white/[0.03]">
                      <tr className="text-left">
                        <th className="px-5 py-3.5 font-extrabold text-foreground dark:text-white font-sans text-[10px] uppercase tracking-[0.15em]">Status</th>
                        <th className="px-5 py-3.5 font-extrabold text-foreground dark:text-white font-sans text-[10px] uppercase tracking-[0.15em]">Code</th>
                        <th className="px-5 py-3.5 font-extrabold text-foreground dark:text-white font-sans text-[10px] uppercase tracking-[0.15em]">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errors.map((e) => (
                        <tr key={e.code} className="border-t border-border/60 dark:border-white/[0.05] hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4 font-mono text-foreground dark:text-white font-bold text-sm">{e.status}</td>
                          <td className="px-5 py-4">
                            <code className="font-mono text-[11px] bg-muted/70 dark:bg-white/5 px-2.5 py-1 rounded-md text-foreground dark:text-white">{e.code}</code>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground font-sans text-sm leading-relaxed">{e.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 sm:hidden grid gap-3">
                  {errors.map((e) => (
                    <div key={e.code} className="bg-card dark:bg-[#0d1f26]/30 border border-border/80 dark:border-white/5 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-extrabold text-foreground dark:text-white">{e.status}</span>
                        <code className="font-mono text-[11px] bg-muted/70 dark:bg-white/5 px-2 py-0.5 rounded-md text-foreground dark:text-white">{e.code}</code>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">{e.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits" className="scroll-mt-28">
                <SectionHeading eyebrow="06" title="Rate Limits" desc="Limits reset every minute. When exceeded, you'll get HTTP 429 with a Retry-After header." />
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {rateLimits.map((r) => (
                    <div key={r.label} className="bg-card dark:bg-[#0d1f26]/30 border border-border/80 dark:border-white/5 rounded-3xl p-6 sm:p-7 hover:border-[#5baab8]/20 dark:hover:border-[#5baab8]/20 transition-all duration-300 shadow-[0_2px_12px_-4px_rgba(13,31,38,0.04)] hover:shadow-[0_8px_28px_-8px_rgba(13,31,38,0.08)]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#5baab8]/10 dark:bg-[#5baab8]/15 flex items-center justify-center shadow-inner shadow-[#5baab8]/5">
                          <Gauge className="w-5 h-5 text-[#5baab8]" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground font-mono">{r.label}</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-white font-heading tracking-tight">{r.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-sans leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-start gap-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-2xl p-5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/80 font-sans leading-relaxed">
                    HTTP 429 responses include a{" "}
                    <code className="font-mono bg-amber-100/60 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-md text-amber-700 dark:text-amber-300 font-semibold">Retry-After</code>{" "}
                    header (seconds). Back off and retry — don't hammer the endpoint.
                  </p>
                </div>
              </section>

              {/* Footer CTA */}
              <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0d1f26] to-[#143542] dark:from-[#0a1018] dark:to-[#12273b] border border-[#0d1f26]/20 dark:border-white/5 p-8 sm:p-12 text-center shadow-2xl shadow-[#0d1f26]/20 dark:shadow-black/30">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#5baab8]/15 blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#5baab8]/10 blur-[80px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#5baab8]/15 flex items-center justify-center mx-auto mb-5 shadow-inner shadow-[#5baab8]/10">
                    <Terminal className="w-7 h-7 text-[#5baab8]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight mb-3">Ready to build?</h2>
                  <p className="text-sm sm:text-base text-white/50 mb-8 font-sans max-w-md mx-auto leading-relaxed">Create a free account, generate an API key, and ship your integration today.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center gap-2.5 text-sm font-extrabold bg-white text-[#0d1f26] px-7 py-4 rounded-2xl hover:bg-[#f1f5f9] transition-all duration-200 shadow-[0_8px_30px_-8px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_40px_-8px_rgba(255,255,255,0.35)] font-sans"
                    >
                      Get an API key <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/api-disclaimer"
                      className="inline-flex items-center justify-center gap-2.5 text-sm font-semibold text-white px-7 py-4 rounded-2xl border border-white/15 hover:bg-white/5 transition-all duration-200 font-sans"
                    >
                      <Link2 className="w-4 h-4" /> API disclaimer
                    </Link>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div>
      <span className="inline-block text-[10px] font-extrabold font-mono text-[#5baab8] uppercase tracking-[0.2em] mb-3">
        {eyebrow}
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-extrabold text-[#0d1f26] dark:text-white font-heading tracking-tight leading-[1.1]">
        {title}
      </h2>
      <p className="text-sm sm:text-base lg:text-lg text-[#0d1f26]/45 dark:text-white/40 font-sans max-w-2xl mt-3 leading-relaxed">{desc}</p>
    </div>
  );
}
