"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { usePlatformTranslations } from "@/lib/usePlatformTranslations";
import type { DownloadType } from "@/lib/constants";
import { useTranslations } from "next-intl";

export function DownloadFaq({ platform, type }: { platform: string; type: DownloadType }) {
  const config = usePlatformTranslations(platform);
  const brandColor = config.brandColor;
  const t = useTranslations("DownloadOnly");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Use the type-specific templated FAQ set (faqAudioItems / faqThumbnailItems
  // / faqTranscriptItems) — fully translated in every locale — instead of the
  // per-platform arrays, which are English-only and mix intents (e.g. audio
  // FAQs were shown on thumbnail/transcript pages). {platform} is interpolated
  // manually because ICU params on t.raw() arrays cannot be resolved via t().
  const faqKey =
    type === "audio"
      ? "faqAudioItems"
      : type === "thumbnail"
      ? "faqThumbnailItems"
      : "faqTranscriptItems";
  const rawFaqs = (() => {
    try {
      return t.raw(faqKey as any);
    } catch {
      return null;
    }
  })();
  const faqs: { q: string; a: string }[] = (() => {
    const fromTemplate = Array.isArray(rawFaqs)
      ? (rawFaqs as Array<{ q?: unknown; a?: unknown }>)
          .map((f) => ({
            q: String(f?.q ?? "").replace(/\{platform\}/g, config.name),
            a: String(f?.a ?? "").replace(/\{platform\}/g, config.name),
          }))
          .filter((f) => f.q && f.a)
      : [];
    return fromTemplate.length > 0 ? fromTemplate : config.faqs;
  })();

  const getTitle = () => {
    try {
      const key =
        type === "audio"
          ? "faqTitleAudio"
          : type === "thumbnail"
          ? "faqTitleThumbnail"
          : type === "transcript"
          ? "faqTitleTranscript"
          : "faqTitleAudio";
      return t(key as any);
    } catch {
      return type === "audio"
        ? "Audio Download Questions"
        : type === "thumbnail"
        ? "Thumbnail Download Questions"
        : type === "transcript"
        ? "Transcript Download Questions"
        : "Audio Download Questions";
    }
  };
  const getLabel = () => {
    try {
      return t("faqLabel");
    } catch {
      return "FAQ";
    }
  };
  const getSubtitle = () => {
    try {
      return t("faqSubtitle", { platform: config.name } as any);
    } catch {
      return `Everything you need to know about downloading from ${config.name}.`;
    }
  };

  if (faqs.length === 0) return null;

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-widest uppercase font-mono" style={{ color: brandColor }}>
            {getLabel()}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            {getTitle()}
          </h2>
          <p className="text-muted-foreground text-sm font-sans">
            {getSubtitle()}
          </p>
        </motion.div>

        <dl className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-border overflow-hidden"
                itemScope
                itemType="https://schema.org/Question"
              >
                <dt>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-sm font-semibold text-foreground pr-4 font-heading" itemProp="name">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </motion.span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`faq-answer-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      <p                        className="px-4 pb-4 sm:px-5 text-sm text-muted-foreground leading-relaxed font-sans" itemProp="text">
                        {faq.a}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
