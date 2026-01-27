# Specification: Nexus Branding and Newsletter Enhancements

## Overview
This track involves a rebranding effort to rename the "AI Center of Excellence" to **Nexus**, along with significant enhancements and fixes to the Newsletter and Test Email sections. This includes adding a new strategic pillar, updating existing pillar names, fixing newsletter filtering logic, adding a new success story, and automating email template generation.

## Functional Requirements

### 1. Global Branding Update
- Rename all instances of "AI Center of Excellence" (or "AIML COE") to **Nexus** across the entire application (Navbar, Landing Page, Titles, Meta tags, Footers).
- In the newsletter page, change "AI/ML" to just **AI**.

### 2. Pillar Updates (Landing Page)
- **New Pillar:** Add "Internal AI Adoption & Automation" to the **Strategic Pillar** section (total pillars: 7).
  - **Description:** "Driving enterprise AI transformation with purpose-built agentic assistants".
  - **Image:** `https://storage.googleapis.com/aiml-coe-web-app/pillars-landing/ai-adoption.jpg`.
  - **Styling:** Consistent with existing cards.
- **Rename Pillar:** Change "COE Delivery Governance" to **Engagement & Continuous Improvement**.

### 3. Newsletter Improvements & Fixes
- **Featured Content:** Set the `staples-mlops-success-story` as a featured post.
- **Filtering Logic Fixes:**
  - Fix "All Posts" filter to correctly render all articles (currently only showing Staples).
  - Fix "Gen AI" tag filter to render relevant articles.
- **Dynamic Tag Sidebar:**
  - Implement logic to only display tags that have at least one associated article.
  - Specifically ensure `AgentOps` and `Security` are removed if no articles exist for them.

### 4. New Success Story
- **Title:** Interactive demo hub.
- **Tag:** `Customer Success Story`.
- **Content:** Mock content describing functionality and impact.

### 5. Test Email & Newsletter Automation
- **TaxMate Update:** Add a "Tech Updates" block for **TaxMate** (AI Tax Assistant) with specific bullet points regarding investment proofs and Darwinbox requirements.
- **Section Cleanup:**
  - Remove "Resources & Learning" section.
  - Remove LinkedIn, Twitter, and Website links from the email footer.
- **Automated Success Stories Section:** Add a section below "Success Stories" that automatically lists the latest 3-5 articles tagged with `Customer Success Story` (Title + Link).
- **Template Automation (API):** Create a dynamic API route (`/api/newsletter/render-template`) that renders the full newsletter HTML template using the current blog/newsletter data.

## Non-Functional Requirements
- **Mobile Responsiveness:** Ensure the new pillar and updated newsletter layouts work perfectly on mobile.
- **SEO:** Ensure meta tags reflect the "Nexus" branding.
- **Consistency:** Rebranding must be applied consistently to avoid "COE" vs "Nexus" confusion.

## Acceptance Criteria
1. "Nexus" is the only name used for the center across the app.
2. 7 pillars are visible on the landing page with correct names and images.
3. Newsletter filters (All Posts, Gen AI) work as expected.
4. Newsletter tag sidebar only shows tags with articles.
5. Test email displays the TaxMate section and automated success story links.
6. Footer social links are removed from the email template.
7. `/api/newsletter/render-template` returns a valid HTML email structure populated with latest data.
