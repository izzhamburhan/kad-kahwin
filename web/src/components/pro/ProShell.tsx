"use client";

import { CalendarCheck, CalendarDays, Gift as GiftIcon, MapPin, Phone } from "lucide-react";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { formatDate, formatHijri, formatTimeRange } from "@/lib/format";
import { s, t } from "@/lib/i18n";
import { Bismillah } from "../designs/scene";
import { Countdown } from "../invitation/Countdown";
import { Footer, Gallery, GuestNotes, Schedule, Story } from "../invitation/Details";
import { Guestbook } from "../invitation/Guestbook";
import { Rsvp } from "../invitation/Rsvp";
import { Reveal } from "../invitation/Section";
import { SuiteShell, type CoverProps, type ProCtx, type SheetId, type SuiteCtx } from "./SuiteShell";

export type { CoverProps, ProCtx } from "./SuiteShell";

type CardStyle = {
  Hero: ComponentType<ProCtx>;
  ornament: ReactNode;
  backdrop?: ReactNode;
  cardClass: string;
  cardStyle?: CSSProperties;
  fullNameClass: string;
};

/** The calm vertical card shared by the original pro designs, with its fixed action bar. */
function CardBody({ Hero, ornament, backdrop, cardClass, cardStyle, fullNameClass, ...ctx }: SuiteCtx & CardStyle) {
  const { w, lang, guest, url, mounted, openSheet, controls } = ctx;
  const sec = w.sections;
  const actions = [
    sec.rsvp && { id: "rsvp", icon: CalendarCheck, label: "RSVP" },
    sec.gift && (w.gift.accountNo || w.gift.qrImage) && { id: "gift", icon: GiftIcon, label: s("gift", lang) },
    sec.contacts && w.contacts.length > 0 && { id: "contact", icon: Phone, label: s("navContact", lang) },
    { id: "map", icon: MapPin, label: s("navMap", lang) },
    { id: "calendar", icon: CalendarDays, label: s("calendar", lang) },
  ].filter(Boolean) as { id: SheetId | "rsvp"; icon: typeof Phone; label: string }[];

  const act = (id: SheetId | "rsvp") => {
    if (id === "rsvp") document.getElementById("rsvp")?.scrollIntoView({ behavior: ctx.reduced ? "auto" : "smooth" });
    else openSheet(id);
  };

  const details = [
    { k: s("date", lang), v: formatDate(w.start, lang), sub: formatHijri(w.start) },
    { k: s("time", lang), v: formatTimeRange(w, lang) },
    { k: s("venue", lang), v: w.venue.name, sub: w.venue.address },
  ];

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)]">
        {controls}
      </div>

      <main className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip bg-bg shadow-[0_0_80px_rgba(0,0,0,.18)]">
        {backdrop}
        <Hero w={w} lang={lang} guest={guest} reduced={ctx.reduced} opened={ctx.opened} />

        <section id="jemputan" className="relative px-5 pb-6 pt-10">
          <div className={`relative px-6 py-12 text-center ${cardClass}`} style={cardStyle}>
            <Reveal>
              <Bismillah className="text-[var(--heading)]" />
              <p className="mt-4 font-sans text-[0.7rem] uppercase tracking-[0.28em] text-ink-soft">{s("salam", lang)}</p>
            </Reveal>
            <Reveal delay={0.05} className="mt-8">
              <p className="font-serif text-[1.05rem] font-medium uppercase leading-relaxed tracking-[0.08em] text-ink">{w.hosts}</p>
              <p className="mx-auto mt-5 max-w-[22rem] font-serif text-[1.08rem] leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
            </Reveal>
            <Reveal delay={0.05} className="mt-9">
              <p className={fullNameClass}>{w.couple.groomFull}</p>
              <div className="my-3 flex justify-center">{ornament}</div>
              <p className={fullNameClass}>{w.couple.brideFull}</p>
            </Reveal>
            <Reveal delay={0.05} className="mt-10 grid gap-6">
              {details.map((d) => (
                <div key={d.k}>
                  <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-gold">{d.k}</p>
                  <p className="mt-1.5 font-serif text-xl leading-snug text-ink">{d.v}</p>
                  {d.sub && <p className="font-serif text-sm text-ink-soft">{d.sub}</p>}
                </div>
              ))}
              <button type="button" onClick={() => openSheet("map")} className="btn-ghost mx-auto !py-2.5 !text-[0.7rem]">
                <MapPin size={15} /> {s("viewMap", lang)}
              </button>
            </Reveal>
            <Reveal delay={0.05} className="mt-10">
              <p className="mx-auto max-w-[20rem] font-serif text-base italic leading-relaxed text-ink-soft">{t(w.closing, lang)}</p>
            </Reveal>
          </div>
        </section>

        {mounted && (
          <>
            <Countdown w={w} lang={lang} url={url} />
            {sec.schedule && <Schedule w={w} lang={lang} />}
            <GuestNotes w={w} lang={lang} />
            {sec.story && <Story w={w} lang={lang} />}
            {sec.gallery && <Gallery w={w} lang={lang} />}
            {sec.rsvp && <Rsvp w={w} lang={lang} guest={guest} />}
            {sec.guestbook && <Guestbook lang={lang} guest={guest} />}
            <Footer w={w} lang={lang} url={url} />
          </>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px]" aria-label="Tindakan">
        <ul className="safe-bottom flex justify-around border-t border-card-line bg-bg/90 px-1 pt-1.5 shadow-[0_-10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur-xl">
          {actions.map((a) => (
            <li key={a.id} className="flex-1">
              <button
                type="button"
                onClick={() => act(a.id)}
                className="flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-ink-soft transition hover:text-gold active:scale-95"
              >
                <a.icon size={19} strokeWidth={1.6} />
                <span className="font-sans text-[0.62rem]">{a.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/**
 * The "professional" e-kad pattern used across the Malaysian market: a cover the guest
 * taps open (music starts), one calm vertical card with soft fade-ins, and a fixed
 * action bar whose buttons open sheets for RSVP, salam kaut, contacts, map and calendar.
 * A card template only brings its cover, its hero, an ornament and the panel style.
 */
export function ProShell({
  theme,
  fontClass,
  Cover,
  Hero,
  ornament,
  backdrop,
  cardClass = "",
  cardStyle,
  fullNameClass = "font-script text-[2rem] leading-snug text-[var(--heading)]",
  music,
}: {
  theme: string;
  fontClass: string;
  Cover: ComponentType<CoverProps>;
  Hero: ComponentType<ProCtx>;
  /** Small divider between the names and around headings. */
  ornament: ReactNode;
  /** Decoration laid behind the whole card column (patterns, edge florals). */
  backdrop?: ReactNode;
  cardClass?: string;
  cardStyle?: CSSProperties;
  /** How the couple's full names are set. Script faces with tight spacing want serif capitals instead. */
  fullNameClass?: string;
  music?: string;
}) {
  const style: CardStyle = { Hero, ornament, backdrop, cardClass, cardStyle, fullNameClass };
  return <SuiteShell theme={theme} fontClass={fontClass} Cover={Cover} body={(ctx) => <CardBody {...ctx} {...style} />} music={music} />;
}
