import { videoFormats, audioFormats, thumbnailFormats, transcriptFormats } from "@/lib/constants";
import type { ApiFormatInfo, UniversalMediaInfo } from "@/lib/api-client";
import type { DownloadType } from "@/lib/constants";

/**
 * Standard video resolutions we expose in the UI, in ascending order.
 * Each maps to a friendly label (e.g. 2160p → "4K").
 */
const STANDARD_QUALITIES: { height: number; label: string }[] = [
  { height: 144, label: "144p" },
  { height: 240, label: "240p" },
  { height: 360, label: "360p" },
  { height: 480, label: "480p" },
  { height: 720, label: "720p HD" },
  { height: 1080, label: "1080p Full HD" },
  { height: 1440, label: "1440p 2K" },
  { height: 2160, label: "4K Ultra HD" },
];

/**
 * From the real backend formats, build a clean, de-duplicated list of the
 * standard resolutions actually available for this media (only those whose
 * height is supported). For each supported height we pick the best matching
 * backend format (highest tbr / fps) so the download button uses a real id.
 */
function resolveVideoQualities(formats: ApiFormatInfo[]): ApiFormatInfo[] {
  const heightToBest = new Map<number, ApiFormatInfo>();
  for (const f of formats) {
    if (!f.height) continue;
    const existing = heightToBest.get(f.height);
    const score = (f.tbr ?? f.abr ?? 0) + (f.fps ?? 0) / 1000;
    const existingScore = existing
      ? (existing.tbr ?? existing.abr ?? 0) + (existing.fps ?? 0) / 1000
      : -1;
    if (!existing || score > existingScore) heightToBest.set(f.height, f);
  }

  const result: ApiFormatInfo[] = [];
  for (const { height, label } of STANDARD_QUALITIES) {
    const match = heightToBest.get(height);
    if (!match) continue;
    result.push({
      ...match,
      quality_label: label,
    });
  }
  return result;
}

/**
 * Resolve the list of formats to show for a given download type.
 * Prefers the real, backend-returned formats from `UniversalMediaInfo`
 * (only the qualities that actually exist for the media), and falls back
 * to the static lists when the backend provides none.
 */
export function resolveFormats(
  mediaInfo: UniversalMediaInfo | null,
  type: DownloadType,
): ApiFormatInfo[] {
  if (mediaInfo) {
    if (type === "video") {
      const backend =
        mediaInfo.video_with_audio_formats?.length
          ? mediaInfo.video_with_audio_formats
          : mediaInfo.video_formats?.length
            ? mediaInfo.video_formats
            : null;
      if (backend) {
        const qualities = resolveVideoQualities(backend);
        if (qualities.length) return qualities;
      }
    }
    if (type === "audio") {
      const backend =
        mediaInfo.audio_only_formats?.length
          ? mediaInfo.audio_only_formats
          : mediaInfo.audio_formats?.length
            ? mediaInfo.audio_formats
            : null;
      if (backend) return backend;
    }
  }

  // Static fallbacks (coerced to ApiFormatInfo shape).
  if (type === "video") {
    return videoFormats.map((f) => ({
      format_id: "",
      ext: f.ext,
      height: f.quality ? parseInt(f.quality, 10) : undefined,
      filesize_str: "",
      quality_label: f.quality || null,
    }));
  }
  if (type === "audio") {
    return audioFormats.map((f) => ({
      format_id: "",
      ext: f.ext,
      abr: f.label.includes("320")
        ? 320
        : f.label.includes("256")
          ? 256
          : f.label.includes("192")
            ? 192
            : f.label.includes("128")
              ? 128
              : undefined,
      filesize_str: "",
    }));
  }
  if (type === "transcript") {
    return transcriptFormats.map((f) => ({ format_id: "", ext: f.ext, filesize_str: "" }));
  }
  return thumbnailFormats.map((f) => ({
    format_id: "",
    ext: f.ext,
    quality_label: f.quality || null,
    filesize_str: "",
  }));
}

/** Bitrate (abr/tbr) for the selected audio format, in kbps. */
export function audioBitrate(fmt: ApiFormatInfo): number {
  return Math.round(fmt.abr ?? fmt.tbr ?? 320);
}
