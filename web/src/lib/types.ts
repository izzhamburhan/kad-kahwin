export type Lang = "ms" | "en";

/** Text written in both Malay and English. */
export type L = { ms: string; en: string };

export type ThemeId = "zamrud" | "gading" | "nila";

export interface WeddingEvent {
  id: string;
  time: string;
  title: L;
  note?: L;
}

export interface Contact {
  name: string;
  role: L;
  /** International format without "+", e.g. 60123456789 */
  phone: string;
}

export interface Photo {
  src: string;
  caption?: string;
}

export interface StoryItem {
  year: string;
  title: L;
  text: L;
}

export interface SectionToggles {
  story: boolean;
  gallery: boolean;
  schedule: boolean;
  dressCode: boolean;
  parking: boolean;
  food: boolean;
  rsvp: boolean;
  gift: boolean;
  guestbook: boolean;
  contacts: boolean;
}

export interface Wedding {
  theme: ThemeId;
  couple: {
    groomShort: string;
    brideShort: string;
    groomFull: string;
    brideFull: string;
    hashtag: string;
  };
  /** Which family hosts this majlis. */
  side: "lelaki" | "perempuan";
  hosts: string;
  title: L;
  message: L;
  closing: L;
  /** ISO date-time with the Malaysia offset, e.g. 2027-04-11T11:00:00+08:00 */
  start: string;
  end: string;
  venue: {
    name: string;
    address: string;
    /** Search text for Google Maps / Waze. A "lat,lng" pair is more precise. */
    mapQuery: string;
  };
  events: WeddingEvent[];
  dressCode: { text: L; colors: string[] };
  parking: L;
  food: L;
  contacts: Contact[];
  rsvp: { deadline: string; maxPax: number; whatsapp: string };
  gift: { bank: string; accountName: string; accountNo: string; qrImage: string; note: L };
  story: StoryItem[];
  gallery: Photo[];
  music: { src: string };
  sections: SectionToggles;
}

export interface RsvpInput {
  name: string;
  phone: string;
  attending: boolean;
  pax: number;
  dietary: string;
  message: string;
}

export interface Rsvp extends RsvpInput {
  id: string;
  created_at: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}