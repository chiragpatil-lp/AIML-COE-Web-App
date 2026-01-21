import { BlogPost, Category } from "@/lib/types/newsletter.types";

export const mockCategories: Category[] = [
  { id: "6", name: "Customer Success Story", slug: "customer-success-story", postCount: 1 },
  { id: "1", name: "AI/ML", slug: "ai-ml", postCount: 1 },
  { id: "2", name: "Cloud Computing", slug: "cloud-computing", postCount: 1 },
  { id: "3", name: "DevOps", slug: "devops", postCount: 0 },
  { id: "4", name: "Data Science", slug: "data-science", postCount: 0 },
  { id: "5", name: "Security", slug: "security", postCount: 0 },
];

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    slug: "future-of-ai-in-enterprise",
    title: "The Future of AI in Enterprise: Trends to Watch in 2024",
    excerpt:
      "Explore how Artificial Intelligence is reshaping the enterprise landscape, from predictive analytics to autonomous systems, and what leaders need to prepare for.",
    content: `
      Artificial Intelligence is rapidly transforming the enterprise landscape. In 2024, we are seeing a shift from experimental pilots to full-scale production deployments.
      
      Key Trends:
      1. **Generative AI Integration:** Companies are moving beyond simple chatbots to integrating LLMs into core business workflows.
      2. **Autonomous Agents:** AI agents that can plan and execute complex tasks are becoming more prevalent.
      3. **Governance and Ethics:** As AI adoption grows, so does the need for robust governance frameworks to ensure ethical and safe use.
      
      Leaders need to prepare by investing in infrastructure, talent, and data quality. The future belongs to those who can effectively harness the power of AI to drive innovation and efficiency.
    `,
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
    content: `
      Staples.com supports a high-velocity ecommerce business where data science teams need to iterate quickly, but production systems must stay stable. The team faced a familiar set of scaling pains: ad hoc feature engineering that led to duplication and inconsistencies, DEV/PROD separation that wasn’t programmatically enforced, and manual deployments with limited review and no consistent CI/CD standards.

      At the same time, the organization saw a gap between agility and reliability. BigQuery ML enabled fast experimentation, while more robust orchestration (such as Vertex Pipelines) required additional development effort, leaving the team looking for a scalable middle ground to productionize mature models.

      ### Implementing end-to-end MLOps: CI/CD, evaluation gates, deployment, and monitoring
      To close these gaps, an end-to-end MLOps workflow was implemented and demonstrated for Staples.com—from source control to production rollout. The workflow established automated CI/CD, introduced model evaluation gates to prevent regressions, and standardized deployment patterns so releases could move from “manual and tribal” to repeatable and reviewable.

      In parallel, the data science team received actionable guidance to strengthen observability across the model lifecycle. That included consistent logging patterns, monitoring dashboards for model performance, and practical approaches to detecting drift and regressions earlier—reducing troubleshooting time and improving day-to-day release confidence.

      ### Reducing risk while enabling faster iteration
      A key challenge was environment management: DEV vs PROD separation existed in practice, but it wasn’t enforced in a way that prevented accidental production changes. The improved workflow made environment boundaries more explicit and operationally safer, so experimentation could continue without putting production stability at risk.

      Another friction point was external data ingestion. With limited engineering bandwidth, ingestion workflows often fell to the data science team, creating overhead and long-term maintenance burden; the recommended operating model clarified ownership boundaries and introduced repeatable patterns that reduced ongoing toil.

      Gemini and Vertex AI-style managed capabilities were also explored as future accelerators for real-time and on-demand predictions. Because enterprise architecture constraints can shape what’s feasible, the approach emphasized clear decision points and governance requirements so the team can adopt managed tooling without surprises.

      ### Building confidence with stronger CI/CD and observability
      With formalized CI/CD, a reviewable release process, and monitoring that surfaces issues proactively, Staples.com can ship models more reliably and spend less time reacting to production incidents. The new workflow also helps the team scale model operations across more use cases by reusing patterns rather than reinventing deployment, evaluation, and logging each time.

      “Once you can trust the pipeline, you can move faster without breaking things,” noted Spokesperson Last Name. “The biggest shift wasn’t just automation—it was consistency across how we build, ship, and monitor models.”

      ### What’s next
      Next, Staples.com plans to continue maturing feature engineering reuse, further standardize ingestion and ownership boundaries, and expand real-time prediction options where business workflows demand low-latency decisions. With CI/CD and observability foundations in place, the team is positioned to scale model deployment patterns across more domains while maintaining production stability.

      *Staples.com is a retail and ecommerce company focused on workplace and home essentials, operating at scale across digital channels.*
      
      **Industry:** Retail and Ecommerce
      **Location:** United States
      **Products:** BigQuery / BigQuery ML, Vertex AI, Vertex Pipelines, CI/CD automation, Model monitoring and observability
    `,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
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
