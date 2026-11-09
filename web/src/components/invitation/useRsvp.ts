"use client";

import { useState, type FormEvent } from "react";
import { isDemo, submitRsvp } from "@/lib/data";
import { normalizePhone, waLink } from "@/lib/format";
import { s } from "@/lib/i18n";
import type { Lang, RsvpInput, Wedding } from "@/lib/types";

// Kept per mode: a reply saved only on the phone in demo mode must not block a real one later.
const SENT_KEY = `vowe:rsvp:sent:${isDemo ? "demo" : "live"}`;

const blank = (name = ""): RsvpInput => ({ name, phone: "", attending: true, pax: 1, dietary: "", message: "" });

/**
 * Everything an RSVP form does except how it looks: the fields, the deadline, sending, and the
 * reply this device already sent. Render it only on the client, after the card is opened.
 */
export function useRsvp(w: Wedding, lang: Lang, guest: string) {
  const max = Math.max(1, w.rsvp.maxPax);
  const [form, setForm] = useState<RsvpInput>(() => blank(guest));
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  // A reply from this device is remembered, so the form isn't offered twice.
  const [sent, setSent] = useState<RsvpInput | null>(() => {
    try {
      const raw = localStorage.getItem(SENT_KEY);
      return raw ? (JSON.parse(raw) as RsvpInput) : null;
    } catch {
      return null;
    }
  });
  const [openedAt] = useState(() => Date.now());

  const deadline = new Date(`${w.rsvp.deadline}T23:59:59+08:00`).getTime();
  const closed = !!w.rsvp.deadline && openedAt > deadline;
  const set = <K extends keyof RsvpInput>(k: K, v: RsvpInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    const phone = normalizePhone(form.phone);
    if (!form.name.trim() || phone.length < 9) return setError(s("required", lang));
    setError("");
    setState("sending");
    const input: RsvpInput = {
      name: form.name.trim().slice(0, 120),
      phone,
      attending: form.attending,
      pax: form.attending ? Math.min(Math.max(1, form.pax), max) : 0,
      dietary: form.dietary.trim().slice(0, 300),
      message: form.message.trim().slice(0, 1000),
    };
    const res = await submitRsvp(input);
    if (!res.ok) {
      setState("idle");
      return setError(res.reason === "duplicate" ? s("duplicate", lang) : s("errorGeneric", lang));
    }
    try {
      localStorage.setItem(SENT_KEY, JSON.stringify(input));
    } catch {
      /* ignore */
    }
    setSent(input);
    setState("done");
  }

  /** Families often share one phone; the database still blocks a repeat phone number. */
  function another() {
    try {
      localStorage.removeItem(SENT_KEY);
    } catch {
      /* ignore */
    }
    setSent(null);
    setState("idle");
    setForm(blank());
  }

  // In demo mode nothing reaches the hosts, so the guest can send the reply by WhatsApp instead.
  const whatsapp =
    sent && isDemo && w.rsvp.whatsapp
      ? waLink(
          w.rsvp.whatsapp,
          [
            `RSVP ${w.couple.groomShort} & ${w.couple.brideShort}`,
            `${s("name", lang)}: ${sent.name}`,
            `${s("phone", lang)}: ${sent.phone}`,
            sent.attending ? `${s("attending", lang)} (${sent.pax})` : s("notAttending", lang),
            sent.dietary && `${s("dietary", lang)}: ${sent.dietary}`,
            sent.message && `${sent.message}`,
          ]
            .filter(Boolean)
            .join("\n"),
        )
      : "";

  return { max, form, set, state, error, sent, closed, submit, another, whatsapp, isDemo };
}