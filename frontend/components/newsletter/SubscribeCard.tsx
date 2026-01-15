"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { isValidEmail } from "@/lib/newsletter/utils";

export const SubscribeCard = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (actual implementation will come later)
    setTimeout(() => {
      toast.success(
        "Thanks for subscribing! Check your inbox for confirmation.",
      );
      setEmail("");
      setName("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <motion.div
      id="subscribe"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-[#146e96] to-[#0f5a7a] rounded-3xl p-8 md:p-12 shadow-2xl"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <h2
          className="text-3xl md:text-4xl font-medium text-white mb-4"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            fontWeight: "500",
          }}
        >
          Subscribe to Our Newsletter
        </h2>

        <p
          className="text-lg text-white/80 mb-8"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
          }}
        >
          Get the latest AI insights, case studies, and best practices delivered
          to your inbox every week.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            />
            <input
              type="email"
              placeholder="Your email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-4 bg-white text-[#146e96] font-semibold rounded-full hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-[#146e96] border-t-transparent rounded-full animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Subscribe Now
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>We respect your privacy. Unsubscribe anytime.</span>
        </div>
      </div>
    </motion.div>
  );
};
