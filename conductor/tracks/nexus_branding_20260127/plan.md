# Implementation Plan: Nexus Branding and Newsletter Enhancements

## Phase 1: Global Branding and Static Content Updates
This phase focuses on the rebranding to "Nexus" and updating the pillar information on the landing page.

- [x] Task: Rebrand "AI Center of Excellence" to "Nexus" [0672aae]
- [x] Task: Update Landing Page Pillars [0672aae]
- [x] Task: Conductor - User Manual Verification 'Branding and Pillars' (Protocol in workflow.md) [checkpoint: 0672aae]

## Phase 2: Newsletter Logic and Content Fixes
This phase addresses the filtering issues and content updates within the newsletter section.

- [ ] Task: Implement "Interactive demo hub" Success Story
    - [ ] Create a new blog/post file for "Interactive demo hub" with mock content and the "Customer Success Story" tag.
- [ ] Task: Fix Newsletter Filtering and Featured Posts
    - [ ] Update post metadata to make `staples-mlops-success-story` featured.
    - [ ] Debug and fix the "All Posts" filter in `NewsletterClient.tsx` or equivalent.
    - [ ] Verify "Gen AI" tag filtering logic.
- [ ] Task: Dynamic Tag Filter Sidebar
    - [ ] Modify the tag filtering logic to only display tags that have at least one associated post.
    - [ ] Verify that `AgentOps` and `Security` tags are hidden if they are empty.
- [ ] Task: Conductor - User Manual Verification 'Newsletter Logic' (Protocol in workflow.md)

## Phase 3: Email Template Automation and Test Email Page
This phase focuses on the email template enhancements and the new API for template generation.

- [ ] Task: Update Test Email Page UI and Content
    - [ ] Add the TaxMate bullet points to the "Tech Updates" section as a text/list block.
    - [ ] Remove the "Resources & Learning" section.
    - [ ] Implement the automated "Success Stories" section that pulls 3-5 latest "Customer Success Story" posts.
- [ ] Task: Create Email Template API Route
    - [ ] Create `frontend/app/api/newsletter/render-template/route.ts`.
    - [ ] Implement logic to fetch posts and render the newsletter HTML.
    - [ ] Remove social links (LinkedIn, Twitter, Website) from the rendered HTML template.
- [ ] Task: Conductor - User Manual Verification 'Email Automation' (Protocol in workflow.md)
