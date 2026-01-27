"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Star } from "lucide-react";
import type { BlogPost } from "@/lib/types/newsletter.types";
import { formatDate } from "@/lib/newsletter/utils";

interface FeaturedPostsProps {
  posts: BlogPost[];
}

export const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-6 h-6 text-[#f35959ff] fill-[#f35959ff]" />
          <h2
            className="text-3xl font-medium text-[#202020]"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontWeight: "500",
            }}
          >
            Featured Articles
          </h2>
        </div>
        <p
          className="text-lg text-[#666666]"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
          }}
        >
          Hand-picked highlights from our latest content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {posts.slice(0, 2).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="group"
          >
            <Link
              href={`/newsletter/${post.slug}`}
              className="block bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#f35959ff] text-white shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                      Featured
                    </span>
                  </div>

                  {/* Categories */}
                  <div className="absolute bottom-6 left-6 flex gap-2 flex-wrap">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-[#146e96]"
                        style={{
                          fontFamily:
                            "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Title */}
                <h3
                  className="text-2xl font-medium text-[#202020] mb-4 line-clamp-2 group-hover:text-[#146e96] transition-colors"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    fontWeight: "500",
                  }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p
                  className="text-base text-[#666666] mb-6 line-clamp-3"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Author & Meta */}
                <div className="flex items-center justify-between pt-6 border-t border-[#e5e5e5]">
                  <div className="flex items-center gap-3">
                    {post.author.photoURL && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#146e96]/30">
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

                  <div className="text-[#146e96] group-hover:translate-x-2 transition-transform duration-300">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
