import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Instagram, MessageCircle, Clock, Star } from "lucide-react";

const DEFAULT_FIELDS = [
  { name: "name", label: "Your Names", type: "text", required: true, placeholder: "Jane & John" },
  { name: "email", label: "Email Address", type: "email", required: true, placeholder: "hello@example.com" },
  { name: "phone", label: "WhatsApp Number", type: "tel", required: false, placeholder: "+27 82 000 0000" },
  { name: "wedding_date", label: "Wedding Date", type: "date", required: false, placeholder: "" },
  { name: "venue", label: "Venue", type: "text", required: false, placeholder: "e.g. Boschendal, Tintswalo Atlantic" },
  { name: "message", label: "Tell me about your wedding", type: "textarea", required: false, placeholder: "The vibe, the venue, what matters most to you…" },
];

const TRUST_REVIEWS = [
  { name: "Philip & Yolandi" },
  { name: "Nozzi & Chris" },
  { name: "Lizzie & Austin" },
];

export default function BookMe() {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: settingsArr = [] } = useQuery({
    queryKey: ["siteSettings-book"],
    queryFn: () => base44.entities.SiteSettings.list(),
    initialData: [],
  });

  const settings = settingsArr[0];
  const fields = settings?.form_fields?.length > 0 ? settings.form_fields : DEFAULT_FIELDS;
  const contactEmail = settings?.contact_email || "hello@gustavfranke.com";

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Lead.create({
      name: formData.name || formData.names || "",
      email: formData.email || "",
      phone: formData.phone || "",
      wedding_date: formData.wedding_date || "",
      venue: formData.venue || "",
      message: formData.message || "",
      status: "new",
      funnel_variant: "direct-contact",
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="pt-36 pb-12 px-6 text-center max-w-2xl mx-auto">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</p>
        <h1
          className="text-4xl md:text-6xl font-light text-white mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Let's Make Your Film
        </h1>
        <p className="text-white/50 text-base font-light">
          I film a limited number of weddings each year. If your date is open, I'd love to hear from you.
        </p>
      </section>

      {/* Main 2-col layout */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Form — 3 cols */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="text-center py-20">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(201,168,76,0.12)" }}
                >
                  <Star className="w-7 h-7" style={{ color: "#c9a84c" }} />
                </div>
                <h2
                  className="text-3xl font-light mb-4"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  You're on my radar!
                </h2>
                <p className="text-white/50 text-base">
                  I've received your details and will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
                      {field.label}
                      {field.required && <span style={{ color: "#c9a84c" }}> *</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ""}
                        rows={4}
                        required={field.required}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm resize-none transition-colors focus:outline-none"
                        style={{ "--focus-border": "#c9a84c" }}
                        onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                        onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      >
                        <option value="">Select…</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none transition-colors"
                        onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                  style={{ backgroundColor: "#c9a84c" }}
                >
                  {submitting ? "Sending…" : "Send My Details"}
                </button>

                <p className="text-white/25 text-xs text-center pt-1">
                  Your details stay private. No spam, ever.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar — 2 cols */}
          <div className="md:col-span-2 space-y-8">
            {/* Reply time */}
            <div className="flex items-start gap-3 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#c9a84c" }} />
              <div>
                <p className="text-white text-sm font-medium mb-1">Quick Response</p>
                <p className="text-white/40 text-sm">I typically respond within 24 hours</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <p className="text-white/30 text-xs uppercase tracking-widest">Contact</p>
              <a
                href={`mailto:${contactEmail}`}
                className="block text-white/70 hover:text-white text-sm transition-colors"
              >
                {contactEmail}
              </a>
              <a
                href="https://www.instagram.com/gustavfrankecine"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <Instagram className="w-4 h-4" />
                @gustavfrankecine
              </a>
              {settings?.booking_calendar_link && (
                <a
                  href={settings.booking_calendar_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm transition-all px-4 py-2.5 rounded-lg border border-white/20 hover:border-[#c9a84c] hover:text-[#c9a84c] text-white/70"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
            </div>

            {/* Trust block */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/50 text-sm leading-relaxed font-light">
                I film a limited number of weddings — usually 1 to 2 per month. This keeps the work personal and the quality high. If your date is still available, let's talk.
              </p>
            </div>

            {/* Mini testimonials */}
            <div className="space-y-2">
              {TRUST_REVIEWS.map((r) => (
                <div key={r.name} className="flex items-center gap-2 text-sm text-white/50">
                  <span>{r.name}</span>
                  <span style={{ color: "#c9a84c" }}>★★★★★</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}