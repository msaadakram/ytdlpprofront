import { steps } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            How it works
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Three simple steps
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            No account, no software, no hassle. Just paste, pick, and download.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="bg-white rounded-2xl border border-border p-8 relative hover:shadow-lg transition-all">
                <span className="text-6xl font-black text-[#5baab8]/10 absolute top-4 right-6 font-heading">{step.number}</span>
                <div className="w-12 h-12 rounded-xl bg-[#eef6f8] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#5baab8]" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 font-heading">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
