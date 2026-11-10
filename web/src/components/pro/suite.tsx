"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Link2, MessageCircle, Minus, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { asset, formatDateShort } from "@/lib/format";
import { s } from "@/lib/i18n";
import type { Lang, Wedding } from "@/lib/types";
import { useCopy } from "@/lib/useCopy";
import { shareText } from "../invitation/Details";
import { timeAgoLabel, useGuestbook } from "../invitation/Guestbook";
import { useRsvp } from "../invitation/useRsvp";

/** Music for the suite cards (Sutera, Majalah, Zaitun, Bingkai, Cincin). */
export const SUITE_MUSIC = "audio/bagaikan-sakti.mp3";

// Working parts for the cards built on SuiteShell. Each takes a "skin" of class names, so the
// same form can be an underlined editorial form on one card and a pill form on another.

/** Class names for the form controls; every card supplies its own. */
export type FormSkin = {
  /** Small caption above a field. */
  label: string;
  input: string;
  /** A selected and an unselected choice button. */
  on: string;
  off: string;
  /** The round +/- buttons. */
  step: string;
  submit: string;
  /** Notes and fine print. */
  note: string;
  /** The thank-you line after sending. */
  thanks: string;
};

export function RsvpForm({ w, lang, guest, skin, radios = false }: { w: Wedding; lang: Lang; guest: string; skin: FormSkin; radios?: boolean }) {
  const { max, form, set, state, error, sent, closed, submit, another, whatsapp, isDemo } = useRsvp(w, lang, guest);

  if (sent)
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} role="status" className="text-center">
        <p className={skin.thanks}>{s("thanks", lang)}</p>
        <p className="mt-2 text-xl">{sent.name}</p>
        <p className={`mt-2 ${skin.note}`}>
          {sent.attending ? `${s("seeYou", lang)} (${sent.pax} ${s("pax", lang).toLowerCase()})` : s("missYou", lang)}
        </p>
        {state !== "done" && <p className={`mt-3 ${skin.note}`}>{s("alreadyReplied", lang)}</p>}
        <button type="button" onClick={another} className={`mt-3 min-h-11 underline underline-offset-4 ${skin.note}`}>
          {s("anotherReply", lang)}
        </button>
        {isDemo && (
          <div className="mt-4 text-left">
            <p className={skin.note}>{s("demoNote", lang)}</p>
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" className={`mt-3 flex items-center justify-center gap-2 ${skin.submit}`}>
                <MessageCircle size={16} /> {s("sendWhatsapp", lang)}
              </a>
            )}
          </div>
        )}
      </motion.div>
    );

  if (closed) return <p className={`text-center ${skin.note}`}>{s("rsvpClosed", lang)}</p>;

  const choices = [
    { v: true, label: radios ? (lang === "ms" ? "Dengan sukacita hadir" : "Joyfully attending") : s("attending", lang) },
    { v: false, label: radios ? (lang === "ms" ? "Dukacita tidak dapat hadir" : "Regretfully unable to attend") : s("notAttending", lang) },
  ];

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {w.rsvp.deadline && (
        <p className={skin.note}>
          {s("rsvpBy", lang)} {formatDateShort(`${w.rsvp.deadline}T12:00:00+08:00`, lang)}
        </p>
      )}

      {radios ? (
        <fieldset className="grid">
          <legend className={skin.label}>{lang === "ms" ? "Jawapan" : "Reply"}</legend>
          {choices.map((c) => (
            <label key={String(c.v)} className="flex min-h-12 items-center gap-3 text-[1.15rem]">
              <input
                type="radio"
                name="attending"
                checked={form.attending === c.v}
                onChange={() => set("attending", c.v)}
                className="h-5 w-5 shrink-0 accent-[var(--gold)]"
              />
              {c.label}
            </label>
          ))}
        </fieldset>
      ) : (
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={s("rsvp", lang)}>
          {choices.map((c) => (
            <button
              key={String(c.v)}
              type="button"
              role="radio"
              aria-checked={form.attending === c.v}
              onClick={() => set("attending", c.v)}
              className={`min-h-12 ${form.attending === c.v ? skin.on : skin.off}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <label className="grid gap-1">
        <span className={skin.label}>{s("name", lang)}</span>
        <input className={skin.input} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" maxLength={120} required />
      </label>
      <label className="grid gap-1">
        <span className={skin.label}>{s("phone", lang)}</span>
        <input
          className={skin.input}
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="012-345 6789"
          required
        />
      </label>

      <AnimatePresence initial={false}>
        {form.attending && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid gap-4 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <span className={skin.label}>
                {s("pax", lang)} <span className="opacity-80">({s("paxLimit", lang).toLowerCase()} {max})</span>
              </span>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Kurang" disabled={form.pax <= 1} onClick={() => set("pax", Math.max(1, form.pax - 1))} className={`${skin.step} disabled:opacity-30`}>
                  <Minus size={16} />
                </button>
                <span className="w-9 text-center text-2xl tabular-nums">{form.pax}</span>
                <button type="button" aria-label="Tambah" disabled={form.pax >= max} onClick={() => set("pax", Math.min(max, form.pax + 1))} className={`${skin.step} disabled:opacity-30`}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <label className="grid gap-1">
              <span className={skin.label}>{s("dietary", lang)}</span>
              <input className={skin.input} value={form.dietary} onChange={(e) => set("dietary", e.target.value)} placeholder={s("dietaryHint", lang)} maxLength={300} />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <label className="grid gap-1">
        <span className={skin.label}>{s("message", lang)}</span>
        <textarea className={`${skin.input} min-h-24 resize-none py-2`} value={form.message} onChange={(e) => set("message", e.target.value)} maxLength={1000} />
      </label>

      {error && (
        <p role="alert" className={`${skin.note} rounded-md bg-red-600/10 px-3 py-2 text-red-900`}>
          {error}
        </p>
      )}

      <button type="submit" className={skin.submit} disabled={state === "sending"}>
        {state === "sending" ? s("sending", lang) : s("submit", lang)}
      </button>
      {isDemo && <p className={skin.note}>{s("demoNote", lang)}</p>}
    </form>
  );
}

/** Guestbook: post a wish, then the wishes so far. `item` styles each wish. */
export function Wishes({ lang, guest, skin, item }: { lang: Lang; guest: string; skin: FormSkin; item: string }) {
  const { wishes, name, setName, message, setMessage, error, post, canPost } = useGuestbook(lang, guest);
  return (
    <div>
      <form onSubmit={post} className="grid gap-3">
        <label className="grid gap-1">
          <span className={skin.label}>{s("name", lang)}</span>
          <input className={skin.input} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        </label>
        <label className="grid gap-1">
          <span className={skin.label}>{s("writeWish", lang)}</span>
          <textarea className={`${skin.input} min-h-24 resize-none py-2`} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
        </label>
        {error && <p className={skin.note}>{error}</p>}
        <button type="submit" className={`${skin.submit} disabled:opacity-50`} disabled={!canPost}>
          {s("postWish", lang)}
        </button>
      </form>
      <div className="mt-6 max-h-[26rem] overflow-y-auto pr-1 [scrollbar-width:thin]">
        {wishes.length === 0 ? (
          <p className={`py-4 text-center ${skin.note}`}>{s("noWishes", lang)}</p>
        ) : (
          <ul className="grid gap-3">
            {wishes.map((x) => (
              <li key={x.id} className={item}>
                <p className="leading-relaxed">{x.message}</p>
                <p className={`mt-1 ${skin.note}`}>
                  {x.name} · {timeAgoLabel(x.created_at, lang)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** WhatsApp share and copy link. */
export function ShareButtons({ w, lang, url, primary, secondary }: { w: Wedding; lang: Lang; url: string; primary: string; secondary: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="grid grid-cols-2 gap-2">
      <a href={`https://wa.me/?text=${encodeURIComponent(shareText(w, lang, url))}`} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-2 ${primary}`}>
        <MessageCircle size={16} /> WhatsApp
      </a>
      <button type="button" onClick={() => copy(url, "link")} className={`flex items-center justify-center gap-2 ${secondary}`}>
        {copied === "link" ? <Check size={16} /> : <Link2 size={16} />}
        {copied === "link" ? s("linkCopied", lang) : s("copyLink", lang)}
      </button>
    </div>
  );
}

/** A couple photo, or `fallback` when none is set or it fails to load. */
export function Portrait({ src, alt, className, fallback }: { src: string; alt: string; className: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState("");
  if (!src || failed === src) return <>{fallback}</>;
  return (
    // Photos are user-set paths or links, so they go through a plain <img>.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(src)} alt={alt} className={className} onError={() => setFailed(src)} />
  );
}
