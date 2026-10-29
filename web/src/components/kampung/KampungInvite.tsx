"use client";

import { s, t } from "@/lib/i18n";
import { formatDate, formatHijri, formatTimeRange } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";
import { Reveal } from "../invitation/Section";
import { AwanLarat } from "./motifs";

/** The invitation proper, set on the cengal planks of the room the doors opened onto. */
export function KampungInvite({ w, lang }: { w: Wedding; lang: Lang }) {
  const rows = [
    { k: s("date", lang), v: formatDate(w.start, lang), sub: formatHijri(w.start) },
    { k: s("time", lang), v: formatTimeRange(w, lang) },
    { k: s("venue", lang), v: w.venue.name, sub: w.venue.address },
  ];

  return (
    <section id="jemputan" className="papan relative scroll-mt-4 px-6 pb-20 pt-16">
      <AwanLarat className="absolute inset-x-0 top-3 text-gold opacity-60" />

      <Reveal className="text-center">
        <h2 className="font-script text-[2.1rem] leading-tight text-gold-hi">{w.hosts}</h2>
        <p className="mx-auto mt-5 max-w-[22rem] font-serif text-[1.15rem] leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 text-center">
        <p className="font-script text-[1.75rem] leading-snug text-ink">{w.couple.groomFull}</p>
        <p className="my-2 font-script text-3xl text-gold">&amp;</p>
        <p className="font-script text-[1.75rem] leading-snug text-ink">{w.couple.brideFull}</p>
      </Reveal>

      {/* papan tanda: a carved board hung in the room */}
      <Reveal delay={0.15} className="mt-12">
        <div
          className="relative rounded-[6px] border-2 border-[#24120a] px-6 py-7"
          style={{
            background: "linear-gradient(180deg, #8a4a26, #6f3a1d)",
            boxShadow: "0 18px 30px -18px rgba(0,0,0,.8), inset 0 0 0 4px #b8753b, inset 0 0 0 6px #24120a",
          }}
        >
          <dl className="grid gap-5">
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3">
                <dt className="font-sans text-sm text-[#ffd9a0]">{r.k}</dt>
                <dd>
                  <span className="block font-serif text-lg leading-snug text-[#fff3df]">{r.v}</span>
                  {r.sub && <span className="block font-serif text-sm text-[#f0cfa6]">{r.sub}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 text-center">
        <p className="mx-auto max-w-[20rem] font-serif text-lg italic text-ink-soft">{t(w.closing, lang)}</p>
      </Reveal>

      <AwanLarat className="absolute inset-x-0 bottom-3 rotate-180 text-gold opacity-60" />
    </section>
  );
}