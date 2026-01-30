import React from "react";
import { EmailPreviewClient } from "@/components/newsletter/EmailPreviewClient";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";

export default async function TestEmailPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  const baseUrl = "https://aiml-coe-web-app-36231825761.us-central1.run.app";

  // Section 2: AI Delivery Wins (Customer Success Stories)
  // Logic: Only blogs from Customer Success Stories (e.g., Staples and IPG Weber)
  const deliveryWins = allPosts
    .filter((post) => post.tag === "Customer Success Story")
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      tags: [post.tag],
      link: `${baseUrl}/newsletter/${post.slug}`,
    }));

  // Section 1: Flagship Achievement

  // Logic: Hardcoded as per user request

  const flagshipAchievement = {
    title: "🚀 Interactive Demo Hub Expanded",

    excerpt:
      "Added five new conversational agents: OrderFlow AI for order processing, ThinkStack for reasoning workflows, and SQLGenie for SQL generation. All agents now support live sales demonstrations with pre-loaded datasets.",

    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",

    link: "#",

    slug: "#",
  };

  // Section 3: COE Execution Updates

  const coeUpdates = [
    {
      title: "📰 AI Newsletter System Live",

      description:
        "Phase 1 MVP is deployed with blogs available in newsletter section and in the next phase automation with ai will be integration.",

      date: "Week of Jan 13, 2026",
    },

    {
      title: "🛠️ MLOps Templates Development",

      description:
        "Building reusable Vertex AI Pipeline templates for common ML workflows. First template covers data preprocessing, model training, and deployment automation. Documentation and best practices guide in progress.",

      date: "In Progress",
    },
  ];

  // Section 4: AI Industry Signals (Updated based on Jan 2026 search)

  // Focus: LLMs, Agents, and AgentOps

  const industrySignals = [
    {
      category: "AgentOps",

      title: "AgentOps Market to Reach $7.9B",

      description:
        "The market for AI agents is projected to grow rapidly in 2026, with a major shift towards 'AgentOps'—ensuring reliability, safety, and scalability of agentic workflows.",

      source: "Global Market Estimates • Jan 28, 2026",

      link: "#",

      style: {
        bg: "#f3e8ff",

        color: "#6b21a8",
      },
    },

    {
      category: "AI Agents",

      title: "Teradata Unveils Enterprise AgentStack",

      description:
        "New toolkit accelerates building and deploying AI agents with a centralized AgentOps interface, marking a move towards production-ready enterprise agents.",

      source: "Teradata News • Jan 27, 2026",

      link: "#",

      style: {
        bg: "#f0fdf4",

        color: "#15803d",
      },
    },

    {
      category: "LLMs",

      title: "OpenAI Focuses on 'Practical Adoption'",

      description:
        "OpenAI's 2026 roadmap emphasizes practical enterprise adoption, enabling LLMs to act as semi-autonomous employees for tasks like coding and scheduling.",

      source: "AI Forum • Jan 25, 2026",

      link: "#",

      style: {
        bg: "#eff6ff",

        color: "#1e40af",
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
