"use client";

// TEMPORARY preview page for visual QA of TranscriptViewer — delete after use.
import { useState } from "react";
import { useTheme } from "next-themes";
import { TranscriptViewer } from "@/components/transcription/TranscriptViewer";
import type { TranscriptSegment } from "@/lib/api-client";

const segments: TranscriptSegment[] = [
  { start: 0.5, end: 4.2, text: "Hey everyone, welcome back to the channel. Today we are talking about building better habits that actually stick." },
  { start: 4.6, end: 9.1, text: "Most people fail at habits because they try to change everything at once instead of starting small." },
  { start: 9.8, end: 15.4, text: "The research is really clear here: tiny changes compound over time into remarkable results." },
  { start: 16.0, end: 21.7, text: "So the first strategy is called habit stacking. You attach a new habit to an existing one." },
  { start: 22.3, end: 27.9, text: "For example, after I pour my morning coffee, I will write down three priorities for the day." },
  { start: 28.5, end: 34.2, text: "The second strategy is designing your environment so the good habit is obvious and easy." },
  { start: 35.0, end: 40.6, text: "If you want to read more, put the book on your pillow. If you want to scroll less, leave your phone in another room." },
  { start: 41.2, end: 46.8, text: "Third, track your habits. What gets measured gets improved, and a simple calendar chain works great." },
  { start: 47.4, end: 53.1, text: "And finally, be patient. Habits often appear to make no difference until you cross a critical threshold." },
  { start: 53.7, end: 58.9, text: "If you found this helpful, subscribe for more practical videos every week. See you in the next one!" },
];

const transcript = segments.map((s) => s.text).join(" ");

export default function PreviewPage() {
  const { theme, setTheme } = useTheme();
  const [withSegments, setWithSegments] = useState(true);
  return (
    <main className="min-h-screen p-4 sm:p-10 bg-white dark:bg-[#050a10] max-w-4xl mx-auto">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="px-4 py-2 rounded-xl border border-border dark:border-white/20 text-sm">
          Toggle theme ({theme})
        </button>
        <button onClick={() => setWithSegments(!withSegments)} className="px-4 py-2 rounded-xl border border-border dark:border-white/20 text-sm">
          {withSegments ? "Plain text only" : "With segments"}
        </button>
      </div>
      <TranscriptViewer
        transcript={transcript}
        segments={withSegments ? segments : null}
        title="How to Build Better Habits — Full Guide (Science-Backed)"
        brandColor="#E1306C"
        downloadUrl={undefined}
        filename={undefined}
      />
    </main>
  );
}
