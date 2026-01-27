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
  content: string; // Made content required as it is in mockData.ts
  coverImage?: string;
  categories: string[];
  tags?: string[];
  author: Author;
  publishedAt: string;
  readingTime?: number;
  featured?: boolean;
}
