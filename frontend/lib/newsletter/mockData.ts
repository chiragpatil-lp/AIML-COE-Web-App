import { BlogPost, Category } from "@/lib/types/newsletter.types";

export const mockCategories: Category[] = [
  { id: "1", name: "AI/ML", slug: "ai-ml", postCount: 1 },
  { id: "2", name: "Cloud Computing", slug: "cloud-computing", postCount: 1 },
  { id: "3", name: "DevOps", slug: "devops", postCount: 0 },
  { id: "4", name: "Data Science", slug: "data-science", postCount: 0 },
  { id: "5", name: "Security", slug: "security", postCount: 0 },
  { id: "6", name: "Customer Success Story", slug: "customer-success-story", postCount: 1 },
];

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    slug: "future-of-ai-in-enterprise",
    title: "The Future of AI in Enterprise: Trends to Watch in 2024",
    excerpt:
      "Explore how Artificial Intelligence is reshaping the enterprise landscape, from predictive analytics to autonomous systems, and what leaders need to prepare for.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000",
    categories: ["AI/ML", "Cloud Computing"],
    author: {
      name: "Dr. Sarah Chen",
      photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      role: "AI Research Lead",
    },
    publishedAt: "2024-03-15",
    readingTime: 8,
    featured: true,
  },
  {
    id: "2",
    slug: "staples-mlops-success-story",
    title: "Turning manual model releases into a production-ready MLOps workflow",
    excerpt:
      "Staples.com supports a high-velocity ecommerce business where data science teams need to iterate quickly, but production systems must stay stable. The team faced a familiar set of scaling pains...",
    coverImage: "https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80&w=2000",
    categories: ["Customer Success Story", "AI/ML"],
    author: {
      name: "Staples Engineering",
      photoURL: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
      role: "Engineering Team",
    },
    publishedAt: "2026-01-21",
    readingTime: 10,
    featured: false,
  },
];

export function getFeaturedPosts(): BlogPost[] {
  return mockPosts.filter((post) => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "all" || category === "All Posts") {
    return mockPosts;
  }
  return mockPosts.filter((post) => post.categories.includes(category));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentPostId: string, limit: number = 3): BlogPost[] {
  return mockPosts
    .filter((post) => post.id !== currentPostId)
    .slice(0, limit);
}
