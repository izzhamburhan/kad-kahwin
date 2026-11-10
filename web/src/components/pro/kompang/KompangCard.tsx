"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { formatClock, formatDate, formatDateDots, formatDateParts, formatHijri, formatTimeRange } from "@/lib/format";
import { s, t } from "@/lib/i18n";
import type { Wedding } from "@/lib/types";
import { Bismillah } from "../../designs/scene";
import { useCountdown } from "../../invitation/Countdown";
import { Gallery, guestNotes, Story } from "../../invitation/Details";
import { Reveal } from "../../invitation/Section";
import { EASE, GuestLine, OpenButtons } from "../parts";
import { Portrait, RsvpForm, ShareButtons, Wishes, type FormSkin } from "../suite";
import { sheetActions, SuiteShell, type CoverProps, type SheetId, type SuiteCtx } from "../SuiteShell";

// Kompang: the procession that brings the couple in. Frame drums beat throughout the card in
// interlocking parts, as a kompang troupe plays, and the couple walk in to the beat.
// Goatskin cream, dark wood and kuning diraja.

const MUSIC = "audio/kompang-dipalu.mp3";

// The song runs at about 86 beats a minute. Drums play eighth notes over one bar of four beats.
const BEAT = 60 / 86;
const STEP = BEAT / 2;
const BAR = STEP * 8;

// Interlocking parts, as steps in the bar: the lead on the beat, the answer off it, and the
// third part cutting across both.
const INDUK = [0, 2, 4, 6];
const ANAK = [1, 3, 5, 7];
const PENINGKAH = [0, 3, 6];

const WOOD = "#6b3a1c";
const KUNING = "#e2a530";

/** Keyframes for a drum skin that dips each time it is struck. */
function strikeKeys(hits: number[]) {
  const times: number[] = [];
  const scale: number[] = [];
  const sorted = [...hits].sort((a, b) => a - b);
  if (sorted[0] !== 0) {
    times.push(0);
    scale.push(1);
  }
  for (const h of sorted) {
    const at = h / 8;
    times.push(at, at + 0.02, at + 0.1);
    scale.push(1, 0.93, 1);
  }
  times.push(1);
  scale.push(1);
  return { times, scale };
}

/**
 * A kompang seen from the front: wooden frame, brass pins, goatskin. `hits` are the steps of the
 * bar it is struck on; each strike dips the skin and sends a ring out. It only plays on screen.
 */
function Kompang({
  hits = [],
  className = "",
  ring = "border-[var(--kuning)]",
  tilt = 0,
  children,
}: {
  hits?: number[];
  className?: string;
  ring?: string;
  tilt?: number;
  children?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "60px" });
  const play = !reduced && inView && hits.length > 0;
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const strike = strikeKeys(hits);
  const pins = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);

  return (
    <div ref={ref} className={`relative aspect-square ${className}`} style={tilt ? { rotate: `${tilt}deg` } : undefined}>
      {play &&
        hits.map((h) => (
          <motion.span
            key={h}
            aria-hidden
            className={`pointer-events-none absolute inset-[8%] rounded-full border-2 ${ring}`}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.5], opacity: [0.75, 0] }}
            transition={{ duration: 0.9, ease: "easeOut", delay: h * STEP, repeat: Infinity, repeatDelay: BAR - 0.9 }}
          />
        ))}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`w${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8f532a" />
            <stop offset="1" stopColor="#4e2a13" />
          </linearGradient>
          <radialGradient id={`s${id}`} cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#fdf6e6" />
            <stop offset="0.7" stopColor="#f3e2bd" />
            <stop offset="1" stopColor="#e2c58e" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill={`url(#w${id})`} />
        {pins.map((a) => (
          <circle key={a} cx={50 + Math.cos(a) * 45.3} cy={50 + Math.sin(a) * 45.3} r="1.5" fill="#e6b24c" />
        ))}
        <motion.g
          animate={play ? { scale: strike.scale } : { scale: 1 }}
          transition={play ? { duration: BAR, times: strike.times, ease: "linear", repeat: Infinity } : { duration: 0.2 }}
        >
          <circle cx="50" cy="50" r="41.5" fill={`url(#s${id})`} />
          <circle cx="50" cy="50" r="36.5" fill="none" stroke="#6b3a1c" strokeOpacity="0.14" strokeWidth="1.2" />
        </motion.g>
      </svg>
      {children && <div className="absolute inset-[13%] flex flex-col items-center justify-center text-center text-ink">{children}</div>}
    </div>
  );
}

/** Pucuk rebung: a strip of upright shoots, the border of a songket sampin. */
function Pucuk({ className = "" }: { className?: string }) {
  const id = `p${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg aria-hidden className={`block h-4 w-full ${className}`}>
      <defs>
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={WOOD} />
          <path d="M0 16 L8 2 L16 16 Z" fill={KUNING} />
          <path d="M4.6 16 L8 10 L11.4 16 Z" fill={WOOD} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// The frame of a kompang, brass pins on dark wood, used as the border of the portraits.
const RIM = `radial-gradient(circle, #e6b24c 1.3px, transparent 1.8px) 0 0 / 11px 11px, linear-gradient(160deg, #8f532a, #4e2a13)`;

/** A portrait in a pinned wooden frame, or the person's initial when no photo is set. */
function Frame({ w, who }: { w: Wedding; who: "groom" | "bride" }) {
  const src = who === "groom" ? w.photos.groom : w.photos.bride;
  const name = who === "groom" ? w.couple.groomShort : w.couple.brideShort;
  return (
    <div className="rounded-[1.6rem] p-[6px]" style={{ background: RIM }}>
      <div className="relative aspect-[5/8] overflow-hidden rounded-[1.2rem] bg-bg-2">
        <Portrait
          src={src}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover object-top"
          fallback={<span className="absolute inset-0 flex items-center justify-center font-script text-[clamp(3.5rem,18vw,6rem)] text-ink">{name.trim().charAt(0)}</span>}
        />
      </div>
    </div>
  );
}

/** One of the couple walking in from the side, bobbing to three beats, once open and on screen. */
function Walk({ from, opened, reduced, children }: { from: -1 | 1; opened: boolean; reduced: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  if (reduced) return <div>{children}</div>;
  const away = { opacity: 0, x: from * 64 };
  return (
    <motion.div
      ref={ref}
      initial={away}
      animate={opened && seen ? { opacity: 1, x: 0, y: [0, -6, 0, -6, 0, -6, 0] } : away}
      transition={{
        x: { duration: BEAT * 3, ease: "easeOut", delay: 0.2 },
        y: { duration: BEAT * 3, ease: "easeInOut", delay: 0.2 },
        opacity: { duration: 0.6, delay: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}

const D = "min(50vw, 27dvh, 230px)";

/** Cover: three drums of the troupe. Opening strikes the big drum and the cover closes into it. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  const side = (from: -1 | 1, delay: number) => ({
    enter: { opacity: 0, y: 24 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay } },
    gone: { x: from * -40, opacity: 0, transition: { duration: 0.45 } },
  });
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-bg text-ink"
      initial="enter"
      animate="shown"
      exit="gone"
      variants={{
        enter: { clipPath: "circle(150% at 50% 36%)" },
        shown: { clipPath: "circle(150% at 50% 36%)" },
        gone: { clipPath: "circle(0% at 50% 36%)", transition: { duration: 0.85, delay: 0.3, ease: [0.7, 0, 0.3, 1] } },
      }}
    >
      <Pucuk className="absolute inset-x-0 top-0" />
      <div className="mx-auto flex min-h-full max-w-[480px] flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+3.2rem)] text-center">
        <p className="font-serif text-lg italic">{t(w.title, lang)}</p>
        <h1 className="mt-1 font-script text-[clamp(2.7rem,12.5vw,3.9rem)] leading-tight">
          {w.couple.groomShort} &amp; {w.couple.brideShort}
        </h1>

        <div className="mt-5 flex items-start justify-center" style={{ ["--d" as string]: D }}>
          <motion.div variants={side(-1, 0.35)} className="relative z-0 shrink-0" style={{ width: "calc(var(--d) * 0.42)", marginTop: "calc(var(--d) * 0.5)", marginRight: "calc(var(--d) * -0.08)" }}>
            <Kompang hits={ANAK} tilt={-12} />
          </motion.div>
          <motion.div
            className="relative z-10 shrink-0"
            style={{ width: "var(--d)" }}
            variants={{
              enter: { opacity: 0, scale: 0.85 },
              shown: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE, delay: 0.15 } },
              gone: { scale: [1, 0.92, 1.1], transition: { duration: 0.45, times: [0, 0.25, 1] } },
            }}
          >
            <Kompang hits={INDUK}>
              <span className="font-script text-[calc(var(--d)*0.3)] leading-none">
                {w.couple.groomShort.trim().charAt(0)}
                <span className="mx-1 text-[0.6em] text-ink-soft">&amp;</span>
                {w.couple.brideShort.trim().charAt(0)}
              </span>
            </Kompang>
          </motion.div>
          <motion.div variants={side(1, 0.5)} className="relative z-0 shrink-0" style={{ width: "calc(var(--d) * 0.42)", marginTop: "calc(var(--d) * 0.5)", marginLeft: "calc(var(--d) * -0.08)" }}>
            <Kompang hits={PENINGKAH} tilt={12} />
          </motion.div>
        </div>

        <div className="mt-6">
          <p className="font-serif text-[1.2rem]">{formatDate(w.start, lang)}</p>
          <p className="mt-0.5 font-serif text-base text-ink-soft">{w.venue.name}</p>
        </div>

        <div className="mt-auto pt-5">
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
      <Pucuk className="absolute inset-x-0 bottom-0 rotate-180" />
    </motion.div>
  );
}

const skin: FormSkin = {
  label: "font-sans text-sm text-ink-soft",
  input: "h-12 w-full rounded-xl border-[1.5px] border-ink/30 bg-white px-4 font-serif text-[1.05rem] text-ink outline-none focus:border-ink",
  on: "rounded-xl bg-ink font-sans text-[0.95rem] text-bg",
  off: "rounded-xl border-[1.5px] border-ink/30 bg-white font-sans text-[0.95rem] text-ink",
  step: "flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink/30 bg-white text-ink",
  submit: "min-h-13 w-full rounded-xl bg-ink px-4 py-3.5 font-sans text-base font-medium text-bg",
  note: "font-sans text-sm text-ink-soft",
  thanks: "font-script text-[3rem] leading-none text-ink",
};

/** Countdown on four drums struck one after another, like a roll passing down the line. */
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
    <div className="grid grid-cols-4 gap-3" aria-live="off">
      {units.map((u, i) => (
        <Kompang key={u.k} hits={[i * 2]}>
          <span className="font-serif text-[1.3rem] font-semibold tabular-nums leading-none">{String(u.v).padStart(2, "0")}</span>
          <span className="mt-0.5 font-sans text-[0.62rem]">{u.k}</span>
        </Kompang>
      ))}
    </div>
  );
}

function Body(ctx: SuiteCtx) {
  const { w, lang, guest, url, mounted, opened, reduced, openSheet, controls } = ctx;
  const sec = w.sections;
  const notes = guestNotes(w, lang);
  const day = formatDateParts(w.start, lang);
  const actions: { id: SheetId | "rsvp"; label: string }[] = [...(sec.rsvp ? [{ id: "rsvp" as const, label: "RSVP" }] : []), ...sheetActions(w, lang)];
  const act = (id: SheetId | "rsvp") => {
    if (id === "rsvp") document.getElementById("rsvp")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    else openSheet(id);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)]">
        {controls}
      </div>

      <main className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip bg-bg pb-24 text-ink">
        <Pucuk />
        <section id="jemputan" className="px-6 pb-2 pt-16 text-center">
          <Reveal>
            <Bismillah className="text-[1.5rem] text-ink" />
            <p className="mt-1 font-serif text-base italic">{s("salam", lang)}</p>
            <p className="mt-5 font-serif text-[1.08rem] leading-snug">{w.hosts}</p>
            <p className="mx-auto mt-3 max-w-[22rem] font-serif text-[1rem] leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
          </Reveal>
        </section>

        <section aria-label={lang === "ms" ? "Mempelai" : "The couple"} className="px-5 pb-12 pt-8 text-center">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-ink-mute">
            {lang === "ms" ? "Diiringi paluan kompang" : "To the beat of the kompang"}
          </p>
          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <Walk from={-1} opened={opened} reduced={reduced}>
              <Frame w={w} who="groom" />
            </Walk>
            <Walk from={1} opened={opened} reduced={reduced}>
              <Frame w={w} who="bride" />
            </Walk>
            <div className="absolute bottom-0 left-1/2 z-10 w-16 -translate-x-1/2 translate-y-1/2">
              <Kompang hits={opened ? PENINGKAH : []}>
                <span className="font-script text-[1.9rem] leading-none">&amp;</span>
              </Kompang>
            </div>
          </div>
          <div className="mt-11 grid grid-cols-2 gap-3">
            <h2 className="font-serif text-[1.08rem] leading-snug">{w.couple.groomFull}</h2>
            <h2 className="font-serif text-[1.08rem] leading-snug">{w.couple.brideFull}</h2>
          </div>
          <div className="mt-8 flex items-center justify-center gap-[3vw] min-[480px]:gap-3" aria-hidden>
            {[INDUK, ANAK, PENINGKAH, ANAK, INDUK].map((h, i) => (
              <Kompang key={i} hits={opened ? h : []} tilt={i % 2 ? 9 : -9} className="w-[14vw] max-w-[64px]" />
            ))}
          </div>
        </section>

        <section aria-label={s("date", lang)} className="bg-ink text-bg">
          <Pucuk />
          <div className="px-6 pb-10 pt-10 text-center">
            <Reveal>
              <Kompang hits={PENINGKAH} className="mx-auto w-[min(68vw,280px)]">
                <span className="font-sans text-[0.72rem] uppercase tracking-[0.2em]">{day.weekday}</span>
                <span className="font-serif text-[clamp(3.4rem,17vw,4.6rem)] font-semibold leading-none tabular-nums">{day.day}</span>
                <span className="mt-1 font-serif text-[1.05rem]">
                  {day.month} {day.year}
                </span>
              </Kompang>
              <p className="mt-6 font-serif text-base">{formatHijri(w.start)}</p>
              <p className="mt-2 font-serif text-[1.15rem]">{formatTimeRange(w, lang)}</p>
              <p className="mt-3 font-script text-[2.2rem] leading-tight text-[var(--kuning)]">{w.venue.name}</p>
              <p className="font-serif text-base text-bg/85">{w.venue.address}</p>
              <button type="button" onClick={() => openSheet("map")} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--kuning)] px-5 font-sans text-sm font-medium text-ink">
                <MapPin size={16} /> {s("viewMap", lang)}
              </button>
            </Reveal>
          </div>
          <Pucuk className="rotate-180" />
        </section>

        {mounted && (
          <section aria-label={s("countdown", lang)} className="px-5 pt-10">
            <Countdown {...ctx} />
          </section>
        )}

        {sec.schedule && w.events.length > 0 && (
          <section id="aturcara" className="px-6 pt-12">
            <h2 className="text-center font-script text-[2.6rem] leading-none">{s("schedule", lang)}</h2>
            <ol className="mt-6">
              {w.events.map((e) => (
                <Reveal key={e.id}>
                  <li className="flex items-center gap-4 border-b border-dashed border-ink/25 py-3.5 last:border-b-0">
                    <Kompang className="w-10 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-sans text-sm text-ink-soft">{formatClock(e.time, lang)}</p>
                      <p className="font-serif text-[1.12rem] leading-snug">{t(e.title, lang)}</p>
                      {e.note && t(e.note, lang) && <p className="text-sm text-ink-soft">{t(e.note, lang)}</p>}
                    </div>
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
                <div className="flex gap-4 rounded-2xl bg-bg-2 px-5 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-bg">
                    <n.icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.1rem] font-semibold">{n.title}</h3>
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
                <Wishes lang={lang} guest={guest} skin={skin} item="rounded-2xl bg-bg-2 px-5 py-3 font-serif text-[1.05rem]" />
              </section>
            )}
          </>
        )}

        <footer className="mt-14 bg-ink text-bg">
          <Pucuk />
          <div className="px-6 pb-10 pt-8 text-center">
            <div className="flex justify-center gap-3" aria-hidden>
              {[ANAK, INDUK, PENINGKAH].map((h, i) => (
                <Kompang key={i} hits={h} tilt={(i - 1) * 10} className="w-12" />
              ))}
            </div>
            <p className="mt-5 font-script text-[3rem] leading-none text-[var(--kuning)]">
              {w.couple.groomShort} &amp; {w.couple.brideShort}
            </p>
            <p className="mt-2 font-sans text-sm tabular-nums text-bg/80">
              {formatDateDots(w.start)} {w.couple.hashtag && `· ${w.couple.hashtag}`}
            </p>
            <div className="mt-6">
              <ShareButtons
                w={w}
                lang={lang}
                url={url}
                primary="min-h-12 rounded-full bg-[var(--kuning)] font-sans text-sm font-medium text-ink"
                secondary="min-h-12 rounded-full border border-bg/60 font-sans text-sm text-bg"
              />
            </div>
          </div>
        </footer>
      </main>

      <nav aria-label={lang === "ms" ? "Tindakan" : "Actions"} className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] bg-ink pb-[env(safe-area-inset-bottom)]">
        <ul className="grid" style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}>
          {actions.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => act(a.id)}
                className={`h-14 w-full font-sans text-[0.82rem] ${i === 0 ? "bg-[var(--kuning)] font-semibold text-ink" : "text-bg"}`}
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

/** /pro/kompang: a kompang procession brings the couple in, drums beating to the song. */
export function KompangCard({ fontClass }: { fontClass: string }) {
  return <SuiteShell theme="pro-kompang" fontClass={fontClass} Cover={Cover} body={(ctx) => <Body {...ctx} />} music={MUSIC} />;
}