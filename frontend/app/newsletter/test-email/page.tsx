import React from "react";
import { EmailPreviewClient } from "@/components/newsletter/EmailPreviewClient";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";

export default function TestEmailPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  
  const successStories = allPosts
    .filter((post) => post.categories.includes("Customer Success Story"))
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      title: post.title,
      description: post.excerpt,
      impact: "Customer Success",
      image: post.coverImage,
      link: `/newsletter/${post.slug}`,
    }));

  const mainFeatured = featuredPosts[0] || allPosts[0];
  
  const featuredArticle = {
    title: mainFeatured?.title || "Latest AI Innovations",
    excerpt: mainFeatured?.excerpt || "Discover the latest updates from Nexus.",
    image: mainFeatured?.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
    link: mainFeatured ? `/newsletter/${mainFeatured.slug}` : "#",
    readTime: `${mainFeatured?.readingTime || 5} min read`,
  };

  const techUpdates = [
    {
      title: "Meet TaxMate: Your AI Tax Assistant",
      description: `With the January 17th deadline for Investment Proof submission approaching, we've developed TaxMate to simplify your queries:
• Clarify valid proofs for Investment Declarations (80C, 80D, etc.)
• Answer queries on specific claims (NPS, HRA, etc.)
• Guide you on Darwinbox upload requirements

Try the AI Assistant here: TaxMate`,
      icon: "🤖",
    },
    {
      title: "Nexus Core Platform Update",
      description: "We've successfully rebranded and updated our strategic pillars to better serve enterprise AI needs.",
      icon: "🚀",
    },
  ];

  const newsletterData = {
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    issue: "#43",
    intro: "Welcome to this month's edition of the Nexus Newsletter. Discover the latest AI innovations, insights, and success stories from our team and the broader AI community.",
  };

  return (
    <EmailPreviewClient
      newsletterData={newsletterData}
      featuredArticle={featuredArticle}
      successStories={successStories}
      techUpdates={techUpdates}
    />
  );
}