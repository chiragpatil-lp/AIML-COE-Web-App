import { PortfolioNavbar } from "@/components/PortfolioNavbar";
import { Footer } from "@/components/Footer";
import { getAllPosts } from "@/lib/newsletter/content";
import { CATEGORIES } from "@/lib/newsletter/constants";
import { NewsletterClient } from "@/components/newsletter/NewsletterClient";

export default function NewsletterPage() {
  const posts = getAllPosts();
  // We can calculate dynamic counts for categories if we want,
  // but for now we'll pass the static categories.
  // Ideally, we should compute post counts per category here.

  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    postCount: posts.filter((p) => p.categories.includes(cat.name)).length,
  }));

  return (
    <>
      <PortfolioNavbar />
      <NewsletterClient
        initialPosts={posts}
        categories={categoriesWithCounts}
      />
      <Footer />
    </>
  );
}
