import { videoFormats, audioFormats, thumbnailFormats } from "@/lib/constants";

export function FormatShowcase() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            Formats
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Any format, any quality
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            From 4K video to lossless audio — choose exactly what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#eef6f8] rounded-2xl p-8">
            <h3 className="text-lg font-bold text-foreground mb-5 font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5baab8]" /> Video
            </h3>
            <ul className="space-y-3">
              {videoFormats.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium font-sans">{f.label}</span>
                  <span className="text-xs uppercase text-muted-foreground font-mono">{f.ext}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#eef6f8] rounded-2xl p-8">
            <h3 className="text-lg font-bold text-foreground mb-5 font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5baab8]" /> Audio
            </h3>
            <ul className="space-y-3">
              {audioFormats.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium font-sans">{f.label}</span>
                  <span className="text-xs uppercase text-muted-foreground font-mono">{f.ext}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#eef6f8] rounded-2xl p-8">
            <h3 className="text-lg font-bold text-foreground mb-5 font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5baab8]" /> Thumbnail
            </h3>
            <ul className="space-y-3">
              {thumbnailFormats.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium font-sans">{f.label}</span>
                  <span className="text-xs uppercase text-muted-foreground font-mono">{f.ext}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
