"use client";

import type { ReactNode } from "react";
import type { L } from "@/lib/types";

// Small iOS-style building blocks for the organiser dashboard:
// inset grouped lists, quiet labels, system-like controls.

export function Group({ title, footer, children }: { title?: string; footer?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-7">
      {title && <h3 className="mb-1.5 px-4 text-[0.78rem] font-medium uppercase tracking-wide text-stone-500">{title}</h3>}
      <div className="divide-y divide-stone-200/80 overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(0,0,0,.03)]">{children}</div>
      {footer && <p className="mt-1.5 px-4 text-xs leading-relaxed text-stone-500">{footer}</p>}
    </section>
  );
}

export function Row({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}

const input =
  "w-full rounded-lg bg-stone-100/80 px-3 py-2 text-[0.95rem] text-stone-900 outline-none ring-emerald-700/30 placeholder:text-stone-400 focus:ring-2";

export function Text({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <Row>
      <label className="grid gap-1">
        <span className="text-xs text-stone-500">{label}</span>
        {multiline ? (
          <textarea className={`${input} min-h-20 resize-y`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input className={input} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    </Row>
  );
}

/** One field written twice: Bahasa Melayu and English. */
export function Bilingual({ label, value, onChange, multiline }: { label: string; value: L; onChange: (v: L) => void; multiline?: boolean }) {
  return (
    <>
      <Text label={`${label} · BM`} value={value.ms} onChange={(ms) => onChange({ ...value, ms })} multiline={multiline} />
      <Text label={`${label} · EN`} value={value.en} onChange={(en) => onChange({ ...value, en })} multiline={multiline} />
    </>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row className="flex items-center justify-between">
      <span className="text-[0.95rem] text-stone-900">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-[31px] w-[51px] rounded-full transition-colors ${checked ? "bg-emerald-600" : "bg-stone-300"}`}
      >
        <span
          className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-[2px]"}`}
        />
      </button>
    </Row>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-[10px] bg-stone-200/70 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 whitespace-nowrap rounded-[8px] px-2 py-1.5 text-[0.8rem] font-medium transition ${
            value === o.value ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: number | string; sub?: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <p className={`mt-1 text-3xl font-semibold tabular-nums tracking-tight ${tone}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-stone-500">{sub}</p>}
    </div>
  );
}