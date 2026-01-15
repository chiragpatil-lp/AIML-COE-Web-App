# Newsletter Feature - Implementation Guide

## Overview

This document outlines the steps needed to complete the newsletter feature implementation by integrating Firestore and SendGrid for full production functionality.

## Current Status ✅

- ✅ UI/UX completely implemented with mock data
- ✅ All components created and styled
- ✅ Routing configured (landing page + individual posts)
- ✅ Type definitions and utilities ready
- ✅ Architecture designed and documented

## Prerequisites

### 1. SendGrid Account Setup

```bash
# Sign up for SendGrid account
# Get your API key from: https://app.sendgrid.com/settings/api_keys
# Free tier: 100 emails/day
```

### 2. Environment Variables

Add to `.env.local`:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=newsletter@yourdomain.com
SENDGRID_FROM_NAME=AI/ML CoE Newsletter

# Firebase Configuration (if not already configured)
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_admin_key_here
```

## Implementation Steps

### Phase 1: Firestore Setup (2-3 hours)

#### Step 1.1: Create Firestore Collections

Create the following collections in Firebase Console:

**Collection: `blog_posts`**

```javascript
// Example document structure
{
  id: "auto-generated-id",
  slug: "getting-started-with-enterprise-ai",
  title: "Getting Started with Enterprise AI",
  excerpt: "Learn how to successfully implement AI...",
  content: "<p>Full HTML or Markdown content here...</p>",
  author: {
    name: "Sarah Johnson",
    email: "sarah.johnson@aimlcoe.com",
    photoURL: "https://...",
    bio: "AI Strategy Lead..."
  },
  coverImage: "https://storage.googleapis.com/...",
  categories: ["Success Stories", "Best Practices"],
  tags: ["Enterprise AI", "Strategy"],
  featured: true,
  publishedAt: Timestamp,
  updatedAt: Timestamp,
  readingTime: 8,
  status: "published"
}
```

**Collection: `newsletter_subscribers`**

```javascript
// Document ID = email address
{
  email: "user@example.com",
  name: "John Doe",
  subscribedAt: Timestamp,
  status: "active",
  categories: ["Success Stories", "Case Studies"],
  verifiedAt: Timestamp,
  unsubscribeToken: "uuid-v4-token"
}
```

**Collection: `categories`**

```javascript
{
  id: "ai-trends",
  name: "Success Stories",
  slug: "ai-trends",
  description: "Latest trends in AI",
  color: "#146e96",
  postCount: 12
}
```

#### Step 1.2: Firestore Security Rules

Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts - public read, admin write
    match /blog_posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;
    }

    // Subscribers - no direct read, server-side only
    match /newsletter_subscribers/{email} {
      allow read: if false; // Only via admin SDK
      allow create: if request.resource.data.email is string;
      allow update, delete: if false; // Only via admin SDK
    }

    // Categories - public read, admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;
    }
  }
}
```

#### Step 1.3: Create Firestore Utility File

**File**: `/frontend/lib/newsletter/firestore.ts`

```typescript
import { getFirestore } from "firebase-admin/firestore";
import type {
  BlogPost,
  NewsletterSubscriber,
  Category,
} from "@/lib/types/newsletter.types";

// Initialize Firestore (server-side only)
const db = getFirestore();

// Blog Posts Operations
export async function getAllPosts(
  status: "published" | "draft" = "published",
): Promise<BlogPost[]> {
  const postsRef = db.collection("blog_posts");
  const snapshot = await postsRef
    .where("status", "==", status)
    .orderBy("publishedAt", "desc")
    .get();

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }) as BlogPost,
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const postsRef = db.collection("blog_posts");
  const snapshot = await postsRef
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    publishedAt: doc.data().publishedAt.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as BlogPost;
}

export async function getPostsByCategory(
  category: string,
): Promise<BlogPost[]> {
  const postsRef = db.collection("blog_posts");
  const snapshot = await postsRef
    .where("categories", "array-contains", category)
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .get();

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }) as BlogPost,
  );
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const postsRef = db.collection("blog_posts");
  const snapshot = await postsRef
    .where("featured", "==", true)
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .limit(3)
    .get();

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }) as BlogPost,
  );
}

// Subscriber Operations
export async function addSubscriber(
  email: string,
  name?: string,
): Promise<void> {
  const subscribersRef = db.collection("newsletter_subscribers");
  const unsubscribeToken = crypto.randomUUID();

  await subscribersRef.doc(email).set({
    email,
    name: name || "",
    subscribedAt: new Date(),
    status: "active",
    categories: [],
    unsubscribeToken,
  });
}

export async function getSubscriber(
  email: string,
): Promise<NewsletterSubscriber | null> {
  const doc = await db.collection("newsletter_subscribers").doc(email).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
    subscribedAt: doc.data()?.subscribedAt.toDate(),
    verifiedAt: doc.data()?.verifiedAt?.toDate(),
  } as NewsletterSubscriber;
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const subscribersRef = db.collection("newsletter_subscribers");
  const snapshot = await subscribersRef
    .where("unsubscribeToken", "==", token)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return false;
  }

  const doc = snapshot.docs[0];
  await doc.ref.update({
    status: "unsubscribed",
  });

  return true;
}

export async function getAllActiveSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  const subscribersRef = db.collection("newsletter_subscribers");
  const snapshot = await subscribersRef.where("status", "==", "active").get();

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        subscribedAt: doc.data().subscribedAt.toDate(),
        verifiedAt: doc.data().verifiedAt?.toDate(),
      }) as NewsletterSubscriber,
  );
}

// Category Operations
export async function getAllCategories(): Promise<Category[]> {
  const categoriesRef = db.collection("categories");
  const snapshot = await categoriesRef.orderBy("name").get();

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Category,
  );
}
```

### Phase 2: SendGrid Integration (2-3 hours)

#### Step 2.1: Install SendGrid Package

```bash
pnpm add @sendgrid/mail
```

#### Step 2.2: Create SendGrid Utility File

**File**: `/frontend/lib/newsletter/sendgrid.ts`

```typescript
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL!;
const FROM_NAME = process.env.SENDGRID_FROM_NAME!;

export async function sendWelcomeEmail(
  to: string,
  name: string,
  unsubscribeToken: string,
): Promise<void> {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/unsubscribe?token=${unsubscribeToken}`;

  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: "Welcome to AI/ML CoE Newsletter",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #146e96;">Welcome to AI/ML CoE Newsletter!</h1>
        <p>Hi ${name || "there"},</p>
        <p>Thank you for subscribing to our newsletter. You'll now receive the latest AI insights, case studies, and best practices directly to your inbox.</p>
        <p>We're committed to delivering valuable content that helps you stay ahead in the AI landscape.</p>
        <p style="margin-top: 30px;">
          <a href="${unsubscribeUrl}" style="color: #666; font-size: 12px;">Unsubscribe</a>
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendNewsletterEmail(
  to: string,
  subject: string,
  content: string,
  unsubscribeToken: string,
): Promise<void> {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/unsubscribe?token=${unsubscribeToken}`;

  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${content}
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e5e5;" />
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a>
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}

export async function sendBulkNewsletter(
  subscribers: Array<{ email: string; unsubscribeToken: string }>,
  subject: string,
  content: string,
): Promise<void> {
  const messages = subscribers.map((subscriber) => ({
    to: subscriber.email,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${content}
        <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e5e5;" />
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}" style="color: #666;">Unsubscribe</a>
        </p>
      </div>
    `,
  }));

  // SendGrid allows up to 1000 emails in a single API call
  await sgMail.send(messages);
}
```

### Phase 3: API Routes Implementation (3-4 hours)

#### Step 3.1: Subscribe API Route

**File**: `/frontend/app/api/newsletter/subscribe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { addSubscriber, getSubscriber } from "@/lib/newsletter/firestore";
import { sendWelcomeEmail } from "@/lib/newsletter/sendgrid";
import { isValidEmail } from "@/lib/newsletter/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Check if already subscribed
    const existingSubscriber = await getSubscriber(email);
    if (existingSubscriber && existingSubscriber.status === "active") {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 },
      );
    }

    // Add to Firestore
    await addSubscriber(email, name);

    // Get subscriber with token
    const subscriber = await getSubscriber(email);

    // Send welcome email
    if (subscriber) {
      await sendWelcomeEmail(email, name || "", subscriber.unsubscribeToken);
    }

    return NextResponse.json(
      { message: "Successfully subscribed!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
```

#### Step 3.2: Posts API Route

**File**: `/frontend/app/api/newsletter/posts/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  getAllPosts,
  getPostsByCategory,
  getFeaturedPosts,
} from "@/lib/newsletter/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let posts;

    if (featured === "true") {
      posts = await getFeaturedPosts();
    } else if (category && category !== "all") {
      posts = await getPostsByCategory(category);
    } else {
      posts = await getAllPosts();
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
```

#### Step 3.3: Individual Post API Route

**File**: `/frontend/app/api/newsletter/posts/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/newsletter/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Fetch post error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}
```

#### Step 3.4: Unsubscribe API Route

**File**: `/frontend/app/api/newsletter/unsubscribe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/newsletter/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const success = await unsubscribeByToken(token);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 },
      );
    }

    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(
      new URL("/newsletter/unsubscribed", request.url),
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 },
    );
  }
}
```

### Phase 4: Update Frontend to Use APIs (1-2 hours)

#### Step 4.1: Update SubscribeCard Component

Replace the mock submission in `/frontend/components/newsletter/SubscribeCard.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email address");
    return;
  }

  if (!isValidEmail(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Subscription failed");
    }

    toast.success("Thanks for subscribing! Check your inbox for confirmation.");
    setEmail("");
    setName("");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to subscribe. Please try again.",
    );
  } finally {
    setIsSubmitting(false);
  }
};
```

#### Step 4.2: Update Newsletter Page to Fetch from API

Replace mock data usage in `/frontend/app/newsletter/page.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { PortfolioNavbar } from "@/components/PortfolioNavbar";
import { NewsletterHero } from "@/components/newsletter/NewsletterHero";
import { SubscribeCard } from "@/components/newsletter/SubscribeCard";
import { FeaturedPosts } from "@/components/newsletter/FeaturedPosts";
import { CategoryFilter } from "@/components/newsletter/CategoryFilter";
import { PostCard } from "@/components/newsletter/PostCard";
import { Footer } from "@/components/Footer";
import type { BlogPost, Category } from "@/lib/types/newsletter.types";

export default function NewsletterPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch posts
        const postsRes = await fetch('/api/newsletter/posts');
        const postsData = await postsRes.json();
        setPosts(postsData);

        // Fetch featured posts
        const featuredRes = await fetch('/api/newsletter/posts?featured=true');
        const featuredData = await featuredRes.json();
        setFeaturedPosts(featuredData);

        // Fetch categories (you'll need to create this API route)
        // For now, derive from posts
        const uniqueCategories = Array.from(
          new Set(postsData.flatMap((post: BlogPost) => post.categories))
        );
        // ... convert to Category objects
      } catch (error) {
        console.error('Failed to fetch newsletter data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter logic...
  const filteredPosts = selectedCategory === "All Posts"
    ? posts
    : posts.filter(post => post.categories.includes(selectedCategory));

  const regularPosts = filteredPosts.filter((post) => !post.featured);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PortfolioNavbar />
      {/* Rest of the component... */}
    </>
  );
}
```

### Phase 5: Create Admin Dashboard (4-6 hours)

#### Step 5.1: Admin Newsletter Management Page

**File**: `/frontend/app/admin/newsletter/page.tsx`

Features needed:

- Create new blog posts
- Edit existing posts
- Delete posts
- View subscriber list
- Send newsletter to all subscribers
- Upload images to Google Cloud Storage

This requires:

- Rich text editor (e.g., TipTap, Quill)
- Image upload component
- Admin authentication checks

#### Step 5.2: Create Unsubscribe Confirmation Page

**File**: `/frontend/app/newsletter/unsubscribed/page.tsx`

Simple page confirming unsubscription.

### Phase 6: Testing & Deployment (2-3 hours)

#### Test Checklist

- [ ] Subscribe with valid email
- [ ] Verify welcome email received
- [ ] Check Firestore subscriber document created
- [ ] Test duplicate subscription (should show error)
- [ ] Test invalid email format
- [ ] Click unsubscribe link in email
- [ ] Verify unsubscribe updates Firestore
- [ ] Test category filtering
- [ ] Test individual post pages
- [ ] Test on mobile devices
- [ ] Verify all images load correctly
- [ ] Test with 100+ subscribers (batch sending)

#### Production Deployment

```bash
# Build and deploy
pnpm build
# Deploy to Google Cloud Run (existing setup)
```

## Estimated Total Time

- **Phase 1**: 2-3 hours (Firestore setup)
- **Phase 2**: 2-3 hours (SendGrid integration)
- **Phase 3**: 3-4 hours (API routes)
- **Phase 4**: 1-2 hours (Frontend updates)
- **Phase 5**: 4-6 hours (Admin dashboard)
- **Phase 6**: 2-3 hours (Testing & deployment)

**Total**: 14-21 hours of development time

## Optional Enhancements (Future)

### Email Templates

Use SendGrid Dynamic Templates for better email designs:

- Create templates in SendGrid dashboard
- Use template IDs in API

### Analytics

- Track email open rates (SendGrid Events API)
- Track link clicks
- Monitor subscriber growth
- A/B testing subject lines

### Advanced Features

- RSS feed generation
- Email preferences (choose categories)
- Scheduled newsletter sends (Cloud Scheduler)
- Draft preview mode
- Multi-author support
- Comment system
- Search functionality (Algolia)

## Support & Resources

### Documentation

- [SendGrid Node.js Documentation](https://docs.sendgrid.com/for-developers/sending-email/nodejs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Troubleshooting

- Check SendGrid activity feed for email delivery issues
- Review Firestore logs in Firebase Console
- Test API routes with Postman/Insomnia
- Check browser console for client-side errors

## Notes

- Start with a small test email list before sending to all subscribers
- Monitor SendGrid quota (100 emails/day on free tier)
- Back up Firestore data regularly
- Consider email verification (double opt-in) for production
- Implement rate limiting on subscribe endpoint to prevent spam
