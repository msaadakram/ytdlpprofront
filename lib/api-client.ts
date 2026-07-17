const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

export interface FormatInfo {
  id: string;
  ext: string;
  quality?: string;
  label?: string;
  size?: number;
}

export interface MediaInfo {
  title: string;
  duration: number;
  thumbnail?: string;
  formats: FormatInfo[];
}

export interface JobStatus {
  job_id: string;
  status: "queued" | "downloading" | "completed" | "failed" | "expired";
  progress?: number;
  speed?: string;
  eta?: string;
  downloaded?: number;
  total?: number;
  filename?: string;
  download_url?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || {
            code: "UNKNOWN_ERROR",
            message: `HTTP ${res.status}: ${res.statusText}`,
          },
        };
      }

      return { success: true, data };
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

  async getInfo(platform: string, url: string): Promise<ApiResponse<MediaInfo>> {
    return this.request<MediaInfo>(`/api/${platform}/info`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }

  async download(
    platform: string,
    url: string,
    formatId: string,
  ): Promise<ApiResponse<JobStatus>> {
    return this.request<JobStatus>(`/api/${platform}/download`, {
      method: "POST",
      body: JSON.stringify({ url, format_id: formatId }),
    });
  }

  async downloadAudio(
    platform: string,
    url: string,
    format: string = "mp3",
    quality: number = 192,
  ): Promise<ApiResponse<JobStatus>> {
    return this.request<JobStatus>(`/api/${platform}/audio`, {
      method: "POST",
      body: JSON.stringify({ url, format, quality }),
    });
  }

  async getJobStatus(jobId: string): Promise<ApiResponse<JobStatus>> {
    return this.request<JobStatus>(`/api/job/${jobId}`);
  }

  async getJobResult(jobId: string): Promise<ApiResponse<JobStatus>> {
    return this.request<JobStatus>(`/api/job/${jobId}/result`);
  }

  async getHealth(): Promise<ApiResponse<{ uptime: number; status: string }>> {
    return this.request("/api/health");
  }
}

export const apiClient = new ApiClient();
export default apiClient;
