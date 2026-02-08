import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function SocialProofSection({ testimonials = [] }) {
  if (!testimonials.length) return null;

  return (
    <section className="bg-stone-900 py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium">Love Stories</span>
          <h2 className="text-3xl md:text-4xl font-light text-white mt-4">What Couples Are Saying</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] relative"
            >
              <Quote className="w-8 h-8 text-amber-500/20 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating || 5 }).map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/60 font-light text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                {t.photo_url && (
                  <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                )}
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-white/30 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}