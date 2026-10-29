import type { Lang, Wedding } from "./types";

const TZ = "Asia/Kuala_Lumpur";
const locale = (lang: Lang) => (lang === "ms" ? "ms-MY" : "en-MY");

export const formatDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(locale(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));

export const formatDateShort = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(locale(lang), { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(
    new Date(iso),
  );

/** dd.mm.yyyy, used on the envelope and hero. */
export const formatDateDots = (iso: string) => {
  const p = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ })
    .formatToParts(new Date(iso))
    .reduce<Record<string, string>>((a, x) => ({ ...a, [x.type]: x.value }), {});
  return `${p.day} . ${p.month} . ${p.year}`;
};

export const formatHijri = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("ms-MY-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: TZ,
    }).format(new Date(iso));
  } catch {
    return "";
  }
};

/** "11:00" → "11:00 pagi" / "11:00 AM" */
export function formatClock(hhmm: string, lang: Lang) {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  const mm = String(m || 0).padStart(2, "0");
  const h12 = ((h + 11) % 12) + 1;
  if (lang === "en") return `${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
  const part = h < 12 ? "pagi" : h < 14 ? "tengah hari" : h < 19 ? "petang" : "malam";
  return `${h12}:${mm} ${part}`;
}

const isoClock = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(
    new Date(iso),
  );

export const formatTimeRange = (w: Wedding, lang: Lang) =>
  `${formatClock(isoClock(w.start), lang)} – ${formatClock(isoClock(w.end), lang)}`;

/** Splits an ISO date-time into the date and time inputs used by the admin form. */
export function splitIso(iso: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ }).format(d);
  return { date, time: isoClock(iso) };
}

export const joinIso = (date: string, time: string) => `${date}T${time || "00:00"}:00+08:00`;

const utcStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const wazeUrl = (q: string) => `https://waze.com/ul?q=${encodeURIComponent(q)}&navigate=yes`;
export const mapsEmbed = (q: string) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const eventTitle = (w: Wedding, lang: Lang) =>
  `${w.title[lang]} ${w.couple.groomShort} & ${w.couple.brideShort}`;

export function googleCalendarUrl(w: Wedding, lang: Lang, url: string) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(w, lang),
    dates: `${utcStamp(w.start)}/${utcStamp(w.end)}`,
    details: url,
    location: `${w.venue.name}, ${w.venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export function downloadIcs(w: Wedding, lang: Lang, url: string) {
  const esc = (v: string) => v.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VOWE MY//Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${utcStamp(w.start)}-${w.couple.groomShort}-${w.couple.brideShort}@vowe.my`,
    `DTSTAMP:${utcStamp(new Date().toISOString())}`,
    `DTSTART:${utcStamp(w.start)}`,
    `DTEND:${utcStamp(w.end)}`,
    `SUMMARY:${esc(eventTitle(w, lang))}`,
    `LOCATION:${esc(`${w.venue.name}, ${w.venue.address}`)}`,
    `DESCRIPTION:${esc(url)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(eventTitle(w, lang))}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "jemputan-kahwin.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Malaysian numbers to international digits: "012-345 6789" → "60123456789". */
export function normalizePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0")) d = `6${d}`;
  return d;
}

/** Prefixes public/ assets with the GitHub Pages base path. Leaves full URLs alone. */
export const asset = (src: string) =>
  !src || /^(https?:|data:|blob:)/.test(src) ? src : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${src.replace(/^\//, "")}`;