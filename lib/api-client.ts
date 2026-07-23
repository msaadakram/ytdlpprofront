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

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
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
  transcript?: string | null;
  segments?: TranscriptSegment[] | null;
  jsonFilename?: string | null;
  jsonDownloadUrl?: string | null;
  jsonSize?: number;
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

export async function universalDownloadTranscript(
  url: string,
  format: string = "srt",
): Promise<ApiResponse<JobStart>> {
  return request<JobStart>("/api/proxy/transcribe", {
    method: "POST",
    body: JSON.stringify({ url, format }),
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

/* ────────────────────────────────────────────────────────────────────────── */
/* ─── Authenticated dashboard / user / billing API client ────────────────── */
/* ────────────────────────────────────────────────────────────────────────── */

const AUTH_STORAGE_KEY = "downforge_auth";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

/** Generic authenticated request through the same-origin proxy. */
async function authRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(endpoint, { headers: { ...headers, ...options.headers }, ...options });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: json.error || { code: "UNKNOWN_ERROR", message: `HTTP ${res.status}: ${res.statusText}` },
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

/* ─── Types ─── */

export interface DashboardOverview {
  totalDownloads: number;
  apiCallsToday: number;
  platformsUsed: number;
  successRate: number;
  trends: {
    downloads: number;
    apiCalls: number;
    platforms: number;
    successRate: number;
  };
}

export interface TimeseriesBucket {
  bucket: string;
  calls: number;
  errors: number;
}

export interface DownloadRow {
  id: string;
  title: string;
  filename: string | null;
  platform: string;
  type: string;
  ext: string | null;
  format_label: string | null;
  size: number;
  status: "completed" | "failed";
  error: string | null;
  created_at: string;
  completed_at: string;
}

export interface DownloadsHistory {
  items: DownloadRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  weekly: { day: string; downloads: number }[];
}

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  masked: string;
  last_used_at: string | null;
  created_at: string;
  revoked: boolean;
}

export interface ApiKeyCreated {
  key: ApiKey;
  plaintext: string;
}

export interface BillingPlan {
  plan: "free" | "pro";
  name: string;
  price: number;
  interval: string;
  features: string[];
  status: string;
  renews_at: string | null;
  stripe_enabled: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  hosted_url: string | null;
  pdf_url: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  plan: "free" | "pro";
  plan_expires_at: string | null;
  notifications: {
    email_completed: boolean;
    weekly_summary: boolean;
    product_updates: boolean;
    billing_reminders: boolean;
  } | null;
  created_at: string | null;
}

/* ─── Dashboard endpoints ─── */

export const getOverview = () =>
  authRequest<DashboardOverview>("/api/proxy/dashboard/overview");

export const getTimeseries = (range = 7) =>
  authRequest<{ buckets: TimeseriesBucket[] }>(`/api/proxy/dashboard/timeseries?range=${range}`);

export const getRecentDownloads = (limit = 5) =>
  authRequest<{ recent: DownloadRow[] }>(`/api/proxy/dashboard/recent-downloads?limit=${limit}`);

export const getDownloadsHistory = (params: { search?: string; page?: number; limit?: number } = {}) => {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return authRequest<DownloadsHistory>(`/api/proxy/dashboard/downloads${query ? `?${query}` : ""}`);
};

/* ─── API keys ─── */

export const listApiKeys = () =>
  authRequest<{ keys: ApiKey[] }>("/api/proxy/api-keys");

export const createApiKey = (name: string) =>
  authRequest<ApiKeyCreated>("/api/proxy/api-keys", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const deleteApiKey = (id: string) =>
  authRequest<{ message: string }>(`/api/proxy/api-keys/${id}`, { method: "DELETE" });

/* ─── Billing ─── */

export const getPlan = () =>
  authRequest<BillingPlan>("/api/proxy/billing/plan");

export const listInvoices = () =>
  authRequest<{ invoices: Invoice[] }>("/api/proxy/billing/invoices");

export const createCheckout = () =>
  authRequest<{ url: string | null; fallback?: boolean; message?: string }>("/api/proxy/billing/checkout", {
    method: "POST",
  });

export const createPortal = () =>
  authRequest<{ url: string | null; fallback?: boolean; message?: string }>("/api/proxy/billing/portal", {
    method: "POST",
  });

export const setPlan = (plan: "free" | "pro") =>
  authRequest<BillingPlan>("/api/proxy/billing/plan", {
    method: "PATCH",
    body: JSON.stringify({ plan }),
  });

/* ─── Profile + notifications ─── */

export const getProfile = () =>
  authRequest<{ user: UserProfile }>("/api/proxy/user/profile");

export const updateProfile = (data: { first_name?: string; last_name?: string; email?: string }) =>
  authRequest<{ user: UserProfile }>("/api/proxy/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const updateNotifications = (data: Partial<{
  email_completed: boolean;
  weekly_summary: boolean;
  product_updates: boolean;
  billing_reminders: boolean;
}>) =>
  authRequest<{ notifications: NonNullable<UserProfile["notifications"]> }>("/api/proxy/user/notifications", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

/* ─── Auth (password change) ─── */

export const changePassword = (currentPassword: string, newPassword: string) =>
  authRequest<{ message: string }>("/api/proxy/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

