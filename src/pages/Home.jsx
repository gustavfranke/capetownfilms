import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Play } from "lucide-react";

const DEFAULT_TESTIMONIALS = [
  {
    id: "t1",
    name: "Philip & Yolandi",
    role: "Couple",
    quote: "Gustav has an amazing talent to capture memories in a remarkable, individualistic way. His eye for detail is phenomenal. Wedding days go by so quickly — thanks to Gustav, we can relive every moment again and again for years to come.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Nozzi & Chris",
    role: "Couple",
    quote: "Without much direction from us, he was able to put together a beautiful video depicting our multicultural wedding — my mum refers to it as 'watching a movie'. I would highly recommend Gustav for any occasion.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Anna & Stephen",
    role: "Couple",
    quote: "Gustav puts together truly beautiful films. He immortalised our special day so wonderfully, with three beautiful films and a very quick turnaround. He's professional, personable, and a pleasure to deal with.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Gustav & Jané fans",
    role: "Couple",
    quote: "Gustav & Jané were absolutely awesome from start to finish. Before our big day we met up, had a coffee and such a good chat — which really made us feel at ease about being on camera. The final products were absolutely stunning. Every time I watch one of the films I burst into tears with happiness.",
    rating: 5,
  },
  {
    id: "t5",
    name: "Kelly & Travis",
    role: "Tintswalo Atlantic",
    quote: "What an honour to have our wedding video shot by Gustav. He really captured the essence of our wedding day. Professional and prompt service. Such a kind person.",
    rating: 5,
  },
];

export default function Home() {
  const { data: testimonialData = [] } = useQuery({
    queryKey: ["testimonials-home"],
    queryFn: () => base44.entities.Testimonial.list(),
    initialData: [],
  });

  const testimonials = testimonialData.length > 0 ? testimonialData : DEFAULT_TESTIMONIALS;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #0a0a0a 0%, #111 40%, #0d0d0d 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.12) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-8 animate-pulse">
            Gustav Franke Cinematography
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            It's All About Your Story
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto mb-4 leading-relaxed">
            I'm a destination wedding videographer based in Cape Town, ready to travel across the world to capture your love story.
          </p>
          <p className="text-white/35 text-sm tracking-wide mb-12">
            Capturing only 20 weddings per year — 7 spots left for 2025
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-me"
              className="px-8 py-4 rounded text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "#c9a84c" }}
            >
              Book Me
            </Link>
            <Link
              to="/films"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded text-sm font-medium text-white border border-white/20 hover:border-white/40 transition-all"
            >
              <Play className="w-4 h-4" /> Watch Films
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
        </div>
      </section>

      {/* Story intro */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">The Approach</p>
        <p
          className="text-2xl md:text-3xl font-light text-white/80 leading-relaxed"
          style={{ fontFamily: "Georgia, serif" }}
        >
          My love for people and storytelling is at the heart of what I do. The films I create aren't about me — they're the greatest gift I can give you.
        </p>
        <p className="text-white/40 text-base mt-8 leading-relaxed max-w-2xl mx-auto">
          A timeless film that captures the essence of you as a couple. The thought of you showing your film to your children and grandchildren is a big part of what inspires me as a wedding filmmaker.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 mt-10 text-sm tracking-wide transition-colors"
          style={{ color: "#c9a84c" }}
        >
          More about me →
        </Link>
      </section>

      {/* Films teaser */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Portfolio</p>
            <h2
              className="text-3xl font-light text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Featured Films
            </h2>
          </div>
          <Link to="/films" className="text-white/40 hover:text-white text-sm transition-colors hidden sm:block">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {["Boschendal Estate", "Tintswalo Atlantic", "La Cotte Farm"].map((name) => (
            <Link
              key={name}
              to="/films"
              className="group relative aspect-video rounded-xl overflow-hidden block"
              style={{ background: "linear-gradient(135deg, #1a1a1a, #222, #111)" }}
            >
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ background: "radial-gradient(ellipse at 40% 40%, rgba(201,168,76,0.2) 0%, transparent 70%)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/20 group-hover:border-[#c9a84c] flex items-center justify-center transition-all">
                  <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm font-light">{name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-3">Couples</p>
            <h2
              className="text-3xl md:text-4xl font-light text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              What Couples Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <div
                key={t.id || i}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, s) => (
                    <span key={s} className="text-xs" style={{ color: "#c9a84c" }}>★</span>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed font-light flex-1 italic">
                  "{t.quote}"
                </p>
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  {t.role && <p className="text-white/30 text-xs mt-0.5">{t.role}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-28 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #000, #0d0a05, #000)" }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.25) 0%, transparent 65%)" }}
        />
        <div className="relative">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Limited Availability</p>
          <h2
            className="text-4xl md:text-5xl font-light text-white mb-6"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Let's Capture Your Story
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-xl mx-auto leading-relaxed">
            I film a limited number of weddings each year. If your date is still open, I'd love to hear about your day.
          </p>
          <Link
            to="/book-me"
            className="inline-flex items-center gap-2 px-10 py-4 rounded text-sm font-medium text-black transition-all hover:opacity-90"
            style={{ backgroundColor: "#c9a84c" }}
          >
            Book Me
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p
              className="text-white text-sm tracking-widest uppercase"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Gustav Franke
            </p>
            <p className="text-white/30 text-xs tracking-widest uppercase mt-0.5">Cinematography</p>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-xs">
            <Link to="/films" className="hover:text-white transition-colors">Films</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/book-me" className="hover:text-white transition-colors">Book Me</Link>
          </div>
          <p className="text-white/20 text-xs">
            I typically respond within 24 hours
          </p>
        </div>
      </footer>
    </div>
  );
}