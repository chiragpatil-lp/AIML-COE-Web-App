"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types/newsletter.types";
import { formatDate } from "@/lib/newsletter/utils";

interface PostCardProps {
  post: BlogPost;
  index?: number;
}

export const PostCard = ({ post, index = 0 }: PostCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group"
    >
      <Link
        href={`/newsletter/${post.slug}`}
        className="block bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Featured Badge */}
            {post.featured && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f35959ff] text-white">
                  Featured
                </span>
              </div>
            )}

            {/* Tag */}
            <div className="absolute top-4 right-4">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#146e96]"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                {post.tag}
              </span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Title */}
          <h3
            className="text-xl font-medium text-[#202020] mb-3 line-clamp-2 group-hover:text-[#146e96] transition-colors"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontWeight: "500",
            }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className="text-sm text-[#666666] mb-4 line-clamp-3"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e5e5e5]">
            <div className="flex items-center gap-3">
              {/* Author */}
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium text-[#202020]"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  {post.author.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#666666]">
              {/* Reading Time */}
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readingTime} min</span>
                </div>
              )}

              {/* Arrow Icon */}
              <ArrowRight className="w-4 h-4 text-[#146e96] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Publish Date */}
          <div className="flex items-center gap-1 mt-3 text-xs text-[#666666]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};