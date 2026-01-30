# Newsletter Content Management Guide

This guide outlines everything you need to know to manage the AI Center of Excellence (COE) Newsletter. It covers adding new blog posts, configuring where they appear in the newsletter, and how to update the email template itself.

## 1. Adding a New Blog Post

All newsletter content is derived from the blog posts located in `frontend/content/posts/`.

### Step-by-Step

1.  **Create a Markdown File:**
    Navigate to `frontend/content/posts/` and create a new file ending in `.md` (e.g., `my-new-feature.md`).

2.  **Add Frontmatter:**
    At the top of the file, add the YAML frontmatter. This metadata controls how the post is displayed on the website and in the newsletter.

    ```yaml
    ---
    title: "The Rise of Specialized AI Agents"
    excerpt: "Specialized agents are taking over enterprise workflows."
    coverImage: "https://images.unsplash.com/..."
    tag: "AI Trends"
    author:
      name: "Nexus Team"
      role: "AI Research"
    publishedAt: "2026-01-30"
    readingTime: 6
    featured: false
    newsletterSection: "industry-signals" 
    ---
    ```

3.  **Write Content:**
    Write your blog post content in standard Markdown format below the frontmatter.

## 2. Configuring Newsletter Sections

The `newsletterSection` field in the frontmatter determines where your post appears in the generated newsletter email.

### Available Sections

| Value | Section Name | Description |
| :--- | :--- | :--- |
| `flagship` | 🎯 Flagship Achievement | The main featured story at the top of the email. <br> **Fallback:** If no post has this tag, the *latest* blog post is used automatically. |
| `delivery-wins` | ✅ AI Delivery Wins | Reserved for customer success stories and key delivery milestones. <br> **Note:** Only posts with this specific tag will appear in this section. |
| `industry-signals` | 🌍 AI Industry Signals | Appends the post to the "Industry Signals" section, appearing alongside hardcoded industry news items. |

### Exclusion
If you **omit** the `newsletterSection` field, the post will be **excluded** from the newsletter email (unless it happens to be the latest post and is picked up by the Flagship fallback). It will still appear on the website's blog list.

## 3. Previewing the Newsletter

Before sending, you can preview exactly how the email will look with your new content.

1.  **Run the Development Server:**
    ```bash
    cd frontend
    pnpm dev
    ```

2.  **Open the Preview Page:**
    Visit [http://localhost:3000/newsletter/email](http://localhost:3000/newsletter/email).

    This page renders the email template using the live data from your markdown files.

## 4. Updating the Email Template structure

The email template logic is duplicated in two places to ensure the web preview matches the actual email HTML. If you change the structure (e.g., add a new section, change colors), you must update **BOTH** files:

1.  **Web Preview Page:**
    *   **File:** `frontend/app/newsletter/email/page.tsx`
    *   **Purpose:** Renders the interactive preview in your browser.

2.  **Email Generator API:**
    *   **File:** `frontend/app/api/newsletter/render-template/route.ts`
    *   **Purpose:** Generates the raw HTML string that is sent to the email provider (SendGrid).

### Hardcoded Content (Manual Updates)
Some sections are **not** automated from blog posts and require manual code updates. These include:

1.  **📋 COE Execution Updates:** This entire section is hardcoded.
2.  **🌍 AI Industry Signals (News Snippets):** The external news links are hardcoded (though blog posts tagged `industry-signals` are automatically appended to this list).

To update these sections, you must edit the `coeUpdates` and `hardcodedSignals` arrays in **BOTH** of the following files:
*   `frontend/app/newsletter/email/page.tsx`
*   `frontend/app/api/newsletter/render-template/route.ts`

## 5. Deployment

Once you have committed your new markdown files and pushed to the main branch:

1.  The changes are automatically deployed.
2.  The `/newsletter/email` endpoint will reflect the new content immediately.
3.  You can then trigger the newsletter send (via the future Admin Dashboard or API).
