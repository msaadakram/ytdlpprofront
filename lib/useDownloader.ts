"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  universalGetInfo,
  universalDownloadVideo,
  universalDownloadAudio,
  universalDownloadTranscript,
  universalDownloadThumbnail,
  getJobStatus,
  getJobResult,
  triggerDownload,
  downloadThumbnail,
  downloadTextFile,
} from "@/lib/api-client";
import type { ApiFormatInfo, UniversalMediaInfo, TranscriptSegment } from "@/lib/api-client";
import { triggerMonetagAd } from "@/lib/monetag";
import type { DownloadType } from "@/lib/constants";
import { resolveFormats, audioBitrate } from "@/lib/formats";

const CONTAINER_MAP: Record<string, string> = {
  mp4: "mp4", mkv: "mkv", webm: "webm",
};

export interface UseDownloaderState {
  url: string;
  activeType: DownloadType;
  selectedFormat: number;
  setSelectedFormat: (i: number) => void;
  setActiveType: (t: DownloadType) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  mediaInfo: UniversalMediaInfo | null;
  fetchingInfo: boolean;
  infoReady: boolean;
  infoError: boolean;
  processing: boolean;
  done: boolean;
  progress: number;
  statusText: string;
  downloadSpeed: string;
  downloadEta: string | number | null;
  downloadedBytes: number;
  totalBytes: number;
  error: string;
  formats: ApiFormatInfo[];
  transcript: string | null;
  transcriptSegments: TranscriptSegment[] | null;
  transcriptFilename: string | null;
  transcriptJsonUrl: string | null;
  transcriptJsonFilename: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleUrlChange: (value: string) => void;
  handleDownloadClick: () => Promise<void>;
}

export function useDownloader(): UseDownloaderState {
  const [url, setUrl] = useState("");
  const [activeType, setActiveType] = useState<DownloadType>("video");
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const inputRef = useRef<HTMLInputElement>(null);

  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [downloadEta, setDownloadEta] = useState<string | number | null>(null);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [error, setError] = useState("");

  const [mediaInfo, setMediaInfo] = useState<UniversalMediaInfo | null>(null);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [infoReady, setInfoReady] = useState(false);
  const [infoError, setInfoError] = useState(false);
  const cancelPoll = useRef<(() => void) | null>(null);
  // Leak-safe poll bookkeeping: timeout id + mounted guard + abort.
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const pollAbortRef = useRef<AbortController | null>(null);

  // Transcript state
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[] | null>(null);
  const [transcriptFilename, setTranscriptFilename] = useState<string | null>(null);
  const [transcriptJsonUrl, setTranscriptJsonUrl] = useState<string | null>(null);
  const [transcriptJsonFilename, setTranscriptJsonFilename] = useState<string | null>(null);

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value);
    setMediaInfo(null);
    setInfoReady(false);
    setInfoError(false);
    setError("");
    setSelectedFormat(0);
    setTranscript(null);
    setTranscriptSegments(null);
    setTranscriptFilename(null);
    setTranscriptJsonUrl(null);
    setTranscriptJsonFilename(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelPoll.current?.();
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
      pollAbortRef.current?.abort();
    };
  }, []);

  async function pollUntilDone(jobId: string): Promise<void> {
    // Cancel any in-flight poll before starting a new one.
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    pollAbortRef.current?.abort();
    const ctrl = new AbortController();
    pollAbortRef.current = ctrl;
    cancelPoll.current = () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
      ctrl.abort();
    };
    const safe = <T extends unknown>(fn: () => void) => {
      if (mountedRef.current && !ctrl.signal.aborted) fn();
    };
    return new Promise((resolve, reject) => {
      let retries = 0;
      // ~30 min horizon matching the backend job timeout: brisk 1s polls
      // for the first 3 min, then 3s cadence to spare the API.
      const maxRetries = 720;

      const poll = async () => {
        if (!mountedRef.current || ctrl.signal.aborted) return;
        if (retries >= maxRetries) {
          reject(new Error("Download timed out"));
          return;
        }
        retries++;

        try {
          const res = await getJobStatus(jobId);
          if (!mountedRef.current || ctrl.signal.aborted) return;
          if (!res.success || !res.data) {
            reject(new Error(res.error?.message || "Failed to check status"));
            return;
          }

          const job = res.data;
          safe(() => {
            setProgress(job.progress ?? 0);
            setDownloadSpeed(job.speed ?? "");
            setDownloadEta(job.eta ?? null);
            setDownloadedBytes(job.downloaded ?? 0);
            setTotalBytes(job.total ?? 0);
          });

          if (job.status === "downloading") {
            safe(() => setStatusText("Downloading..."));
          } else if (job.status === "processing") {
            safe(() => setStatusText("Processing..."));
          } else if (job.status === "queued") {
            safe(() => setStatusText("Queued..."));
          }

          if (job.status === "completed") {
            safe(() => {
              setProgress(100);
              setStatusText("Complete!");
            });

            const finalRes = await getJobResult(jobId);
            if (!mountedRef.current || ctrl.signal.aborted) return;
            if (finalRes.success && finalRes.data) {
              const data = finalRes.data;

              if (activeType === "transcript" && (data.transcript || data.downloadUrl)) {
                // Trigger the actual transcript file download first
                if (data.downloadUrl) {
                  triggerDownload(data.downloadUrl, data.filename || undefined);
                } else if (data.transcript) {
                  const fmt = formats[selectedFormat];
                  const ext = fmt?.ext || "srt";
                  const safeTitle = (mediaInfo?.title || "transcript").replace(/[^\w\s.-]+/g, "").trim() || "transcript";
                  downloadTextFile(data.transcript, data.filename || `${safeTitle}.${ext}`);
                }
                // Then keep the content for the in-page viewer (download pages)
                safe(() => {
                  setTranscript(data.transcript ?? null);
                  setTranscriptSegments(data.segments || null);
                  setTranscriptFilename(data.filename || null);
                  setTranscriptJsonUrl(data.jsonDownloadUrl || null);
                  setTranscriptJsonFilename(data.jsonFilename || null);
                });
              } else if (data.downloadUrl) {
                // For video/audio types, trigger download as before
                triggerDownload(data.downloadUrl, data.filename);
              }
            }
            safe(() => {
              setProcessing(false);
              setDone(true);
            });
            const doneId = setTimeout(() => {
              if (mountedRef.current) setDone(false);
            }, 3000);
            pollTimeoutRef.current = doneId;
            resolve();
            return;
          }

          if (job.status === "failed") {
            reject(new Error(job.error || "Download failed"));
            return;
          }

          pollTimeoutRef.current = setTimeout(poll, retries < 180 ? 1000 : 3000);
        } catch (err) {
          reject(err);
        }
      };

      poll();
    });
  }

  async function startDownload(): Promise<void> {
    setError("");
    setProcessing(true);
    setProgress(0);
    setStatusText("Starting...");
    setDownloadSpeed("");
    setDownloadEta(null);
    setDownloadedBytes(0);
    setTotalBytes(0);
    setDone(false);

    try {
      if (activeType === "video") {
        const fmt = formats[selectedFormat] as unknown as { format_id?: string; ext?: string; quality_label?: string | null };
        // Static fallbacks carry format_id:"" — send quality label instead of an
        // empty format_id so the backend picks the right rendition.
        const rawId = (fmt.format_id || "").trim();
        const formatId = rawId ? rawId : undefined;
        const quality = rawId ? undefined : (fmt.quality_label || undefined);
        const container = CONTAINER_MAP[fmt.ext || "mp4"] || "mp4";
        const res = await universalDownloadVideo(url, formatId, quality, container);
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || "Download failed to start");
        }
        setStatusText("Processing...");
        await pollUntilDone(res.data.job_id);
      } else if (activeType === "audio") {
        const fmt = formats[selectedFormat] as unknown as { format_id?: string; ext?: string };
        const ext = fmt.ext || "mp3";
        const bitrate = audioBitrate(formats[selectedFormat]);
        const res = await universalDownloadAudio(url, ext, bitrate);
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || "Download failed to start");
        }
        setStatusText("Processing...");
        await pollUntilDone(res.data.job_id);
      } else if (activeType === "transcript") {
        const fmt = formats[selectedFormat];
        const res = await universalDownloadTranscript(url, fmt.ext, selectedLanguage);
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || "Transcription failed to start");
        }
        setStatusText("Transcribing...");
        await pollUntilDone(res.data.job_id);
      } else {
        // Thumbnail — server-side via same ytultra URL (video → ffmpeg frame → /download/*.jpg).
        // Falls back to CDN proxy when backend rejects (non-YouTube).
        try {
          const thumbRes = await universalDownloadThumbnail(url);
          if (thumbRes.success && thumbRes.data) {
            setStatusText("Processing...");
            await pollUntilDone(thumbRes.data.job_id);
            return;
          }
          throw new Error(thumbRes.error?.message || "Thumbnail job failed to start");
        } catch (thumbErr) {
          const thumbUrl = mediaInfo?.thumbnail;
          if (!thumbUrl) throw thumbErr instanceof Error ? thumbErr : new Error("No thumbnail available for this URL");
          const ext = formats[selectedFormat]?.ext || "jpg";
          const safeTitle = (mediaInfo?.title || "thumbnail").replace(/[^\w\s.-]+/g, "").trim() || "thumbnail";
          downloadThumbnail(thumbUrl, `${safeTitle}.${ext}`);
          setProcessing(false);
          setDone(true);
          setTimeout(() => setDone(false), 3000);
          return;
        }
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : "Download failed");
      setProcessing(false);
      pollTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) setError("");
      }, 5000);
    }
  }

  async function handleDownloadClick(): Promise<void> {
    // Monetag OnClick: ads fire only on download-button presses.
    triggerMonetagAd();
    if (!url.trim()) {
      inputRef.current?.focus();
      return;
    }

    // Step 1: first click fetches info and reveals the quality grid.
    if (!infoReady) {
      setError("");
      setFetchingInfo(true);
      setInfoError(false);
      try {
        const res = await universalGetInfo(url);
        if (res.success && res.data) {
          setMediaInfo(res.data);
          setInfoReady(true);
          setInfoError(false);
        } else {
          setInfoError(true);
          // Surface the backend's verbatim reason (bot-check, 401, …) next
          // to the generic banner — critical for diagnosing failures.
          setError(res.error?.message || "");
        }
      } catch {
        setInfoError(true);
      } finally {
        setFetchingInfo(false);
      }
      return;
    }

    // Step 2: subsequent click starts the actual download.
    await startDownload();
  }

  const formats = resolveFormats(mediaInfo, activeType);

  return {
    url,
    activeType,
    selectedFormat,
    setSelectedFormat,
    setActiveType,
    selectedLanguage,
    setSelectedLanguage,
    mediaInfo,
    fetchingInfo,
    infoReady,
    infoError,
    processing,
    done,
    progress,
    statusText,
    downloadSpeed,
    downloadEta,
    downloadedBytes,
    totalBytes,
    error,
    formats,
    transcript,
    transcriptSegments,
    transcriptFilename,
    transcriptJsonUrl,
    transcriptJsonFilename,
    inputRef,
    handleUrlChange,
    handleDownloadClick,
  };
}
