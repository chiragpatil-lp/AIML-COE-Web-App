"use client";

import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft, Share2 } from "lucide-react";
import type { BlogPost } from "@/lib/types/newsletter.types";
import { formatDate } from "@/lib/newsletter/utils";
import { PostCard } from "./PostCard";

interface PostContentProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

export const PostContent = ({ post, relatedPosts = [] }: PostContentProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="w-full">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-[400px] lg:h-[500px] mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#146e96] transition-colors"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Newsletter
          </Link>
        </nav>

        {/* Categories */}
        <div className="flex gap-2 mb-6">
          {post.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#146e96]/10 text-[#146e96]"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              {category}
            </span>
          ))}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-5xl font-medium text-[#202020] mb-6 leading-tight"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            fontWeight: "500",
          }}
        >
          {post.title}
        </motion.h1>

        {/* Meta Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-6 pb-8 mb-8 border-b border-[#e5e5e5]"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            {post.author.photoURL && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#146e96]/30">
                <Image
                  src={post.author.photoURL}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p
                className="text-sm font-medium text-[#202020]"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                {post.author.name}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#666666] mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.publishedAt)}
                </span>
                {post.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#666666] border border-[#e5e5e5] hover:border-[#146e96] hover:text-[#146e96] transition-colors"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-lg max-w-none mb-12 prose-headings:font-medium prose-a:text-[#146e96]"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
          }}
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </motion.article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12 pb-8 border-b border-[#e5e5e5]">
            <h3
              className="text-sm font-medium text-[#666666] mb-4"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#f0f0f0] text-[#666666] hover:bg-[#146e96] hover:text-white transition-colors cursor-pointer"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {post.author.bio && (
          <div className="mb-12 p-6 bg-[#fafafa] rounded-2xl">
            <div className="flex items-start gap-4">
              {post.author.photoURL && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#146e96]/30 flex-shrink-0">
                  <Image
                    src={post.author.photoURL}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3
                  className="text-lg font-medium text-[#202020] mb-2"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  About {post.author.name}
                </h3>
                <p
                  className="text-sm text-[#666666]"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2
              className="text-2xl font-medium text-[#202020] mb-8"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                fontWeight: "500",
              }}
            >
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};