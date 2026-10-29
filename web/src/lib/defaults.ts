import type { Wedding } from "./types";

// The invitation's built-in content. With Supabase configured, anything saved
// from /admin overrides these values; without it, this file is what guests see.
export const defaultWedding: Wedding = {
  theme: "zamrud",
  couple: {
    groomShort: "Izzat",
    brideShort: "Aishah",
    groomFull: "Muhammad Ariff Izzat bin Burhanuddin",
    brideFull: "Wan Aishah binti Wan Zulkifli",
    hashtag: "#IzzatAishahSelamanya",
  },
  side: "lelaki",
  hosts: "Norhaniza Bt MD Idris Dan Keluarga",
  title: { ms: "Walimatul Urus", en: "Wedding Reception" },
  message: {
    ms: "Dengan penuh kesyukuran ke hadrat Ilahi, kami dengan segala hormatnya menjemput Dato' | Datin | Tuan | Puan | Encik | Cik sekeluarga ke majlis perkahwinan putera kami",
    en: "With gratitude to the Almighty, we cordially invite you and your family to the wedding reception of our beloved son",
  },
  closing: {
    ms: "Kehadiran dan doa restu anda amat kami hargai.",
    en: "Your presence and blessings would mean the world to us.",
  },
  start: "2027-04-11T11:00:00+08:00",
  end: "2027-04-11T16:00:00+08:00",
  venue: {
    name: "Delima White Hall",
    address: "Kelana Jaya, Petaling Jaya, Selangor",
    mapQuery: "Delima White Hall Kelana Jaya",
  },
  events: [
    { id: "e1", time: "11:00", title: { ms: "Ketibaan tetamu & jamuan", en: "Guests arrive & lunch is served" } },
    { id: "e2", time: "12:30", title: { ms: "Ketibaan pengantin", en: "Arrival of the bride & groom" } },
    { id: "e3", time: "13:00", title: { ms: "Bacaan doa & sesi bergambar", en: "Doa & photo session" } },
    { id: "e4", time: "16:00", title: { ms: "Majlis bersurai", en: "End of reception" } },
  ],
  dressCode: {
    text: {
      ms: "Pakaian tradisional atau formal. Warna pilihan: hijau zamrud, champagne dan gading.",
      en: "Traditional or formal attire. Suggested colours: emerald, champagne and ivory.",
    },
    colors: ["#1f5a46", "#d8c08a", "#f4ecdc"],
  },
  parking: {
    ms: "Tempat letak kereta tersedia di sekitar dewan. Sila datang awal kerana ruang terhad.",
    en: "Parking is available around the hall. Please arrive early as spaces are limited.",
  },
  food: {
    ms: "Semua hidangan adalah halal. Maklumkan keperluan pemakanan khas dalam borang RSVP.",
    en: "All food served is halal. Let us know any dietary needs in the RSVP form.",
  },
  contacts: [{ name: "Izzham", role: { ms: "Adik pengantin", en: "Groom's brother" }, phone: "601123505422" }],
  rsvp: { deadline: "2027-03-28", maxPax: 4, whatsapp: "601123505422" },
  gift: {
    bank: "",
    accountName: "",
    accountNo: "",
    qrImage: "",
    note: {
      ms: "Kehadiran anda adalah hadiah terindah. Bagi yang ingin memberi, butiran di bawah boleh digunakan.",
      en: "Your presence is the greatest gift. For those who wish to give, the details are below.",
    },
  },
  story: [
    { year: "", title: { ms: "Pertemuan", en: "We met" }, text: { ms: "", en: "" } },
    { year: "", title: { ms: "Bertunang", en: "Engaged" }, text: { ms: "", en: "" } },
    { year: "2027", title: { ms: "Bersatu", en: "Forever" }, text: { ms: "", en: "" } },
  ],
  gallery: [],
  music: { src: "audio/lagu.mp3" },
  sections: {
    story: false,
    gallery: false,
    schedule: true,
    dressCode: true,
    parking: true,
    food: true,
    rsvp: true,
    gift: false,
    guestbook: true,
    contacts: true,
  },
};

/** Fills any fields missing from saved data with the defaults. */
export function mergeWedding(saved: Partial<Wedding> | null | undefined): Wedding {
  if (!saved) return structuredClone(defaultWedding);
  const d = structuredClone(defaultWedding) as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined || v === null) continue;
    const base = d[k];
    d[k] =
      base && typeof base === "object" && !Array.isArray(base) && typeof v === "object" && !Array.isArray(v)
        ? { ...base, ...v }
        : v;
  }
  return d as unknown as Wedding;
}