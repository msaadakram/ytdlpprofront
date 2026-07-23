"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  universalGetInfo,
  universalDownloadVideo,
  universalDownloadAudio,
  universalDownloadTranscript,
  getJobStatus,
  getJobResult,
  triggerDownload,
} from "@/lib/api-client";
import type { ApiFormatInfo, UniversalMediaInfo, TranscriptSegment } from "@/lib/api-client";
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
    return () => {
      cancelPoll.current?.();
    };
  }, []);

  async function pollUntilDone(jobId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let retries = 0;
      const maxRetries = 180;

      const poll = async () => {
        if (retries >= maxRetries) {
          reject(new Error("Download timed out"));
          return;
        }
        retries++;

        try {
          const res = await getJobStatus(jobId);
          if (!res.success || !res.data) {
            reject(new Error(res.error?.message || "Failed to check status"));
            return;
          }

          const job = res.data;
          setProgress(job.progress ?? 0);
          setDownloadSpeed(job.speed ?? "");
          setDownloadEta(job.eta ?? null);
          setDownloadedBytes(job.downloaded ?? 0);
          setTotalBytes(job.total ?? 0);

          if (job.status === "downloading") {
            setStatusText("Downloading...");
          } else if (job.status === "processing") {
            setStatusText("Processing...");
          } else if (job.status === "queued") {
            setStatusText("Queued...");
          }

          if (job.status === "completed") {
            setProgress(100);
            setStatusText("Complete!");

            const finalRes = await getJobResult(jobId);
            if (finalRes.success && finalRes.data) {
              const data = finalRes.data;

              // For transcript type, store the transcript content for display
              if (activeType === "transcript" && data.transcript) {
                setTranscript(data.transcript);
                setTranscriptSegments(data.segments || null);
                setTranscriptFilename(data.filename || null);
                setTranscriptJsonUrl(data.jsonDownloadUrl || null);
                setTranscriptJsonFilename(data.jsonFilename || null);
              } else if (data.downloadUrl) {
                // For video/audio types, trigger download as before
                triggerDownload(data.downloadUrl, data.filename);
              }
            }
            setProcessing(false);
            setDone(true);
            setTimeout(() => setDone(false), 3000);
            resolve();
            return;
          }

          if (job.status === "failed") {
            reject(new Error(job.error || "Download failed"));
            return;
          }

          setTimeout(poll, 1000);
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
        const fmt = formats[selectedFormat] as unknown as { format_id?: string; ext?: string };
        const formatId = fmt.format_id;
        const container = CONTAINER_MAP[fmt.ext || "mp4"] || "mp4";
        const res = await universalDownloadVideo(url, formatId, undefined, container);
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
        const info = await universalGetInfo(url);
        if (!info.success || !info.data) {
          throw new Error(info.error?.message || "Could not fetch media info");
        }
        const thumbUrl = info.data.thumbnail;
        if (thumbUrl) {
          const a = document.createElement("a");
          a.href = thumbUrl;
          a.download = `${info.data.title || "thumbnail"}.jpg`;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setProcessing(false);
        setDone(true);
        setTimeout(() => setDone(false), 3000);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
      setProcessing(false);
      setTimeout(() => setError(""), 5000);
    }
  }

  async function handleDownloadClick(): Promise<void> {
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
