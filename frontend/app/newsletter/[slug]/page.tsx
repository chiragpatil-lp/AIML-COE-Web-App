"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PortfolioNavbar } from "@/components/PortfolioNavbar";
import { PostContent } from "@/components/newsletter/PostContent";
import { Footer } from "@/components/Footer";
import { getPostBySlug, getRelatedPosts } from "@/lib/newsletter/mockData";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <>
        <PortfolioNavbar />
        <div className="min-h-screen flex items-center justify-center bg-white pt-24">
          <div className="text-center px-6">
            <h1
              className="text-4xl font-medium text-[#202020] mb-4"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                fontWeight: "500",
              }}
            >
              Post Not Found
            </h1>
            <p
              className="text-lg text-[#666666] mb-8"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/newsletter"
              className="inline-block px-8 py-4 bg-[#146e96] text-white font-semibold rounded-full hover:bg-[#0f5a7a] transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              Back to Newsletter
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const relatedPosts = getRelatedPosts(post.id, 3);

  return (
    <>
      <PortfolioNavbar />
      <div className="min-h-screen bg-white pt-24 pb-16">
        <PostContent post={post} relatedPosts={relatedPosts} />
      </div>
      <Footer />
    </>
  );
}
