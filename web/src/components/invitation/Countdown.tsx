"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { s } from "@/lib/i18n";
import { downloadIcs, googleCalendarUrl } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";
import { Panel, Reveal, Section } from "./Section";

function remaining(target: number, now: number) {
  const ms = Math.max(0, target - now);
  return {
    days: Math.floor(ms / 864e5),
    hours: Math.floor(ms / 36e5) % 24,
    minutes: Math.floor(ms / 6e4) % 60,
    seconds: Math.floor(ms / 1e3) % 60,
  };
}

/** One unit; each digit change slides the old value up and the new one in. */
function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl border border-card-line bg-card">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-card-line" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="foil font-serif text-[2rem] font-medium lining-nums tabular-nums"
            initial={{ y: "70%", opacity: 0, rotateX: -60 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: "-70%", opacity: 0, rotateX: 60 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="label mt-2 text-[0.6rem] text-ink-soft">{label}</span>
    </div>
  );
}

export function Countdown({ w, lang, url }: { w: Wedding; lang: Lang; url: string }) {
  const start = new Date(w.start).getTime();
  const end = new Date(w.end).getTime();
  // Rendered only after the envelope opens, so reading the clock here can't mismatch hydration.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const r = remaining(start, now);
  const status = now < start ? "before" : now < end ? "during" : "after";

  return (
    <Section id="tarikh" eyebrow={s("countdown", lang)} title={s("date", lang)}>
      <Reveal>
        <Panel>
          {status === "before" ? (
            <div className="grid grid-cols-4 gap-2.5" style={{ perspective: 400 }} aria-live="off">
              <Unit value={r.days} label={s("days", lang)} />
              <Unit value={r.hours} label={s("hours", lang)} />
              <Unit value={r.minutes} label={s("minutes", lang)} />
              <Unit value={r.seconds} label={s("seconds", lang)} />
            </div>
          ) : (
            <p className="foil py-4 text-center font-script text-4xl">
              {status === "during" ? s("happening", lang) : s("over", lang)}
            </p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <a href={googleCalendarUrl(w, lang, url)} target="_blank" rel="noreferrer" className="btn-ghost !px-3 !text-[0.7rem]">
              <CalendarPlus size={16} /> Google
            </a>
            <button type="button" onClick={() => downloadIcs(w, lang, url)} className="btn-ghost !px-3 !text-[0.7rem]">
              <Download size={16} /> iPhone / .ics
            </button>
          </div>
          <p className="label mt-4 text-center text-[0.6rem] text-ink-mute">{s("addCalendar", lang)}</p>
        </Panel>
      </Reveal>
    </Section>
  );
}