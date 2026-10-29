"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Divider } from "../ornaments";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-6 px-6 py-16 ${className}`}>
      {(eyebrow || title) && (
        <Reveal className="mb-10 text-center">
          {eyebrow && eyebrow !== title && <p className="label mb-3 text-gold">{eyebrow}</p>}
          {title && <h2 className="foil px-4 font-script text-[2.6rem] leading-tight">{title}</h2>}
          <Divider className="mt-4" />
        </Reveal>
      )}
      {children}
    </section>
  );
}

/** Soft framed panel used for details. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[22px] border border-card-line bg-card p-6 backdrop-blur-sm ${className}`}
      style={{ boxShadow: "0 20px 40px -30px rgba(0,0,0,.6)" }}
    >
      {children}
    </div>
  );
}