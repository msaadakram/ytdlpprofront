import { testimonials } from "@/lib/constants";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            Testimonials
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Loved by creators
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            Join thousands of satisfied users who download with Fetchwave daily.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#eef6f8] rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#5baab8] text-[#5baab8]" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6 font-sans">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="text-sm font-bold text-foreground font-heading">{t.name}</p>
                <p className="text-xs text-muted-foreground font-sans">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
