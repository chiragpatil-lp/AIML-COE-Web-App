"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { PillarInfo } from "@/lib/types/auth.types";
import { ArrowRight } from "lucide-react";
import { getAssetUrl } from "@/lib/image-loader";

const PILLARS: PillarInfo[] = [
  {
    id: "strategy",
    number: 1,
    name: "Strategy & Value Realization",
    description: "ROI tracking, leadership dashboards, and impact metrics",
    url: process.env.NEXT_PUBLIC_PILLAR_1_URL || "#",
    accentColor: "#f2545b",
    enabled: true,
    image: getAssetUrl("/pillars-landing/strategy-value.jpg"),
  },
  {
    id: "innovation",
    number: 2,
    name: "Innovation & IP Development",
    description: "AI accelerators, frameworks, and enterprise assets",
    url: process.env.NEXT_PUBLIC_PILLAR_2_URL || "#",
    accentColor: "#2c3e50",
    enabled: true,
    image: getAssetUrl("/pillars-landing/innovation-ip.jpg"),
  },
  {
    id: "platforms",
    number: 3,
    name: "Platforms & Engineering",
    description: "Trusted tools, templates, and standards",
    url: process.env.NEXT_PUBLIC_PILLAR_3_URL || "#",
    accentColor: "#f2545b",
    enabled: true,
    image: getAssetUrl("/pillars-landing/platform-engieering.jpg"),
  },
  {
    id: "people",
    number: 4,
    name: "People & Capability Enablement",
    description: "Skills development, training, and maturity assessment",
    url: process.env.NEXT_PUBLIC_PILLAR_4_URL || "#",
    accentColor: "#2c3e50",
    enabled: true,
    image: getAssetUrl("/pillars-landing/people.jpg"),
  },
  {
    id: "governance",
    number: 5,
    name: "COE Delivery Governance",
    description: "Quality assurance and continuous improvement",
    url: process.env.NEXT_PUBLIC_PILLAR_5_URL || "#",
    accentColor: "#f2545b",
    enabled: true,
    image: getAssetUrl("/pillars-landing/operational-excellence.jpg"),
  },
  {
    id: "communication",
    number: 6,
    name: "Communication & Market Intelligence",
    description: "Market insights, AI trends, and COE showcase",
    url: process.env.NEXT_PUBLIC_PILLAR_6_URL || "#",
    accentColor: "#2c3e50",
    enabled: true,
    image: getAssetUrl("/pillars-landing/communication-intelligence.jpg"),
  },
];

export function PillarCardsSection() {
  const { user } = useAuth();
  const router = useRouter();

  const handlePillarClick = () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="w-full py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-[40px] leading-tight font-normal text-[#202020] tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontWeight: "400",
              fontSize: "40px",
            }}
          >
            Explore Our{" "}
            <span className="text-[#146e96]">Strategic Pillars</span>
          </h2>
          <p
            className="text-lg leading-6 text-[#666666] max-w-3xl mx-auto"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Discover the core areas that drive AI excellence across our
            organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, index) => {
            return (
              <motion.button
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onClick={handlePillarClick}
                className="relative overflow-hidden bg-white rounded-3xl shadow-lg text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                aria-label={`${pillar.name} - ${user ? "Go to dashboard" : "Sign in to access"}`}
                type="button"
              >
                {pillar.image && (
                  <div className="relative h-48 overflow-hidden rounded-t-3xl">
                    <Image
                      src={pillar.image}
                      alt={pillar.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: pillar.accentColor }}
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-medium text-[#202020] pr-2"
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        fontWeight: "500",
                      }}
                    >
                      {pillar.name}
                    </h3>
                    <ArrowRight
                      className="w-5 h-5 text-[#146e96] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>

                  <p
                    className="text-sm text-[#666666] mb-4"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    }}
                  >
                    {pillar.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
