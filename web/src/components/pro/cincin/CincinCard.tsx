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
import { EASE, GuestLine, OpenButtons } from "../parts";
import { Portrait, RsvpForm, ShareButtons, Wishes, type FormSkin } from "../suite";
import { sheetActions, SuiteShell, type CoverProps, type SheetId, type SuiteCtx } from "../SuiteShell";

// Cincin: two rings. The couple's portraits sit in overlapping circles set on a diagonal,
// groom above left and bride below right, and the circle carries on through the card:
// countdown rounds, the ring nodes of the programme, pill buttons. Pastel olive throughout.

/** A portrait in a ring, or the person's initial when no photo is set. */
function Ring({ w, who, className = "", inner = "" }: { w: Wedding; who: "groom" | "bride"; className?: string; inner?: string }) {
  const src = who === "groom" ? w.photos.groom : w.photos.bride;
  const name = who === "groom" ? w.couple.groomShort : w.couple.brideShort;
  return (
    <div className={`rounded-full border-[1.5px] border-ink p-1.5 ${className}`}>
      <div className={`relative aspect-square overflow-hidden rounded-full bg-[var(--band)] ${inner}`}>
        <Portrait
          src={src}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover object-top"
          fallback={<span className="absolute inset-0 flex items-center justify-center font-script text-[clamp(3rem,16vw,6rem)] text-ink">{name.trim().charAt(0)}</span>}
        />
      </div>
    </div>
  );
}

const D = "min(56vw, 26dvh, 240px)";

/** Cover: the rings on a diagonal. Opening draws them together into one, then fades. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[var(--band)] text-ink"
      initial="enter"
      animate="shown"
      exit="gone"
      variants={{ enter: { opacity: 1 }, shown: { opacity: 1 }, gone: { opacity: 0, transition: { duration: 0.45, delay: 0.6 } } }}
    >
      <div className="mx-auto flex h-full max-w-[480px] flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+3.6rem)]">
        <p className="font-serif text-lg italic">{t(w.title, lang)}</p>

        <div className="mt-2" style={{ ["--d" as string]: D }}>
          <div className="flex items-center gap-3">
            <motion.div
              className="shrink-0"
              style={{ width: "var(--d)" }}
              variants={{
                enter: { opacity: 0, scale: 0.9 },
                shown: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE } },
                gone: { x: "28%", y: "22%", scale: 0.85, opacity: 0, transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] } },
              }}
            >
              <Ring w={w} who="groom" />
            </motion.div>
            <motion.div variants={{ enter: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 0.4 } }, gone: { opacity: 0 } }} className="min-w-0 font-script leading-none">
              <h1 className="text-[clamp(3rem,15vw,4.6rem)]">{w.couple.groomShort}</h1>
              <p className="ml-6 mt-1 text-[clamp(2.2rem,10vw,3.2rem)]">&amp;</p>
            </motion.div>
          </div>
          <div className="flex items-center justify-end gap-3" style={{ marginTop: "calc(var(--d) * -0.16)" }}>
            <motion.p variants={{ enter: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 0.55 } }, gone: { opacity: 0 } }} className="min-w-0 text-right font-script text-[clamp(3rem,15vw,4.6rem)] leading-none">
              {w.couple.brideShort}
            </motion.p>
            <motion.div
              className="relative shrink-0 rounded-full bg-[var(--band)]"
              style={{ width: "var(--d)" }}
              variants={{
                enter: { opacity: 0, scale: 0.9 },
                shown: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE, delay: 0.15 } },
                gone: { x: "-28%", y: "-22%", scale: 0.85, opacity: 0, transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] } },
              }}
            >
              <Ring w={w} who="bride" />
            </motion.div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="font-serif text-[1.25rem]">{formatDate(w.start, lang)}</p>
          <p className="mt-0.5 font-serif text-base">{w.venue.name}</p>
        </div>

        <div className="mt-auto pt-4 text-center">
          <GuestLine lang={lang} guest={guest} />
          <OpenButtons
            lang={lang}
            onOpen={onOpen}
            className="mt-3 !items-stretch"
            buttonClass="min-h-13 rounded-full bg-ink px-4 font-sans text-base font-medium text-bg"
            linkClass="self-center min-h-11 text-ink"
          />
        </div>
      </div>
    </motion.div>
  );
}

const skin: FormSkin = {
  label: "font-sans text-sm text-ink-soft",
  input: "h-12 w-full rounded-full border border-ink/50 bg-white px-5 font-serif text-[1.05rem] text-ink outline-none focus:border-ink [&:is(textarea)]:rounded-3xl",
  on: "rounded-full bg-ink font-sans text-[0.95rem] text-bg",
  off: "rounded-full border border-ink bg-white font-sans text-[0.95rem] text-ink",
  step: "flex h-11 w-11 items-center justify-center rounded-full border border-ink bg-white text-ink",
  submit: "min-h-13 w-full rounded-full bg-ink px-4 py-3.5 font-sans text-base font-medium text-bg",
  note: "font-sans text-sm text-ink-soft",
  thanks: "font-script text-[3rem] leading-none text-ink",
};

function Countdown({ w, lang }: SuiteCtx) {
  const { r, status } = useCountdown(w);
  if (status !== "before") return <p className="text-center font-script text-[2.4rem]">{status === "during" ? s("happening", lang) : s("over", lang)}</p>;
  const units = [
    { v: r.days, k: s("days", lang) },
    { v: r.hours, k: s("hours", lang) },
    { v: r.minutes, k: s("minutes", lang) },
    { v: r.seconds, k: s("seconds", lang) },
  ];
  return (
    <div className="grid grid-cols-4 gap-2.5" aria-live="off">
      {units.map((u) => (
        <div key={u.k} className="flex aspect-square flex-col items-center justify-center rounded-full border-[1.5px] border-ink bg-bg">
          <span className="font-serif text-[1.45rem] tabular-nums leading-none">{String(u.v).padStart(2, "0")}</span>
          <span className="mt-1 font-sans text-[0.7rem]">{u.k}</span>
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

      <main className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip bg-bg pb-28 text-ink">
        <section id="jemputan" className="px-6 pb-6 pt-20 text-center">
          <Reveal>
            <Bismillah className="text-[1.5rem] text-ink" />
            <p className="mt-1 font-serif text-base italic">{s("salam", lang)}</p>
            <p className="mt-5 font-serif text-[1.08rem] leading-snug">{w.hosts}</p>
            <p className="mx-auto mt-3 max-w-[22rem] font-serif text-[1rem] leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
          </Reveal>
        </section>

        <section aria-label={lang === "ms" ? "Mempelai" : "The couple"} className="px-6">
          <Reveal className="flex items-center gap-4">
            <Ring w={w} who="groom" className="w-[38%] shrink-0" />
            <h2 className="min-w-0 font-serif text-[1.25rem] leading-snug">{w.couple.groomFull}</h2>
          </Reveal>
          <p className="my-1 text-center font-script text-[2.6rem] leading-none">&amp;</p>
          <Reveal className="flex items-center gap-4">
            <p className="min-w-0 flex-1 text-right font-serif text-[1.25rem] leading-snug">{w.couple.brideFull}</p>
            <Ring w={w} who="bride" className="w-[38%] shrink-0" />
          </Reveal>
        </section>

        <section aria-label={s("date", lang)} className="mx-4 mt-10 rounded-[2.5rem] bg-[var(--band)] px-6 py-8 text-center">
          <Reveal>
            <p className="font-script text-[2.7rem] leading-none">{formatDate(w.start, lang)}</p>
            <p className="mt-2 font-serif text-base">{formatHijri(w.start)}</p>
            <p className="mt-3 font-serif text-[1.15rem]">{formatTimeRange(w, lang)}</p>
            <p className="mt-2 font-serif text-[1.2rem]">{w.venue.name}</p>
            <p className="font-serif text-base text-ink-soft">{w.venue.address}</p>
            <button type="button" onClick={() => openSheet("map")} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-sans text-sm text-bg">
              <MapPin size={16} /> {s("viewMap", lang)}
            </button>
          </Reveal>
        </section>

        {mounted && (
          <section aria-label={s("countdown", lang)} className="px-6 pt-10">
            <Countdown {...ctx} />
          </section>
        )}

        {sec.schedule && w.events.length > 0 && (
          <section id="aturcara" className="px-6 pt-12">
            <h2 className="text-center font-script text-[2.6rem] leading-none">{s("schedule", lang)}</h2>
            <ol className="relative mt-6 ml-2 border-l-[1.5px] border-ink pl-7">
              {w.events.map((e) => (
                <Reveal key={e.id} className="relative pb-6 last:pb-0">
                  <li>
                    <span className="absolute -left-[2.35rem] top-0.5 h-5 w-5 rounded-full border-[1.5px] border-ink bg-[var(--band)]" aria-hidden />
                    <p className="font-sans text-sm text-ink-soft">{formatClock(e.time, lang)}</p>
                    <p className="mt-0.5 font-serif text-[1.15rem] leading-snug">{t(e.title, lang)}</p>
                    {e.note && t(e.note, lang) && <p className="text-sm text-ink-soft">{t(e.note, lang)}</p>}
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>
        )}

        {notes.length > 0 && (
          <section aria-label={s("details", lang)} className="grid gap-3 px-5 pt-10">
            {notes.map((n) => (
              <Reveal key={n.title}>
                <div className="flex gap-4 rounded-[2rem] bg-[var(--band)] px-5 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg">
                    <n.icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.1rem]">{n.title}</h3>
                    <p className="mt-1 font-serif text-base leading-relaxed">{n.text}</p>
                    {n.colors && n.colors.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {n.colors.map((c) => (
                          <span key={c} className="h-6 w-6 rounded-full border border-ink/30" style={{ background: c }} />
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
              <section id="rsvp" className="scroll-mt-4 px-6 pt-12">
                <h2 className="mb-5 text-center font-script text-[2.6rem] leading-none">{s("rsvp", lang)}</h2>
                <RsvpForm w={w} lang={lang} guest={guest} skin={skin} />
              </section>
            )}
            {sec.guestbook && (
              <section id="ucapan" className="px-6 pt-12">
                <h2 className="mb-5 text-center font-script text-[2.6rem] leading-none">{s("guestbook", lang)}</h2>
                <Wishes lang={lang} guest={guest} skin={skin} item="rounded-3xl bg-[var(--band)] px-5 py-3 font-serif text-[1.05rem]" />
              </section>
            )}
          </>
        )}

        <footer className="mt-14 px-6 pb-8 text-center">
          <p className="font-script text-[3rem] leading-none">
            {w.couple.groomShort} &amp; {w.couple.brideShort}
          </p>
          <p className="mt-2 font-sans text-sm tabular-nums text-ink-soft">
            {formatDateDots(w.start)} {w.couple.hashtag && `· ${w.couple.hashtag}`}
          </p>
          <div className="mt-6">
            <ShareButtons w={w} lang={lang} url={url} primary="min-h-12 rounded-full bg-ink font-sans text-sm text-bg" secondary="min-h-12 rounded-full border border-ink font-sans text-sm" />
          </div>
        </footer>
      </main>

      <nav aria-label={lang === "ms" ? "Tindakan" : "Actions"} className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-2.5 pb-[max(env(safe-area-inset-bottom),0.6rem)]">
        <ul className="grid gap-1.5 rounded-full bg-bg/90 p-1.5 shadow-[0_8px_30px_-12px_rgba(61,68,38,.45)] backdrop-blur-md" style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}>
          {actions.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => act(a.id)}
                className={`h-11 w-full rounded-full font-sans text-[0.8rem] ${i === 0 ? "bg-ink font-medium text-bg" : "border border-ink text-ink"}`}
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

/** /pro/cincin: the couple's portraits in two overlapping rings. */
export function CincinCard({ fontClass }: { fontClass: string }) {
  return <SuiteShell theme="pro-cincin" fontClass={fontClass} Cover={Cover} body={(ctx) => <Body {...ctx} />} />;
}