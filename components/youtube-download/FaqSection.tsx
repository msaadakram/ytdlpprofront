"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is downloading YouTube videos legal?",
    a: "Downloading videos for personal offline use is generally permitted. However, redistributing copyrighted content without permission may violate YouTube's Terms of Service. Always respect copyright and use downloaded content responsibly.",
  },
  {
    q: "What video qualities are available?",
    a: "YouTube videos can be downloaded in multiple qualities including 4K (2160p), 1440p, 1080p (Full HD), 720p (HD), 480p, and 360p. The available qualities depend on what the original uploader provided. Higher resolutions like 4K require a Pro subscription.",
  },
  {
    q: "Can I download age-restricted videos?",
    a: "Age-restricted videos require you to be signed into a Google account that meets the age requirement. These videos cannot be downloaded through our service due to YouTube's restrictions. Please use YouTube's official app for offline viewing of age-restricted content.",
  },
  {
    q: "What audio formats do you support?",
    a: "We support MP3 (up to 320 kbps), AAC (256 kbps), FLAC (lossless), WAV (uncompressed), and OGG (192 kbps). For music production and archiving, FLAC is recommended. For general listening, MP3 at 320 kbps offers excellent quality with small file sizes.",
  },
  {
    q: "Why is there no sound in my 4K download?",
    a: "YouTube separates video and audio streams for resolutions above 1080p. Our system automatically merges the best available video stream with the best audio stream. If you encounter audio issues, try downloading in 1080p or use the MKV container format.",
  },
  {
    q: "How long are downloaded files stored?",
    a: "Files are stored temporarily and deleted automatically after the download is complete. We do not keep copies of your downloaded content. For Pro users, files remain available for 24 hours in case you need to download again.",
  },
  {
    q: "Can I download transcripts and subtitles?",
    a: "Yes! Select the Transcript mode and choose from SRT, VTT, TXT, or JSON formats. Our AI generates accurate transcripts with timestamps from any video with audio. SRT and VTT are perfect for subtitle files, TXT for plain text, and JSON for structured data with timestamps.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-14 md:py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-[#5baab8] font-mono">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            YouTube Download Questions
          </h2>
          <p className="text-muted-foreground text-sm font-sans">
            Everything you need to know about downloading from YouTube.
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
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
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
                      <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed font-sans" itemProp="text">
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
