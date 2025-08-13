// posts/trust-collapse-simulator.tsx
import LoopVideo from "../components/LoopVideo";
import type { PostMeta } from "../components/PostCard";

export const meta: PostMeta = {
  slug: "trust-collapse-simulator", // <-- string literal
  title:
    "Collapse of societies - will trust survive an anti-trust society from an evolutionary lens.",
  excerpt: "A minimal model where distrust spreads faster than trust...",
  date: "2025-08-14",
  readingMinutes: 7,
  tags: [],
  cover: "",
} as const;

import Simulation from "../components/Simulation";

export default function Post() {
  return (
    <main className="container">
      {/* Hero / Rules — Medium-like single column */}
      <section className="section">
        <article className="rounded-none sm:rounded-xl px-5 sm:px-8 py-8 sm:py-12">
          {/* Title */}
          <header className="max-w-3xl mx-auto">
            <h1 className="font-serif text-[38px] sm:text-[46px] leading-[1.1] tracking-[-0.014em] mb-5">
              {meta.title}
            </h1>

            {/* Author strip */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-[#222]">
                      Arjun Acharya
                    </span>
                  </div>
                  <div className="text-[12px] text-[#6b6b6b] mt-[2px]">
                    7 min read ·{" "}
                    {new Date().toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Social icons */}
              <nav className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/arjunacharya10/"
                  aria-label="LinkedIn"
                  className="p-2 rounded-full hover:bg-[#f5f5f5]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#6b6b6b]"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.7-1.2 2.5-2.5 5.1-2.5 5.5 0 6.5 3.6 6.5 8.2V24h-5v-7.1c0-1.7 0-3.9-2.4-3.9-2.4 0-2.7 1.9-2.7 3.8V24h-5V8z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/arjunacharya10"
                  aria-label="GitHub"
                  className="p-2 rounded-full hover:bg-[#f5f5f5]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#6b6b6b]"
                  >
                    <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.86 3.16 8.98 7.55 10.44.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.07.67-3.72-1.3-3.72-1.3-.5-1.27-1.22-1.6-1.22-1.6-.99-.67.08-.66.08-.66 1.09.08 1.66 1.12 1.66 1.12.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.46-2.45-.28-5.02-1.22-5.02-5.42 0-1.2.43-2.19 1.13-2.96-.11-.28-.49-1.4.11-2.92 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.56 0c2.12-1.43 3.05-1.13 3.05-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.76 1.13 2.96 0 4.21-2.58 5.14-5.04 5.41.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .3.2.64.76.53A11.05 11.05 0 0 0 23 11.52C23 5.24 18.27.5 12 .5z" />
                  </svg>
                </a>
                <a
                  href="https://linktr.ee/arjunacharya10"
                  aria-label="Website"
                  className="p-2 rounded-full hover:bg-[#f5f5f5]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#6b6b6b]"
                  >
                    <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm6.93 6H16.5a15.8 15.8 0 0 0-1.58-3.62A8.02 8.02 0 0 1 18.93 8zM12 4c.9 0 2.4 1.9 3.2 4H8.8C9.6 5.9 11.1 4 12 4zM6.65 4.38A15.8 15.8 0 0 0 5.5 8H3.07a8.02 8.02 0 0 1 3.58-3.62zM4 12c0-.68.04-1.34.12-2h3.76a24.1 24.1 0 0 0 0 4H4.12C4.04 13.34 4 12.68 4 12zm.07 4H5.5c.3 1.29.78 2.5 1.58 3.62A8.02 8.02 0 0 1 4.07 16zM12 20c-.9 0-2.4-1.9-3.2-4h6.4c-.8 2.1-2.3 4-3.2 4zM18.5 16h1.43A8.02 8.02 0 0 1 18.43 19.62 15.8 15.8 0 0 0 18.5 16zm1.38-4H16.5a24.1 24.1 0 0 1 0-4h3.38c.08.66.12 1.32.12 2s-.04 1.34-.12 2zM15.2 14H8.8a15.8 15.8 0 0 1 0-4h6.4a15.8 15.8 0 0 1 0 4zM7.5 16H5.5c.07 1.07.3 2.08.65 3.02A8.02 8.02 0 0 0 7.5 16zM7.5 8H5.5c.22-.94.52-1.86.95-2.72.27.86.62 1.8 1.05 2.72z" />
                  </svg>
                </a>
              </nav>
            </div>
          </header>

          {/* Body copy */}
          <div className="max-w-3xl mx-auto mt-8 sm:mt-10 prose prose-neutral prose-p:leading-8 prose-headings:font-serif prose-h2:tracking-[-0.01em] prose-h2:mt-8 prose-h2:mb-3">
            <LoopVideo src="/videos/simulation.mp4" />
            <p>
              I’m modeling how distrust spreads faster than trust. Simple rules.
              Clear asymmetry. One bad move can outweigh a lot of good. Elites
              amplify both. We run this on two grids and watch what emerges.
            </p>

            <section className="max-w-3xl mx-auto mt-10 prose prose-neutral prose-p:leading-7">
              <h2>
                Rules of the world and how individuals interract with each
                other.
              </h2>
              <p>
                In our simulation, every person has a{" "}
                <strong>trust score</strong>. Good actions raise it, bad actions
                lower it. Trust can never go higher than +10, but it can fall as
                far as it wants into the negatives.
              </p>

              <h3>Who’s in the world?</h3>
              <ul>
                <li>
                  <strong>The Powerful</strong> – the ones with the most
                  influence.
                </li>
                <li>
                  <strong>The Common</strong> – everyday people who make up much
                  of the middle.
                </li>
                <li>
                  <strong>The Poor</strong> – the most vulnerable group.
                </li>
              </ul>

              <h3>Players & ratios</h3>
              <p>
                <b>Powerful</b> (10%), <b>Common</b> (30%), <b>Poor</b> (60%).
                Ratios stay steady—we’re focused on trust flow, not class
                mobility.
              </p>

              <h3>How they affect each other</h3>
              <p>
                People interact with their 8 closest neighbours. Each
                interaction either builds trust or damages it, but not equally –
                bad actions usually have a stronger impact than good ones.
              </p>
              <ul>
                <li>
                  The Powerful’s actions ripple out the most – they can lift
                  trust a lot or damage it badly.
                </li>
                <li>
                  Common folk influence each other and the poor more than they
                  influence the Powerful.
                </li>
                <li>
                  The Poor have the weakest reach, but they still shift trust in
                  small ways.
                </li>
              </ul>

              <h3>The two worlds</h3>
              <p>
                We start with two halves:
                <strong>Good World</strong>, where everyone begins with maximum
                trust (+10), and
                <strong> Mixed World</strong>, where trust levels are randomly
                spread between good and bad.
              </p>

              <h3>Migration</h3>
              <p>
                If someone in the Mixed World behaves badly four times in a row,
                they “migrate” to the Good World – but not as a good person.
                They replace a random good person there, bringing distrust into
                the good side and leaving their old spot empty.
              </p>

              <h3>Why it matters</h3>
              <p>
                Over time, we can watch how distrust spreads like an infection,
                and how a few bad actors can slowly unravel even the most
                trusting societies.
              </p>
            </section>

            <h2>What you’ll see</h2>
            <p>
              Two worlds side‑by‑side: <b>Good</b> (everyone starts at{" "}
              <b>+10</b>) and <b>Mixed</b> (good + evil). Each cell listens to
              its 8 neighbors and adjusts. Colors:{" "}
              <span className="text-green-700 font-medium">green</span> = high
              trust, <span className="text-yellow-700 font-medium">yellow</span>{" "}
              = neutral edge,{" "}
              <span className="text-red-600 font-medium">red</span> = entrenched
              distrust. Histograms below track how the population shifts over
              time.
            </p>

            <h2>Trust & moves</h2>
            <ul>
              <li>
                <b>Trust score:</b> (−∞, +10]. We cap the top; there’s no floor
                on negative.
              </li>
              <li>
                <b>Move rule:</b> if <code>T &lt; 0</code> → always evil. If{" "}
                <code>T ≥ 0</code> → good with probability <code>T/10</code>,
                else evil.
              </li>
              <li>
                <b>Neighborhood:</b> 8 neighbors (Moore). Your update is the
                average impact of their moves on you.
              </li>
              <li>
                <b>Self‑drift (Powerful only):</b> +0.1 if they act good, −0.1
                if they act evil.
              </li>
            </ul>

            <h2>Scoring (impact) — actor → target per interaction</h2>
            <p>
              Normalized deltas. Bad hits harder than good helps. We apply these
              neighbor‑wise, then average.
            </p>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-[16px] leading-[1.8] text-[#3b3b3b] border border-[#e6e6e6]">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th className="text-left p-3 border-b border-[#e6e6e6] font-normal">
                      Actor
                    </th>
                    <th className="text-left p-3 border-b border-[#e6e6e6] font-normal">
                      Target
                    </th>
                    <th className="text-left p-3 border-b border-[#e6e6e6] font-normal">
                      Good Δ
                    </th>
                    <th className="text-left p-3 border-b border-[#e6e6e6] font-normal">
                      Evil Δ
                    </th>
                    <th className="text-left p-3 border-b border-[#e6e6e6] font-normal">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-[#efefef]">Powerful</td>
                    <td className="p-3 border-b border-[#efefef]">Anyone</td>
                    <td className="p-3 border-b border-[#efefef]">+0.5</td>
                    <td className="p-3 border-b border-[#efefef]">−1.0</td>
                    <td className="p-3 border-b border-[#efefef]">
                      Megaphone effect
                    </td>
                  </tr>
                  <tr className="bg-[#fcfcfc]">
                    <td className="p-3 border-b border-[#efefef]">Common</td>
                    <td className="p-3 border-b border-[#efefef]">Powerful</td>
                    <td className="p-3 border-b border-[#efefef]">+0.1</td>
                    <td className="p-3 border-b border-[#efefef]">−0.1</td>
                    <td className="p-3 border-b border-[#efefef]">
                      Upward impact is small
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-[#efefef]">Common</td>
                    <td className="p-3 border-b border-[#efefef]">Common</td>
                    <td className="p-3 border-b border-[#efefef]">+0.1</td>
                    <td className="p-3 border-b border-[#efefef]">−0.5</td>
                    <td className="p-3 border-b border-[#efefef]">
                      In‑group betrayal hurts
                    </td>
                  </tr>
                  <tr className="bg-[#fcfcfc]">
                    <td className="p-3 border-b border-[#efefef]">Common</td>
                    <td className="p-3 border-b border-[#efefef]">Poor</td>
                    <td className="p-3 border-b border-[#efefef]">+0.2</td>
                    <td className="p-3 border-b border-[#efefef]">−0.5</td>
                    <td className="p-3 border-b border-[#efefef]">
                      Downward harm is heavier
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-[#efefef]">Poor</td>
                    <td className="p-3 border-b border-[#efefef]">Powerful</td>
                    <td className="p-3 border-b border-[#efefef]">+0.1</td>
                    <td className="p-3 border-b border-[#efefef]">−0.1</td>
                    <td className="p-3 border-b border-[#efefef]">
                      Barely registers upward
                    </td>
                  </tr>
                  <tr className="bg-[#fcfcfc]">
                    <td className="p-3 border-b border-[#efefef]">Poor</td>
                    <td className="p-3 border-b border-[#efefef]">Common</td>
                    <td className="p-3 border-b border-[#efefef]">+0.1</td>
                    <td className="p-3 border-b border-[#efefef]">−0.2</td>
                    <td className="p-3 border-b border-[#efefef]">Moderate</td>
                  </tr>
                  <tr>
                    <td className="p-3">Poor</td>
                    <td className="p-3">Poor</td>
                    <td className="p-3">+0.1</td>
                    <td className="p-3">−0.3</td>
                    <td className="p-3">Local harm spreads fastest</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Worlds & migration</h2>
            <ul>
              <li>
                <b>Good world:</b> everyone starts at <b>T = 10</b>.
              </li>
              <li>
                <b>Mixed world:</b> random in [−10, +10] at start; voids can
                appear.
              </li>
              <li>
                <b>Migration (one‑way):</b> in Mixed, 4 evil moves in a row
                overwrites a random Good cell; the Mixed slot becomes a void.
              </li>
              <li>
                <b>Randomization:</b> optional shuffle of positions each tick.
              </li>
            </ul>

            <h2>Reading the heatmap</h2>
            <p>
              Green → good, yellow → starting to distrust, red → entrenched
              distrust.
            </p>
          </div>
        </article>
      </section>

      {/* Simulation */}
      <section className="section">
        <Simulation />
      </section>
    </main>
  );
}
