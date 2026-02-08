import React, { useEffect, useState } from "react";

export default function SurveyTrigger({ 
  triggers = {}, 
  onTrigger, 
  isOpen,
  ctaTriggerActive = false 
}) {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (hasTriggered || isOpen) return;

    // CTA trigger is handled externally via ctaTriggerActive prop
    if (ctaTriggerActive && triggers.cta_enabled) {
      onTrigger();
      setHasTriggered(true);
      return;
    }

    // Scroll trigger
    if (triggers.scroll_enabled) {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= (triggers.scroll_percent || 50)) {
          onTrigger();
          setHasTriggered(true);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Time delay trigger
    if (triggers.time_enabled) {
      const timer = setTimeout(() => {
        onTrigger();
        setHasTriggered(true);
      }, (triggers.time_seconds || 30) * 1000);
      return () => clearTimeout(timer);
    }

    // Exit intent trigger (desktop only)
    if (triggers.exit_intent_enabled && window.innerWidth >= 768) {
      const handleMouseLeave = (e) => {
        if (e.clientY <= 0) {
          onTrigger();
          setHasTriggered(true);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [triggers, onTrigger, hasTriggered, isOpen, ctaTriggerActive]);

  return null;
}