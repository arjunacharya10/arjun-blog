// app/page.tsx
"use client";

import Link from "next/link";
import PostCard, { PostMeta } from "../components/PostCard";
import SiteHeader from "../components/SiteHeader";
import { allPostMeta } from "../lib/posts";
import Image from "next/image";

const meta: PostMeta = {
  slug: "/", // <-- string literal
  title: "",
  excerpt:
    "I found myself alone in the metro, the cacophony of the crowd fading into a distant metronome as the train rattled through its tunnels. I was perfectly awake, every sense busy feeding its two cents to the control unit — my mind — which, in turn, was digesting it all into white noise. In that exact moment, everything felt fake. People, the metro, the tracks, hunger, popsicles, cotton candy, tears — all of it, a fable unfolding on a stone hurled at a ripe mango hanging from a tree. That was the moment my search began.",
  date: "2025-08-14",
  cover: "/images/spider.jpeg",
} as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        {/* Hero title */}
        <section className="py-8 sm:py-10">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center gap-4">
              <h1 className="font-black tracking-tight text-6xl sm:text-8xl leading-[1.1]">
                SEEKING
              </h1>
              <h2 className="text-md sm:text-xl text-neutral-600">
                Thoughts
                <br /> about
                <br /> thoughts.
                <br />
              </h2>
            </div>
          </div>

          <div className="mt-10">
            <article>
              {meta.cover ? (
                <div>
                  <Link href={`/blog/${meta.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.cover}
                      alt=""
                      className="w-l aspect-[2.31/1] object-cover rounded-t-xl"
                    />
                  </Link>
                  <span className="text-xs text-neutral-600 text-center">
                    The tiny Darwin's bark spider can shoot its web a distance
                    of 82 feet (25 meters). (Image credit: BBC/YouTube)
                  </span>
                </div>
              ) : null}
              <div className="p-4 sm:p-5">
                <p className="p mt-2">{meta.excerpt}</p>
              </div>
            </article>
          </div>
        </section>

        {/* Articles list */}
        <section className="section">
          <h2 className="h2 mb-4">Latest</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allPostMeta.map((meta) => (
              <PostCard key={meta.slug} meta={meta} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
