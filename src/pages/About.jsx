import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronDown, ChevronUp } from "lucide-react";

const STATS = [
  { value: "20", label: "Weddings / Year" },
  { value: "CT", label: "Cape Town Based" },
  { value: "\u221e", label: "Worldwide Travel" },
  { value: "2015", label: "Filming Since" },
];

function FAQAccordion({ faqs }) {
  const [open, setOpen] = useState(null);
  if (!faqs || faqs.length === 0) return null;
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={faq.id || i} className="border border-white/10 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left text-white/90 hover:text-white transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-light text-base pr-4">{faq.question}</span>
            {open === i
              ? <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/10 pt-4">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function About() {
  const { data: faqs = [] } = useQuery({
    queryKey: ["faqs-about"],
    queryFn: () => base44.entities.FAQ.filter({ variant: "all" }),
    initialData: [],
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.3) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">About</p>
          <h1
            className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Get to Know Gustav Franke
          </h1>
          <p className="text-white/50 text-lg font-light">
            Wedding filmmaker based in Cape Town, available worldwide
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2
            className="text-2xl md:text-3xl font-light text-white mb-8 leading-relaxed"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {"\"My love for people and storytelling is at the heart of what I do.\""}
          </h2>
          <div className="space-y-5 text-white/60 text-base leading-relaxed font-light">
            <p>
              The films I create aren't about me — they're the greatest gift I can give you. A timeless film that captures the essence of you as a couple. The thought of you showing your film to your children and grandchildren is a big part of what inspires me as a wedding filmmaker.
            </p>
            <p>
              I hope that when you watch your film for the first time, it gives you goosebumps, brings tears of joy, and takes you on a rollercoaster of emotions as you relive all the moments that swept by too fast on the day.
            </p>
            <p>
              I value a strong connection with all of my couples, and understanding your story and the significance of your wedding. This allows me to capture your day in a way that feels true to who you are — not a template, not a formula. Your film.
            </p>
          </div>
        </div>
        <div
          className="aspect-[3/4] rounded-2xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #111 100%)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-white/20 text-2xl" style={{ fontFamily: "Georgia, serif" }}>GF</span>
              </div>
              <p className="text-white/20 text-xs tracking-widest uppercase">Portrait coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-light mb-2" style={{ color: "#c9a84c", fontFamily: "Georgia, serif" }}>
                {s.value}
              </div>
              <div className="text-white/40 text-xs tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ section */}
      {faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-20">
          <h2
            className="text-3xl font-light text-white text-center mb-12"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Common Questions
          </h2>
          <FAQAccordion faqs={faqs} />
        </section>
      )}

      {/* Bottom CTA */}
      <section className="text-center py-24 px-6">
        <h2
          className="text-3xl md:text-4xl font-light text-white mb-6"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Ready to make something beautiful?
        </h2>
        <p className="text-white/50 mb-10 text-base">
          I film a limited number of weddings each year. Let's see if your date is still available.
        </p>
        <Link
          to="/book-me"
          className="inline-flex items-center gap-2 px-8 py-4 rounded text-sm font-medium text-black transition-all hover:opacity-90"
          style={{ backgroundColor: "#c9a84c" }}
        >
          Book Me
        </Link>
      </section>
    </div>
  );
}