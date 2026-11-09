"use client";

import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { formatClock, formatDate, formatDateDots, formatHijri, formatTimeRange } from "@/lib/format";
import { s, t } from "@/lib/i18n";
import type { Wedding } from "@/lib/types";
import { Bismillah } from "../../designs/scene";
import { useCountdown } from "../../invitation/Countdown";
import { Gallery, guestNotes, Story } from "../../invitation/Details";
import { Reveal } from "../../invitation/Section";
import { BrideFigure, GroomFigure } from "../figures";
import { EASE, GuestLine, OpenButtons } from "../parts";
import { Portrait, RsvpForm, ShareButtons, Wishes, type FormSkin } from "../suite";
import { sheetActions, SuiteShell, type CoverProps, type SheetId, type SuiteCtx } from "../SuiteShell";

// Bingkai: the bride and groom side by side, each in an arched frame, groom on the left and
// bride on the right. Real photos when the hosts set them, drawn figures until then. Peacock
// teal with blush, and the arch repeats through the card: countdown tiles, the reply card.

const TEAL = "var(--teal)";
const BLUSH = "var(--blush)";

/** One arch: a thin outer frame around a filled arch holding the photo or figure. */
function Arch({ w, who, className = "", tall = true }: { w: Wedding; who: "groom" | "bride"; className?: string; tall?: boolean }) {
  const src = who === "groom" ? w.photos.groom : w.photos.bride;
  const name = who === "groom" ? w.couple.groomShort : w.couple.brideShort;
  const Figure = who === "groom" ? GroomFigure : BrideFigure;
  return (
    <div className={`rounded-t-full border border-[var(--blush)] p-1.5 ${className}`}>
      <div className={`relative overflow-hidden rounded-t-full ${tall ? "aspect-[155/390]" : "aspect-[158/204]"}`} style={{ background: BLUSH }}>
        <Portrait
          src={src}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover object-top"
          fallback={<Figure accent="#12474f" className={`absolute inset-x-0 mx-auto w-full ${tall ? "top-[8%]" : "top-[6%]"}`} />}
        />
      </div>
    </div>
  );
}

/** Each portrait slides in from its own side, and slides back out that way when the cover opens. */
const door = (side: -1 | 1) => ({
  enter: { x: side * 30, opacity: 0 },
  shown: { x: 0, opacity: 1, transition: { duration: 1, ease: EASE } },
  gone: { x: `${side * 115}%`, opacity: 0, transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] as const } },
});

/** Cover: the two portraits under arches. Opening parts them like a pair of doors. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
      style={{ background: TEAL, color: "#fbf3ea" }}
      initial="enter"
      animate="shown"
      exit="gone"
      variants={{ enter: { opacity: 1 }, shown: { opacity: 1 }, gone: { opacity: 0, transition: { duration: 0.5, delay: 0.55 } } }}
    >
      <div className="mx-auto flex h-full max-w-[480px] flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+3.4rem)]">
        <p className="text-center font-serif text-lg italic" style={{ color: BLUSH }}>
          {t(w.title, lang)}
        </p>

        <div className="relative mx-auto mt-3 grid w-full max-w-[min(100%,36dvh)] grid-cols-2 gap-3">
          <motion.div variants={door(-1)}>
            <Arch w={w} who="groom" />
          </motion.div>
          <motion.div variants={door(1)}>
            <Arch w={w} who="bride" />
          </motion.div>
          <motion.span
            variants={{ enter: { scale: 0 }, shown: { scale: 1, transition: { delay: 0.6 } }, gone: { scale: 0, transition: { duration: 0.3 } } }}
            className="absolute bottom-[-1.75rem] left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full font-script text-[2.2rem]"
            style={{ background: "#fbf3ea", color: TEAL }}
          >
            &amp;
          </motion.span>
        </div>

        <div className="mx-auto mt-7 grid w-full max-w-[min(100%,36dvh)] grid-cols-2 gap-3 text-center font-script text-[clamp(2.4rem,11vw,3.4rem)] leading-tight">
          <h1>{w.couple.groomShort}</h1>
          <p>{w.couple.brideShort}</p>
        </div>
        <p className="mt-1 text-center font-serif text-lg">{formatDate(w.start, lang)}</p>
        <p className="text-center font-serif text-base" style={{ color: BLUSH }}>
          {w.venue.name}
        </p>

        <div className="mt-auto pt-4 text-center [&_p]:!text-[#fbf3ea]">
          <GuestLine lang={lang} guest={guest} />
          <OpenButtons
            lang={lang}
            onOpen={onOpen}
            className="mt-3 !items-stretch"
            buttonClass="min-h-13 rounded px-4 font-sans text-base font-medium [background:var(--blush)] [color:var(--teal)]"
            linkClass="self-center min-h-11 text-[#fbf3ea]"
          />
        </div>
      </div>
    </motion.div>
  );
}

const skin: FormSkin = {
  label: "font-sans text-sm text-ink-soft",
  input: "h-12 w-full rounded border border-[var(--card-line)] bg-white px-3 font-serif text-[1.1rem] text-ink outline-none focus:border-ink",
  on: "rounded bg-ink font-sans text-[0.95rem] text-bg",
  off: "rounded border border-ink bg-white font-sans text-[0.95rem] text-ink",
  step: "flex h-11 w-11 items-center justify-center rounded-full border border-ink text-ink",
  submit: "min-h-13 w-full rounded bg-ink px-4 py-3.5 font-sans text-base font-medium text-bg",
  note: "font-sans text-sm text-ink-soft",
  thanks: "font-script text-[2.6rem] leading-none text-ink",
};

function Countdown({ w, lang }: SuiteCtx) {
  const { r, status } = useCountdown(w);
  if (status !== "before") return <p className="text-center font-script text-[2rem]">{status === "during" ? s("happening", lang) : s("over", lang)}</p>;
  const units = [
    { v: r.days, k: s("days", lang) },
    { v: r.hours, k: s("hours", lang) },
    { v: r.minutes, k: s("minutes", lang) },
    { v: r.seconds, k: s("seconds", lang) },
  ];
  return (
    <div className="grid grid-cols-4 gap-2" aria-live="off">
      {units.map((u) => (
        <div key={u.k} className="flex flex-col items-center rounded-t-full bg-[#fff9f3] pb-3 pt-6 text-ink">
          <span className="font-serif text-[1.7rem] tabular-nums leading-none">{String(u.v).padStart(2, "0")}</span>
          <span className="mt-1.5 font-sans text-xs">{u.k}</span>
        </div>
      ))}
    </div>
  );
}

function Body(ctx: SuiteCtx) {
  const { w, lang, guest, url, mounted, openSheet, controls } = ctx;
  const sec = w.sections;
  const notes = guestNotes(w, lang);
  const actions: { id: SheetId | "rsvp"; label: string }[] = [...(sec.rsvp ? [{ id: "rsvp" as const, label: "RSVP" }] : []), ...sheetActions(w, lang)];
  const act = (id: SheetId | "rsvp") => {
    if (id === "rsvp") document.getElementById("rsvp")?.scrollIntoView({ behavior: ctx.reduced ? "auto" : "smooth" });
    else openSheet(id);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)]">
        {controls}
      </div>

      <main className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip bg-bg pb-24 text-ink">
        <section id="jemputan" className="px-6 pb-8 pt-20 text-center">
          <Reveal>
            <Bismillah className="text-[1.5rem] text-ink" />
            <p className="mt-1 font-serif text-base italic">{s("salam", lang)}</p>
            <p className="mt-5 font-serif text-[1.1rem] leading-snug">{w.hosts}</p>
            <p className="mx-auto mt-3 max-w-[22rem] font-serif text-[1.02rem] leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
          </Reveal>
        </section>

        <section aria-label={lang === "ms" ? "Mempelai" : "The couple"} className="px-5">
          <Reveal className="relative grid grid-cols-2 gap-4">
            <Arch w={w} who="groom" tall={false} className="!border-0 !p-0" />
            <Arch w={w} who="bride" tall={false} className="!border-0 !p-0" />
            <span className="absolute bottom-[-1.5rem] left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-ink font-script text-[1.9rem] text-bg">&amp;</span>
          </Reveal>
          <Reveal className="mt-8 grid grid-cols-2 gap-6 text-center font-serif text-[1.08rem] leading-snug">
            <h2>{w.couple.groomFull}</h2>
            <p>{w.couple.brideFull}</p>
          </Reveal>
        </section>

        <section aria-label={s("date", lang)} className="mx-6 mt-10 border-t border-[var(--card-line)] pt-8 text-center">
          <Reveal>
            <p className="font-script text-[2.5rem] leading-none">{formatDate(w.start, lang)}</p>
            <p className="mt-2 font-serif text-base text-ink-soft">{formatHijri(w.start)}</p>
            <p className="mt-2 font-serif text-[1.15rem]">{formatTimeRange(w, lang)}</p>
            <p className="mt-3 font-serif text-[1.2rem]">{w.venue.name}</p>
            <p className="font-serif text-base text-ink-soft">{w.venue.address}</p>
            <button type="button" onClick={() => openSheet("map")} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded border border-ink px-4 font-sans text-sm">
              <MapPin size={16} /> {s("viewMap", lang)}
            </button>
            <p className="mx-auto mt-7 max-w-[20rem] font-serif text-base italic text-ink-soft">{t(w.closing, lang)}</p>
          </Reveal>
        </section>

        {mounted && (
          <section aria-label={s("countdown", lang)} className="mt-10 px-5 py-8" style={{ background: BLUSH }}>
            <p className="mb-4 text-center font-script text-[2.1rem] leading-none">{s("countdown", lang)}</p>
            <Countdown {...ctx} />
          </section>
        )}

        {sec.schedule && w.events.length > 0 && (
          <section id="aturcara" className="px-6 py-10" style={{ background: TEAL, color: "#fbf3ea" }}>
            <h2 className="text-center font-script text-[2.4rem] leading-none">{s("schedule", lang)}</h2>
            <ol className="mt-6 grid gap-3">
              {w.events.map((e) => (
                <Reveal key={e.id}>
                  <li className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-white/20 pb-3">
                    <span className="font-sans text-sm" style={{ color: BLUSH }}>
                      {formatClock(e.time, lang)}
                    </span>
                    <span className="font-serif text-[1.1rem] leading-snug">
                      {t(e.title, lang)}
                      {e.note && t(e.note, lang) && <span className="block text-sm opacity-80">{t(e.note, lang)}</span>}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>
        )}

        {notes.length > 0 && (
          <section aria-label={s("details", lang)} className="grid gap-4 px-6 pt-10">
            {notes.map((n) => (
              <Reveal key={n.title}>
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-t-full text-ink" style={{ background: BLUSH }}>
                    <n.icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.1rem]">{n.title}</h3>
                    <p className="mt-1 font-serif text-base leading-relaxed text-ink-soft">{n.text}</p>
                    {n.colors && n.colors.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {n.colors.map((c) => (
                          <span key={c} className="h-6 w-6 rounded-full border border-[var(--card-line)]" style={{ background: c }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </section>
        )}

        {mounted && (
          <>
            {sec.story && <Story w={w} lang={lang} />}
            {sec.gallery && <Gallery w={w} lang={lang} />}
            {sec.rsvp && (
              <section id="rsvp" className="scroll-mt-4 px-5 pt-12">
                <div className="rounded-t-[11rem] border border-[var(--card-line)] bg-white px-6 pb-8 pt-16">
                  <h2 className="text-center font-script text-[2.4rem] leading-none">{s("rsvp", lang)}</h2>
                  <div className="mt-6">
                    <RsvpForm w={w} lang={lang} guest={guest} skin={skin} />
                  </div>
                </div>
              </section>
            )}
            {sec.guestbook && (
              <section id="ucapan" className="px-6 pt-12">
                <h2 className="mb-5 text-center font-script text-[2.4rem] leading-none">{s("guestbook", lang)}</h2>
                <Wishes lang={lang} guest={guest} skin={skin} item="rounded-t-2xl border border-[var(--card-line)] bg-white px-4 py-3 font-serif text-[1.05rem]" />
              </section>
            )}
          </>
        )}

        <footer className="mt-14 px-6 pb-10 text-center">
          <p className="font-script text-[2.6rem] leading-none">{s("thankYou", lang)}</p>
          <p className="mt-2 font-serif text-lg">
            {w.couple.groomShort} &amp; {w.couple.brideShort} · <span className="tabular-nums">{formatDateDots(w.start)}</span>
          </p>
          {w.couple.hashtag && <p className="mt-1 font-sans text-sm text-ink-soft">{w.couple.hashtag}</p>}
          <div className="mt-6">
            <ShareButtons w={w} lang={lang} url={url} primary="min-h-12 rounded bg-ink font-sans text-sm text-bg" secondary="min-h-12 rounded border border-ink font-sans text-sm" />
          </div>
        </footer>
      </main>

      <nav aria-label={lang === "ms" ? "Tindakan" : "Actions"} className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px]">
        <ul className="grid pb-[env(safe-area-inset-bottom)]" style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))`, background: TEAL }}>
          {actions.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => act(a.id)}
                className="h-15 w-full font-sans text-[0.85rem]"
                style={i === 0 ? { background: BLUSH, color: TEAL, fontWeight: 600 } : { color: "#fbf3ea" }}
              >
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/** /pro/bingkai: groom left, bride right, each in an arch. */
export function BingkaiCard({ fontClass }: { fontClass: string }) {
  return <SuiteShell theme="pro-bingkai" fontClass={fontClass} Cover={Cover} body={(ctx) => <Body {...ctx} />} />;
}