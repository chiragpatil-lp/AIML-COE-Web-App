import React from "react";
import { EmailPreviewClient } from "@/components/newsletter/EmailPreviewClient";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";
import { CATEGORIES } from "@/lib/newsletter/constants";

export default function TestEmailPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexus.example.com";

  const successStories = allPosts
    .filter((post) => post.categories.includes("Customer Success Story"))
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      title: post.title,
      description: post.excerpt,
      impact: "Customer Success",
      image:
        post.coverImage ||
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
      link: `${baseUrl}/newsletter/${post.slug}`,
    }));

  const mainFeatured = featuredPosts[0] || allPosts[0];

  const featuredArticle = {
    title: mainFeatured?.title || "Latest AI Innovations",
    excerpt: mainFeatured?.excerpt || "Discover the latest updates from Nexus.",
    image:
      mainFeatured?.coverImage ||
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
    link: mainFeatured ? `${baseUrl}/newsletter/${mainFeatured.slug}` : "#",
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
      description:
        "We've successfully rebranded and updated our strategic pillars to better serve enterprise AI needs.",
      icon: "🚀",
    },
  ];

  // Logic to find other categories with posts (excluding Success Stories which is already handled)
  const otherCategories = CATEGORIES.filter(
    (category) => category.name !== "Customer Success Story",
  )
    .map((category) => {
      const posts = allPosts
        .filter((post) => post.categories.includes(category.name))
        .filter((post) => post.id !== mainFeatured?.id) // Exclude featured post to avoid duplicates
        .slice(0, 3);
      return {
        categoryName: category.name,
        posts: posts.map((post) => ({
          id: post.id,
          title: post.title,
          type: "Article",
          link: `${baseUrl}/newsletter/${post.slug}`,
        })),
      };
    })
    .filter((category) => category.posts.length > 0);

  const newsletterData = {
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    issue: "#43",
    intro:
      "Welcome to this month's edition of the Nexus Newsletter. Discover the latest AI innovations, insights, and success stories from our team and the broader AI community.",
  };

  return (
    <EmailPreviewClient
      newsletterData={newsletterData}
      featuredArticle={featuredArticle}
      successStories={successStories}
      techUpdates={techUpdates}
      otherCategories={otherCategories}
    />
  );
}