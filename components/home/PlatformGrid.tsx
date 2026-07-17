import { platforms } from "@/lib/constants";
import { YoutubeLogo } from "@/components/shared/brand-logos";
import type { ComponentType } from "react";

type BrandLogoProps = { className?: string; style?: React.CSSProperties };

function PlaceholderLogo({ name }: { name: string }) {
  const p = platforms.find((pl) => pl.name === name);
  if (!p) return null;
  const Logo = p.Logo;
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: p.bg }}>
      <Logo className="w-5 h-5" style={{ color: p.fg }} />
    </div>
  );
}

const featuredPlatforms = [
  "YouTube", "Facebook", "Instagram", "TikTok", "Twitter / X",
  "Vimeo", "Dailymotion", "Twitch", "Reddit", "Pinterest",
  "LinkedIn", "Snapchat",
];

export function PlatformGrid() {
  return (
    <section id="platforms" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            Supported platforms
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            200+ Platforms & Growing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            From the biggest names to the niche platforms — if there&apos;s a video, we can fetch it.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredPlatforms.map((name) => (
            <div
              key={name}
              className="flex items-center gap-4 bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <PlaceholderLogo name={name} />
              <span className="text-sm font-semibold text-foreground font-sans">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
