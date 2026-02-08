import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function StickyMobileCTA({ variant, onCtaClick }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 bg-stone-950/95 backdrop-blur-xl border-t border-white/5"
        >
          <Button
            onClick={onCtaClick}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-5 rounded-full font-medium shadow-2xl shadow-amber-900/30"
          >
            {variant?.hero_cta_text || "Request Availability"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}