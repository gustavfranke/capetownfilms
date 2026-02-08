import React, { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

import HeroSection from "@/components/funnel/HeroSection";
import CredibilityStrip from "@/components/funnel/CredibilityStrip";
import ProblemSection from "@/components/funnel/ProblemSection";
import SolutionSection from "@/components/funnel/SolutionSection";
import VaultRevealSection from "@/components/funnel/VaultRevealSection";
import BenefitCards from "@/components/funnel/BenefitCards";
import OfferSection from "@/components/funnel/OfferSection";
import SocialProofSection from "@/components/funnel/SocialProofSection";
import ObjectionSection from "@/components/funnel/ObjectionSection";
import ProcessTimeline from "@/components/funnel/ProcessTimeline";
import VaultPreviewGrid from "@/components/funnel/VaultPreviewGrid";
import AuthoritySection from "@/components/funnel/AuthoritySection";
import FAQSection from "@/components/funnel/FAQSection";
import FinalCTASection from "@/components/funnel/FinalCTASection";
import LeadForm from "@/components/funnel/LeadForm";
import StickyMobileCTA from "@/components/funnel/StickyMobileCTA";

function getDeviceType() {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getOrAssignVariant(variants) {
  if (!variants || variants.length === 0) return null;

  const stored = sessionStorage.getItem("funnel_variant");
  if (stored) {
    const found = variants.find(v => v.slug === stored && v.is_active);
    if (found) return found;
  }

  const active = variants.filter(v => v.is_active);
  if (active.length === 0) return variants[0];
  if (active.length === 1) return active[0];

  const total = active.reduce((s, v) => s + (v.traffic_percent || 50), 0);
  const rand = Math.random() * total;
  let cumulative = 0;
  for (const v of active) {
    cumulative += v.traffic_percent || 50;
    if (rand <= cumulative) {
      sessionStorage.setItem("funnel_variant", v.slug);
      return v;
    }
  }
  return active[0];
}

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [variant, setVariant] = useState(null);
  const trackedView = useRef(false);

  const { data: variants } = useQuery({
    queryKey: ["pageVariants"],
    queryFn: () => base44.entities.PageVariant.list(),
    initialData: [],
  });

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => base44.entities.Testimonial.list(),
    initialData: [],
  });

  const { data: faqs } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => base44.entities.FAQ.list("sort_order"),
    initialData: [],
  });

  const { data: categories } = useQuery({
    queryKey: ["vendorCategories"],
    queryFn: () => base44.entities.VendorCategory.list(),
    initialData: [],
  });

  const { data: settingsArr } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: () => base44.entities.SiteSettings.list(),
    initialData: [],
  });

  const settings = settingsArr?.[0];

  useEffect(() => {
    if (variants.length > 0 && !variant) {
      const v = getOrAssignVariant(variants);
      setVariant(v);
    }
  }, [variants, variant]);

  useEffect(() => {
    if (variant && !trackedView.current) {
      trackedView.current = true;
      base44.entities.AnalyticsEvent.create({
        event_type: "page_view",
        variant: variant.slug,
        device_type: getDeviceType(),
      }).catch(() => {});
    }
  }, [variant]);

  const trackEvent = useCallback((type) => {
    if (!variant) return;
    base44.entities.AnalyticsEvent.create({
      event_type: type,
      variant: variant.slug,
      device_type: getDeviceType(),
    }).catch(() => {});
  }, [variant]);

  const handleCtaClick = useCallback(() => {
    trackEvent("cta_click");
    setFormOpen(true);
  }, [trackEvent]);

  const handleFormSubmit = async (data) => {
    trackEvent("form_submit");
    await base44.entities.Lead.create({ ...data, status: "new" });
    setFormOpen(false);
    window.location.href = createPageUrl("ThankYou") + "?variant=" + (variant?.slug || "");
  };

  if (!variant) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-stone-950 min-h-screen">
      <HeroSection variant={variant} onCtaClick={handleCtaClick} />
      <CredibilityStrip />
      <ProblemSection variant={variant} />
      <SolutionSection variant={variant} />
      <VaultRevealSection variant={variant} onCtaClick={handleCtaClick} />
      <BenefitCards />
      <OfferSection variant={variant} />
      <SocialProofSection testimonials={testimonials} />
      <ObjectionSection />
      <ProcessTimeline variant={variant} />
      <VaultPreviewGrid categories={categories} onCtaClick={handleCtaClick} />
      <AuthoritySection variant={variant} />
      <FAQSection faqs={faqs} />
      <FinalCTASection variant={variant} onCtaClick={handleCtaClick} />
      <StickyMobileCTA variant={variant} onCtaClick={handleCtaClick} />

      <AnimatePresence>
        {formOpen && (
          <LeadForm
            isOpen={formOpen}
            variant={variant}
            settings={settings}
            onSubmit={handleFormSubmit}
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} {settings?.site_name || "Cape Town Wedding Films"}. All rights reserved.</p>
      </footer>
    </div>
  );
}