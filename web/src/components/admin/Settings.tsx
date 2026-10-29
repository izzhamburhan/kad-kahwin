"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { isDemo, resetDemoWedding, saveWedding } from "@/lib/data";
import { joinIso, splitIso } from "@/lib/format";
import type { SectionToggles, ThemeId, Wedding } from "@/lib/types";
import { Bilingual, Group, Row, Text, Toggle } from "./ui";

const THEMES: { id: ThemeId; name: string; colors: string[] }[] = [
  { id: "zamrud", name: "Zamrud Songket", colors: ["#0b2620", "#d4af6a", "#f6efe1"] },
  { id: "gading", name: "Gading Champagne", colors: ["#f6efe2", "#a9823b", "#1d3a30"] },
  { id: "nila", name: "Nila Batik", colors: ["#11132a", "#cfa862", "#f3ecdc"] },
];

const SECTION_LABELS: Record<keyof SectionToggles, string> = {
  story: "Kisah kami",
  gallery: "Galeri",
  schedule: "Aturcara",
  dressCode: "Kod pakaian",
  parking: "Tempat letak kereta",
  food: "Hidangan",
  rsvp: "RSVP",
  gift: "Salam kaut",
  guestbook: "Ucapan tetamu",
  contacts: "Hubungi",
};

const uid = () => Math.random().toString(36).slice(2, 9);

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1 text-sm text-red-600">
    <Trash2 size={14} /> Buang
  </button>
);

const AddRow = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Row>
    <button type="button" onClick={onClick} className="flex items-center gap-1.5 text-[0.95rem] text-emerald-700">
      <Plus size={17} /> {label}
    </button>
  </Row>
);

export function Settings({ initial, onSaved }: { initial: Wedding; onSaved: (w: Wedding) => void }) {
  const [w, setW] = useState<Wedding>(initial);
  const [status, setStatus] = useState<"" | "saving" | "saved" | "error">("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(w) !== JSON.stringify(initial);

  /** Edit a copy and store it: update((d) => { d.venue.name = "…" }) */
  const update = (fn: (d: Wedding) => void) =>
    setW((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  const start = splitIso(w.start);
  const end = splitIso(w.end);

  async function save() {
    setStatus("saving");
    try {
      await saveWedding(w);
      onSaved(w);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  return (
    <div className="pb-10">
      <Group title="Tema">
        <Row className="grid grid-cols-3 gap-2">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => update((d) => void (d.theme = th.id))}
              className={`rounded-xl p-2 text-left ring-2 transition ${w.theme === th.id ? "ring-emerald-600" : "ring-transparent"}`}
            >
              <div className="flex h-14 overflow-hidden rounded-lg">
                {th.colors.map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <p className="mt-1.5 text-xs font-medium">{th.name}</p>
            </button>
          ))}
        </Row>
      </Group>

      <Group title="Pengantin">
        <Text label="Nama panggilan lelaki" value={w.couple.groomShort} onChange={(v) => update((d) => void (d.couple.groomShort = v))} />
        <Text label="Nama penuh lelaki" value={w.couple.groomFull} onChange={(v) => update((d) => void (d.couple.groomFull = v))} />
        <Text label="Nama panggilan perempuan" value={w.couple.brideShort} onChange={(v) => update((d) => void (d.couple.brideShort = v))} />
        <Text label="Nama penuh perempuan" value={w.couple.brideFull} onChange={(v) => update((d) => void (d.couple.brideFull = v))} />
        <Text label="Hashtag" value={w.couple.hashtag} onChange={(v) => update((d) => void (d.couple.hashtag = v))} />
      </Group>

      <Group title="Teks jemputan">
        <Row>
          <label className="grid gap-1">
            <span className="text-xs text-stone-500">Majlis belah</span>
            <select
              className="rounded-lg bg-stone-100/80 px-3 py-2"
              value={w.side}
              onChange={(e) => update((d) => void (d.side = e.target.value as Wedding["side"]))}
            >
              <option value="lelaki">Lelaki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </label>
        </Row>
        <Text label="Tuan rumah" value={w.hosts} onChange={(v) => update((d) => void (d.hosts = v))} />
        <Bilingual label="Tajuk" value={w.title} onChange={(v) => update((d) => void (d.title = v))} />
        <Bilingual label="Ayat jemputan" value={w.message} onChange={(v) => update((d) => void (d.message = v))} multiline />
        <Bilingual label="Penutup" value={w.closing} onChange={(v) => update((d) => void (d.closing = v))} multiline />
      </Group>

      <Group title="Tarikh & masa" footer="Waktu Malaysia (GMT+8). Kiraan detik, tarikh Hijrah dan kalendar dikira daripada ini.">
        <Text label="Tarikh" type="date" value={start.date} onChange={(v) => update((d) => {
          d.start = joinIso(v, start.time);
          d.end = joinIso(v, end.time);
        })} />
        <Text label="Mula" type="time" value={start.time} onChange={(v) => update((d) => void (d.start = joinIso(start.date, v)))} />
        <Text label="Tamat" type="time" value={end.time} onChange={(v) => update((d) => void (d.end = joinIso(end.date, v)))} />
      </Group>

      <Group title="Lokasi" footer="Carian peta untuk Google Maps & Waze. Pasangan &quot;lat,lng&quot; lebih tepat.">
        <Text label="Nama dewan" value={w.venue.name} onChange={(v) => update((d) => void (d.venue.name = v))} />
        <Text label="Alamat" value={w.venue.address} onChange={(v) => update((d) => void (d.venue.address = v))} multiline />
        <Text label="Carian peta" value={w.venue.mapQuery} onChange={(v) => update((d) => void (d.venue.mapQuery = v))} />
      </Group>

      <Group title="Aturcara">
        {w.events.map((e, i) => (
          <div key={e.id} className="divide-y divide-stone-100">
            <Text label={`Masa #${i + 1}`} type="time" value={e.time} onChange={(v) => update((d) => void (d.events[i].time = v))} />
            <Bilingual label="Acara" value={e.title} onChange={(v) => update((d) => void (d.events[i].title = v))} />
            <Row>
              <RemoveButton onClick={() => update((d) => void d.events.splice(i, 1))} />
            </Row>
          </div>
        ))}
        <AddRow label="Tambah acara" onClick={() => update((d) => void d.events.push({ id: uid(), time: "12:00", title: { ms: "", en: "" } }))} />
      </Group>

      <Group title="RSVP">
        <Text label="Tarikh akhir" type="date" value={w.rsvp.deadline} onChange={(v) => update((d) => void (d.rsvp.deadline = v))} />
        <Text
          label="Maksimum tetamu setiap jawapan"
          type="number"
          value={w.rsvp.maxPax}
          onChange={(v) => update((d) => void (d.rsvp.maxPax = Math.min(20, Math.max(1, Number(v) || 1))))}
        />
        <Text
          label="WhatsApp untuk RSVP mod demo (cth. 60123456789)"
          value={w.rsvp.whatsapp}
          onChange={(v) => update((d) => void (d.rsvp.whatsapp = v.replace(/\D/g, "")))}
        />
      </Group>

      <Group title="Maklumat tetamu">
        <Bilingual label="Kod pakaian" value={w.dressCode.text} onChange={(v) => update((d) => void (d.dressCode.text = v))} multiline />
        <Text
          label="Warna (hex, dipisah koma)"
          value={w.dressCode.colors.join(", ")}
          onChange={(v) => update((d) => void (d.dressCode.colors = v.split(",").map((x) => x.trim()).filter(Boolean)))}
        />
        <Bilingual label="Tempat letak kereta" value={w.parking} onChange={(v) => update((d) => void (d.parking = v))} multiline />
        <Bilingual label="Hidangan" value={w.food} onChange={(v) => update((d) => void (d.food = v))} multiline />
      </Group>

      <Group title="Hubungi">
        {w.contacts.map((c, i) => (
          <div key={i} className="divide-y divide-stone-100">
            <Text label={`Nama #${i + 1}`} value={c.name} onChange={(v) => update((d) => void (d.contacts[i].name = v))} />
            <Bilingual label="Peranan" value={c.role} onChange={(v) => update((d) => void (d.contacts[i].role = v))} />
            <Text label="Telefon (60…)" value={c.phone} onChange={(v) => update((d) => void (d.contacts[i].phone = v.replace(/\D/g, "")))} />
            <Row>
              <RemoveButton onClick={() => update((d) => void d.contacts.splice(i, 1))} />
            </Row>
          </div>
        ))}
        <AddRow label="Tambah orang" onClick={() => update((d) => void d.contacts.push({ name: "", role: { ms: "", en: "" }, phone: "" }))} />
      </Group>

      <Group title="Salam kaut" footer="Gambar QR: letak fail dalam web/public/ (cth. duitnow.png) atau guna URL penuh.">
        <Text label="Bank" value={w.gift.bank} onChange={(v) => update((d) => void (d.gift.bank = v))} />
        <Text label="Nama akaun" value={w.gift.accountName} onChange={(v) => update((d) => void (d.gift.accountName = v))} />
        <Text label="No. akaun" value={w.gift.accountNo} onChange={(v) => update((d) => void (d.gift.accountNo = v))} />
        <Text label="Gambar QR DuitNow" value={w.gift.qrImage} onChange={(v) => update((d) => void (d.gift.qrImage = v))} />
        <Bilingual label="Nota" value={w.gift.note} onChange={(v) => update((d) => void (d.gift.note = v))} multiline />
      </Group>

      <Group title="Kisah kami">
        {w.story.map((it, i) => (
          <div key={i} className="divide-y divide-stone-100">
            <Text label={`Tahun #${i + 1}`} value={it.year} onChange={(v) => update((d) => void (d.story[i].year = v))} />
            <Bilingual label="Tajuk" value={it.title} onChange={(v) => update((d) => void (d.story[i].title = v))} />
            <Bilingual label="Cerita" value={it.text} onChange={(v) => update((d) => void (d.story[i].text = v))} multiline />
            <Row>
              <RemoveButton onClick={() => update((d) => void d.story.splice(i, 1))} />
            </Row>
          </div>
        ))}
        <AddRow label="Tambah kisah" onClick={() => update((d) => void d.story.push({ year: "", title: { ms: "", en: "" }, text: { ms: "", en: "" } }))} />
      </Group>

      <Group title="Galeri" footer="Letak gambar dalam web/public/photos/ dan tulis photos/nama.jpg, atau guna URL penuh.">
        {w.gallery.map((p, i) => (
          <div key={i} className="divide-y divide-stone-100">
            <Text label={`Gambar #${i + 1}`} value={p.src} onChange={(v) => update((d) => void (d.gallery[i].src = v))} />
            <Text label="Kapsyen" value={p.caption ?? ""} onChange={(v) => update((d) => void (d.gallery[i].caption = v))} />
            <Row>
              <RemoveButton onClick={() => update((d) => void d.gallery.splice(i, 1))} />
            </Row>
          </div>
        ))}
        <AddRow label="Tambah gambar" onClick={() => update((d) => void d.gallery.push({ src: "", caption: "" }))} />
      </Group>

      <Group title="Muzik" footer="Kosongkan untuk tanpa muzik.">
        <Text label="Fail muzik" value={w.music.src} onChange={(v) => update((d) => void (d.music.src = v))} />
      </Group>

      <Group title="Paparkan bahagian">
        {(Object.keys(SECTION_LABELS) as (keyof SectionToggles)[]).map((k) => (
          <Toggle key={k} label={SECTION_LABELS[k]} checked={w.sections[k]} onChange={(v) => update((d) => void (d.sections[k] = v))} />
        ))}
      </Group>

      {isDemo && (
        <button
          type="button"
          onClick={() => {
            if (!confirm("Kembalikan semua tetapan kepada asal?")) return;
            resetDemoWedding();
            location.reload();
          }}
          className="mx-auto block text-sm text-red-600"
        >
          Set semula tetapan demo
        </button>
      )}

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/85 backdrop-blur-xl safe-bottom">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 pt-3">
          <p className="text-sm text-stone-500">
            {status === "saving"
              ? "Menyimpan…"
              : status === "saved"
                ? "Disimpan ✓"
                : status === "error"
                  ? <span className="text-red-600">{error}</span>
                  : dirty
                    ? "Ada perubahan belum disimpan"
                    : "Semua disimpan"}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status === "saving"}
            className="rounded-xl bg-emerald-700 px-6 py-2.5 font-medium text-white transition disabled:opacity-40"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}