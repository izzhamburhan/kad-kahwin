"use client";

import { motion } from "motion/react";
import { CalendarPlus, MapPin, Navigation } from "lucide-react";
import { formatClock, formatDateDots, formatDateParts, formatHijri, formatTimeRange, mapsUrl, wazeUrl } from "@/lib/format";
import { s, t } from "@/lib/i18n";
import { Bismillah } from "../../designs/scene";
import { useCountdown } from "../../invitation/Countdown";
import { Gallery, guestNotes, Story } from "../../invitation/Details";
import { Reveal } from "../../invitation/Section";
import { EASE, OpenButtons } from "../parts";
import { RsvpForm, ShareButtons, Wishes, type FormSkin, SUITE_MUSIC } from "../suite";
import { sheetActions, SuiteShell, type CoverProps, type SuiteCtx } from "../SuiteShell";

// Majalah: the invitation laid out like a bridal magazine. Huge names on the cover over a
// line drawing of a bunga raya, a drop cap on the invitation, the day as one big figure, and a
// plain text menu at the top instead of an icon bar. Two palettes share this layout: oxblood
// and cream (/pro/majalah) and pastel olive (/pro/zaitun); every colour comes from the theme.

const C = (name: string) => `var(--${name})`;

/** A five-petal bunga raya with veins and its long stamen, drawn once for every render. */
const HIBISCUS = (() => {
  const cx = 238;
  const cy = 260;
  const R = 216;
  const f = (n: number) => n.toFixed(1);
  const at = (a: number, r: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`;
  const petals: string[] = [];
  let veins = "";
  for (let i = 0; i < 5; i++) {
    const mid = -2.6 + (i * 2 * Math.PI) / 5;
    const span = 0.86;
    let d = `M${at(mid - span, 12)}`;
    for (let k = 0; k <= 64; k++) {
      const u = k / 64;
      const body = Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.02)), 0.42);
      const ruffle = 1 + Math.sin(u * 30 + i) * 0.024 + Math.sin(u * 13 + i * 2) * 0.02;
      d += `L${at(mid - span + u * span * 2, Math.max(14, R * body * ruffle))}`;
    }
    petals.push(`${d}L${at(mid + span, 12)}Z`);
    for (let v = -2; v <= 2; v++) veins += `M${at(mid + v * 0.05, 30)}Q${at(mid + v * 0.1, 100)} ${at(mid + v * 0.16, R * (0.72 - Math.abs(v) * 0.05))}`;
  }
  let anthers = "";
  for (let i = 0; i < 18; i++) {
    const u = i / 17;
    const x = 180 - u * 76;
    const y = 208 - u * 53 + (i % 2 ? 9 : -9);
    anthers += `M${f(x - 3.2)} ${f(y)}a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0Z`;
  }
  return { petals, veins, anthers };
})();

function Hibiscus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 520" className={className} aria-hidden>
      {HIBISCUS.petals.map((d) => (
        <path key={d.slice(0, 20)} d={d} fill={C("cover-petal")} stroke={C("cover-line")} strokeWidth="1.2" strokeLinejoin="round" />
      ))}
      <path d={HIBISCUS.veins} fill="none" stroke={C("cover-line")} strokeWidth="0.6" opacity="0.7" />
      <path d="M238 260C188 214 146 176 96 152" fill="none" stroke={C("cover-ink")} strokeWidth="2.4" strokeLinecap="round" />
      <path d={HIBISCUS.anthers} fill={C("cover-anther")} />
    </svg>
  );
}

/** The cover turns away like a magazine page, hinged on its left edge. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  const d = formatDateParts(w.start, lang);
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: C("cover"), color: C("cover-ink"), transformOrigin: "0% 50%", transformPerspective: 1400 }}
      exit={{ rotateY: -92, opacity: 0.4, transition: { duration: 1, ease: [0.7, 0, 0.3, 1] } }}
    >
      <div className="relative mx-auto flex h-full max-w-[480px] flex-col px-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[calc(env(safe-area-inset-top)+4.25rem)]">
        <Hibiscus className="pointer-events-none absolute left-[40%] top-[max(40%,20rem)] w-[112%] max-w-[560px]" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative flex items-baseline justify-between border-b pb-2.5 font-sans text-sm" style={{ borderColor: C("cover-line") }}>
          <span>{t(w.title, lang)}</span>
          <span className="tabular-nums">{formatDateDots(w.start)}</span>
        </motion.div>

        <div className="relative mt-3 font-script">
          <motion.h1 initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.1 }} className="text-[clamp(4.2rem,25vw,6.6rem)] leading-none tracking-[-0.02em]">
            {w.couple.groomShort}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="ml-1 text-[2rem] leading-none" style={{ color: C("cover-line") }}>
            &amp;
          </motion.p>
          <motion.p initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.25 }} className="text-right text-[clamp(4rem,24vw,6.2rem)] leading-none tracking-[-0.02em]">
            {w.couple.brideShort}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="relative mt-6 w-[46%]">
          <p className="font-script text-[1.3rem] leading-tight">
            {d.weekday},
            <br />
            {d.day} {d.month} {d.year}
          </p>
          <p className="mt-2 font-sans text-sm leading-snug" style={{ color: C("cover-soft") }}>
            {w.venue.name}
          </p>
        </motion.div>

        <div className="relative mt-auto border-t pt-4" style={{ borderColor: C("cover-line"), background: C("cover") }}>
          <p className="font-script text-lg">
            {s("to", lang)} <span style={{ color: C("cover-soft") }}>{guest || s("guest", lang)}</span>
          </p>
          <OpenButtons
            lang={lang}
            onOpen={onOpen}
            className="mt-3 !items-stretch"
            buttonClass="min-h-13 font-sans text-base font-medium [background:var(--cover-btn)] [color:var(--cover-btn-ink)]"
            linkClass="self-center min-h-11 [color:var(--cover-ink)]"
          />
        </div>
      </div>
    </motion.div>
  );
}

const skin: FormSkin = {
  label: "font-sans text-sm text-ink-soft",
  input: "h-12 w-full border-0 border-b border-ink bg-transparent font-script text-[1.2rem] text-ink outline-none focus:border-b-2",
  on: "border border-ink bg-ink font-sans text-[0.95rem] text-bg",
  off: "border border-ink bg-transparent font-sans text-[0.95rem] text-ink",
  step: "flex h-11 w-11 items-center justify-center border border-ink text-ink",
  submit: "min-h-13 w-full bg-[var(--accent)] px-4 py-3.5 font-sans text-base font-medium text-[var(--on-accent)]",
  note: "font-sans text-sm text-ink-soft",
  thanks: "font-script text-[2.6rem] leading-none text-[var(--accent)]",
};

function Heading({ children }: { children: string }) {
  return <h2 className="font-script text-[2.4rem] leading-none">{children}</h2>;
}

function Body(ctx: SuiteCtx) {
  const { w, lang, guest, url, mounted, openSheet, controls } = ctx;
  const sec = w.sections;
  const d = formatDateParts(w.start, lang);
  const notes = guestNotes(w, lang);
  const extras = sheetActions(w, lang).filter((a) => a.id === "contact" || a.id === "gift");
  const nav = [
    { id: "jemputan", label: s("invitation", lang) },
    sec.schedule && w.events.length > 0 && { id: "aturcara", label: lang === "ms" ? "Aturcara" : "Programme" },
    { id: "lokasi", label: s("venue", lang) },
    sec.rsvp && { id: "rsvp", label: "RSVP" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <main className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip bg-bg text-ink">
      <header className="sticky top-0 z-30 bg-bg/95 px-5 pt-[max(env(safe-area-inset-top),0.6rem)] backdrop-blur-md">
        <div className="pointer-events-none flex items-center justify-between">{controls}</div>
        <nav aria-label={lang === "ms" ? "Bahagian" : "Sections"} className="mt-1 flex justify-between border-b border-ink font-sans text-sm">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="flex min-h-11 items-center text-ink no-underline">
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="jemputan" className="scroll-mt-28 px-6 pb-12 pt-8">
        <Reveal>
          <Bismillah className="text-[1.6rem] text-ink" />
          <p className="mt-5 font-sans text-[0.95rem] leading-snug">
            {s("salam", lang)}
            <br />
            <span className="font-medium">{w.hosts}</span>
          </p>
          <p className="mt-4 font-sans text-base leading-[1.65] text-ink first-letter:float-left first-letter:mr-2.5 first-letter:mt-1.5 first-letter:font-script first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-[var(--accent)]">
            {t(w.message, lang)}
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <p className="font-script text-[1.85rem] leading-[1.15]">{w.couple.groomFull}</p>
          <p className="my-2 text-center font-script text-[1.7rem] text-[var(--accent)]">&amp;</p>
          <p className="text-right font-script text-[1.85rem] leading-[1.15]">{w.couple.brideFull}</p>
        </Reveal>
        <Reveal className="mt-10">
          <p className="border-l-2 border-[var(--accent)] pl-4 font-script text-lg leading-snug">{t(w.closing, lang)}</p>
        </Reveal>
      </section>

      <section aria-label={s("date", lang)} className="px-6 pb-7 pt-6" style={{ background: C("band"), color: C("band-ink") }}>
        <Reveal className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5">
          <p className="font-script text-[8.5rem] leading-[0.85] tracking-[-0.03em]">{d.day}</p>
          <div className="pt-3">
            <p className="font-script text-[1.9rem] leading-[1.05]">
              {d.month}
              <br />
              {d.year}
            </p>
            <p className="mt-2 font-sans text-sm leading-snug" style={{ color: C("band-soft") }}>
              {d.weekday}
              <br />
              {formatHijri(w.start)}
            </p>
          </div>
        </Reveal>
        <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: C("band-line") }}>
          <p className="font-sans text-[0.95rem] leading-snug">
            {formatTimeRange(w, lang)}
            {mounted && <CountLine {...ctx} />}
          </p>
          <button
            type="button"
            onClick={() => openSheet("calendar")}
            className="flex min-h-11 shrink-0 items-center gap-2 px-4 font-sans text-sm font-medium"
            style={{ background: C("band-btn"), color: C("band-btn-ink") }}
          >
            <CalendarPlus size={16} /> {s("calendar", lang)}
          </button>
        </div>
      </section>

      {sec.schedule && w.events.length > 0 && (
        <section id="aturcara" className="scroll-mt-28 px-6 pb-4 pt-10">
          <Heading>{lang === "ms" ? "Aturcara" : "Programme"}</Heading>
          <dl className="mt-4">
            {w.events.map((e) => (
              <Reveal key={e.id}>
                <div className="grid min-h-14 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 border-b border-card-line py-2">
                  <dt className="text-[var(--accent)]">
                    <span className="block font-script text-[1.45rem] leading-none">{formatClock(e.time, lang).split(" ")[0]}</span>
                    <span className="mt-1 block font-sans text-xs">{formatClock(e.time, lang).split(" ").slice(1).join(" ")}</span>
                  </dt>
                  <dd className="font-sans text-[0.95rem] leading-snug">
                    {t(e.title, lang)}
                    {e.note && t(e.note, lang) && <span className="block text-sm text-ink-soft">{t(e.note, lang)}</span>}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>
      )}

      <section id="lokasi" className="mt-8 scroll-mt-28 px-6 py-7" style={{ background: C("band"), color: C("band-ink") }}>
        <h2 className="font-script text-[2rem] leading-tight">{w.venue.name}</h2>
        <p className="mt-1 font-sans text-[0.95rem]" style={{ color: C("band-soft") }}>
          {w.venue.address}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 font-sans text-sm">
          <a href={mapsUrl(w.venue.mapQuery || `${w.venue.name} ${w.venue.address}`)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 border" style={{ borderColor: C("band-line") }}>
            <MapPin size={16} /> Google Maps
          </a>
          <a href={wazeUrl(w.venue.mapQuery || `${w.venue.name} ${w.venue.address}`)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 border" style={{ borderColor: C("band-line") }}>
            <Navigation size={16} /> Waze
          </a>
        </div>
        <button type="button" onClick={() => openSheet("map")} className="mt-2 min-h-11 font-sans text-sm underline underline-offset-4">
          {s("viewMap", lang)}
        </button>
      </section>

      {notes.length > 0 && (
        <section aria-label={s("details", lang)} className="px-6 pt-10">
          <Heading>{s("details", lang)}</Heading>
          <ol className="mt-4 grid gap-5">
            {notes.map((n, i) => (
              <Reveal key={n.title}>
                <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2">
                  <span className="font-script text-[1.6rem] leading-none text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-sans text-[0.95rem] font-medium">{n.title}</h3>
                    <p className="mt-1 font-sans text-[0.95rem] leading-relaxed text-ink-soft">{n.text}</p>
                    {n.colors && n.colors.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {n.colors.map((c) => (
                          <span key={c} className="h-6 w-6 rounded-full border border-card-line" style={{ background: c }} />
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {extras.length > 0 && (
        <div className="grid grid-cols-2 gap-2 px-6 pt-8 font-sans text-sm">
          {extras.map((a) => (
            <button key={a.id} type="button" onClick={() => openSheet(a.id)} className="min-h-12 border border-ink">
              {a.label}
            </button>
          ))}
        </div>
      )}

      {mounted && (
        <>
          {sec.story && <Story w={w} lang={lang} />}
          {sec.gallery && <Gallery w={w} lang={lang} />}
          {sec.rsvp && (
            <section id="rsvp" className="scroll-mt-28 px-6 pt-12">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <Heading>RSVP</Heading>
              </div>
              <RsvpForm w={w} lang={lang} guest={guest} skin={skin} />
            </section>
          )}
          {sec.guestbook && (
            <section id="ucapan" className="px-6 pt-14">
              <Heading>{s("guestbook", lang)}</Heading>
              <div className="mt-4">
                <Wishes lang={lang} guest={guest} skin={skin} item="border-b border-card-line pb-3 font-sans text-[0.95rem]" />
              </div>
            </section>
          )}
        </>
      )}

      <footer className="mt-14 px-6 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] pt-8" style={{ background: C("band"), color: C("band-ink") }}>
        <p className="font-script text-[2.6rem] leading-none">
          {w.couple.groomShort} &amp; {w.couple.brideShort}
        </p>
        <p className="mt-2 font-sans text-sm tabular-nums" style={{ color: C("band-soft") }}>
          {formatDateDots(w.start)} {w.couple.hashtag && `· ${w.couple.hashtag}`}
        </p>
        <div className="mt-6">
          <ShareButtons
            w={w}
            lang={lang}
            url={url}
            primary="min-h-12 font-sans text-sm font-medium [background:var(--band-btn)] [color:var(--band-btn-ink)]"
            secondary="min-h-12 border font-sans text-sm [border-color:var(--band-line)]"
          />
        </div>
      </footer>
    </main>
  );
}

/** The countdown as a line of type under the time. */
function CountLine({ w, lang }: SuiteCtx) {
  const { r, status } = useCountdown(w);
  if (status !== "before") return <span className="block opacity-80">{status === "during" ? s("happening", lang) : s("over", lang)}</span>;
  return (
    <span className="block tabular-nums opacity-80">
      {r.days} {s("days", lang).toLowerCase()} · {r.hours} {s("hours", lang).toLowerCase()} · {r.minutes} {s("minutes", lang).toLowerCase()}
    </span>
  );
}

/** /pro/majalah and /pro/zaitun: the same magazine layout in two palettes. */
export function MajalahCard({ fontClass, theme }: { fontClass: string; theme: "pro-majalah" | "pro-zaitun" }) {
  return <SuiteShell theme={theme} fontClass={fontClass} Cover={Cover} body={(ctx) => <Body {...ctx} />} music={SUITE_MUSIC} />;
}