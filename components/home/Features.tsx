import { features } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            Features
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Everything you need
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            Built for speed, reliability, and quality. No compromises.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#eef6f8] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#5baab8]" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 font-heading">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
