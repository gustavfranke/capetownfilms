import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function SurveyModal({ 
  isOpen, 
  onClose, 
  questions = [], 
  config = {},
  onComplete,
  variantId 
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load saved progress
  useEffect(() => {
    if (isOpen && config.remember_progress) {
      const saved = localStorage.getItem(`survey_progress_${variantId}`);
      if (saved) {
        try {
          const { step: savedStep, answers: savedAnswers } = JSON.parse(saved);
          setStep(savedStep);
          setAnswers(savedAnswers);
        } catch (e) {}
      }
    }
  }, [isOpen, variantId, config.remember_progress]);

  // Save progress
  useEffect(() => {
    if (config.remember_progress && isOpen && !showConfirmation) {
      localStorage.setItem(`survey_progress_${variantId}`, JSON.stringify({ step, answers }));
    }
  }, [step, answers, variantId, config.remember_progress, isOpen, showConfirmation]);

  const currentQuestion = questions[step];
  const totalSteps = questions.length;

  // Check conditional logic
  const shouldShowQuestion = (question) => {
    if (!question?.conditional_rules?.length) return true;
    
    for (const rule of question.conditional_rules) {
      const answerValue = answers[rule.condition_field];
      const matches = answerValue === rule.condition_value;
      
      if (rule.action === "hide" && matches) return false;
      if (rule.action === "show" && !matches) return false;
    }
    return true;
  };

  const validateStep = () => {
    if (!currentQuestion) return true;
    
    const newErrors = {};
    
    if (currentQuestion.type === "contact_step") {
      if (!answers.full_name?.trim()) newErrors.full_name = "Name is required";
      if (!answers.email?.trim()) newErrors.email = "Email is required";
      if (answers.email && !answers.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = "Invalid email format";
      }
      if (!answers.whatsapp_number?.trim()) newErrors.whatsapp_number = "WhatsApp number is required";
    } else {
      if (currentQuestion.required && !answers[currentQuestion.field_key]) {
        newErrors[currentQuestion.field_key] = "This field is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    
    if (step < totalSteps - 1) {
      let nextStep = step + 1;
      // Skip hidden questions
      while (nextStep < totalSteps && !shouldShowQuestion(questions[nextStep])) {
        nextStep++;
      }
      setStep(nextStep);
    } else {
      // Complete survey
      setIsCompleting(true);
      try {
        await onComplete(answers);
        if (config.remember_progress) {
          localStorage.removeItem(`survey_progress_${variantId}`);
        }
        setShowConfirmation(true);
      } catch (error) {
        console.error("Survey submission error:", error);
      } finally {
        setIsCompleting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      let prevStep = step - 1;
      // Skip hidden questions
      while (prevStep >= 0 && !shouldShowQuestion(questions[prevStep])) {
        prevStep--;
      }
      if (prevStep >= 0) setStep(prevStep);
    }
  };

  const handleAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    setErrors({ ...errors, [key]: undefined });
  };

  const handleMultiSelect = (key, option) => {
    const current = answers[key] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    handleAnswer(key, updated);
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "text":
      case "date":
        return (
          <Input
            type={currentQuestion.type}
            value={answers[currentQuestion.field_key] || ""}
            onChange={e => handleAnswer(currentQuestion.field_key, e.target.value)}
            className="bg-white/5 border-white/10 text-white text-lg py-6 rounded-xl focus:ring-2 focus:ring-amber-500"
            placeholder={currentQuestion.helper_text}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={answers[currentQuestion.field_key] || ""}
            onChange={e => handleAnswer(currentQuestion.field_key, e.target.value)}
            className="bg-white/5 border-white/10 text-white text-lg rounded-xl min-h-[120px] focus:ring-2 focus:ring-amber-500"
            placeholder={currentQuestion.helper_text}
          />
        );

      case "single_select":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map(option => (
              <button
                key={option}
                onClick={() => handleAnswer(currentQuestion.field_key, option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion.field_key] === option
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-white/90">{option}</span>
              </button>
            ))}
          </div>
        );

      case "multi_select":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map(option => {
              const selected = (answers[currentQuestion.field_key] || []).includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleMultiSelect(currentQuestion.field_key, option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selected
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected ? "border-amber-500 bg-amber-500" : "border-white/20"
                  }`}>
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-white/90">{option}</span>
                </button>
              );
            })}
          </div>
        );

      case "contact_step":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white/70 text-sm">Full Name *</Label>
              <Input
                value={answers.full_name || ""}
                onChange={e => handleAnswer("full_name", e.target.value)}
                className="mt-2 bg-white/5 border-white/10 text-white text-lg py-6 rounded-xl"
                placeholder="Your name"
              />
              {errors.full_name && <p className="text-red-400 text-sm mt-1">{errors.full_name}</p>}
            </div>
            <div>
              <Label className="text-white/70 text-sm">Email *</Label>
              <Input
                type="email"
                value={answers.email || ""}
                onChange={e => handleAnswer("email", e.target.value)}
                className="mt-2 bg-white/5 border-white/10 text-white text-lg py-6 rounded-xl"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label className="text-white/70 text-sm">WhatsApp Number *</Label>
              <Input
                type="tel"
                value={answers.whatsapp_number || ""}
                onChange={e => handleAnswer("whatsapp_number", e.target.value)}
                className="mt-2 bg-white/5 border-white/10 text-white text-lg py-6 rounded-xl"
                placeholder="+27 123 456 789"
              />
              {errors.whatsapp_number && <p className="text-red-400 text-sm mt-1">{errors.whatsapp_number}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderConfirmation = () => {
    const destinations = config.destinations || {};
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-6"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-3xl font-light text-white mb-4">
          {destinations.confirmation_headline || "Your Vendor Vault Access Is Confirmed"}
        </h2>
        <p className="text-white/60 text-lg mb-8">
          {destinations.confirmation_text || "We will reach out within 24 to 48 hours with availability and next steps."}
        </p>
        
        {/* Conditional helper text */}
        {answers.vault_interest === "I already have my vendor team" && (
          <p className="text-amber-400/80 text-sm mb-6 italic">
            Perfect, we'll focus on capturing your day like a film.
          </p>
        )}

        <div className="space-y-3">
          {destinations.primary_button_url && (
            <Button
              onClick={() => window.open(destinations.primary_button_url, "_blank")}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg rounded-xl"
            >
              {destinations.primary_button_text || "Book Your Free Consultation"}
            </Button>
          )}
          {destinations.secondary_button_enabled && destinations.secondary_button_url && (
            <Button
              onClick={() => window.open(destinations.secondary_button_url, "_blank")}
              variant="outline"
              className="w-full border-white/20 text-white py-6 text-lg rounded-xl hover:bg-white/5"
            >
              {destinations.secondary_button_text || "Download Vendor Vault"}
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-stone-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-stone-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex-1">
                <div className="text-white/40 text-sm mb-2">Step {step + 1} of {totalSteps}</div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                    className="h-full bg-amber-500"
                  />
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl md:text-3xl font-light text-white mb-2">
                    {currentQuestion?.question}
                  </h2>
                  {currentQuestion?.helper_text && currentQuestion.type !== "text" && (
                    <p className="text-white/50 text-sm mb-6">{currentQuestion.helper_text}</p>
                  )}
                  <div className="mt-8">
                    {renderQuestion()}
                  </div>
                  {errors[currentQuestion?.field_key] && (
                    <p className="text-red-400 text-sm mt-2">{errors[currentQuestion.field_key]}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="sticky bottom-0 bg-stone-900 border-t border-white/10 p-6 flex gap-3">
              <Button
                onClick={handleBack}
                disabled={step === 0}
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white disabled:opacity-30 px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isCompleting}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg rounded-xl"
              >
                {isCompleting ? (
                  "Submitting..."
                ) : step === totalSteps - 1 ? (
                  "Complete"
                ) : (
                  <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-6 border-b border-white/10 flex justify-end">
              <button onClick={onClose} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderConfirmation()}
          </>
        )}
      </motion.div>
    </div>
  );
}