import React from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VaultPreviewGrid({ categories = [], onCtaClick }) {
  return (
    <section className="bg-stone-950 py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium">Vendor Vault</span>
          <h2 className="text-3xl md:text-4xl font-light text-white mt-4">Preview the Vault</h2>
          <p className="text-white/40 mt-4 font-light">Submit your enquiry to unlock full access</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center hover:border-amber-500/20 transition-all duration-500 cursor-pointer"
              onClick={onCtaClick}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <Lock className="w-5 h-5 text-white/20 mx-auto mb-3 group-hover:text-amber-400/50 transition-colors" />
                <h3 className="text-white/80 text-sm font-medium">{cat.name}</h3>
                <p className="text-white/30 text-xs mt-1">{cat.vendor_count} vendors</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={onCtaClick}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-5 rounded-full transition-all duration-300 hover:scale-105"
          >
            Unlock Full Vault <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}