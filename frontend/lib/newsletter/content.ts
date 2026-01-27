import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/lib/types/newsletter.types";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    id: realSlug,
    slug: realSlug,
    title: data.title,
    excerpt: data.excerpt,
    content: content,
    coverImage: data.coverImage,
    categories: data.categories || [],
    tags: data.tags || [],
    author: {
      name: data.author?.name || "Unknown",
      photoURL: data.author?.photoURL || "/placeholder-avatar.png",
      role: data.author?.role || "Contributor",
      bio: data.author?.bio,
    },
    publishedAt: data.publishedAt || new Date().toISOString(),
    readingTime: data.readingTime || 5,
    featured: data.featured || false,
  } as BlogPost;
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== undefined)
    // Sort posts by date in descending order
    .sort((post1, post2) => (post1.publishedAt > post2.publishedAt ? -1 : 1));
  return posts;
}

export function getFeaturedPosts(): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  if (category === "all" || category === "All Posts") {
    return posts;
  }
  return posts.filter((post) => post.categories.includes(category));
}

export function getRelatedPosts(
  currentPostId: string,
  limit: number = 3,
): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.id !== currentPostId).slice(0, limit);
}
