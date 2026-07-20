import { videoFormats, audioFormats, thumbnailFormats, transcriptFormats } from "@/lib/constants";
import type { ApiFormatInfo, UniversalMediaInfo } from "@/lib/api-client";
import type { DownloadType } from "@/lib/constants";

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
      if (backend) return backend;
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
