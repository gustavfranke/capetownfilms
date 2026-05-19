import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X, ArrowLeft, ArrowRight, Check } from "lucide-react";

const STORAGE_KEY = "gf_quiz_progress";

export default function WeddingQuiz({ isOpen, onClose }) {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", email: "", phone: "", wedding_date: "", venue: "", message: "" });
  const [transitioning, setTransitioning] = useState(false);
  const [done, setDone] = useState(false);
  const [settings, setSettings] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadQuiz();
    loadSettings();
    restoreProgress();
  }, [isOpen]);

  const loadQuiz = async () => {
    try {
      const quizzes = await base44.entities.Quiz.filter({ status: "live" });
      if (quizzes[0]) {
        setQuiz(quizzes[0]);
        setQuestions(quizzes[0].questions || []);
      } else {
        const configs = await base44.entities.SurveyConfig.filter({ config_key: "default" });
        if (configs[0]?.questions) setQuestions(configs[0].questions);
      }
    } catch (e) {
      // no quiz
    }
  };

  const loadSettings = async () => {
    try {
      const arr = await base44.entities.SiteSettings.list();
      setSettings(arr[0] || null);
    } catch (e) {}
  };

  const restoreProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { step, answers: savedAnswers, contact: savedContact } = JSON.parse(saved);
        setCurrentStep(step || 0);
        setAnswers(savedAnswers || {});
        setContact(savedContact || { name: "", email: "", phone: "", wedding_date: "", venue: "", message: "" });
      }
    } catch (e) {}
  };

  const saveProgress = (step, ans, con) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers: ans, contact: con }));
    } catch (e) {}
  };

  const goTo = (step) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      setTransitioning(false);
    }, 200);
  };

  const handleSingleSelect = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    saveProgress(currentStep, newAnswers, contact);
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        goTo(currentStep + 1);
      } else {
        handleSubmit(newAnswers);
      }
    }, 300);
  };

  const toggleMulti = (qId, value) => {
    const current = answers[qId] || [];
    const newVal = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    const newAnswers = { ...answers, [qId]: newVal };
    setAnswers(newAnswers);
    saveProgress(currentStep, newAnswers, contact);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      goTo(currentStep + 1);
    } else {
      handleSubmit(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) goTo(currentStep - 1);
  };

  const handleSubmit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const lead = await base44.entities.Lead.create({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        wedding_date: contact.wedding_date,
        message: contact.message || contact.venue,
        status: "new",
        survey_completed: true,
        funnel_variant: "quiz"
      });
      await base44.entities.SurveyResponse.create({
        lead_id: lead.id,
        answers: { ...finalAnswers, ...contact },
        completed: true
      });
      localStorage.removeItem(STORAGE_KEY);
      setDone(true);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  const totalSteps = questions.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const currentQ = questions[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-xl mx-4 relative">
        {!done && totalSteps > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-white/30 text-xs mb-2">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: "#c9a84c" }}
              />
            </div>
          </div>
        )}

        {done ? (
          <ThankYouScreen quiz={quiz} settings={settings} onClose={onClose} />
        ) : (
          <div className={`transition-all duration-200 ${transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
            {currentQ ? (
              <QuestionStep
                question={currentQ}
                answers={answers}
                contact={contact}
                setContact={setContact}
                onSingleSelect={handleSingleSelect}
                onToggleMulti={toggleMulti}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={currentStep === 0}
                isLast={currentStep === totalSteps - 1}
                submitting={submitting}
              />
            ) : (
              <div className="text-white/40 text-center py-16">Loading quiz…</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionStep({ question, answers, contact, setContact, onSingleSelect, onToggleMulti, onNext, onBack, isFirst, isLast, submitting }) {
  const { id: qId, question: text, type, options = [], helper_text } = question;

  return (
    <div>
      <h2 className="text-white text-2xl font-light mb-2 leading-snug">{text}</h2>
      {helper_text && <p className="text-white/40 text-sm mb-6">{helper_text}</p>}

      {type === "single_select" && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSingleSelect(qId, opt.value)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                answers[qId] === opt.value
                  ? "border-yellow-500 bg-yellow-500/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
              }`}
              style={answers[qId] === opt.value ? { borderColor: "#c9a84c", backgroundColor: "rgba(201,168,76,0.1)" } : {}}
            >
              {opt.emoji && <span className="text-2xl block mb-1">{opt.emoji}</span>}
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {type === "multi_select" && (
        <>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {options.map(opt => {
              const selected = (answers[qId] || []).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => onToggleMulti(qId, opt.value)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-200 ${
                    selected ? "border-yellow-500 bg-yellow-500/10 text-white" : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                  style={selected ? { borderColor: "#c9a84c", backgroundColor: "rgba(201,168,76,0.1)" } : {}}
                >
                  {opt.emoji && <span className="text-2xl block mb-1">{opt.emoji}</span>}
                  <span className="text-sm font-medium">{opt.label}</span>
                  {selected && <Check className="w-3 h-3 absolute top-2 right-2" style={{ color: "#c9a84c" }} />}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-6">
            {!isFirst && (
              <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={onNext}
              className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-black transition-all"
              style={{ backgroundColor: "#c9a84c" }}
            >
              {isLast ? "Submit" : "Next"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {type === "contact_step" && (
        <ContactStep
          contact={contact}
          setContact={setContact}
          onBack={onBack}
          onSubmit={() => onNext()}
          isFirst={isFirst}
          submitting={submitting}
        />
      )}

      {type !== "multi_select" && type !== "contact_step" && (
        <div className="flex gap-3 mt-6">
          {!isFirst && (
            <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ContactStep({ contact, setContact, onBack, onSubmit, isFirst, submitting }) {
  const fields = [
    { key: "name", label: "Your Name", type: "text", placeholder: "Jane & John" },
    { key: "email", label: "Email Address", type: "email", placeholder: "jane@example.com" },
    { key: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+27 82 000 0000" },
    { key: "wedding_date", label: "Wedding Date", type: "date", placeholder: "" },
    { key: "venue", label: "Venue (if known)", type: "text", placeholder: "Babylonstoren, Franschhoek…" },
    { key: "message", label: "Anything else?", type: "textarea", placeholder: "Tell me a little about your day…" },
  ];

  return (
    <div className="space-y-4 mt-4">
      {fields.map(f => (
        <div key={f.key}>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              value={contact[f.key]}
              onChange={e => setContact({ ...contact, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 text-sm resize-none"
            />
          ) : (
            <input
              type={f.type}
              value={contact[f.key]}
              onChange={e => setContact({ ...contact, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 text-sm"
            />
          )}
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        {!isFirst && (
          <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={submitting || !contact.name || !contact.email}
          className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-black transition-all disabled:opacity-50"
          style={{ backgroundColor: "#c9a84c" }}
        >
          {submitting ? "Sending…" : "Send My Details"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ThankYouScreen({ quiz, settings, onClose }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(201,168,76,0.15)" }}>
        <Check className="w-8 h-8" style={{ color: "#c9a84c" }} />
      </div>
      <h2 className="text-white text-3xl font-light mb-3">
        {quiz?.completion_headline || "You're on the list."}
      </h2>
      <p className="text-white/50 text-base mb-8 max-w-sm mx-auto">
        {quiz?.completion_subtext || "I'll be in touch within 24 hours. In the meantime, feel free to book a free discovery call."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {settings?.booking_calendar_link && (
          <a
            href={settings.booking_calendar_link}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-medium text-black transition-all"
            style={{ backgroundColor: "#c9a84c" }}
          >
            Book a Free Discovery Call
          </a>
        )}
        <a
          href="#"
          className="px-6 py-3 rounded-xl text-sm font-medium text-white border border-white/20 hover:border-white/40 transition-all"
        >
          Download Venue Guide
        </a>
      </div>
    </div>
  );
}