"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
type CaseStudy = {
  id: string;
  company: string;
  logo: React.ReactNode;
  title: string;
  features: string[];
  quote: string;
  attribution: string;
  accentColor: string;
  image: string;
  cards: {
    type: "slack" | "meeting" | "sentiment" | "notion" | "stripe" | "figma";
    delay: number;
    zIndex: number;
  }[];
};
const caseStudies: CaseStudy[] = [
  {
    id: "notion",
    company: "Strategy & Value Realization",
    logo: (
      <svg
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#16b364" />
        <path d="M24 14L32 20V34H28V24H20V34H16V20L24 14Z" fill="white" />
      </svg>
    ),
    title:
      "Quantifiable ROI and leadership visibility into AI investments and outcomes.",
    features: ["ROI Tracking", "Leadership Dashboards", "Impact Metrics"],
    quote:
      "Clear visibility into AI investments enables data-driven decision making and demonstrates tangible business value.",
    attribution: "Strategic Pillar 1",
    accentColor: "#f2545b",
    image: "/pillars-landing/strategy-value.jpg",
    cards: [
      {
        type: "notion",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "slack",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "cloudwatch",
    company: "Innovation & IP Development",
    logo: (
      <svg
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#2c3e50" />
        <path
          d="M24 12L28 16L24 20L20 16L24 12Z M16 20L20 24L16 28L12 24L16 20Z M32 20L36 24L32 28L28 24L32 20Z M24 28L28 32L24 36L20 32L24 28Z"
          fill="white"
        />
      </svg>
    ),
    title: "Reusable accelerators, frameworks, and enterprise-ready AI assets.",
    features: ["AI Accelerators", "Frameworks", "Enterprise Assets"],
    quote:
      "Building a robust IP portfolio of AI assets accelerates innovation and reduces time-to-value across projects.",
    attribution: "Strategic Pillar 2",
    accentColor: "#2c3e50",
    image: "/pillars-landing/innovation-ip.jpg",
    cards: [
      {
        type: "stripe",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "slack",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "eightball",
    company: "Platforms & Engineering",
    logo: (
      <svg
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#f2545b" />
        <rect x="14" y="14" width="8" height="8" rx="1" fill="white" />
        <rect x="26" y="14" width="8" height="8" rx="1" fill="white" />
        <rect x="14" y="26" width="8" height="8" rx="1" fill="white" />
        <rect x="26" y="26" width="8" height="8" rx="1" fill="white" />
      </svg>
    ),
    title: "Trusted tools, templates, standards and showcases for AI at scale.",
    features: ["AI Tools", "Templates", "Standards"],
    quote:
      "Standardized platforms and engineering practices ensure quality, reliability, and scalability of AI solutions.",
    attribution: "Strategic Pillar 3",
    accentColor: "#f2545b",
    image: "/pillars-landing/platform-engieering.jpg",
    cards: [
      {
        type: "meeting",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "slack",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "coreos",
    company: "People & Capability enablement",
    logo: (
      <svg
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#2c3e50" />
        <circle cx="24" cy="18" r="5" fill="white" />
        <path
          d="M14 34C14 28 18 26 24 26C30 26 34 28 34 34"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    title:
      "AI talent development, skills enablement, and organizational maturity.",
    features: ["Skills Development", "Training", "Maturity Assessment"],
    quote:
      "Investing in people and capability development ensures long-term AI success and organizational transformation.",
    attribution: "Strategic Pillar 4",
    accentColor: "#2c3e50",
    image: "/pillars-landing/people.jpg",
    cards: [
      {
        type: "figma",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "meeting",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "notion-2",
    company: "COE Delivery Goverance",
    logo: (
      <svg
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#f2545b" />
        <path
          d="M14 24L20 30L34 16"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title:
      "Consistent, high-quality delivery and continuous improvement practices.",
    features: ["Quality Assurance", "Best Practices", "Continuous Improvement"],
    quote:
      "Operational excellence through standardized processes and continuous improvement drives consistent AI delivery.",
    attribution: "Strategic Pillar 5",
    accentColor: "#f2545b",
    image: "/pillars-landing/operational-excellence.jpg",
    cards: [
      {
        type: "notion",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "slack",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
  {
    id: "cloudwatch-2",
    company: "Communication and Market Intelligence",
    logo: (
      <svg
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#2c3e50" />
        <path
          d="M16 20C16 17 18 15 21 15H27C30 15 32 17 32 20V24C32 27 30 29 27 29H24L19 33V29C17 29 16 27 16 24V20Z"
          fill="white"
        />
      </svg>
    ),
    title:
      "Market alignment, AI trends, and amplification of COE achievements.",
    features: ["Market Insights", "AI Trends", "COE Showcase"],
    quote:
      "Strategic communication and market intelligence keep the COE aligned with industry trends and showcase our impact.",
    attribution: "Strategic Pillar 6",
    accentColor: "#2c3e50",
    image: "/pillars-landing/communication-intelligence.jpg",
    cards: [
      {
        type: "stripe",
        delay: 0,
        zIndex: 1,
      },
      {
        type: "slack",
        delay: 0.1,
        zIndex: 2,
      },
    ],
  },
];
const FeatureBadge = ({ name }: { name: string }) => {
  const getIcon = (featureName: string) => {
    if (
      featureName.includes("ROI") ||
      featureName.includes("Leadership") ||
      featureName.includes("Impact")
    ) {
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 opacity-50"
        >
          <path
            d="M3 9L5 11L8 8L13 13"
            stroke="#16b364"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 5H13M3 5V13M13 5V13M3 13H13"
            stroke="#16b364"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (
      featureName.includes("AI") ||
      featureName.includes("Framework") ||
      featureName.includes("Enterprise")
    ) {
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 opacity-50"
        >
          <path
            d="M8 3L10 5L8 7L6 5L8 3Z M4 7L6 9L4 11L2 9L4 7Z M12 7L14 9L12 11L10 9L12 7Z M8 11L10 13L8 15L6 13L8 11Z"
            fill="#3b82f6"
          />
        </svg>
      );
    } else if (
      featureName.includes("Tool") ||
      featureName.includes("Template") ||
      featureName.includes("Standard")
    ) {
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 opacity-50"
        >
          <rect x="3" y="3" width="4" height="4" rx="0.5" fill="#8B5CF6" />
          <rect x="9" y="3" width="4" height="4" rx="0.5" fill="#8B5CF6" />
          <rect x="3" y="9" width="4" height="4" rx="0.5" fill="#8B5CF6" />
          <rect x="9" y="9" width="4" height="4" rx="0.5" fill="#8B5CF6" />
        </svg>
      );
    } else if (
      featureName.includes("Skills") ||
      featureName.includes("Training") ||
      featureName.includes("Maturity")
    ) {
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 opacity-50"
        >
          <circle cx="8" cy="6" r="2.5" fill="#F59E0B" />
          <path
            d="M4 13C4 10 6 9 8 9C10 9 12 10 12 13"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    } else if (
      featureName.includes("Quality") ||
      featureName.includes("Best") ||
      featureName.includes("Continuous")
    ) {
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 opacity-50"
        >
          <path
            d="M4 8L6 10L12 4"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (
      featureName.includes("Market") ||
      featureName.includes("Trends") ||
      featureName.includes("Showcase")
    ) {
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 opacity-50"
        >
          <path
            d="M4 6C4 4.5 5 3.5 6.5 3.5H9.5C11 3.5 12 4.5 12 6V8C12 9.5 11 10.5 9.5 10.5H8L5 12.5V10.5C4 10.5 4 9.5 4 8V6Z"
            fill="#EC4899"
          />
        </svg>
      );
    }
    return null;
  };
  return (
    <div className="flex items-center gap-2 bg-white/75 shadow-sm border border-black/5 rounded-lg px-2 py-1 text-sm font-medium text-foreground">
      {getIcon(name)}
      {name}
    </div>
  );
};
export const CaseStudiesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const currentStudy = caseStudies[currentIndex];

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + caseStudies.length) % caseStudies.length,
    );
  };

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isAutoPlaying, currentIndex, startAutoPlay, stopAutoPlay]);
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };
  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center py-24 px-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1
            className="text-[40px] leading-tight font-normal text-foreground mb-6 tracking-tight"
            style={{
              fontWeight: "400",
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontSize: "40px",
            }}
          >
            The 6 Strategic Pillars of Our AI/ML COE
          </h1>
          <p
            className="text-lg leading-7 text-muted-foreground max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Our Centre of Excellence is architected around six strategic pillars
            that enable innovation, scale, quality, and measurable business
            impact across the enterprise.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStudy.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 mb-2">
                    <span
                      className="text-6xl font-bold opacity-20"
                      style={{ color: currentStudy.accentColor }}
                    >
                      {currentIndex + 1}
                    </span>
                    <div className="h-12 w-[2px] bg-foreground/10" />
                    <h3
                      className="text-2xl font-bold tracking-tight uppercase"
                      style={{ color: currentStudy.accentColor }}
                    >
                      {currentStudy.company}
                    </h3>
                  </div>
                </div>

                <h2
                  className="text-4xl font-bold text-foreground leading-tight tracking-tight"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    fontWeight: "400",
                    fontSize: "32px",
                  }}
                >
                  {currentStudy.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {currentStudy.features.map((feature, idx) => (
                    <FeatureBadge key={idx} name={feature} />
                  ))}
                </div>

                <blockquote className="border-l-4 border-primary pl-6 py-2">
                  <p
                    className="text-lg leading-7 text-foreground/80 italic mb-3"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    }}
                  >
                    &ldquo;{currentStudy.quote}&rdquo;
                  </p>
                  <footer
                    className="text-sm text-muted-foreground"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    }}
                  >
                    {currentStudy.attribution}
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {caseStudies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  aria-label="Previous slide"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.5 15L7.5 10L12.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  aria-label="Next slide"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Pillar Image */}
          <div className="relative h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStudy.id}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="relative w-[500px] h-[350px] flex items-center justify-center"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={currentStudy.image}
                    alt={currentStudy.company}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
