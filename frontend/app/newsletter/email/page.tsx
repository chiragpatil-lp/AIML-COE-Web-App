import React from "react";
import { EmailPreviewClient } from "@/components/newsletter/EmailPreviewClient";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";

export default async function TestEmailPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  const baseUrl = "https://aiml-coe-web-app-36231825761.us-central1.run.app";

  // Section 2: AI Delivery Wins (Customer Success Stories)
  // Logic: Post with newsletterSection === 'delivery-wins'
  const deliveryWins = allPosts
    .filter((post) => post.newsletterSection === "delivery-wins")
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      tags: [post.tag],
      link: `${baseUrl}/newsletter/${post.slug}`,
    }));

  // Section 1: Flagship Achievement
  // Logic: Post with newsletterSection === 'flagship'
  const mainFeatured =
    allPosts.find((post) => post.newsletterSection === "flagship") ||
    allPosts[0];

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
      title: "🚀 Agentic Demo Platform Expanded",
      description:
        "Transformed the Interactive Demo Hub into a state-of-the-art Agentic Platform, featuring a sophisticated constellation of autonomous agents. This upgrade demonstrates the potential of next-generation cognitive architectures to drive enterprise value.",
      date: "Week of Jan 20, 2026",
    },
    {
      title: "📰 Nexus Newsletter System Live",
      description:
        "Successfully operationalized the Nexus Newsletter Engine, an automated content ecosystem. This platform synthesizes internal engineering wins and global market signals into a unified intelligence briefing.",
      date: "Week of Jan 30, 2026",
    },
  ];

  // Section 4: AI Industry Signals (Updated based on Jan 2026 search)
  // Focus: LLMs, Agents, and AgentOps
  const hardcodedSignals = [
    {
      category: "Google Cloud",
      title: "Agentic Vision with Gemini 3 Flash",
      description:
        "Google introduces Gemini 3 Flash, designed for high-frequency agentic workflows with enhanced vision capabilities, enabling developers to build faster, more responsive multimodal agents.",
      source: "Google Blog • Jan 29, 2026",
      link: "https://blog.google/innovation-and-ai/technology/developers-tools/agentic-vision-gemini-3-flash/",
      style: {
        bg: "#e0f2f1", // Teal-ish for Google
        color: "#00695c",
      },
    },
    {
      category: "AI Startups",
      title: "Viral 'Moltbot' AI Assistant Automates Your Digital Life",
      description:
        "TechCrunch breaks down the rise of Moltbot (formerly Clawdbot), the personal AI agent that autonomously manages emails, scheduling, and apps, now rebranding as it scales.",
      source: "TechCrunch • Jan 27, 2026",
      link: "https://techcrunch.com/2026/01/27/everything-you-need-to-know-about-viral-personal-ai-assistant-clawdbot-now-moltbot/",
      style: {
        bg: "#eff6ff", // Blueish
        color: "#1e40af",
      },
    },
  ];

  const blogSignals = allPosts
    .filter((post) => post.newsletterSection === "industry-signals")
    .map((post) => ({
      category: post.tag || "Blog Update",
      title: post.title,
      description: post.excerpt,
      source: "Nexus Blog • " + new Date(post.publishedAt).toLocaleDateString(),
      link: `${baseUrl}/newsletter/${post.slug}`,
      style: {
        bg: "#eff6ff",
        color: "#1e40af",
      },
    }));

  const industrySignals = [...hardcodedSignals, ...blogSignals];

  const newsletterData = {
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    issue: "#1",
    intro:
      "Welcome to this month's Nexus (AI CoE) Newsletter. This edition highlights our key Nexus (AI CoE) initiatives, recent AI delivery wins, and key AI trends shaping the AI landscape.",
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
