"use client";

import { useState } from "react";
import { NewsletterHero } from "@/components/newsletter/NewsletterHero";
import { FeaturedPosts } from "@/components/newsletter/FeaturedPosts";
import { CategoryFilter } from "@/components/newsletter/CategoryFilter";
import { PostCard } from "@/components/newsletter/PostCard";
import { BlogPost, Category } from "@/lib/types/newsletter.types";

interface NewsletterClientProps {
  initialPosts: BlogPost[];
  categories: Category[];
}

const POSTS_PER_PAGE = 6;

export function NewsletterClient({
  initialPosts,
  categories,
}: NewsletterClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const getFeaturedPosts = () => initialPosts.filter((post) => post.featured);

  const getPostsByTag = (tag: string) => {
    if (tag === "all" || tag === "All Posts") {
      return initialPosts;
    }
    return initialPosts.filter((post) => post.tag === tag);
  };

  const featuredPosts = getFeaturedPosts();
  const filteredPosts = getPostsByTag(selectedCategory);

  // Keep all posts in the grid, including featured ones, so they show up in tag filters
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <>
      {/* Hero Section */}
      <NewsletterHero />

      <div className="w-full bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <FeaturedPosts posts={featuredPosts} />
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-8">
            <h2
              className="text-3xl font-medium text-[#202020] mb-6"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                fontWeight: "500",
              }}
            >
              All Articles
            </h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
                setVisibleCount(POSTS_PER_PAGE); // Reset pagination on category change
              }}
            />
          </div>

          {/* Posts Grid */}
          {visiblePosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p
                className="text-lg text-[#666666]"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                No articles found for this tag.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMorePosts && (
            <div className="mt-12 text-center">
              <button
                className="px-8 py-4 bg-white text-[#146e96] border-2 border-[#146e96] font-semibold rounded-full hover:bg-[#146e96] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
                onClick={handleLoadMore}
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}