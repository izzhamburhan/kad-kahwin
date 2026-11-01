"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, Check, Copy, Download, MapPin, MessageCircle, Navigation, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { s, t } from "@/lib/i18n";
import { asset, downloadIcs, formatDate, formatHijri, formatTimeRange, googleCalendarUrl, mapsEmbed, mapsUrl, waLink, wazeUrl } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";

type P = { w: Wedding; lang: Lang };

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* nothing to fall back to without a visible input */
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };
  return { copied, copy };
}

/** Bottom sheet that the action bar opens, the way Malaysian e-kad show contact, map and gift details. */
export function Sheet({ open, onClose, title, lang, children }: { open: boolean; onClose: () => void; title: string; lang: Lang; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="sheet" className="fixed inset-0 z-[60] flex items-end justify-center" exit={{ opacity: 1 }}>
          <motion.button
            type="button"
            aria-label={s("close", lang)}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative max-h-[86dvh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] border-t border-card-line bg-bg px-6 pb-[max(env(safe-area-inset-bottom),1.75rem)] pt-3 shadow-[0_-20px_60px_-20px_rgba(0,0,0,.45)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 340 }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-card-line" />
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-script text-[1.9rem] leading-tight text-[var(--heading)]">{title}</h3>
              <button type="button" onClick={onClose} aria-label={s("close", lang)} className="rounded-full border border-card-line p-2 text-ink-soft">
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ContactSheet({ w, lang }: P) {
  const hello = lang === "ms" ? "Assalamualaikum, saya ingin bertanya tentang majlis perkahwinan" : "Hi, I have a question about the wedding of";
  return (
    <ul className="grid gap-3">
      {w.contacts.map((c, i) => (
        <li key={c.phone + i} className="flex items-center gap-3 rounded-2xl border border-card-line bg-card px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg text-ink">{c.name}</p>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-ink-mute">{t(c.role, lang)}</p>
          </div>
          <a href={`tel:+${c.phone}`} aria-label={`${s("call", lang)} ${c.name}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-card-line text-gold">
            <Phone size={16} />
          </a>
          <a
            href={waLink(c.phone, `${hello} ${w.couple.groomShort} & ${w.couple.brideShort}.`)}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp ${c.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--on-gold)]"
            style={{ background: "var(--gold)" }}
          >
            <MessageCircle size={16} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function MapSheet({ w, lang }: P) {
  const { copied, copy } = useCopy();
  const q = w.venue.mapQuery || `${w.venue.name} ${w.venue.address}`;
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-card-line">
        <iframe title={w.venue.name} src={mapsEmbed(q)} loading="lazy" className="block h-52 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <div className="mt-4 text-center">
        <p className="font-serif text-xl text-ink">{w.venue.name}</p>
        <p className="mt-0.5 font-serif text-sm leading-relaxed text-ink-soft">{w.venue.address}</p>
        <button type="button" onClick={() => copy(`${w.venue.name}, ${w.venue.address}`, "addr")} className="mt-2 inline-flex items-center gap-1.5 font-sans text-xs text-gold">
          {copied === "addr" ? <Check size={13} /> : <Copy size={13} />}
          {copied === "addr" ? s("copied", lang) : s("copyAddress", lang)}
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <a href={mapsUrl(q)} target="_blank" rel="noreferrer" className="btn-ghost !px-3 !text-[0.72rem]">
          <MapPin size={16} /> {s("openMaps", lang)}
        </a>
        <a href={wazeUrl(q)} target="_blank" rel="noreferrer" className="btn-gold !px-3 !text-[0.72rem]">
          <Navigation size={16} /> {s("openWaze", lang)}
        </a>
      </div>
    </div>
  );
}

export function GiftSheet({ w, lang }: P) {
  const { copied, copy } = useCopy();
  const g = w.gift;
  return (
    <div className="text-center">
      {t(g.note, lang) && <p className="mx-auto max-w-xs font-serif text-base leading-relaxed text-ink-soft">{t(g.note, lang)}</p>}
      {g.qrImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(g.qrImage)} alt="DuitNow QR" className="mx-auto mt-5 w-52 rounded-2xl border border-card-line bg-white p-2.5" />
      )}
      {g.accountNo && (
        <div className="paper mx-auto mt-5 max-w-xs rounded-2xl p-5 text-paper-ink shadow-[0_14px_30px_-18px_rgba(0,0,0,.5)]">
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
    </div>
  );
}

export function CalendarSheet({ w, lang, url }: P & { url: string }) {
  return (
    <div className="text-center">
      <p className="font-serif text-xl text-ink">{formatDate(w.start, lang)}</p>
      <p className="font-serif text-sm text-ink-soft">{formatHijri(w.start)}</p>
      <p className="mt-1 font-serif text-base text-ink-soft">{formatTimeRange(w, lang)}</p>
      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <a href={googleCalendarUrl(w, lang, url)} target="_blank" rel="noreferrer" className="btn-gold !px-3 !text-[0.72rem]">
          <CalendarPlus size={16} /> Google
        </a>
        <button type="button" onClick={() => downloadIcs(w, lang, url)} className="btn-ghost !px-3 !text-[0.72rem]">
          <Download size={16} /> iPhone / .ics
        </button>
      </div>
    </div>
  );
}