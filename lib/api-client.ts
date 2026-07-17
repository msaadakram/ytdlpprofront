const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

export interface ApiFormatInfo {
  format_id: string;
  ext: string;
  resolution?: string;
  width?: number;
  height?: number;
  fps?: number;
  vcodec?: string;
  acodec?: string;
  tbr?: number;
  abr?: number;
  vbr?: number;
  filesize?: number | null;
  filesize_str: string;
  quality_label?: string | null;
  protocol?: string;
}

export interface UniversalMediaInfo {
  id: string;
  platform: string;
  detected_hostname: string | null;
  title: string;
  url: string;
  duration: number;
  duration_str: string;
  thumbnail: string | null;
  uploader: string | null;
  channel: string | null;
  upload_date: string | null;
  description: string | null;
  view_count: number;
  like_count: number;
  extractor: string | null;
  webpage_url: string | null;
  extractor_key: string | null;
  categories: string[];
  tags: string[];
  chapters: unknown[];
  playlist: unknown | null;
  subtitles: string[];
  automatic_captions: string[];
  video_formats: ApiFormatInfo[];
  audio_formats: ApiFormatInfo[];
  audio_only_formats: ApiFormatInfo[];
  video_with_audio_formats: ApiFormatInfo[];
  best_format: ApiFormatInfo | null;
  filesize: number | null;
  filesize_str: string;
  audio_ext: string[];
}

export interface JobStart {
  job_id: string;
  platform: string;
  type: string;
  status: string;
}

export interface JobStatus {
  jobId: string;
  type?: string;
  platform?: string | null;
  status: "queued" | "downloading" | "processing" | "completed" | "failed" | "expired";
  progress?: number;
  speed?: string;
  eta?: string | number | null;
  downloaded?: number;
  total?: number;
  filename?: string;
  size?: number;
  downloadUrl?: string;
  error?: string;
  createdAt?: number;
  completedAt?: number;
  expiresAt?: number;
}

// Helper: pick proxy or direct URL
function baseUrl(): string {
  if (typeof window !== "undefined") {
    return ""; // use same-origin proxy
  }
  return API_BASE;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const base = baseUrl();
    const url = base ? `${base}${endpoint}` : endpoint;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.error || {
          code: "UNKNOWN_ERROR",
          message: `HTTP ${res.status}: ${res.statusText}`,
        },
      };
    }
    if (typeof json === "object" && json !== null && "success" in json) {
      return json as ApiResponse<T>;
    }
    return { success: true, data: json };
  } catch (err) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : "Network request failed",
      },
    };
  }
}

/** ─── Universal endpoints (auto-detect platform) ─── */

export async function universalGetInfo(
  url: string,
): Promise<ApiResponse<UniversalMediaInfo>> {
  return request<UniversalMediaInfo>("/api/proxy/info", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export async function universalDownloadVideo(
  url: string,
  formatId?: string,
  quality?: string,
  container?: string,
): Promise<ApiResponse<JobStart>> {
  return request<JobStart>("/api/proxy/download", {
    method: "POST",
    body: JSON.stringify({
      url,
      format_id: formatId,
      quality,
      container: container || "mp4",
    }),
  });
}

export async function universalDownloadAudio(
  url: string,
  format: string = "mp3",
  quality: number = 320,
): Promise<ApiResponse<JobStart>> {
  return request<JobStart>("/api/proxy/audio", {
    method: "POST",
    body: JSON.stringify({ url, format, quality }),
  });
}

/** ─── Job polling ─── */

export async function getJobStatus(
  jobId: string,
): Promise<ApiResponse<JobStatus>> {
  return request<JobStatus>(`/api/proxy/job/${jobId}`);
}

export async function getJobResult(
  jobId: string,
): Promise<ApiResponse<JobStatus>> {
  return request<JobStatus>(`/api/proxy/job/${jobId}/result`);
}

/** ─── Helper: poll until done ─── */

export function pollJob(
  jobId: string,
  onUpdate: (status: JobStatus) => void,
  intervalMs: number = 1500,
  maxRetries: number = 120,
): { cancel: () => void } {
  let cancelled = false;
  let retries = 0;

  async function poll() {
    if (cancelled || retries >= maxRetries) return;
    retries++;
    const result = await getJobStatus(jobId);
    if (cancelled) return;

    if (result.success && result.data) {
      onUpdate(result.data);
      if (
        result.data.status === "completed" ||
        result.data.status === "failed" ||
        result.data.status === "expired"
      ) {
        return;
      }
    }

    setTimeout(poll, intervalMs);
  }

  poll();
  return { cancel: () => { cancelled = true; } };
}

/** ─── Trigger browser download from server URL ─── */

export function triggerDownload(downloadUrl: string, filename?: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const fullUrl = downloadUrl.startsWith("http")
    ? downloadUrl
    : `${apiBase}${downloadUrl}`;
  const a = document.createElement("a");
  a.href = fullUrl;
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
