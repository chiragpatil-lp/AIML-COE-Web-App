"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export const NewsletterHero = () => {
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTypingComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSubscribe = () => {
    const subscribeSection = document.getElementById("subscribe");
    if (subscribeSection) {
      subscribeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-8 py-24 pt-32">
        <div className="text-center">
          <div
            className="relative h-6 inline-flex items-center font-mono uppercase text-xs text-[#167E6C] mb-8"
            style={{
              fontFamily:
                "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
            }}
          >
            <div className="flex items-center gap-0.5 overflow-hidden">
              <motion.span
                initial={{
                  width: 0,
                }}
                animate={{
                  width: "auto",
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="block whitespace-nowrap overflow-hidden text-[#167E6C] relative z-10"
                style={{
                  color: "#146e96",
                }}
              >
                Stay Informed
              </motion.span>
              <motion.span
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: typingComplete ? [1, 0, 1, 0] : 0,
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="block w-1.5 h-3 bg-[#167E6C] ml-0.5 relative z-10 rounded-sm"
                style={{
                  color: "#146e96",
                }}
              />
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[56px] font-normal leading-tight tracking-tight text-[#111A4A] mb-6"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontSize: "56px",
              fontWeight: "500",
            }}
          >
            AI/ML CoE{" "}
            <span className="text-[#146e96]">Newsletter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg leading-7 text-[#111A4A] opacity-60 mt-0 mb-8 max-w-3xl mx-auto"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Stay updated with the latest in AI innovation, industry insights,
            best practices, and real-world case studies from our Center of
            Excellence.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={scrollToSubscribe}
            className="relative inline-flex justify-center items-center leading-4 text-center cursor-pointer whitespace-nowrap outline-none font-medium h-10 text-white bg-[#146e96] shadow-lg transition-all duration-200 ease-in-out rounded-full px-6 text-sm group hover:bg-[#0f5a7a] hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              Subscribe Now
              <ArrowDown className="w-4 h-4 transition-transform duration-150 group-hover:translate-y-1" />
            </span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div
                className="text-3xl font-medium text-[#146e96] mb-2"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Weekly
              </div>
              <p className="text-sm text-[#666666]">Expert insights delivered to your inbox</p>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-medium text-[#146e96] mb-2"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Curated
              </div>
              <p className="text-sm text-[#666666]">Hand-picked content from AI experts</p>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-medium text-[#146e96] mb-2"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Actionable
              </div>
              <p className="text-sm text-[#666666]">Practical insights you can implement</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
