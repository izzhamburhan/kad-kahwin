"use client";

import { motion } from "motion/react";
import { formatDate, formatDateDots, formatHijri, formatTimeRange } from "@/lib/format";
import { s } from "@/lib/i18n";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { EASE, GuestLine, OpenButtons, ScrollCue, rise } from "../parts";

// Ringkas: the invitation set as type alone. Black on bone, a hairline grid, the date
// as large figures and the names in a single italic voice. No ornament but the rule.

const TZ = "Asia/Kuala_Lumpur";
const parts = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ })
    .formatToParts(new Date(iso))
    .reduce<Record<string, string>>((a, x) => ({ ...a, [x.type]: x.value }), {});

/** Divider: a hairline with a small dot at its centre. */
function Rule() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span className="h-px w-14 bg-ink" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink" />
      <span className="h-px w-14 bg-ink" />
    </div>
  );
}

/** Ringkas cover: the date set very large. Opening wipes it away from the bottom up. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  const d = parts(w.start);
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-bg"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="mx-auto flex h-full max-w-[480px] flex-col justify-between px-7 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+4.5rem)]">
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-ink-soft">Walimatul Urus</p>
          <div className="mt-4 border-t border-ink pt-3 font-script leading-[0.82] text-ink">
            {[d.day, d.month, d.year].map((n, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.1 }} className="text-[clamp(5.5rem,30vw,8.5rem)] tracking-[-0.03em]">
                {n}
              </motion.p>
            ))}
          </div>
        </div>
        <div>
          <p className="border-t border-ink pt-4 font-script text-[2.3rem] italic leading-tight text-ink">
            {w.couple.groomShort} &amp; {w.couple.brideShort}
          </p>
          <GuestLine lang={lang} guest={guest} className="mt-4" />
          <OpenButtons lang={lang} onOpen={onOpen} className="mt-7 !items-start" />
        </div>
      </div>
    </motion.div>
  );
}

/** First screen: a typographic page, set left on a hairline grid. */
function Hero({ w, lang, opened }: ProCtx) {
  return (
    <section id="utama" className="relative flex min-h-dvh flex-col justify-center px-7 pb-24 pt-20">
      <motion.div {...rise(opened, 0, 0.15)} className="flex items-baseline justify-between border-b border-ink pb-2 font-sans text-[0.68rem] uppercase tracking-[0.3em] text-ink-soft">
        <span>Walimatul Urus</span>
        <span className="tabular-nums">{formatDateDots(w.start)}</span>
      </motion.div>
      <motion.p {...rise(opened, 1, 0.15)} className="mt-8 font-script text-[clamp(4rem,18vw,5.6rem)] italic leading-[0.9] tracking-[-0.02em] text-ink">
        {w.couple.groomShort}
      </motion.p>
      <motion.p {...rise(opened, 2, 0.15)} className="my-1 pl-[18%] font-script text-[3rem] leading-none text-ink-mute">
        &amp;
      </motion.p>
      <motion.p {...rise(opened, 3, 0.15)} className="text-right font-script text-[clamp(4rem,18vw,5.6rem)] italic leading-[0.9] tracking-[-0.02em] text-ink">
        {w.couple.brideShort}
      </motion.p>
      <motion.dl {...rise(opened, 4, 0.15)} className="mt-12 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-3 border-t border-ink pt-4 font-sans text-sm">
        <dt className="text-ink-mute">{s("date", lang)}</dt>
        <dd className="text-ink">
          {formatDate(w.start, lang)}
          <span className="block text-ink-mute">{formatHijri(w.start)}</span>
        </dd>
        <dt className="text-ink-mute">{s("time", lang)}</dt>
        <dd className="text-ink">{formatTimeRange(w, lang)}</dd>
        <dt className="text-ink-mute">{s("venue", lang)}</dt>
        <dd className="text-ink">{w.venue.name}</dd>
      </motion.dl>
      <ScrollCue lang={lang} opened={opened} />
    </section>
  );
}

/** /pro/ringkas: simple and minimalist, set in type alone. */
export function RingkasCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-ringkas"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<Rule />}
      fullNameClass="font-script text-[2.1rem] italic leading-tight text-[var(--heading)]"
      cardClass="bg-white"
      cardStyle={{ boxShadow: "inset 0 0 0 1px rgba(17,17,17,.9)" }}
    />
  );
}