import { sanityFetch } from '@/sanity/lib/live';
import {
  BLOG_POSTS_QUERY,
  BLOG_INDEX_PAGE_QUERY,
  BLOG_POST_QUERY,
  ALL_BLOG_POSTS_SLUGS_QUERY,
  ADJACENT_BLOG_POSTS_QUERY,
} from '@/sanity/lib/queries';

// Server-side function using live queries (for use in server components)
export async function getAllBlogPosts() {
  const { data: posts } = await sanityFetch({
    query: BLOG_POSTS_QUERY,
  });

  return posts;
}

// Server-side function to get blog index page data
export async function getBlogIndexPage() {
  const { data: page } = await sanityFetch({
    query: BLOG_INDEX_PAGE_QUERY,
  });

  return page;
}

// Server-side function to get a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  const { data: post } = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug },
  });

  return post;
}

// Server-side function to get all blog posts for sitemap
export async function getAllBlogPostsForSitemap() {
  const { data: posts } = await sanityFetch({
    query: ALL_BLOG_POSTS_SLUGS_QUERY,
  });

  return posts;
}

// Server-side function to get adjacent blog posts (prev/next)
export async function getAdjacentBlogPosts(slug: string) {
  const { data } = await sanityFetch({
    query: ADJACENT_BLOG_POSTS_QUERY,
    params: { slug },
  });

  return data;
}
