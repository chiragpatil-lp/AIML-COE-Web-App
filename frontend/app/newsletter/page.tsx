import { PortfolioNavbar } from "@/components/PortfolioNavbar";
import { Footer } from "@/components/Footer";
import { getAllPosts } from "@/lib/newsletter/content";
import { NewsletterClient } from "@/components/newsletter/NewsletterClient";
import { Category } from "@/lib/types/newsletter.types";

export default function NewsletterPage() {
  const posts = getAllPosts();

  // Dynamically infer tags from posts
  const tagCounts: { [key: string]: number } = {};
  posts.forEach((post) => {
    if (post.tag) {
      tagCounts[post.tag] = (tagCounts[post.tag] || 0) + 1;
    }
  });

  const categories: Category[] = Object.keys(tagCounts).map((tag, index) => ({
    id: `tag-${index}`,
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, "-"),
    postCount: tagCounts[tag],
  }));

  return (
    <>
      <PortfolioNavbar />
      <NewsletterClient initialPosts={posts} categories={categories} />
      <Footer />
    </>
  );
}
