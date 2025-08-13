// lib/posts.ts
import type { PostMeta } from "../components/PostCard";

// IMPORT post components here (one line each)
import TrustCollapseSimulator, {
  meta as trustMeta,
} from "../posts/trust-collapse-simulator";

// List of posts (top = most recent)
export const posts: { meta: PostMeta; Component: () => JSX.Element }[] = [
  { meta: trustMeta, Component: TrustCollapseSimulator },
];

// Convenience exports
export const allPostMeta: PostMeta[] = posts.map((p) => p.meta);

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.meta.slug === slug) || null;
}
