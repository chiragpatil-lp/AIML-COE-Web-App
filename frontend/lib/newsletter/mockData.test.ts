import { describe, it, expect } from 'vitest';
import { mockPosts, mockCategories, getPostsByCategory, getPostBySlug, getRelatedPosts } from './mockData';

describe('Newsletter Mock Data', () => {
  it('should have exactly 2 posts', () => {
    expect(mockPosts.length).toBe(2);
  });

  it('should have the Staples.com story', () => {
    const staplesPost = mockPosts.find(p => p.title.includes('Turning manual model releases'));
    expect(staplesPost).toBeDefined();
    if (staplesPost) {
        expect(staplesPost.categories).toContain('Customer Success Story');
    }
  });

  it('should include "Customer Success Story" category', () => {
    const category = mockCategories.find(c => c.name === 'Customer Success Story');
    expect(category).toBeDefined();
  });

  it('should filter by "Customer Success Story"', () => {
    const posts = getPostsByCategory('Customer Success Story');
    expect(posts.length).toBe(1);
    expect(posts[0].title).toContain('Turning manual model releases');
  });

  it('should get post by slug', () => {
      const staplesPost = mockPosts.find(p => p.title.includes('Turning manual model releases'));
      if(staplesPost) {
        const post = getPostBySlug(staplesPost.slug);
        expect(post).toBeDefined();
        expect(post?.id).toBe(staplesPost.id);
      }
  });

  it('should return undefined for non-existent slug', () => {
      const post = getPostBySlug('non-existent-slug');
      expect(post).toBeUndefined();
  });

  it('should get related posts', () => {
      const staplesPost = mockPosts.find(p => p.title.includes('Turning manual model releases'));
      if(staplesPost) {
        const related = getRelatedPosts(staplesPost.id, 2);
        expect(related.length).toBeGreaterThan(0);
        expect(related.find(p => p.id === staplesPost.id)).toBeUndefined();
      }
  });
});
