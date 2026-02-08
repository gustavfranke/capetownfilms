import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditableSection({ sectionId, children, onEdit }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsLoggedIn).catch(() => setIsLoggedIn(false));
  }, []);

  if (!isLoggedIn) return <>{children}</>;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none"
          >
            <div className="absolute inset-0 border-2 border-amber-500/50 rounded-lg" />
            <button
              onClick={onEdit}
              className="absolute top-4 right-4 pointer-events-auto bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-2xl transition-all duration-200 hover:scale-110"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}