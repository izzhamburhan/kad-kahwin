import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { defaultWedding, mergeWedding } from "./defaults";
import type { Guest, Rsvp, RsvpInput, Wedding, Wish } from "./types";

// One data layer, two backends:
//  - Supabase, when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set at build time.
//  - Demo mode otherwise: everything is kept in this browser's localStorage only.
// Callers never need to know which one is active, except to tell guests the truth (see `isDemo`).

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SLUG = process.env.NEXT_PUBLIC_WEDDING_SLUG || "main";

export const isDemo = !(url && key);

let client: SupabaseClient | null = null;
export function supabase() {
  if (isDemo) throw new Error("Supabase is not configured");
  client ??= createClient(url, key);
  return client;
}

/* ---------------- demo storage ---------------- */

const DEMO = {
  wedding: "vowe:demo:wedding",
  rsvps: "vowe:demo:rsvps",
  wishes: "vowe:demo:wishes",
  guests: "vowe:demo:guests",
};

function readLocal<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage full or blocked: demo data simply isn't kept */
  }
}

const id = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const now = () => new Date().toISOString();

/* ---------------- wedding settings ---------------- */

export async function loadWedding(): Promise<Wedding> {
  if (isDemo) return mergeWedding(readLocal<Partial<Wedding> | null>(DEMO.wedding, null));
  const { data, error } = await supabase().from("weddings").select("data").eq("slug", SLUG).maybeSingle();
  if (error || !data) return structuredClone(defaultWedding);
  return mergeWedding(data.data as Partial<Wedding>);
}

export async function saveWedding(w: Wedding) {
  if (isDemo) return writeLocal(DEMO.wedding, w);
  const { error } = await supabase().from("weddings").update({ data: w, updated_at: now() }).eq("slug", SLUG);
  if (error) throw error;
}

export function resetDemoWedding() {
  localStorage.removeItem(DEMO.wedding);
}

/* ---------------- RSVP ---------------- */

export type RsvpResult = { ok: true } | { ok: false; reason: "duplicate" | "error" };

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  const row = { ...input, pax: input.attending ? input.pax : 0 };
  if (isDemo) {
    const all = readLocal<Rsvp[]>(DEMO.rsvps, []);
    if (all.some((r) => r.phone === row.phone)) return { ok: false, reason: "duplicate" };
    writeLocal(DEMO.rsvps, [{ ...row, id: id(), created_at: now() }, ...all]);
    return { ok: true };
  }
  const { error } = await supabase()
    .from("rsvps")
    .insert({ ...row, wedding_slug: SLUG });
  if (!error) return { ok: true };
  // 23505 = unique violation on (wedding_slug, phone)
  return { ok: false, reason: error.code === "23505" ? "duplicate" : "error" };
}

export async function listRsvps(): Promise<Rsvp[]> {
  if (isDemo) return readLocal<Rsvp[]>(DEMO.rsvps, []);
  const { data, error } = await supabase()
    .from("rsvps")
    .select("id,name,phone,attending,pax,dietary,message,created_at")
    .eq("wedding_slug", SLUG)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Rsvp[];
}

export async function deleteRsvp(rid: string) {
  if (isDemo) return writeLocal(DEMO.rsvps, readLocal<Rsvp[]>(DEMO.rsvps, []).filter((r) => r.id !== rid));
  const { error } = await supabase().from("rsvps").delete().eq("id", rid);
  if (error) throw error;
}

/** Fills demo mode with sample replies so the dashboard can be previewed. */
export function seedDemoRsvps() {
  const sample: RsvpInput[] = [
    { name: "Pak Long Hamid", phone: "60123000001", attending: true, pax: 4, dietary: "", message: "Selamat pengantin baru!" },
    { name: "Kak Ros & family", phone: "60123000002", attending: true, pax: 3, dietary: "1 vegetarian", message: "" },
    { name: "Daniel Lim", phone: "60123000003", attending: false, pax: 0, dietary: "", message: "Sorry I'm overseas. Congrats both!" },
    { name: "Nurul Huda", phone: "60123000004", attending: true, pax: 2, dietary: "Alahan udang", message: "Barakallah!" },
  ];
  writeLocal(
    DEMO.rsvps,
    sample.map((r, i) => ({ ...r, id: id(), created_at: new Date(Date.now() - i * 36e5).toISOString() })),
  );
}

/* ---------------- guestbook ---------------- */

export async function listWishes(): Promise<Wish[]> {
  if (isDemo) return readLocal<Wish[]>(DEMO.wishes, []);
  const { data, error } = await supabase()
    .from("wishes")
    .select("id,name,message,created_at")
    .eq("wedding_slug", SLUG)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data as Wish[];
}

export async function addWish(name: string, message: string): Promise<Wish> {
  const wish = { id: id(), name, message, created_at: now() };
  if (isDemo) {
    writeLocal(DEMO.wishes, [wish, ...readLocal<Wish[]>(DEMO.wishes, [])]);
    return wish;
  }
  const { error } = await supabase().from("wishes").insert({ name, message, wedding_slug: SLUG });
  if (error) throw error;
  return wish;
}

export async function deleteWish(wid: string) {
  if (isDemo) return writeLocal(DEMO.wishes, readLocal<Wish[]>(DEMO.wishes, []).filter((w) => w.id !== wid));
  const { error } = await supabase().from("wishes").delete().eq("id", wid);
  if (error) throw error;
}

/* ---------------- guest list (admin only) ---------------- */

export async function listGuests(): Promise<Guest[]> {
  if (isDemo) return readLocal<Guest[]>(DEMO.guests, []);
  const { data, error } = await supabase()
    .from("guests")
    .select("id,name,phone,created_at")
    .eq("wedding_slug", SLUG)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Guest[];
}

export async function addGuest(name: string, phone: string): Promise<Guest> {
  if (isDemo) {
    const g = { id: id(), name, phone, created_at: now() };
    writeLocal(DEMO.guests, [...readLocal<Guest[]>(DEMO.guests, []), g]);
    return g;
  }
  const { data, error } = await supabase()
    .from("guests")
    .insert({ name, phone, wedding_slug: SLUG })
    .select("id,name,phone,created_at")
    .single();
  if (error) throw error;
  return data as Guest;
}

export async function deleteGuest(gid: string) {
  if (isDemo) return writeLocal(DEMO.guests, readLocal<Guest[]>(DEMO.guests, []).filter((g) => g.id !== gid));
  const { error } = await supabase().from("guests").delete().eq("id", gid);
  if (error) throw error;
}