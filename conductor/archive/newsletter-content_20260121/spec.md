# Specification: Update Newsletter Content & Categories

## 1. Overview
This feature updates the Newsletter page content to feature a specific "Customer Success Story" regarding Staples.com and limits the total visible articles to exactly two. It also introduces "Customer Success Story" as a functional filter category.

## 2. Functional Requirements
### 2.1 Content Management
- **Total Articles:** The newsletter feed must display exactly **two** articles.
- **Article 1 (New):**
    - **Title:** "Turning manual model releases into a production-ready MLOps workflow"
    - **Content:** (Based on the provided Staples.com text)
    - **Category:** "Customer Success Story"
    - **Summary:** "Staples.com supports a high-velocity ecommerce business where data science teams need to iterate quickly..." (excerpt)
- **Article 2 (Existing):**
    - Select one existing mock article (e.g., "The Future of Generative AI") to remain.
    - Remove or hide all other current mock articles.

### 2.2 Category & Filtering
- **New Category:** Add "Customer Success Story" to the `mockCategories` list.
- **Filter Behavior:**
    - Selecting "Customer Success Story" in the filter bar must show the Staples.com article.
    - Selecting "All Posts" must show both articles.

## 3. Technical Implementation
- **File:** `frontend/lib/newsletter/mockData.ts`
    - Update `mockPosts` array to contain only the two specified articles.
    - Update `mockCategories` array to include "Customer Success Story".
- **File:** `frontend/app/newsletter/page.tsx`
    - Ensure the grid layout handles 2 items gracefully (already handled by grid CSS, but verify).

## 4. Acceptance Criteria
- [ ] Navigate to `/newsletter`.
- [ ] Verify exactly two article cards are visible.
- [ ] Verify one card is the "Staples.com" story with the correct title and summary.
- [ ] Verify the "Customer Success Story" tag is visible in the Category Filter.
- [ ] Click "Customer Success Story" filter: verify only the Staples.com article is shown.
