"use client";

import type { CSSProperties, ReactNode } from "react";
import { s, t } from "@/lib/i18n";
import { formatDate, formatHijri, formatTimeRange } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";
import { Reveal } from "../invitation/Section";

/**
 * The invitation's words in the order every design tells them: hosts, the
 * invitation, the couple, the when and where, the closing. Designs supply the
 * section ground, the board the details sit on, and what goes between the names.
 */
export function InviteBody({
  w,
  lang,
  className = "",
  style,
  board,
  boardClass = "",
  boardStyle,
  joiner = "&",
  top,
  bottom,
  dtClass = "text-ink-soft",
  ddClass = "text-ink",
  ddSubClass = "text-ink-soft",
}: {
  w: Wedding;
  lang: Lang;
  className?: string;
  style?: CSSProperties;
  board?: ReactNode;
  boardClass?: string;
  boardStyle?: CSSProperties;
  joiner?: ReactNode;
  top?: ReactNode;
  bottom?: ReactNode;
  dtClass?: string;
  ddClass?: string;
  ddSubClass?: string;
}) {
  const rows = [
    { k: s("date", lang), v: formatDate(w.start, lang), sub: formatHijri(w.start) },
    { k: s("time", lang), v: formatTimeRange(w, lang) },
    { k: s("venue", lang), v: w.venue.name, sub: w.venue.address },
  ];

  return (
    <section id="jemputan" className={`relative scroll-mt-4 px-6 pb-20 pt-16 ${className}`} style={style}>
      {top}
      <Reveal className="text-center">
        <h2 className="font-script text-[2.1rem] leading-tight text-[var(--heading)]">{w.hosts}</h2>
        <p className="mx-auto mt-5 max-w-[22rem] font-serif text-[1.12rem] leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 text-center">
        <p className="font-script text-[1.8rem] leading-snug text-ink">{w.couple.groomFull}</p>
        <div className="my-3 font-script text-3xl text-gold">{joiner}</div>
        <p className="font-script text-[1.8rem] leading-snug text-ink">{w.couple.brideFull}</p>
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <div className={`relative px-6 py-7 ${boardClass}`} style={boardStyle}>
          {board}
          <dl className="relative grid gap-5">
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3">
                <dt className={`font-sans text-sm ${dtClass}`}>{r.k}</dt>
                <dd>
                  <span className={`block font-serif text-lg leading-snug ${ddClass}`}>{r.v}</span>
                  {r.sub && <span className={`block font-serif text-sm ${ddSubClass}`}>{r.sub}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 text-center">
        <p className="mx-auto max-w-[20rem] font-serif text-lg italic text-ink-soft">{t(w.closing, lang)}</p>
      </Reveal>
      {bottom}
    </section>
  );
}