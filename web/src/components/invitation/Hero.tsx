"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { s } from "@/lib/i18n";
import { formatDate, formatHijri } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";
import { FloralCorner, SongketBand } from "../ornaments";

const EASE = [0.22, 1, 0.36, 1] as const;

function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <span aria-label={text} className="inline-block">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          // Script swashes overhang the glyph box; pad it so the foil isn't clipped.
          className="foil -mx-[0.3em] -my-[0.15em] inline-block px-[0.3em] py-[0.15em]"
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE, delay: delay + i * 0.07 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({ w, lang }: { w: Wedding; lang: Lang }) {
  const { scrollY } = useScroll();
  const floralY = useTransform(scrollY, [0, 600], [0, -120]);
  const floralY2 = useTransform(scrollY, [0, 600], [0, 80]);
  const namesY = useTransform(scrollY, [0, 600], [0, 90]);
  const fade = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <header id="utama" className="songket-bg relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 45%, color-mix(in srgb, var(--gold) 16%, transparent), transparent 70%), linear-gradient(to bottom, transparent 60%, var(--bg))",
        }}
      />
      <motion.div style={{ y: floralY }} className="pointer-events-none absolute -left-10 -top-8 w-56 text-gold opacity-60">
        <FloralCorner />
      </motion.div>
      <motion.div style={{ y: floralY2 }} className="pointer-events-none absolute -bottom-10 -right-10 w-56 rotate-180 text-gold opacity-60">
        <FloralCorner />
      </motion.div>
      <SongketBand className="absolute left-0 top-0 text-gold opacity-50" />

      <motion.div style={{ y: namesY, opacity: fade }} className="relative z-10">
        <motion.p
          className="font-arabic text-2xl text-gold"
          dir="rtl"
          lang="ar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.1 }}
        >
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </motion.p>

        <motion.p
          className="label mt-8 text-ink-soft"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.32em" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        >
          {w.title[lang]}
        </motion.p>

        <h1 className="mt-6 font-script leading-[0.95]">
          <span className="block text-[4.6rem] sm:text-[5.4rem]">
            <Letters text={w.couple.groomShort} delay={0.6} />
          </span>
          <motion.span
            className="foil block text-[2.6rem]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          >
            &
          </motion.span>
          <span className="block text-[4.6rem] sm:text-[5.4rem]">
            <Letters text={w.couple.brideShort} delay={1.3} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 2 }}
          className="mt-8"
        >
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-5 font-serif text-xl text-ink">{formatDate(w.start, lang)}</p>
          <p className="mt-1 font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
          <p className="label mt-4 text-gold">{w.venue.name}</p>
        </motion.div>
      </motion.div>

      <motion.a
        href="#jemputan"
        className="absolute bottom-10 z-10 flex flex-col items-center gap-1 text-ink-soft"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 2.6, duration: 1 }, y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" } }}
      >
        <span className="label text-[0.6rem]">{s("scroll", lang)}</span>
        <ChevronDown size={18} />
      </motion.a>
    </header>
  );
}