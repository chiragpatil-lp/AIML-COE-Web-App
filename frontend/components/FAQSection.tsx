"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
type FAQItem = {
  question: string;
  answer: string;
};
type FAQSectionProps = {
  title?: string;
  faqs?: FAQItem[];
};
const defaultFAQs: FAQItem[] = [
  {
    question: "What is Nexus?",
    answer:
      "Nexus is a specialized team within our organization dedicated to the strategic implementation and governance of Artificial Intelligence. It serves as a central hub for sharing best practices, driving innovation, and ensuring that AI initiatives align with broader business goals while maintaining security and compliance standards.",
  },
  {
    question:
      "How does Nexus support AI adoption across different departments?",
    answer:
      "Nexus acts as a bridge between technical teams and business units. We provide standardized tools, shared infrastructure, and expert guidance to help departments—from HR to Finance—identify high-impact AI use cases, develop prototypes, and scale successful solutions responsibly across the enterprise.",
  },
  {
    question:
      "What governance and security measures does Nexus implement?",
    answer:
      "Nexus establishes robust governance frameworks that include ethical AI guidelines, data privacy protocols, and rigorous security assessments for all AI models. We ensure that every AI implementation complies with industry regulations and organizational security policies, protecting both sensitive data and brand reputation.",
  },
  {
    question: "How can I collaborate with Nexus on a new project?",
    answer:
      "Getting started is easy. You can submit a project proposal through our internal portal. Our team will then work with you to evaluate the feasibility, potential ROI, and resource requirements. Once approved, we provide the technical expertise and project management support needed to bring your AI vision to life.",
  },
];
export const FAQSection = ({
  title = "Frequently asked questions",
  faqs = defaultFAQs,
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section className="w-full py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <h2
              className="text-[40px] leading-tight font-normal text-[#202020] tracking-tight sticky top-24"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                fontWeight: "400",
                fontSize: "40px",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-[#e5e5e5] last:border-b-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="text-lg leading-7 text-[#202020] pr-8"
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        fontWeight: "400",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus
                        className="w-6 h-6 text-[#202020]"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-12">
                          <p
                            className="text-lg leading-6 text-[#666666]"
                            style={{
                              fontFamily:
                                "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
