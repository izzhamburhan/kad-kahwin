"use client";

import { AnimatePresence, motion } from "motion/react";
import { Car, Check, Copy, Gift as GiftIcon, Link2, MapPin, MessageCircle, Navigation, Shirt, Utensils, X } from "lucide-react";
import { useState } from "react";
import { s, t } from "@/lib/i18n";
import { asset, formatClock, formatDate, formatHijri, formatTimeRange, mapsEmbed, mapsUrl, waLink, wazeUrl } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";
import { FloralCorner, Hibiscus } from "../ornaments";
import { Panel, Reveal, Section } from "./Section";

type P = { w: Wedding; lang: Lang };

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key = text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* older browsers: nothing to fall back to without a visible input */
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };
  return { copied, copy };
}

/* ---------------- Jemputan ---------------- */

export function Invitation({ w, lang }: P) {
  return (
    <Section id="jemputan" eyebrow={s("invitation", lang)}>
      <Reveal className="text-center">
        <p className="label text-ink-soft">{s("hosts", lang)}</p>
        <p className="mt-3 font-serif text-2xl text-ink">{w.hosts}</p>
        <p className="mx-auto mt-6 max-w-[22rem] font-serif text-lg leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 text-center">
        <p className="font-serif text-2xl font-medium uppercase leading-snug tracking-wide text-ink">{w.couple.groomFull}</p>
        <Hibiscus size={44} className="mx-auto my-4 text-gold" />
        <p className="font-serif text-2xl font-medium uppercase leading-snug tracking-wide text-ink">{w.couple.brideFull}</p>
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <Panel className="overflow-hidden text-center">
          <FloralCorner className="pointer-events-none absolute -right-8 -top-8 w-28 text-gold opacity-25" flip />
          <div className="grid gap-5">
            <div>
              <p className="label text-gold">{s("date", lang)}</p>
              <p className="mt-1.5 font-serif text-xl text-ink">{formatDate(w.start, lang)}</p>
              <p className="font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
            </div>
            <div className="mx-auto h-px w-16 bg-card-line" />
            <div>
              <p className="label text-gold">{s("time", lang)}</p>
              <p className="mt-1.5 font-serif text-xl text-ink">{formatTimeRange(w, lang)}</p>
            </div>
            <div className="mx-auto h-px w-16 bg-card-line" />
            <div>
              <p className="label text-gold">{s("venue", lang)}</p>
              <p className="mt-1.5 font-serif text-xl text-ink">{w.venue.name}</p>
              <p className="font-serif text-sm text-ink-soft">{w.venue.address}</p>
            </div>
          </div>
        </Panel>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 text-center">
        <p className="mx-auto max-w-[20rem] font-serif text-base italic text-ink-soft">{t(w.closing, lang)}</p>
      </Reveal>
    </Section>
  );
}

/* ---------------- Kisah kami ---------------- */

export function Story({ w, lang }: P) {
  const items = w.story.filter((x) => t(x.title, lang) || t(x.text, lang));
  if (!items.length) return null;
  return (
    <Section id="kisah" eyebrow={s("story", lang)} title={s("story", lang)}>
      <ol className="relative mx-auto max-w-sm border-l border-card-line pl-7">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 0.08} className="relative mb-10 last:mb-0">
            <span className="absolute -left-[37px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-gold bg-bg">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            {it.year && <p className="label text-gold">{it.year}</p>}
            <h3 className="mt-1 font-serif text-xl text-ink">{t(it.title, lang)}</h3>
            {t(it.text, lang) && <p className="mt-1.5 font-serif text-base leading-relaxed text-ink-soft">{t(it.text, lang)}</p>}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- Galeri ---------------- */

export function Gallery({ w, lang }: P) {
  const [open, setOpen] = useState<number | null>(null);
  const photos = w.gallery.filter((p) => p.src);
  if (!photos.length) return null;
  return (
    <Section id="galeri" eyebrow={s("gallery", lang)} title={s("gallery", lang)}>
      <div className="grid grid-cols-2 gap-2.5">
        {photos.map((p, i) => (
          <Reveal key={p.src + i} delay={(i % 4) * 0.06} className={i % 3 === 0 ? "col-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-[18px] border border-card-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(p.src)}
                alt={p.caption || ""}
                loading="lazy"
                className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i % 3 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"}`}
              />
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="max-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(photos[open].src)} alt={photos[open].caption || ""} className="max-h-[80dvh] rounded-xl object-contain" />
              {photos[open].caption && (
                <figcaption className="mt-3 text-center font-serif italic text-white/80">{photos[open].caption}</figcaption>
              )}
            </motion.figure>
            <button type="button" aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* ---------------- Aturcara ---------------- */

export function Schedule({ w, lang }: P) {
  if (!w.events.length) return null;
  return (
    <Section id="aturcara" eyebrow={s("schedule", lang)} title={s("schedule", lang)}>
      <Panel>
        <ol>
          {w.events.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.07}>
              <li className="flex gap-5 border-b border-card-line py-4 last:border-0">
                <span className="w-[4.5rem] shrink-0 text-right text-gold">
                  <span className="block font-sans text-base tracking-wide">{formatClock(e.time, lang).split(" ")[0]}</span>
                  <span className="block font-sans text-[0.6rem] uppercase tracking-[0.18em] text-ink-mute">
                    {formatClock(e.time, lang).split(" ").slice(1).join(" ")}
                  </span>
                </span>
                <span className="relative flex-1 pl-5 font-serif text-lg leading-snug text-ink">
                  <span className="absolute left-0 top-2.5 h-1.5 w-1.5 rotate-45 bg-gold" />
                  {t(e.title, lang)}
                  {e.note && t(e.note, lang) && <span className="mt-0.5 block text-sm text-ink-soft">{t(e.note, lang)}</span>}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Panel>
    </Section>
  );
}

/* ---------------- Lokasi ---------------- */

export function Location({ w, lang }: P) {
  const q = w.venue.mapQuery || `${w.venue.name} ${w.venue.address}`;
  return (
    <Section id="lokasi" eyebrow={s("venue", lang)} title={s("location", lang)}>
      <Reveal>
        <Panel className="!p-0 overflow-hidden">
          <iframe
            title={w.venue.name}
            src={mapsEmbed(q)}
            loading="lazy"
            className="block h-60 w-full border-0 grayscale-[35%]"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="p-6 text-center">
            <MapPin className="mx-auto text-gold" size={22} />
            <p className="mt-2 font-serif text-xl text-ink">{w.venue.name}</p>
            <p className="font-serif text-sm text-ink-soft">{w.venue.address}</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <a href={mapsUrl(q)} target="_blank" rel="noreferrer" className="btn-ghost !px-3 !text-[0.7rem]">
                <MapPin size={16} /> {s("openMaps", lang)}
              </a>
              <a href={wazeUrl(q)} target="_blank" rel="noreferrer" className="btn-ghost !px-3 !text-[0.7rem]">
                <Navigation size={16} /> {s("openWaze", lang)}
              </a>
            </div>
          </div>
        </Panel>
      </Reveal>
    </Section>
  );
}

/* ---------------- Maklumat tetamu ---------------- */

export function GuestNotes({ w, lang }: P) {
  const items = [
    w.sections.dressCode && t(w.dressCode.text, lang) && {
      icon: Shirt,
      title: s("dressCode", lang),
      text: t(w.dressCode.text, lang),
      colors: w.dressCode.colors,
    },
    w.sections.parking && t(w.parking, lang) && { icon: Car, title: s("parking", lang), text: t(w.parking, lang) },
    w.sections.food && t(w.food, lang) && { icon: Utensils, title: s("food", lang), text: t(w.food, lang) },
  ].filter(Boolean) as { icon: typeof Car; title: string; text: string; colors?: string[] }[];
  if (!items.length) return null;

  return (
    <Section id="info" eyebrow={s("details", lang)} title={s("details", lang)}>
      <div className="grid gap-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.08}>
            <Panel className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-card-line text-gold">
                <it.icon size={19} />
              </span>
              <div>
                <h3 className="font-serif text-lg text-ink">{it.title}</h3>
                <p className="mt-1 font-serif text-base leading-relaxed text-ink-soft">{it.text}</p>
                {it.colors && it.colors.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {it.colors.map((c) => (
                      <span key={c} className="h-7 w-7 rounded-full border border-white/20 shadow-inner" style={{ background: c }} />
                    ))}
                  </div>
                )}
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Salam kaut ---------------- */

export function Gift({ w, lang }: P) {
  const { copied, copy } = useCopy();
  const g = w.gift;
  if (!g.accountNo && !g.qrImage) return null;
  return (
    <Section id="hadiah" eyebrow={s("gift", lang)} title={s("gift", lang)}>
      <Reveal>
        <Panel className="text-center">
          <GiftIcon className="mx-auto text-gold" size={24} />
          <p className="mx-auto mt-3 max-w-xs font-serif text-base leading-relaxed text-ink-soft">{t(g.note, lang)}</p>
          {g.accountNo && (
            <div className="paper mx-auto mt-6 max-w-xs rounded-2xl p-5 text-paper-ink">
              <p className="label text-[0.6rem]" style={{ color: "var(--gold-lo)" }}>
                {g.bank}
              </p>
              <p className="mt-2 font-sans text-xl tracking-[0.12em]">{g.accountNo}</p>
              <p className="mt-1 font-serif text-sm">{g.accountName}</p>
              <button
                type="button"
                onClick={() => copy(g.accountNo.replace(/\s/g, ""), "acc")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-sans text-xs uppercase tracking-widest"
                style={{ borderColor: "var(--gold)", color: "var(--gold-lo)" }}
              >
                {copied === "acc" ? <Check size={14} /> : <Copy size={14} />}
                {copied === "acc" ? s("copied", lang) : s("copy", lang)}
              </button>
            </div>
          )}
          {g.qrImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(g.qrImage)} alt="DuitNow QR" className="mx-auto mt-6 w-48 rounded-xl bg-white p-2" />
          )}
        </Panel>
      </Reveal>
    </Section>
  );
}

/* ---------------- Hubungi ---------------- */

export function Contacts({ w, lang }: P) {
  if (!w.contacts.length) return null;
  const hello = lang === "ms" ? "Assalamualaikum, saya ingin bertanya tentang majlis perkahwinan" : "Hi, I have a question about the wedding of";
  return (
    <Section id="hubungi" eyebrow={s("contact", lang)} title={s("contact", lang)}>
      <div className="grid gap-3">
        {w.contacts.map((c, i) => (
          <Reveal key={c.phone + i} delay={i * 0.06}>
            <Panel className="flex items-center gap-4 !py-4">
              <div className="flex-1">
                <p className="font-serif text-lg text-ink">{c.name}</p>
                <p className="font-sans text-xs uppercase tracking-widest text-ink-soft">{t(c.role, lang)}</p>
              </div>
              <a
                href={waLink(c.phone, `${hello} ${w.couple.groomShort} & ${w.couple.brideShort}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-gold !px-4 !py-2.5 !text-[0.7rem]"
                aria-label={`WhatsApp ${c.name}`}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Penutup ---------------- */

export function Footer({ w, lang, url }: P & { url: string }) {
  const { copied, copy } = useCopy();
  const shareText = `${s("shareText", lang)}\n\n${w.title[lang]} ${w.couple.groomShort} & ${w.couple.brideShort}\n${formatDate(w.start, lang)}\n${w.venue.name}\n\n${url}`;
  return (
    <footer className="songket-bg relative overflow-hidden px-6 pb-36 pt-20 text-center">
      <Reveal>
        <p className="label text-gold">{s("share", lang)}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="btn-gold">
            <MessageCircle size={16} /> WhatsApp
          </a>
          <button type="button" onClick={() => copy(url, "link")} className="btn-ghost">
            {copied === "link" ? <Check size={16} /> : <Link2 size={16} />}
            {copied === "link" ? s("linkCopied", lang) : s("copyLink", lang)}
          </button>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="mt-16">
        <Hibiscus size={40} className="mx-auto text-gold" />
        <p className="foil mt-4 font-script text-5xl">{s("thankYou", lang)}</p>
        <p className="mt-3 font-serif text-lg text-ink">
          {w.couple.groomShort} & {w.couple.brideShort}
        </p>
        {w.couple.hashtag && <p className="label mt-3 text-gold">{w.couple.hashtag}</p>}
      </Reveal>
    </footer>
  );
}