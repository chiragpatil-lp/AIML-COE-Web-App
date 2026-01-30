export interface Author {
  name: string;
  photoURL?: string;
  role?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tag: string; // Changed from categories[]/tags[] to single tag
  author: Author;
  publishedAt: string;
  readingTime?: number;
  featured?: boolean;
  newsletterSection?: "flagship" | "delivery-wins" | "industry-signals";
}
