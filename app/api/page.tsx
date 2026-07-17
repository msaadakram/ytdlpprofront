import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft, Copy, CheckCircle2, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/api/CodeBlock";

export const metadata: Metadata = {
  title: "API Documentation — fetchwave",
  description: "fetchwave API documentation. Download videos, audio, and thumbnails programmatically.",
};

const endpoints = [
  {
    method: "POST",
    path: "/api/:platform/info",
    desc: "Get available formats and metadata for a URL",
    code: `curl -X POST https://api.fetchwave.app/api/youtube/info \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}'`,
    response: `{
  "success": true,
  "data": {
    "title": "Rick Astley - Never Gonna Give You Up",
    "duration": 212,
    "formats": [
      { "id": "137", "ext": "mp4", "quality": "1080p" },
      { "id": "136", "ext": "mp4", "quality": "720p" }
    ]
  }
}`,
  },
  {
    method: "POST",
    path: "/api/:platform/download",
    desc: "Download a video in the specified format",
    code: `curl -X POST https://api.fetchwave.app/api/youtube/download \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ", "format_id": "137"}'`,
    response: `{
  "success": true,
  "data": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "queued"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/job/:id",
    desc: "Poll for job status and progress",
    code: `curl https://api.fetchwave.app/api/job/550e8400-e29b-41d4-a716-446655440000`,
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
    method: "GET",
    path: "/api/job/:id/result",
    desc: "Get the download URL when complete",
    code: `curl https://api.fetchwave.app/api/job/550e8400-e29b-41d4-a716-446655440000/result`,
    response: `{
  "success": true,
  "data": {
    "status": "completed",
    "download_url": "https://api.fetchwave.app/download/video.mp4",
    "filename": "Rick Astley - Never Gonna Give You Up.mp4",
    "size": 52428800
  }
}`,
  },
];

export default function ApiPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-12">
            <div className="w-14 h-14 rounded-2xl bg-[#5baab8]/20 flex items-center justify-center mb-5">
              <Terminal className="w-7 h-7 text-[#5baab8]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-3 font-heading">API Documentation</h1>
            <p className="text-muted-foreground max-w-xl font-sans">
              Integrate video downloading into your own applications. Our REST API supports 200+ platforms.
            </p>
          </div>

          <div className="space-y-6 mb-12">
            <div className="bg-[#eef6f8] rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-bold text-foreground mb-2 font-heading">Authentication</h2>
              <p className="text-sm text-muted-foreground mb-4 font-sans">
                Include your API key in the request header:
              </p>
              <CodeBlock code={`curl -X POST https://api.fetchwave.app/api/youtube/info \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}'`} />
            </div>

            <div className="bg-[#eef6f8] rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-bold text-foreground mb-2 font-heading">Base URL</h2>
              <CodeBlock code="https://api.fetchwave.app/api" />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground font-heading">Endpoints</h2>
            {endpoints.map((ep, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-white bg-[#5baab8] px-2.5 py-1 rounded-md font-mono">{ep.method}</span>
                  <code className="text-sm text-foreground font-mono">{ep.path}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-sans">{ep.desc}</p>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block font-mono">Example Request</span>
                    <CodeBlock code={ep.code} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block font-mono">Example Response</span>
                    <CodeBlock code={ep.response} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 font-heading">Rate Limits</h2>
            <div className="space-y-3 text-sm text-muted-foreground font-sans">
              <p>Global: <strong className="text-foreground">60 requests / minute</strong></p>
              <p>Info endpoints: <strong className="text-foreground">30 requests / minute</strong></p>
              <p>Download endpoints: <strong className="text-foreground">20 requests / minute</strong></p>
              <p>HTTP 429 responses include a <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">Retry-After</code> header.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
