import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

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
import EditableSection from "@/components/funnel/EditableSection";
import SectionEditModal from "@/components/funnel/SectionEditModal";
import SurveyModal from "@/components/survey/SurveyModal";
import SurveyTrigger from "@/components/survey/SurveyTrigger";

export default function FunnelVariantB() {
  const [formOpen, setFormOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [ctaTriggerActive, setCtaTriggerActive] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, section: null });

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

  const { data: surveyQuestionsConfig } = useQuery({
    queryKey: ["survey-config-questions"],
    queryFn: async () => {
      const configs = await base44.entities.SurveyConfig.filter({ config_key: "questions" });
      return configs[0] || null;
    },
  });

  const { data: surveyTriggersConfig } = useQuery({
    queryKey: ["survey-config-triggers"],
    queryFn: async () => {
      const configs = await base44.entities.SurveyConfig.filter({ config_key: "triggers" });
      return configs[0] || null;
    },
  });

  const { data: surveyDestinationsConfig } = useQuery({
    queryKey: ["survey-config-destinations"],
    queryFn: async () => {
      const configs = await base44.entities.SurveyConfig.filter({ config_key: "destinations" });
      return configs[0] || null;
    },
  });

  const { data: surveyRulesConfig } = useQuery({
    queryKey: ["survey-config-rules"],
    queryFn: async () => {
      const configs = await base44.entities.SurveyConfig.filter({ config_key: "rules" });
      return configs[0] || null;
    },
  });

  const variant = variants.find(v => v.slug === "variant-b") || variants[1];
  const settings = settingsArr?.[0];

  const trackEvent = useCallback((type) => {
    if (!variant) return;
    base44.entities.AnalyticsEvent.create({
      event_type: type,
      variant: "variant-b",
      device_type: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop",
    }).catch(() => {});
  }, [variant]);

  const handleCtaClick = useCallback(() => {
    trackEvent("cta_click");
    setCtaTriggerActive(true);
  }, [trackEvent]);

  const handleFormSubmit = async (data) => {
    trackEvent("form_submit");
    await base44.entities.Lead.create({ ...data, status: "new" });
    setFormOpen(false);
    window.location.href = "/ThankYou?variant=variant-b";
  };

  const applyRules = (answers) => {
    const rules = surveyRulesConfig?.rules || [];
    const tags = [];
    
    rules.forEach(rule => {
      const allConditionsMet = rule.conditions.every(cond => {
        const answerValue = answers[cond.field];
        if (cond.operator === "equals") {
          return answerValue === cond.value;
        }
        if (cond.operator === "contains") {
          return Array.isArray(answerValue) && answerValue.includes(cond.value);
        }
        return false;
      });
      
      if (allConditionsMet) {
        rule.actions.forEach(action => {
          if (action.type === "add_tag") tags.push(action.value);
        });
      }
    });
    
    return tags;
  };

  const handleSurveyComplete = async (answers) => {
    trackEvent("survey_completed");
    
    const tags = applyRules(answers);
    
    const lead = await base44.entities.Lead.create({
      name: answers.full_name,
      email: answers.email,
      phone: answers.whatsapp_number,
      wedding_date: answers.wedding_date,
      guest_count: answers.guest_count,
      funnel_variant: "variant-b",
      status: "new",
      tags,
      survey_completed: true
    });
    
    await base44.entities.SurveyResponse.create({
      lead_id: lead.id,
      page_variant_id: variant?.id,
      answers,
      tags,
      completed: true
    });
  };

  useEffect(() => {
    trackEvent("page_view");
  }, []);

  if (!variant) return <div className="min-h-screen bg-stone-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="bg-stone-950 min-h-screen">
      <EditableSection sectionId="hero" onEdit={() => setEditModal({ open: true, section: "hero" })}>
        <HeroSection variant={variant} onCtaClick={handleCtaClick} />
      </EditableSection>
      
      <CredibilityStrip />
      
      <EditableSection sectionId="problem" onEdit={() => setEditModal({ open: true, section: "problem" })}>
        <ProblemSection variant={variant} />
      </EditableSection>
      
      <EditableSection sectionId="solution" onEdit={() => setEditModal({ open: true, section: "solution" })}>
        <SolutionSection variant={variant} />
      </EditableSection>
      
      <EditableSection sectionId="vault" onEdit={() => setEditModal({ open: true, section: "vault" })}>
        <VaultRevealSection variant={variant} onCtaClick={handleCtaClick} />
      </EditableSection>
      
      <BenefitCards />
      
      <EditableSection sectionId="offer" onEdit={() => setEditModal({ open: true, section: "offer" })}>
        <OfferSection variant={variant} />
      </EditableSection>
      
      <SocialProofSection testimonials={testimonials} />
      <ObjectionSection />
      <ProcessTimeline variant={variant} />
      <VaultPreviewGrid categories={categories} onCtaClick={handleCtaClick} />
      
      <EditableSection sectionId="authority" onEdit={() => setEditModal({ open: true, section: "authority" })}>
        <AuthoritySection variant={variant} />
      </EditableSection>
      
      <FAQSection faqs={faqs} />
      
      <EditableSection sectionId="final_cta" onEdit={() => setEditModal({ open: true, section: "final_cta" })}>
        <FinalCTASection variant={variant} onCtaClick={handleCtaClick} />
      </EditableSection>
      
      <StickyMobileCTA variant={variant} onCtaClick={handleCtaClick} />

      <SurveyTrigger
        triggers={surveyTriggersConfig?.triggers || {}}
        onTrigger={() => setSurveyOpen(true)}
        isOpen={surveyOpen}
        ctaTriggerActive={ctaTriggerActive}
      />

      <AnimatePresence>
        {surveyOpen && (
          <SurveyModal
            isOpen={surveyOpen}
            onClose={() => {
              setSurveyOpen(false);
              setCtaTriggerActive(false);
            }}
            questions={surveyQuestionsConfig?.questions || []}
            config={{
              destinations: surveyDestinationsConfig?.destinations || {},
              remember_progress: true
            }}
            onComplete={handleSurveyComplete}
            variantId={variant?.id}
          />
        )}
      </AnimatePresence>

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

      <SectionEditModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, section: null })}
        variant={variant}
        sectionType={editModal.section}
      />

      <footer className="bg-stone-950 border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} {settings?.site_name || "Cape Town Wedding Films"}. All rights reserved.</p>
      </footer>
    </div>
  );
}