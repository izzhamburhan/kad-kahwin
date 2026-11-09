"use client";

import { AnimatePresence, motion } from "motion/react";
import { Minus, MessageCircle, Plus } from "lucide-react";
import { s } from "@/lib/i18n";
import { formatDateShort } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";
import { Panel, Reveal, Section } from "./Section";
import { useRsvp } from "./useRsvp";

/** Check mark that draws itself, with a burst of petals around it. */
function SuccessMark() {
  const bits = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return { x: Math.cos(a) * 78, y: Math.sin(a) * 78, r: (i * 47) % 360, d: (i % 3) * 0.04 };
  });
  return (
    <div className="relative mx-auto h-28 w-28">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-2.5 w-1.5 rounded-full"
          style={{ background: i % 2 ? "var(--gold-hi)" : "var(--petal)" }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
          animate={{ x: b.x, y: b.y, opacity: [0, 1, 0], rotate: b.r, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.35 + b.d, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 50%" }}
        />
        <motion.path
          d="M31 52 L45 65 L70 38"
          fill="none"
          stroke="var(--gold-hi)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

export function Rsvp({ w, lang, guest }: { w: Wedding; lang: Lang; guest: string }) {
  const { max, form, set, state, error, sent, closed, submit, another, whatsapp, isDemo } = useRsvp(w, lang, guest);

  return (
    <Section id="rsvp" eyebrow={s("navRsvp", lang)} title={s("rsvp", lang)}>
      <Reveal>
        <Panel>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
                role="status"
              >
                {state === "done" ? <SuccessMark /> : null}
                <p className="foil mt-4 font-script text-5xl">{s("thanks", lang)}</p>
                <p className="mt-2 font-serif text-xl text-ink">{sent.name}</p>
                <p className="mt-2 font-serif text-base text-ink-soft">
                  {sent.attending ? `${s("seeYou", lang)} (${sent.pax} ${s("pax", lang).toLowerCase()})` : s("missYou", lang)}
                </p>
                {state !== "done" && <p className="mt-4 font-sans text-xs text-ink-mute">{s("alreadyReplied", lang)}</p>}
                <button type="button" onClick={another} className="mt-4 font-sans text-xs text-gold underline underline-offset-4">
                  {s("anotherReply", lang)}
                </button>
                {isDemo && (
                  <div className="mt-6 rounded-2xl border border-dashed border-card-line p-4 text-left">
                    <p className="font-sans text-xs leading-relaxed text-ink-soft">{s("demoNote", lang)}</p>
                    {whatsapp && (
                      <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-gold mt-3 w-full">
                        <MessageCircle size={16} /> {s("sendWhatsapp", lang)}
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ) : closed ? (
              <p key="closed" className="py-6 text-center font-serif text-lg text-ink-soft">
                {s("rsvpClosed", lang)}
              </p>
            ) : (
              <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="grid gap-4" noValidate>
                {w.rsvp.deadline && (
                  <p className="text-center font-serif text-sm italic text-ink-soft">
                    {s("rsvpBy", lang)} {formatDateShort(`${w.rsvp.deadline}T12:00:00+08:00`, lang)}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 rounded-full border border-card-line p-1" role="radiogroup">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      role="radio"
                      aria-checked={form.attending === v}
                      onClick={() => set("attending", v)}
                      className="relative rounded-full py-3 font-sans text-sm tracking-wide"
                    >
                      {form.attending === v && (
                        <motion.span
                          layoutId="attend-pill"
                          className="absolute inset-0 rounded-full"
                          style={{ background: "linear-gradient(135deg, var(--gold-hi), var(--gold) 60%, var(--gold-lo))" }}
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className={`relative ${form.attending === v ? "text-[var(--on-gold,#1b160b)]" : "text-ink-soft"}`}>
                        {v ? s("attending", lang) : s("notAttending", lang)}
                      </span>
                    </button>
                  ))}
                </div>

                <label className="grid gap-1.5">
                  <span className="label text-[0.6rem] text-ink-soft">{s("name", lang)}</span>
                  <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" maxLength={120} required />
                </label>
                <label className="grid gap-1.5">
                  <span className="label text-[0.6rem] text-ink-soft">{s("phone", lang)}</span>
                  <input
                    className="field"
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
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid gap-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between rounded-[14px] border border-card-line bg-card px-4 py-3">
                        <div>
                          <p className="font-sans text-sm text-ink">{s("pax", lang)}</p>
                          <p className="font-sans text-xs text-ink-mute">
                            {s("paxLimit", lang)} {max}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label="-"
                            disabled={form.pax <= 1}
                            onClick={() => set("pax", Math.max(1, form.pax - 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-card-line text-ink disabled:opacity-30"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-serif text-2xl lining-nums tabular-nums text-ink">{form.pax}</span>
                          <button
                            type="button"
                            aria-label="+"
                            disabled={form.pax >= max}
                            onClick={() => set("pax", Math.min(max, form.pax + 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-card-line text-ink disabled:opacity-30"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <label className="grid gap-1.5">
                        <span className="label text-[0.6rem] text-ink-soft">{s("dietary", lang)}</span>
                        <input className="field" value={form.dietary} onChange={(e) => set("dietary", e.target.value)} placeholder={s("dietaryHint", lang)} maxLength={300} />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="grid gap-1.5">
                  <span className="label text-[0.6rem] text-ink-soft">{s("message", lang)}</span>
                  <textarea className="field min-h-24 resize-none" value={form.message} onChange={(e) => set("message", e.target.value)} maxLength={1000} />
                </label>

                {error && (
                  <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 font-sans text-sm"
                    style={{ color: "color-mix(in srgb, #e0525a 70%, var(--ink))" }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-gold mt-1 w-full" disabled={state === "sending"}>
                  {state === "sending" ? s("sending", lang) : s("submit", lang)}
                </button>
                {isDemo && <p className="text-center font-sans text-[0.7rem] text-ink-mute">{s("demoNote", lang)}</p>}
              </motion.form>
            )}
          </AnimatePresence>
        </Panel>
      </Reveal>
    </Section>
  );
}