// components/PostCard.tsx
import Link from "next/link";

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // '2025-07-09'
  readingMinutes?: number;
  tags?: string[];
  cover?: string; // optional image url
};

export default function PostCard({ meta }: { meta: PostMeta }) {
  return (
    <article className="card hover:shadow-md transition-shadow">
      {meta.cover ? (
        <Link href={`/blog/${meta.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.cover}
            alt=""
            className="w-full aspect-[16/9] object-cover rounded-t-xl"
          />
        </Link>
      ) : null}
      <div className="p-4 sm:p-5">
        <div className="text-xs text-muted">
          {new Date(meta.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {meta.readingMinutes ? ` · ${meta.readingMinutes} min read` : ""}
        </div>
        <Link href={`/blog/${meta.slug}`} className="block mt-1">
          <h3 className="text-[18px] sm:text-[20px] font-semibold leading-snug">
            {meta.title}
          </h3>
        </Link>
        <p className="p mt-2">{meta.excerpt}</p>
        {meta.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full border border-border text-[#444]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
