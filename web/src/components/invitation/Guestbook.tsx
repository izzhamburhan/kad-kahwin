"use client";

import { AnimatePresence, motion } from "motion/react";
import { Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { addWish, listWishes } from "@/lib/data";
import { s } from "@/lib/i18n";
import type { Lang, Wish } from "@/lib/types";
import { Panel, Reveal, Section } from "./Section";

const timeAgo = (iso: string, lang: Lang) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 6e4);
  const rtf = new Intl.RelativeTimeFormat(lang === "ms" ? "ms" : "en", { numeric: "auto" });
  if (mins < 60) return rtf.format(-mins, "minute");
  if (mins < 1440) return rtf.format(-Math.round(mins / 60), "hour");
  return rtf.format(-Math.round(mins / 1440), "day");
};

/** The guestbook's list and posting, without its look. */
export function useGuestbook(lang: Lang, guest: string) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState(guest);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listWishes()
      .then(setWishes)
      .catch(() => setWishes([]));
  }, []);

  async function post(e: FormEvent) {
    e.preventDefault();
    if (busy || !name.trim() || !message.trim()) return;
    setBusy(true);
    setError("");
    try {
      const wish = await addWish(name.trim().slice(0, 80), message.trim().slice(0, 500));
      setWishes((w) => [wish, ...w]);
      setMessage("");
    } catch {
      setError(s("errorGeneric", lang));
    } finally {
      setBusy(false);
    }
  }

  return { wishes, name, setName, message, setMessage, busy, error, post, canPost: !busy && !!name.trim() && !!message.trim() };
}

export const timeAgoLabel = timeAgo;

export function Guestbook({ lang, guest }: { lang: Lang; guest: string }) {
  const { wishes, name, setName, message, setMessage, busy, error, post } = useGuestbook(lang, guest);
  return (
    <Section id="ucapan" eyebrow={s("guestbook", lang)} title={s("guestbook", lang)}>
      <Reveal>
        <Panel>
          <form onSubmit={post} className="grid gap-3">
            <input className="field" placeholder={s("name", lang)} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            <textarea
              className="field min-h-24 resize-none"
              placeholder={s("writeWish", lang)}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
            />
            {error && <p className="font-sans text-sm text-ink-soft">{error}</p>}
            <button type="submit" className="btn-gold" disabled={busy || !name.trim() || !message.trim()}>
              <Send size={15} /> {s("postWish", lang)}
            </button>
          </form>

          {wishes.length === 0 ? (
            <p className="mt-6 py-6 text-center font-serif italic text-ink-mute">{s("noWishes", lang)}</p>
          ) : (
            <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:thin]">
              <AnimatePresence initial={false}>
                {wishes.map((w) => (
                  <motion.li
                    key={w.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex w-[78%] max-w-[18rem] shrink-0 snap-center flex-col justify-between rounded-2xl border border-card-line px-5 py-4"
                  >
                    <p className="font-serif text-base leading-relaxed text-ink">“{w.message}”</p>
                    <p className="mt-3 font-sans text-xs text-gold">
                      {w.name} <span className="text-ink-mute">· {timeAgo(w.created_at, lang)}</span>
                    </p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Panel>
      </Reveal>
    </Section>
  );
}