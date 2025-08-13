// app/blog/[slug]/page.tsx
import { posts } from "@/lib/posts";
import SiteHeader from "@/components/SiteHeader";

// ✅ make sure we only return { slug: string }
export function generateStaticParams(): { slug: string }[] {
  return posts.map((p) => ({ slug: String(p.meta.slug) }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const entry = posts.find((p) => p.meta.slug === params.slug);
  if (!entry)
    return (
      <>
        <SiteHeader />
        <main className="container section">Not found.</main>
      </>
    );

  const { Component } = entry;
  return (
    <>
      <SiteHeader />
      <main className="container section">
        <Component />
      </main>
    </>
  );
}

// If you want to allow unknown slugs at runtime (not prelisted), keep this true.
// Otherwise you can omit it.
export const dynamicParams = true;
