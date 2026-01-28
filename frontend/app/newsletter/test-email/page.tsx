import React from "react";
import { EmailPreviewClient } from "@/components/newsletter/EmailPreviewClient";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";

export default function TestEmailPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://nexus.example.com";

  // Section 2: AI Delivery Wins (Customer Success Stories)
  const deliveryWins = allPosts
    .filter((post) => post.categories.includes("Customer Success Story"))
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags || ["Success Story"],
      link: `${baseUrl}/newsletter/${post.slug}`,
    }));

  // Section 1: Flagship Achievement
  const mainFeatured =
    featuredPosts.length > 0 ? featuredPosts[0] : allPosts[0];

  const flagshipAchievement = {
    title: mainFeatured?.title || "Introducing Nexus: Our AI COE Platform",
    excerpt:
      mainFeatured?.excerpt ||
      "Nexus, our new AI COE platform, is now operational in its first phase, featuring the Interactive Demo Hub, the automated newsletter system, and AI accelerators.",
    image:
      mainFeatured?.coverImage ||
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
    link: mainFeatured ? `${baseUrl}/newsletter/${mainFeatured.slug}` : "#",
    slug: mainFeatured?.slug || "#",
  };

  // Section 3: COE Execution Updates
  const coeUpdates = [
    {
      title: "🚀 Interactive Demo Hub Expanded",
      description:
        "Added five new conversational agents: OrderFlow AI for order processing, ThinkStack for reasoning workflows, and SQLGenie for SQL generation. All agents now support live sales demonstrations with pre-loaded datasets.",
      date: "Week of Jan 20, 2026",
    },
    {
      title: "📰 AI Newsletter System Live",
      description:
        "Phase 1 MVP deployed with manual content creation and SendGrid integration. Archive functionality allows browsing past editions. Phase 2 AI news aggregation module begins development next sprint.",
      date: "Week of Jan 13, 2026",
    },
    {
      title: "🛠️ MLOps Templates Development",
      description:
        "Building reusable Vertex AI Pipeline templates for common ML workflows. First template covers data preprocessing, model training, and deployment automation. Documentation and best practices guide in progress.",
      date: "In Progress",
    },
  ];

  // Section 4: AI Industry Signals
  const industrySignals = [
    {
      category: "LLMs",
      title: "OpenAI Releases GPT-5 with Multimodal Reasoning",
      description:
        "Latest model demonstrates significant improvements in complex reasoning tasks, combining text, image, and audio inputs seamlessly.",
      source: "TechCrunch • Jan 24, 2026",
      link: "#",
      style: {
        bg: "#eff6ff",
        color: "#1e40af",
      },
    },
    {
      category: "AI Agents",
      title: "Google Vertex AI Adds Native Agent Builder",
      description:
        "New low-code platform enables rapid development of AI agents with built-in tool integration and monitoring capabilities for enterprise use cases.",
      source: "Google Cloud Blog • Jan 22, 2026",
      link: "#",
      style: {
        bg: "#f0fdf4",
        color: "#15803d",
      },
    },
    {
      category: "MLOps",
      title: "Databricks Launches Unified ML Pipeline Framework",
      description:
        "New framework streamlines ML workflows from data preparation to production deployment with automated versioning and lineage tracking.",
      source: "VentureBeat • Jan 20, 2026",
      link: "#",
      style: {
        bg: "#fef3c7",
        color: "#92400e",
      },
    },
  ];

  const newsletterData = {
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    issue: "#1",
    intro:
      "Welcome to this month's AI Newsletter. This edition highlights our key COE initiatives, recent AI delivery wins, and key AI trends shaping the AI landscape.",
  };

  return (
    <EmailPreviewClient
      newsletterData={newsletterData}
      flagshipAchievement={flagshipAchievement}
      deliveryWins={deliveryWins}
      coeUpdates={coeUpdates}
      industrySignals={industrySignals}
    />
  );
}
