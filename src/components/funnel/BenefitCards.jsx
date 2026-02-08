import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Film } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Less Stress, More Joy",
    description: "Stop second-guessing vendors. Every professional in the Vault has been tested over hundreds of events.",
  },
  {
    icon: Heart,
    title: "Better Vendors, Better Day",
    description: "Access a curated team that already works together seamlessly. The result? A flawless, unforgettable day.",
  },
  {
    icon: Film,
    title: "A Film You'll Treasure",
    description: "Not a standard wedding video. A cinematic story crafted with the same artistry as your favourite films.",
  },
];

export default function BenefitCards() {
  return (
    <section className="bg-stone-900 py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium">Why This Is Different</span>
          <h2 className="text-3xl md:text-4xl font-light text-white mt-4">The Advantage You Deserve</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-amber-500/20 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <b.icon className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-light text-white mb-3">{b.title}</h3>
              <p className="text-white/40 font-light leading-relaxed text-sm">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}