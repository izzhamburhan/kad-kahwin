"use client";

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { s, t } from "@/lib/i18n";
import { formatDate, formatHijri, formatTimeRange } from "@/lib/format";
import type { L, Lang, Wedding } from "@/lib/types";
import { CoconutTree, House } from "./motifs";

const LINES: Record<"dusk" | "door" | "enter", L> = {
  dusk: {
    ms: "Senja berlabuh di kampung kami, dan dua hati bakal disatukan.",
    en: "Dusk settles over our kampung, and two hearts are about to become one.",
  },
  door: { ms: "Pintu kami terbuka untuk anda", en: "Our door is open to you" },
  enter: { ms: "Masuk", en: "Come in" },
};

/** Fixed star field: a tiny LCG keeps positions identical on server and client. */
const STARS = (() => {
  let seed = 7;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 46 }, () => ({ x: r() * 100, y: r() * 52, s: 0.6 + r() * 1.6, d: r() * 3 }));
})();

function Act({ o, y, children, className = "" }: { o: MotionValue<number>; y: MotionValue<string>; children: React.ReactNode; className?: string }) {
  return (
    <motion.div style={{ opacity: o, y }} className={`absolute inset-x-0 px-7 text-center ${className}`}>
      {children}
    </motion.div>
  );
}

/**
 * The opening: one sticky viewport, about five screens of scroll.
 * Dusk turns to night, the lamps are lit, the camera walks up to the house
 * and the doors open onto the invitation inside.
 */
export function Scene({ w, lang, guest, reduced, onEnter }: { w: Wedding; lang: Lang; guest: string; reduced: boolean; onEnter: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Reduced motion: a single still frame of the lit house at night.
  const still = useMotionValue(0.6);
  const p = reduced ? still : scrollYProgress;

  const night = useTransform(p, [0.18, 0.55], [0, 1]);
  const stars = useTransform(p, [0.35, 0.6], [0, 1]);
  const sunY = useTransform(p, [0, 0.45], ["0vh", "24vh"]);
  const sunO = useTransform(p, [0.3, 0.46], [1, 0]);
  const moonO = useTransform(p, [0.45, 0.65], [0, 1]);
  const glow = useTransform(p, [0.38, 0.56], [0, 1]);
  const door = useTransform(p, [0.76, 0.88], [1, 0.06]);
  const houseScale = useTransform(p, [0, 0.72, 1], [1, 1.9, 9]);
  const houseY = useTransform(p, [0, 0.72], ["0vh", "3vh"]);
  const treeL = useTransform(p, [0, 0.8], ["0vw", "-60vw"]);
  const treeR = useTransform(p, [0, 0.8], ["0vw", "60vw"]);
  const treeScale = useTransform(p, [0, 0.8], [1, 1.7]);
  const sawahY = useTransform(p, [0, 0.8], ["0vh", "24vh"]);
  const hillsY = useTransform(p, [0, 0.8], ["0vh", "8vh"]);
  const hillFar = useTransform(p, [0.1, 0.55], ["#8a4f6e", "#232448"]);
  const hillNear = useTransform(p, [0.1, 0.55], ["#5e3552", "#171832"]);
  const sawah = useTransform(p, [0.1, 0.55], ["#58823f", "#18291e"]);
  const sawahTint = useTransform(night, [0, 1], [0, 0.45]);
  const flood = useTransform(p, [0.88, 0.98], [0, 1]);

  const act1 = useTransform(p, [0, 0.1, 0.17], [1, 1, 0]);
  const act1y = useTransform(p, [0, 0.17], ["0vh", "-6vh"]);
  const act2 = useTransform(p, [0.22, 0.3, 0.4, 0.47], [0, 1, 1, 0]);
  const act2y = useTransform(p, [0.22, 0.47], ["4vh", "-4vh"]);
  const act3 = useTransform(p, [0.52, 0.6, 0.7, 0.76], [0, 1, 1, 0]);
  const act3y = useTransform(p, [0.52, 0.76], ["4vh", "-4vh"]);
  const cue = useTransform(p, [0, 0.05], [1, 0]);

  return (
    <section id="utama" ref={ref} className={reduced ? "relative h-dvh" : "relative h-[520vh]"}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* sky: senja, then malam */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #2b2d5e 0%, #7a3f6a 34%, #d4675d 58%, #f6ad4f 76%)" }} />
        <motion.div className="absolute inset-0" style={{ opacity: night, background: "linear-gradient(to bottom, #070a22 0%, #121638 50%, #2a2550 76%)" }} />
        <motion.svg className="absolute inset-0 h-full w-full" style={{ opacity: stars }} aria-hidden>
          {STARS.map((st, i) => (
            <circle key={i} cx={`${st.x}%`} cy={`${st.y}%`} r={st.s} fill="#fff6dc" className="twinkle" style={{ animationDelay: `${st.d}s` }} />
          ))}
        </motion.svg>
        {/* anak bulan */}
        <motion.svg viewBox="0 0 40 40" className="absolute right-[16%] top-[13%] w-10" style={{ opacity: moonO }} aria-hidden>
          <path d="M26 4 A16 16 0 1 0 26 36 A13 13 0 1 1 26 4 Z" fill="#ffe9b5" style={{ filter: "drop-shadow(0 0 8px #ffe9b5)" }} />
        </motion.svg>
        <motion.div
          className="absolute bottom-[30%] left-1/2 h-28 w-28 -translate-x-1/2 rounded-full"
          style={{
            y: sunY,
            opacity: sunO,
            background: "radial-gradient(circle, #fff1c4 0%, #ffc967 45%, rgba(255,160,70,0) 70%)",
          }}
        />

        {/* bukit */}
        <motion.svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[15%] h-[27%] w-full" style={{ y: hillsY }} aria-hidden>
          <motion.path d="M0 70 C 50 30, 90 40, 140 60 S 230 20, 290 50 S 370 40, 400 55 L400 120 L0 120 Z" style={{ fill: hillFar }} />
          <motion.path d="M0 95 C 60 70, 110 80, 170 92 S 280 66, 340 84 S 390 86, 400 88 L400 120 L0 120 Z" style={{ fill: hillNear }} />
        </motion.svg>

        {/* rumah */}
        <motion.div
          className="absolute bottom-[13%] left-1/2 w-[min(80vw,420px)] -translate-x-1/2"
          style={{ scale: houseScale, y: houseY, transformOrigin: "50% 63%" }}
        >
          <House glow={glow} door={door} night={night} />
        </motion.div>

        {/* sawah */}
        <motion.svg viewBox="0 0 400 90" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-[17%] w-full" style={{ y: sawahY }} aria-hidden>
          <defs>
            <pattern id="padi" width="9" height="9" patternUnits="userSpaceOnUse">
              <path d="M2 9 L3.5 2 M4.5 9 L4.5 0 M7 9 L5.5 2" stroke="#9cc06a" strokeWidth="0.9" opacity="0.55" />
            </pattern>
          </defs>
          <motion.rect width="400" height="90" style={{ fill: sawah }} />
          <rect width="400" height="90" fill="url(#padi)" />
          <path d="M0 26 C 120 18, 260 34, 400 22 M0 54 C 140 46, 250 62, 400 50" stroke="#2c1a0c" strokeWidth="2" fill="none" opacity="0.5" />
          <motion.rect width="400" height="90" fill="#06081c" style={{ opacity: sawahTint }} />
        </motion.svg>

        {/* pokok kelapa */}
        <motion.div className="absolute -left-10 bottom-[4%] w-[44vw] max-w-[230px] text-[#1b1420]" style={{ x: treeL, scale: treeScale, transformOrigin: "0% 100%" }}>
          <CoconutTree className="h-auto w-full" />
        </motion.div>
        <motion.div className="absolute -right-12 bottom-[8%] w-[36vw] max-w-[190px] text-[#1b1420]" style={{ x: treeR, scale: treeScale, transformOrigin: "100% 100%" }}>
          <CoconutTree className="h-auto w-full" flip />
        </motion.div>

        {/* words */}
        <div className="pointer-events-none absolute inset-x-0 top-[9%] mx-auto max-w-[480px]" style={{ textShadow: "0 2px 18px rgba(20,8,20,.45)" }}>
          {reduced ? (
            <div className="px-7 text-center">
              <Names w={w} lang={lang} guest={guest} />
            </div>
          ) : (
            <>
              <Act o={act1} y={act1y}>
                <Names w={w} lang={lang} guest={guest} />
              </Act>
              <Act o={act2} y={act2y} className="top-[6vh]">
                <p className="mx-auto max-w-[19rem] font-serif text-[1.65rem] italic leading-snug text-[#fff1da]">{t(LINES.dusk, lang)}</p>
              </Act>
              <Act o={act3} y={act3y} className="top-[2vh]">
                <p className="font-script text-[2.3rem] leading-tight text-[#ffe2a8]">{t(LINES.door, lang)}</p>
                <p className="mt-4 font-serif text-lg text-[#fff1da]">{formatDate(w.start, lang)}</p>
                <p className="font-serif text-base text-[#f3d3ad]">{formatTimeRange(w, lang)}</p>
                <p className="mt-1 font-sans text-sm tracking-wide text-[#ffd27e]">{w.venue.name}</p>
              </Act>
            </>
          )}
        </div>

        {!reduced && (
          <motion.button
            type="button"
            onClick={onEnter}
            style={{ opacity: cue }}
            className="absolute bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full px-5 py-2 font-sans text-sm tracking-wide text-[#fff1da]"
          >
            {t(LINES.enter, lang)}
            <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
              <ChevronDown size={20} />
            </motion.span>
          </motion.button>
        )}

        {/* lamplight floods out of the doorway into the page below */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: flood, background: "radial-gradient(60% 50% at 50% 55%, #ffd27e 0%, #b4661a 45%, var(--bg) 100%)" }}
        />
      </div>
    </section>
  );
}

function Names({ w, lang, guest }: { w: Wedding; lang: Lang; guest: string }) {
  return (
    <>
      <p className="font-arabic text-xl text-[#ffd27e]" dir="rtl" lang="ar">
        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
      </p>
      <p className="mt-4 font-sans text-sm text-[#ffe2b8]">
        {s("to", lang)} <span className="font-medium text-[#fff4e2]">{guest || s("guest", lang)}</span>
      </p>
      <h1 className="mt-6 font-script leading-[0.92] text-[#fff4e2]">
        <span className="block text-[4.4rem]">{w.couple.groomShort}</span>
        <span className="block text-[2.2rem] text-[#ffd27e]">&amp;</span>
        <span className="block text-[4.4rem]">{w.couple.brideShort}</span>
      </h1>
      <p className="mt-5 font-serif text-lg italic text-[#ffe2b8]">
        {w.title[lang]} · {formatDate(w.start, lang)}
      </p>
      <p className="font-serif text-sm text-[#f3d3ad]">{formatHijri(w.start)}</p>
    </>
  );
}