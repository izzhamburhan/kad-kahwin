"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarPlus, Download, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { downloadIcs, formatClock, formatDate, formatHijri, formatTimeRange, googleCalendarUrl, mapsUrl, waLink, wazeUrl } from "@/lib/format";
import { s, t } from "@/lib/i18n";
import { Bismillah } from "../../designs/scene";
import { useCountdown } from "../../invitation/Countdown";
import { Gallery, guestNotes, Story } from "../../invitation/Details";
import { EASE, GuestLine, OpenButtons } from "../parts";
import { RsvpForm, ShareButtons, Wishes, type FormSkin } from "../suite";
import { SuiteShell, type CoverProps, type SuiteCtx } from "../SuiteShell";

// Sutera: a printed invitation suite lying on dusty-rose silk. The cover is the envelope card
// tied with a ribbon; inside, each part of the invitation is its own printed card behind an
// index tab (jemputan, aturcara, lokasi, reply card, wishes) and the guest flips between them.

/** Folds of silk behind everything. Static, so it costs nothing while scrolling. */
function Silk() {
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden>
      <rect width="390" height="844" fill="var(--bg)" />
      <path d="M-20 120C90 60 180 210 410 90V260C240 340 110 220 -20 320Z" fill="var(--bg-2)" />
      <path d="M-20 470C120 400 230 560 410 470V640C260 720 90 590 -20 690Z" fill="var(--bg-3)" />
      <path d="M-20 760C110 700 240 830 410 750V860H-20Z" fill="var(--bg-2)" />
    </svg>
  );
}

/** Two initials in an oval, framed by laurel sprigs. */
function Monogram({ a, b }: { a: string; b: string }) {
  const leaf = (cx: number, cy: number, ang: number) => {
    const c = Math.cos(ang);
    const n = Math.sin(ang);
    const p = (u: number, v: number) => `${(cx + u * c - v * n).toFixed(1)} ${(cy + u * n + v * c).toFixed(1)}`;
    return `M${p(0, 0)}Q${p(5, -4)} ${p(11, 0)}Q${p(5, 4)} ${p(0, 0)}Z`;
  };
  let sprigs = "";
  for (let i = 0; i < 9; i++) {
    const k = 1.05 + i * 0.13;
    const y = 82 - Math.cos(k) * 62;
    sprigs += leaf(66 - Math.sin(k) * 48, y, 2.2 - i * 0.14) + leaf(66 + Math.sin(k) * 48, y, 0.94 + i * 0.14);
  }
  return (
    <div className="relative mx-auto h-[8.5rem] w-[7rem]" aria-hidden>
      <svg viewBox="0 0 132 164" className="absolute inset-0 h-full w-full text-gold">
        <ellipse cx="66" cy="82" rx="62" ry="78" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="66" cy="82" rx="57" ry="73" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d={sprigs} fill="currentColor" />
      </svg>
      <span className="absolute left-[19%] top-[14%] font-script text-[3.8rem] italic leading-none text-gold">{a}</span>
      <span className="absolute left-[45%] top-[36%] font-script text-[3.8rem] italic leading-none text-ink">{b}</span>
    </div>
  );
}

/** The bow; its loops slip apart when the cover opens. */
function Bow() {
  return (
    <svg viewBox="0 0 150 96" className="h-20 w-32" aria-hidden>
      <motion.path variants={{ shut: { x: 0, opacity: 1 }, gone: { x: -30, opacity: 0 } }} d="M75 48L30 18C14 12 6 24 8 44C10 66 20 76 32 72Z" fill="var(--gold-hi)" />
      <motion.path variants={{ shut: { x: 0, opacity: 1 }, gone: { x: 30, opacity: 0 } }} d="M75 48L120 18C136 12 144 24 142 44C140 66 130 76 118 72Z" fill="var(--gold-hi)" />
      <motion.path variants={{ shut: { y: 0, opacity: 1 }, gone: { y: 30, opacity: 0 } }} d="M70 52L44 96L58 88L66 96L78 56ZM80 52L106 96L92 88L84 96L72 56Z" fill="var(--gold)" />
      <motion.rect variants={{ shut: { scale: 1, opacity: 1 }, gone: { scale: 0, opacity: 0 } }} x="64" y="36" width="22" height="26" rx="6" fill="var(--gold)" />
    </svg>
  );
}

/** Cover: the invitation card tied with a ribbon. Opening slips the bow, then lifts the card away. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  const initial = (n: string) => n.trim().charAt(0).toUpperCase();
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial="shut"
      animate="shut"
      exit="gone"
      variants={{
        shut: { y: 0 },
        gone: { y: "-104%", transition: { duration: 0.85, ease: [0.7, 0, 0.3, 1], when: "afterChildren" } },
      }}
    >
      <Silk />
      <div className="mx-auto flex h-full max-w-[480px] flex-col items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+3.75rem)]">
        <div className="relative w-[min(80vw,310px)]">
          <div className="absolute inset-0 rotate-[4deg] bg-paper-2 shadow-[0_2px_8px_rgba(71,40,47,.22)]" />
          <div className="absolute inset-0 -rotate-[3.5deg] bg-[#f8f0e6] shadow-[0_2px_8px_rgba(71,40,47,.22)]" />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="relative bg-paper px-6 pb-24 pt-7 text-center shadow-[0_6px_18px_rgba(71,40,47,.28)]"
          >
            <div className="pointer-events-none absolute inset-2.5 border border-[var(--card-line)]" />
            <Monogram a={initial(w.couple.groomShort)} b={initial(w.couple.brideShort)} />
            <p className="mt-3 font-serif text-lg italic">{t(w.title, lang)}</p>
            <h1 className="mt-1 font-script text-[clamp(2rem,9vw,2.4rem)] leading-tight">
              {w.couple.groomShort} <span className="italic text-gold">&amp;</span> {w.couple.brideShort}
            </h1>
            <p className="mt-2 font-serif text-[1.05rem]">{formatDate(w.start, lang)}</p>
          </motion.div>
          <motion.div variants={{ shut: { scaleX: 1 }, gone: { scaleX: 0, transition: { duration: 0.5, delay: 0.25 } } }} className="absolute inset-x-0 bottom-12 h-6 bg-gold" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <Bow />
          </div>
        </div>

        <div className="w-full max-w-[22rem] text-center">
          <GuestLine lang={lang} guest={guest} />
          <OpenButtons
            lang={lang}
            onOpen={onOpen}
            className="mt-4 !items-stretch"
            buttonClass="min-h-13 rounded-sm bg-gold-lo px-4 font-sans text-base text-paper"
            linkClass="self-center min-h-11 text-ink"
          />
          <span className="sr-only">{lang === "ms" ? "Lerai reben untuk membuka" : "Untie the ribbon to open"}</span>
        </div>
      </div>
    </motion.div>
  );
}

type Tab = "jemputan" | "aturcara" | "lokasi" | "rsvp" | "ucapan";

const skin: FormSkin = {
  label: "font-serif text-[1.05rem] text-ink",
  input: "h-12 w-full border-0 border-b border-gold bg-transparent font-serif text-[1.2rem] italic text-ink outline-none focus:border-b-2",
  on: "rounded-sm border border-gold bg-gold font-sans text-sm text-paper",
  off: "rounded-sm border border-gold font-sans text-sm text-ink",
  step: "flex h-11 w-11 items-center justify-center rounded-full border border-gold text-ink",
  submit: "min-h-13 w-full rounded-sm bg-gold-lo px-4 py-3.5 font-sans text-base text-paper",
  note: "font-serif text-[0.95rem] italic text-ink-soft",
  thanks: "font-script text-[2.4rem] italic leading-tight text-gold",
};

const Rule = () => (
  <svg viewBox="0 0 160 14" className="mx-auto my-5 h-3.5 w-40 text-gold" aria-hidden>
    <path d="M0 7H66M94 7H160" stroke="currentColor" strokeWidth="0.8" />
    <path d="M80 1L86 7L80 13L74 7Z" fill="currentColor" />
  </svg>
);

function Countdown({ w, lang }: SuiteCtx) {
  const { r, status } = useCountdown(w);
  if (status !== "before") return <p className="font-serif italic">{status === "during" ? s("happening", lang) : s("over", lang)}</p>;
  return (
    <p className="font-serif text-[1.05rem] italic text-ink-soft">
      {lang === "ms" ? `Lagi ${r.days} hari ${r.hours} jam` : `${r.days} days ${r.hours} hours to go`}
    </p>
  );
}

function Body(ctx: SuiteCtx) {
  const { w, lang, guest, url, mounted, openSheet, controls } = ctx;
  const sec = w.sections;
  const [tab, setTab] = useState<Tab>("jemputan");
  const tabs = [
    { id: "jemputan" as const, label: s("invitation", lang) },
    { id: "aturcara" as const, label: lang === "ms" ? "Aturcara" : "Programme" },
    { id: "lokasi" as const, label: s("venue", lang) },
    sec.rsvp && { id: "rsvp" as const, label: "RSVP" },
    sec.guestbook && { id: "ucapan" as const, label: lang === "ms" ? "Ucapan" : "Wishes" },
  ].filter(Boolean) as { id: Tab; label: string }[];
  const at = tabs.findIndex((x) => x.id === tab);
  const next = tabs[(at + 1) % tabs.length];
  const go = (id: Tab) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: ctx.reduced ? "auto" : "smooth" });
  };
  const q = w.venue.mapQuery || `${w.venue.name} ${w.venue.address}`;
  const hello = lang === "ms" ? "Assalamualaikum, saya ingin bertanya tentang majlis perkahwinan" : "Hi, I have a question about the wedding of";

  return (
    <div className="relative isolate mx-auto min-h-dvh max-w-[480px] overflow-x-clip text-ink">
      <Silk />
      <header className="sticky top-0 z-30 bg-bg px-3 pt-[max(env(safe-area-inset-top),0.6rem)] shadow-[0_6px_10px_-8px_rgba(71,40,47,.35)]">
        <div className="pointer-events-none flex items-center justify-between px-1">{controls}</div>
        <div role="tablist" aria-label={lang === "ms" ? "Kad" : "Cards"} className="mt-2 grid items-end gap-[3px]" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
          {tabs.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={tab === x.id}
              onClick={() => go(x.id)}
              className={`rounded-t-md px-1 font-sans text-[0.8rem] transition-[height,background] ${tab === x.id ? "h-12 bg-paper text-ink" : "h-11 bg-paper-2 text-ink-soft"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative px-3 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <div className="pointer-events-none absolute inset-x-5 bottom-6 top-3 bg-paper-2 shadow-[0_2px_8px_rgba(71,40,47,.22)]" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={tab}
            role="tabpanel"
            aria-label={tabs[at]?.label}
            initial={{ opacity: 0, y: 26, rotate: -1.2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -14, rotate: 1.2 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative bg-paper px-7 pb-8 pt-9 text-center shadow-[0_6px_18px_rgba(71,40,47,.28)]"
          >
            <div className="pointer-events-none absolute inset-2.5 border border-[var(--card-line)]" />

            {tab === "jemputan" && (
              <>
                <Bismillah className="text-[1.5rem] text-gold" />
                <p className="mt-1 font-serif text-lg italic">{s("salam", lang)}</p>
                <p className="mt-6 font-serif text-[1.2rem] font-medium leading-snug">{w.hosts}</p>
                <p className="mt-3 font-serif text-[1.1rem] leading-[1.45]">{t(w.message, lang)}</p>
                <h2 className="mt-7 font-script text-[1.7rem] italic leading-[1.15]">{w.couple.groomFull}</h2>
                <p className="my-1.5 font-serif text-lg text-gold">{lang === "ms" ? "dengan" : "and"}</p>
                <p className="font-script text-[1.7rem] italic leading-[1.15]">{w.couple.brideFull}</p>
                <Rule />
                <p className="font-serif text-[1.25rem]">{formatDate(w.start, lang)}</p>
                <p className="font-serif text-base text-ink-soft">{formatHijri(w.start)}</p>
                <p className="mt-2 font-serif text-[1.1rem]">{formatTimeRange(w, lang)}</p>
                <p className="mt-3 font-serif text-[1.25rem] font-medium">{w.venue.name}</p>
                <p className="font-serif text-base text-ink-soft">{w.venue.address}</p>
                <p className="mx-auto mt-7 max-w-[19rem] font-serif text-[1.05rem] italic text-ink-soft">{t(w.closing, lang)}</p>
                {mounted && (
                  <div className="mt-4">
                    <Countdown {...ctx} />
                  </div>
                )}
              </>
            )}

            {tab === "aturcara" && (
              <>
                <h2 className="font-script text-[2.3rem] italic leading-tight text-gold">{s("schedule", lang)}</h2>
                <p className="mt-1 font-serif text-base text-ink-soft">{formatDate(w.start, lang)}</p>
                <ol className="mt-6 text-left">
                  {w.events.map((e) => (
                    <li key={e.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-b border-[var(--card-line)] py-3 last:border-0">
                      <span className="font-serif text-[1.05rem] italic text-gold">{formatClock(e.time, lang)}</span>
                      <span className="font-serif text-[1.1rem] leading-snug">
                        {t(e.title, lang)}
                        {e.note && t(e.note, lang) && <span className="block text-base text-ink-soft">{t(e.note, lang)}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
                {guestNotes(w, lang).map((n) => (
                  <div key={n.title} className="mt-6">
                    <Rule />
                    <h3 className="font-serif text-[1.15rem] font-medium">{n.title}</h3>
                    <p className="mt-1 font-serif text-[1.05rem] leading-relaxed text-ink-soft">{n.text}</p>
                    {n.colors && n.colors.length > 0 && (
                      <div className="mt-3 flex justify-center gap-2">
                        {n.colors.map((c) => (
                          <span key={c} className="h-6 w-6 rounded-full border border-[var(--card-line)]" style={{ background: c }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {mounted && sec.story && <Story w={w} lang={lang} />}
                {mounted && sec.gallery && <Gallery w={w} lang={lang} />}
              </>
            )}

            {tab === "lokasi" && (
              <>
                <h2 className="font-script text-[2.3rem] italic leading-tight text-gold">{s("location", lang)}</h2>
                <p className="mt-4 font-serif text-[1.35rem] font-medium">{w.venue.name}</p>
                <p className="font-serif text-[1.05rem] text-ink-soft">{w.venue.address}</p>
                <div className="mt-5 grid grid-cols-2 gap-2 font-sans text-sm">
                  <a href={mapsUrl(q)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-sm border border-gold">
                    <MapPin size={16} /> Google Maps
                  </a>
                  <a href={wazeUrl(q)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-sm border border-gold">
                    <Navigation size={16} /> Waze
                  </a>
                </div>
                <button type="button" onClick={() => openSheet("map")} className="mt-2 min-h-11 font-serif text-base italic underline underline-offset-4">
                  {s("viewMap", lang)}
                </button>

                <Rule />
                <p className="font-serif text-[1.15rem]">{formatDate(w.start, lang)}</p>
                <p className="font-serif text-base text-ink-soft">{formatTimeRange(w, lang)}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 font-sans text-sm">
                  <a href={googleCalendarUrl(w, lang, url)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-sm bg-gold text-paper">
                    <CalendarPlus size={16} /> Google
                  </a>
                  <button type="button" onClick={() => downloadIcs(w, lang, url)} className="flex min-h-12 items-center justify-center gap-2 rounded-sm border border-gold">
                    <Download size={16} /> iPhone / .ics
                  </button>
                </div>

                {sec.contacts && w.contacts.length > 0 && (
                  <>
                    <Rule />
                    <h3 className="font-serif text-[1.15rem] font-medium">{s("contact", lang)}</h3>
                    <ul className="mt-3 grid gap-2 text-left">
                      {w.contacts.map((c, i) => (
                        <li key={c.phone + i} className="flex items-center gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-serif text-[1.1rem]">{c.name}</p>
                            <p className="font-serif text-sm text-ink-soft">{t(c.role, lang)}</p>
                          </div>
                          <a href={`tel:+${c.phone}`} aria-label={`${s("call", lang)} ${c.name}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-gold text-gold">
                            <Phone size={16} />
                          </a>
                          <a
                            href={waLink(c.phone, `${hello} ${w.couple.groomShort} & ${w.couple.brideShort}.`)}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`WhatsApp ${c.name}`}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-paper"
                          >
                            <MessageCircle size={16} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {sec.gift && (w.gift.accountNo || w.gift.qrImage) && (
                  <button type="button" onClick={() => openSheet("gift")} className="mt-6 min-h-12 w-full rounded-sm border border-gold font-sans text-sm">
                    {s("gift", lang)}
                  </button>
                )}
              </>
            )}

            {tab === "rsvp" && mounted && (
              <div className="text-left">
                <h2 className="text-center font-script text-[2.3rem] italic leading-tight text-gold">{lang === "ms" ? "Kad Jawapan" : "Reply Card"}</h2>
                <div className="mt-5">
                  <RsvpForm w={w} lang={lang} guest={guest} skin={skin} radios />
                </div>
              </div>
            )}

            {tab === "ucapan" && mounted && (
              <div className="text-left">
                <h2 className="text-center font-script text-[2.3rem] italic leading-tight text-gold">{s("guestbook", lang)}</h2>
                <div className="mt-5">
                  <Wishes lang={lang} guest={guest} skin={skin} item="border-b border-[var(--card-line)] pb-3 font-serif text-[1.1rem]" />
                </div>
                <Rule />
                <ShareButtons w={w} lang={lang} url={url} primary="min-h-12 rounded-sm bg-gold font-sans text-sm text-paper" secondary="min-h-12 rounded-sm border border-gold font-sans text-sm" />
                <p className="mt-8 text-center font-script text-[2rem] italic text-gold">{s("thankYou", lang)}</p>
                <p className="text-center font-serif text-lg">
                  {w.couple.groomShort} &amp; {w.couple.brideShort}
                </p>
              </div>
            )}

            {tabs.length > 1 && next.id !== tab && (
              <button type="button" onClick={() => go(next.id)} className="relative mt-8 inline-flex min-h-11 items-center gap-2 font-sans text-sm text-gold">
                {next.label} <ArrowRight size={16} />
              </button>
            )}
          </motion.article>
        </AnimatePresence>
      </main>
    </div>
  );
}

/** /pro/sutera: a printed invitation suite on dusty-rose silk, one card per tab. */
export function SuteraCard({ fontClass }: { fontClass: string }) {
  return <SuiteShell theme="pro-sutera" fontClass={fontClass} Cover={Cover} body={(ctx) => <Body {...ctx} />} />;
}