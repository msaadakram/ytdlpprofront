"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What video qualities are available?",
    a: "YouTube videos can be downloaded in multiple qualities including 4K (2160p), 1440p, 1080p (Full HD), 720p (HD), 480p, and 360p. The available qualities depend on what the original uploader provided. Higher resolutions like 4K provide the best viewing experience but result in larger file sizes.",
  },
  {
    q: "Can I download 4K YouTube videos?",
    a: "Yes, you can download YouTube videos in full 4K Ultra HD resolution (2160p). 4K downloads require a Pro subscription. The video will be saved in MP4 format with H.264 or H.265 codec, depending on the source. Note that 4K videos require more storage space.",
  },
  {
    q: "What video formats do you support?",
    a: "We support MP4, WebM, and MKV formats. MP4 is the most compatible format, working on virtually all devices. WebM offers efficient compression with broad browser support. MKV supports advanced features and multiple codecs for maximum flexibility.",
  },
  {
    q: "Why does my 4K download have no sound?",
    a: "YouTube separates video and audio streams for resolutions above 1080p. When downloading in 4K, our system automatically merges the best available video stream with the best audio stream. If you encounter audio issues, try downloading in 1080p or switch to the MKV container which handles merged streams better.",
  },
  {
    q: "Is downloading YouTube videos legal?",
    a: "Downloading videos for personal offline use is generally permitted. However, redistributing copyrighted content without permission may violate YouTube's Terms of Service. Always respect copyright, use downloaded content for personal use only, and support creators by watching on YouTube when possible.",
  },
  {
    q: "Do I need an account to download?",
    a: "No account or sign-up is required. Simply paste the YouTube video URL, choose your preferred quality, and download. It's completely free for standard qualities. A Pro subscription unlocks 4K downloads and additional features like batch processing.",
  },
];

export function VideoFaq() {
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
          <span className="text-xs font-bold tracking-widest uppercase text-[#FF0000] font-mono">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            Video Download Questions
          </h2>
          <p className="text-muted-foreground text-sm font-sans">
            Everything you need to know about downloading YouTube videos.
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
