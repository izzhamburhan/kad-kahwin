"use client";

import { Check, Copy, Download, ExternalLink, MessageCircle, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addGuest,
  deleteGuest,
  deleteRsvp,
  deleteWish,
  isDemo,
  listGuests,
  listRsvps,
  listWishes,
  loadWedding,
  seedDemoRsvps,
} from "@/lib/data";
import { formatDate, normalizePhone, waLink } from "@/lib/format";
import type { Guest, Rsvp, Wedding, Wish } from "@/lib/types";
import { Settings } from "./Settings";
import { Group, Row, Segmented, Stat } from "./ui";

type Tab = "overview" | "rsvp" | "guests" | "wishes" | "settings";

// Every design reads the same settings and sends RSVPs here; only the look differs.
const DESIGNS = [
  { path: "", name: "Zamrud", note: "Sampul dan mohor" },
  { path: "kampung/", name: "Kampung", note: "Senja di rumah kampung" },
  { path: "songket/", name: "Songket", note: "Kain ditenun benang emas" },
  { path: "pelamin/", name: "Pelamin", note: "Berjalan ke pelamin" },
  { path: "surat/", name: "Surat", note: "Surat pos udara 90-an" },
  { path: "batik/", name: "Batik", note: "Lilin, canting dan pewarna" },
];

const inviteUrl = (name?: string, design = "") => {
  const base = `${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${design}`;
  return name ? `${base}?to=${encodeURIComponent(name)}` : base;
};

export function Dashboard({ onSignOut, email }: { onSignOut?: () => void; email?: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [w, setW] = useState<Wedding | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [error, setError] = useState("");

  const refresh = useCallback(
    () =>
      Promise.all([loadWedding(), listRsvps(), listGuests(), listWishes()])
        .then(([ww, r, g, wi]) => {
          setW(ww);
          setRsvps(r);
          setGuests(g);
          setWishes(wi);
          setError("");
        })
        .catch((e) => setError(e instanceof Error ? e.message : String(e))),
    [],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    const yes = rsvps.filter((r) => r.attending);
    const replied = new Set(rsvps.map((r) => r.phone));
    const repliedNames = new Set(rsvps.map((r) => r.name.trim().toLowerCase()));
    const pending = guests.filter(
      (g) => !(g.phone && replied.has(normalizePhone(g.phone))) && !repliedNames.has(g.name.trim().toLowerCase()),
    );
    return {
      yes: yes.length,
      pax: yes.reduce((n, r) => n + r.pax, 0),
      no: rsvps.length - yes.length,
      pending,
    };
  }, [rsvps, guests]);

  if (!w) return <p className="p-10 text-center text-stone-500">{error || "Memuatkan…"}</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-[max(env(safe-area-inset-top),1.25rem)]">
      <header className="flex items-end justify-between gap-3 pt-6">
        <div>
          <p className="text-sm text-stone-500">{formatDate(w.start, "ms")}</p>
          <h1 className="text-[2.1rem] font-bold leading-tight tracking-tight">
            {w.couple.groomShort} & {w.couple.brideShort}
          </h1>
        </div>
        <div className="flex items-center gap-3 pb-1.5 text-[0.95rem]">
          <a href={inviteUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-700">
            Lihat <ExternalLink size={15} />
          </a>
          {onSignOut && (
            <button type="button" onClick={onSignOut} className="text-stone-500" title={email}>
              Keluar
            </button>
          )}
        </div>
      </header>

      {isDemo && (
        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-[0.85rem] leading-relaxed text-amber-900">
          <b>Mod demo.</b> Supabase belum disambung, jadi semua data di sini disimpan dalam pelayar ini sahaja. Tetamu tidak
          akan nampak perubahan tetapan, dan RSVP mereka tidak sampai ke sini. Lihat README untuk sambung Supabase.
        </div>
      )}
      {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

      <div className="sticky top-0 z-10 -mx-4 mt-5 bg-[#f2f2f7]/85 px-4 py-2 backdrop-blur-xl">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "overview", label: "Ringkasan" },
            { value: "rsvp", label: "RSVP" },
            { value: "guests", label: "Tetamu" },
            { value: "wishes", label: "Ucapan" },
            { value: "settings", label: "Tetapan" },
          ]}
        />
      </div>

      <div className="mt-4">
        {tab === "overview" && <Overview w={w} rsvps={rsvps} stats={stats} guests={guests.length} />}
        {tab === "rsvp" && <RsvpList rsvps={rsvps} onChange={refresh} />}
        {tab === "guests" && <Guests w={w} guests={guests} pending={stats.pending} onChange={refresh} />}
        {tab === "wishes" && <Wishes wishes={wishes} onChange={refresh} />}
        {tab === "settings" && <Settings initial={w} onSaved={setW} />}
      </div>
    </div>
  );
}

/* ---------------- overview ---------------- */

function Overview({
  w,
  rsvps,
  stats,
  guests,
}: {
  w: Wedding;
  rsvps: Rsvp[];
  stats: { yes: number; pax: number; no: number; pending: Guest[] };
  guests: number;
}) {
  const [today] = useState(() => Date.now());
  const daysLeft = Math.ceil((new Date(w.start).getTime() - today) / 864e5);
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Hadir" value={stats.pax} sub={`${stats.yes} jawapan`} tone="text-emerald-700" />
        <Stat label="Tidak hadir" value={stats.no} sub="jawapan" tone="text-rose-600" />
        <Stat label="Belum jawab" value={stats.pending.length} sub={`daripada ${guests} dalam senarai`} tone="text-amber-600" />
        <Stat label="Hari lagi" value={Math.max(0, daysLeft)} sub={`RSVP tutup ${w.rsvp.deadline}`} tone="text-stone-900" />
      </div>

      <div className="mt-7">
        <Group title="Reka bentuk kad" footer="Tambah ?to=Nama pada mana-mana pautan untuk nama tetamu pada kad.">
          {DESIGNS.map((d) => (
            <a key={d.path} href={inviteUrl(undefined, d.path)} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3">
              <span>
                <span className="block font-medium">{d.name}</span>
                <span className="block text-xs text-stone-500">/{d.path}</span>
              </span>
              <span className="flex items-center gap-1.5 text-sm text-stone-500">
                {d.note} <ExternalLink size={14} className="text-emerald-700" />
              </span>
            </a>
          ))}
        </Group>
        <Group title="Jawapan terkini">
          {rsvps.length === 0 ? (
            <Row className="text-center text-sm text-stone-500">
              Belum ada jawapan.
              {isDemo && (
                <button
                  type="button"
                  onClick={() => {
                    seedDemoRsvps();
                    location.reload();
                  }}
                  className="ml-1 text-emerald-700"
                >
                  Isi contoh data
                </button>
              )}
            </Row>
          ) : (
            rsvps.slice(0, 5).map((r) => <RsvpRow key={r.id} r={r} />)
          )}
        </Group>
      </div>
    </>
  );
}

function RsvpRow({ r, onDelete }: { r: Rsvp; onDelete?: () => void }) {
  return (
    <Row className="flex items-start gap-3">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${r.attending ? "bg-emerald-500" : "bg-rose-400"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-medium">{r.name}</p>
          <p className="shrink-0 text-sm tabular-nums text-stone-500">{r.attending ? `${r.pax} org` : "Tidak hadir"}</p>
        </div>
        <p className="text-xs text-stone-500">
          +{r.phone} · {new Date(r.created_at).toLocaleDateString("ms-MY", { day: "numeric", month: "short" })}
        </p>
        {r.dietary && <p className="mt-1 text-sm text-amber-800">Pemakanan: {r.dietary}</p>}
        {r.message && <p className="mt-1 text-sm text-stone-600">“{r.message}”</p>}
      </div>
      {onDelete && (
        <button type="button" onClick={onDelete} aria-label="Padam" className="p-1 text-stone-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      )}
    </Row>
  );
}

/* ---------------- RSVP ---------------- */

function RsvpList({ rsvps, onChange }: { rsvps: Rsvp[]; onChange: () => void }) {
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const shown = rsvps.filter((r) => filter === "all" || (filter === "yes") === r.attending);

  const exportCsv = () => {
    const q = (v: string | number | boolean) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [
      ["Masa", "Nama", "Telefon", "Hadir", "Pax", "Pemakanan", "Ucapan"],
      ...rsvps.map((r) => [r.created_at, r.name, r.phone, r.attending ? "Ya" : "Tidak", r.pax, r.dietary, r.message]),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + rows.map((r) => r.map(q).join(",")).join("\n")], { type: "text/csv" }));
    a.download = "rsvp.csv";
    a.click();
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: `Semua ${rsvps.length}` },
              { value: "yes", label: "Hadir" },
              { value: "no", label: "Tidak" },
            ]}
          />
        </div>
        <button type="button" onClick={exportCsv} className="flex items-center gap-1 text-[0.95rem] text-emerald-700">
          <Download size={16} /> CSV
        </button>
      </div>
      <Group>
        {shown.length === 0 ? (
          <Row className="text-center text-sm text-stone-500">Tiada jawapan.</Row>
        ) : (
          shown.map((r) => (
            <RsvpRow
              key={r.id}
              r={r}
              onDelete={async () => {
                if (!confirm(`Padam RSVP ${r.name}? Tetamu ini boleh menghantar semula selepas dipadam.`)) return;
                await deleteRsvp(r.id);
                onChange();
              }}
            />
          ))
        )}
      </Group>
    </>
  );
}

/* ---------------- guest list ---------------- */

function Guests({ w, guests, pending, onChange }: { w: Wedding; guests: Guest[]; pending: Guest[]; onChange: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState("");
  const pendingIds = new Set(pending.map((g) => g.id));

  const add = async () => {
    if (!name.trim()) return;
    await addGuest(name.trim(), phone.trim() ? normalizePhone(phone) : "");
    setName("");
    setPhone("");
    onChange();
  };

  const message = (g: Guest) =>
    `Assalamualaikum ${g.name}.\n\nDengan segala hormatnya kami menjemput anda ke ${w.title.ms} ${w.couple.groomShort} & ${w.couple.brideShort} pada ${formatDate(w.start, "ms")} di ${w.venue.name}.\n\nKad jemputan & RSVP:\n${inviteUrl(g.name)}`;

  return (
    <>
      <Group title="Tambah tetamu" footer="Setiap tetamu mendapat pautan peribadi yang memaparkan nama mereka pada sampul.">
        <Row className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-lg bg-stone-100/80 px-3 py-2 outline-none"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-36 rounded-lg bg-stone-100/80 px-3 py-2 outline-none"
            placeholder="No. telefon"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button type="button" onClick={add} aria-label="Tambah" className="rounded-lg bg-emerald-700 px-3 text-white">
            <Plus size={18} />
          </button>
        </Row>
      </Group>

      <Group title={`Senarai jemputan · ${guests.length}`}>
        {guests.length === 0 ? (
          <Row className="text-center text-sm text-stone-500">Senarai kosong.</Row>
        ) : (
          guests.map((g) => (
            <Row key={g.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{g.name}</p>
                <p className={`text-xs ${pendingIds.has(g.id) ? "text-amber-600" : "text-emerald-700"}`}>
                  {pendingIds.has(g.id) ? "Belum jawab" : "Sudah jawab"}
                  {g.phone && <span className="text-stone-400"> · +{g.phone}</span>}
                </p>
              </div>
              <button
                type="button"
                aria-label="Salin pautan"
                onClick={async () => {
                  await navigator.clipboard.writeText(inviteUrl(g.name)).catch(() => {});
                  setCopied(g.id);
                  setTimeout(() => setCopied(""), 1500);
                }}
                className="p-1.5 text-stone-500"
              >
                {copied === g.id ? <Check size={17} className="text-emerald-600" /> : <Copy size={17} />}
              </button>
              {g.phone && (
                <a href={waLink(g.phone, message(g))} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="p-1.5 text-emerald-700">
                  <MessageCircle size={17} />
                </a>
              )}
              <button
                type="button"
                aria-label="Padam"
                onClick={async () => {
                  await deleteGuest(g.id);
                  onChange();
                }}
                className="p-1.5 text-stone-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </Row>
          ))
        )}
      </Group>
    </>
  );
}

/* ---------------- guestbook moderation ---------------- */

function Wishes({ wishes, onChange }: { wishes: Wish[]; onChange: () => void }) {
  return (
    <Group title={`Ucapan tetamu · ${wishes.length}`} footer="Ucapan dipaparkan secara umum pada kad. Padam yang tidak sesuai.">
      {wishes.length === 0 ? (
        <Row className="text-center text-sm text-stone-500">Belum ada ucapan.</Row>
      ) : (
        wishes.map((w) => (
          <Row key={w.id} className="flex gap-3">
            <div className="flex-1">
              <p className="text-[0.95rem]">{w.message}</p>
              <p className="mt-0.5 text-xs text-stone-500">{w.name}</p>
            </div>
            <button
              type="button"
              aria-label="Padam"
              onClick={async () => {
                if (!confirm("Padam ucapan ini?")) return;
                await deleteWish(w.id);
                onChange();
              }}
              className="p-1 text-stone-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </Row>
        ))
      )}
    </Group>
  );
}