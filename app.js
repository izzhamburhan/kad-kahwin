(() => {
  "use strict";
  const C = window.WEDDING;
  const TZ = "Asia/Kuala_Lumpur";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("--")) el.style.setProperty(k, v);
      else el.setAttribute(k, v);
    }
    for (const c of children) el.append(c);
    return el;
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = h("textarea", { style: "position:fixed;opacity:0" });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }

  /* ---------- fill text from config ---------- */
  $$("[data-k]").forEach((el) => {
    const v = get(C, el.dataset.k);
    if (v != null) el.textContent = v;
  });
  $("#monoA").textContent = C.couple.groom.charAt(0);
  $("#monoB").textContent = C.couple.bride.charAt(0);
  document.title = `${C.couple.groom} & ${C.couple.bride} · Walimatul Urus`;

  // Personalised guest name: index.html?to=Encik%20Ali
  const guest = new URLSearchParams(location.search).get("to");
  if (guest) $("#guestName").textContent = guest.trim().slice(0, 60);

  /* ---------- dates ---------- */
  const start = new Date(C.event.start);
  const end = new Date(C.event.end);
  const fmt = (d, opts) => new Intl.DateTimeFormat("ms-MY", { timeZone: TZ, ...opts }).format(d);
  const dayName = fmt(start, { weekday: "long" });
  const dayNum = fmt(start, { day: "numeric" });
  const monthName = fmt(start, { month: "long" });
  const year = fmt(start, { year: "numeric" });

  const HIJRI_MONTHS = ["Muharram", "Safar", "Rabiulawal", "Rabiulakhir", "Jamadilawal", "Jamadilakhir",
    "Rejab", "Syaaban", "Ramadan", "Syawal", "Zulkaedah", "Zulhijjah"];
  function hijri(d) {
    try {
      const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        timeZone: TZ, day: "numeric", month: "numeric", year: "numeric",
      }).formatToParts(d);
      const part = (t) => parts.find((p) => p.type === t)?.value;
      return `${part("day")} ${HIJRI_MONTHS[Number(part("month")) - 1]} ${parseInt(part("year"), 10)}H`;
    } catch {
      return "";
    }
  }
  const hijriText = hijri(start);

  $("#coverDate").textContent = `${dayNum} · ${monthName} · ${year}`;
  $("#heroDate").textContent = `${dayName} · ${dayNum} ${monthName} ${year}`;
  $("#heroHijri").textContent = hijriText;
  $("#dDay").textContent = dayName;
  $("#dNum").textContent = dayNum;
  $("#dMonth").textContent = monthName;
  $("#dYear").textContent = year;
  $("#dHijri").textContent = hijriText;
  $("#rsvpDeadline").textContent = fmt(new Date(`${C.rsvp.deadline}T23:59:00+08:00`), { day: "numeric", month: "long", year: "numeric" });
  $("#calSummary").textContent = `${dayName}, ${dayNum} ${monthName} ${year} · ${C.event.timeLabel}`;

  /* ---------- countdown ---------- */
  const cd = { D: $("#cdD"), H: $("#cdH"), M: $("#cdM"), S: $("#cdS") };
  function tickCountdown() {
    const diff = start - Date.now();
    if (diff <= 0) {
      const box = $("#countdown");
      box.classList.add("done");
      box.textContent = Date.now() < end ? "Majlis sedang berlangsung. Selamat datang!" : "Alhamdulillah, majlis telah selamat berlangsung.";
      clearInterval(tickCountdown.timer);
      return;
    }
    const vals = {
      D: Math.floor(diff / 864e5),
      H: Math.floor(diff / 36e5) % 24,
      M: Math.floor(diff / 6e4) % 60,
      S: Math.floor(diff / 1e3) % 60,
    };
    for (const k in vals) {
      const txt = String(vals[k]).padStart(2, "0");
      if (cd[k].textContent !== txt) {
        cd[k].textContent = txt;
        cd[k].classList.remove("tick");
        void cd[k].offsetWidth;
        cd[k].classList.add("tick");
      }
    }
  }
  tickCountdown();
  tickCountdown.timer = setInterval(tickCountdown, 1000);

  /* ---------- schedule ---------- */
  const sched = $("#schedule");
  C.schedule.forEach((s, i) => {
    sched.append(h("li", { class: "reveal", "--d": String(i) }, h("time", {}, s.time), h("span", {}, s.title)));
  });

  /* ---------- location ---------- */
  const q = encodeURIComponent(C.venue.mapQuery || `${C.venue.name}, ${C.venue.address}`);
  $("#mapFrame").src = `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  $("#wazeLink").href = `https://waze.com/ul?q=${q}&navigate=yes`;
  $("#gmapLink").href = `https://www.google.com/maps/search/?api=1&query=${q}`;

  /* ---------- contacts ---------- */
  const phoneIcon = '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
  const waIcon = '<svg viewBox="0 0 24 24"><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2z"/></svg>';
  const contacts = $("#contacts");
  C.contacts.forEach((c, i) => {
    contacts.append(h("li", { class: "reveal", "--d": String(i) },
      h("div", { class: "who" }, h("strong", {}, c.name), h("small", {}, c.role)),
      h("a", { href: `tel:+${c.phone}`, "aria-label": `Telefon ${c.name}`, html: phoneIcon }),
      h("a", { class: "wa", href: `https://wa.me/${c.phone}`, target: "_blank", rel: "noopener", "aria-label": `WhatsApp ${c.name}`, html: waIcon }),
    ));
  });

  /* ---------- gift & QR ---------- */
  function qrSvg(text, color) {
    if (!window.qrcode) return null;
    if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs["UTF-8"]) qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
    const qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    return qr.createSvgTag(4, 0).replace(/fill="black"/g, `fill="${color}"`);
  }
  function fillQr(el, text) {
    const svg = qrSvg(text, "#5b1626");
    if (svg) el.innerHTML = svg;
    else el.remove();
  }
  const giftQr = $("#giftQr");
  if (C.gift.qrImage) {
    giftQr.append(h("img", { src: C.gift.qrImage, alt: `DuitNow QR ${C.gift.accountName}` }));
  } else {
    fillQr(giftQr, `${C.gift.bank} ${C.gift.accountNo.replace(/\s/g, "")} ${C.gift.accountName}`);
  }
  $("#copyAcc").addEventListener("click", async () => {
    await copyText(C.gift.accountNo.replace(/\s/g, ""));
    toast("Nombor akaun disalin");
  });
  const wl = $("#wishlist");
  (C.gift.wishlist || []).forEach((w) => {
    wl.append(h("li", {}, h("span", {}, w.name), h("a", { class: "btn", href: w.link, target: "_blank", rel: "noopener" }, "Tempah")));
  });

  const shareUrl = location.href.split("?")[0].split("#")[0];
  fillQr($("#shareQr"), shareUrl);
  $("#shareBtn").addEventListener("click", async () => {
    const data = { title: document.title, text: `Jemputan ${C.event.title}`, url: shareUrl };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelled */ }
    } else {
      await copyText(shareUrl);
      toast("Pautan jemputan disalin");
    }
  });

  /* ---------- calendar ---------- */
  const utc = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const where = `${C.venue.name}, ${C.venue.address}`;
  $("#gcalLink").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(C.event.title)}` +
    `&dates=${utc(start)}/${utc(end)}` +
    `&location=${encodeURIComponent(where)}` +
    `&details=${encodeURIComponent(`Jemputan ${C.event.title}. RSVP: ${shareUrl}`)}`;
  $("#icsBtn").addEventListener("click", () => {
    const esc = (s) => s.replace(/[\\;,]/g, (m) => "\\" + m);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//kad-kahwin//MS", "BEGIN:VEVENT",
      `UID:${utc(start)}-${C.couple.groom}-${C.couple.bride}@kad-kahwin`,
      `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(start)}`, `DTEND:${utc(end)}`,
      `SUMMARY:${esc(C.event.title)}`, `LOCATION:${esc(where)}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${esc(C.event.title)}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = h("a", { href: URL.createObjectURL(new Blob([ics], { type: "text/calendar" })), download: "walimatul-urus.ics" });
    document.body.append(a);
    a.click();
    a.remove();
  });

  $$("[data-open]").forEach((b) => b.addEventListener("click", () => $("#" + b.dataset.open).showModal()));
  $$("dialog").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
  });

  /* ---------- RSVP ---------- */
  const form = $("#rsvpForm");
  const f = form.elements;
  const thanks = $("#rsvpThanks");
  const paxOut = $("#paxOut");
  const paxRow = $(".pax-row");
  let pax = 1;
  $$("[data-step]").forEach((b) => b.addEventListener("click", () => {
    pax = Math.min(C.rsvp.maxPax, Math.max(1, pax + Number(b.dataset.step)));
    paxOut.textContent = pax;
  }));
  form.addEventListener("change", () => {
    paxRow.classList.toggle("off", f.attend.value !== "Hadir");
  });

  function showThanks(d) {
    form.hidden = true;
    thanks.hidden = false;
    $("#thanksMsg").textContent = d.attend === "Hadir"
      ? `${d.name}, kami menanti kehadiran ${d.pax} orang tetamu.`
      : `${d.name}, doa dan ucapan anda amat kami hargai.`;
  }
  $("#rsvpEdit").addEventListener("click", () => {
    thanks.hidden = true;
    form.hidden = false;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#rsvpError");
    const d = {
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      attend: f.attend.value,
      pax: f.attend.value === "Hadir" ? pax : 0,
      wish: f.wish.value.trim(),
    };
    if (!d.name) {
      err.textContent = "Sila isi nama anda.";
      f.name.focus();
      return;
    }
    err.textContent = "";
    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    try {
      if (C.rsvp.endpoint) {
        await fetch(C.rsvp.endpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(d) });
      } else {
        const msg = [`*RSVP ${C.event.title}*`, `Nama: ${d.name}`, `Telefon: ${d.phone || "-"}`,
          `Kehadiran: ${d.attend}`, `Bilangan: ${d.pax}`, `Ucapan: ${d.wish || "-"}`].join("\n");
        window.open(`https://wa.me/${C.rsvp.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      }
      try { localStorage.setItem("rsvp", JSON.stringify(d)); } catch { /* storage unavailable */ }
      showThanks(d);
    } catch {
      err.textContent = "Maaf, RSVP tidak berjaya dihantar. Sila cuba lagi.";
    } finally {
      btn.disabled = false;
    }
  });

  try {
    const saved = JSON.parse(localStorage.getItem("rsvp") || "null");
    if (saved) {
      f.name.value = saved.name || "";
      f.phone.value = saved.phone || "";
      f.wish.value = saved.wish || "";
      f.attend.value = saved.attend || "Hadir";
      pax = saved.pax || 1;
      paxOut.textContent = pax;
      showThanks(saved);
    }
  } catch { /* ignore */ }

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- music ---------- */
  // Generated music-box melody (no audio file needed): Cmaj7 – Am7 – Fmaj7 – G
  class MusicBox {
    constructor() {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = (this.ctx = new AC());
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      this.master.connect(comp).connect(ctx.destination);
      this.verb = ctx.createConvolver();
      this.verb.buffer = this.impulse(3.4);
      const wet = ctx.createGain();
      wet.gain.value = 0.45;
      this.verb.connect(wet).connect(this.master);
      this.dry = ctx.createGain();
      this.dry.connect(this.master);
      this.beat = 60 / 66;
      this.step = 0;
      this.gen = 0;
      this.prog = [
        { pad: [48, 55, 64, 71], arp: [60, 64, 67, 71, 72, 71, 67, 64] },
        { pad: [45, 52, 60, 67], arp: [57, 60, 64, 67, 69, 67, 64, 60] },
        { pad: [41, 48, 57, 64], arp: [53, 57, 60, 64, 65, 64, 60, 57] },
        { pad: [43, 50, 59, 62], arp: [55, 59, 62, 67, 71, 67, 62, 59] },
      ];
      this.melody = [
        [[[0, 76], [1.5, 79], [3, 83]], [[0, 81], [2, 79], [3, 76]], [[0, 77], [1.5, 76], [3, 72]], [[0, 74], [2, 71], [3, 74]]],
        [[[0, 79], [1, 76], [2, 74], [3, 76]], [[0, 72], [2, 76]], [[0, 77], [1, 81], [2, 79], [3, 77]], [[0, 76], [2, 74], [3.5, 71]]],
      ];
    }
    impulse(sec) {
      const rate = this.ctx.sampleRate, len = Math.floor(rate * sec);
      const buf = this.ctx.createBuffer(2, len, rate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      return buf;
    }
    hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    bell(t, midi, vel) {
      const ctx = this.ctx;
      [[1, 1], [2, 0.22], [3.01, 0.07]].forEach(([mul, amp]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = this.hz(midi) * mul;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vel * amp, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4 / mul);
        o.connect(g);
        g.connect(this.dry);
        g.connect(this.verb);
        o.start(t);
        o.stop(t + 2.5);
      });
    }
    pad(t, notes, dur) {
      const ctx = this.ctx;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      lp.connect(this.verb);
      lp.connect(this.dry);
      notes.forEach((m) => [-7, 7].forEach((det) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = this.hz(m);
        o.detune.value = det;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.022, t + 1.2);
        g.gain.setValueAtTime(0.022, t + dur - 0.2);
        g.gain.linearRampToValueAtTime(0, t + dur + 0.9);
        o.connect(g).connect(lp);
        o.start(t);
        o.stop(t + dur + 1);
      }));
    }
    schedule() {
      const now = this.ctx.currentTime;
      if (this.next < now - 0.2) this.next = now + 0.05; // tab was throttled; skip ahead
      while (this.next < now + 0.3) {
        const t = this.next, bar = Math.floor(this.step / 8), pos = this.step % 8;
        const chord = this.prog[bar % 4];
        const mel = this.melody[Math.floor(bar / 4) % 2][bar % 4];
        if (pos === 0) this.pad(t, chord.pad, this.beat * 4);
        this.bell(t, chord.arp[pos], 0.045);
        mel.forEach(([b, m]) => { if (b * 2 === pos) this.bell(t, m, 0.13); });
        this.step++;
        this.next += this.beat / 2;
      }
    }
    start() {
      this.gen++;
      this.ctx.resume();
      if (!this.timer) {
        this.next = this.ctx.currentTime + 0.1;
        this.timer = setInterval(() => this.schedule(), 60);
      }
      const g = this.master.gain;
      g.cancelScheduledValues(this.ctx.currentTime);
      g.setTargetAtTime(0.6, this.ctx.currentTime, 0.8);
    }
    stop() {
      const gen = this.gen;
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
      setTimeout(() => {
        if (gen !== this.gen) return;
        clearInterval(this.timer);
        this.timer = null;
        this.ctx.suspend();
      }, 1200);
    }
  }

  const musicBtn = $("#musicBtn");
  const music = {
    on: false,
    audio: null,
    box: null,
    useBox: !C.music.src,
    play() {
      if (!this.useBox) {
        if (!this.audio) {
          this.audio = new Audio(C.music.src);
          this.audio.loop = true;
          this.audio.addEventListener("error", () => { this.useBox = true; if (this.on) this.play(); });
        }
        this.audio.play().catch(() => {});
      } else {
        try {
          this.box = this.box || new MusicBox();
          this.box.start();
        } catch { return; }
      }
      this.set(true);
    },
    pause() {
      if (this.audio) this.audio.pause();
      if (this.box) this.box.stop();
      this.set(false);
    },
    set(v) {
      this.on = v;
      musicBtn.setAttribute("aria-pressed", String(v));
    },
  };
  musicBtn.addEventListener("click", () => {
    music.wanted = !music.on;
    music.wanted ? music.play() : music.pause();
  });
  document.addEventListener("visibilitychange", () => {
    if (!music.wanted) return;
    document.hidden ? music.pause() : music.play();
  });

  /* ---------- petals ---------- */
  const petals = (() => {
    const cv = $("#petals");
    const cx = cv.getContext("2d");
    const colors = ["#e9b9b3", "#d98f95", "#b9636c", "#8e2a3c", "#f3e0a8", "#fbe3df"];
    let W = 0, H = 0, list = [], running = false;
    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth;
      H = innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(burst) {
      const p = {
        s: rand(5, 11), rot: rand(0, 6.28), vr: rand(-0.03, 0.03), sw: rand(0, 6.28), flip: rand(0, 6.28),
        c: colors[Math.floor(Math.random() * colors.length)], a: rand(0.55, 0.95), burst,
        fall: rand(0.5, 1.3), drift: rand(-0.3, 0.3),
      };
      if (burst) {
        const ang = rand(0, Math.PI * 2), sp = rand(4, 12);
        p.x = W / 2; p.y = H / 2; p.vx = Math.cos(ang) * sp; p.vy = Math.sin(ang) * sp - 3;
      } else {
        p.x = rand(0, W); p.y = rand(-H, -10); p.vx = p.drift; p.vy = p.fall;
      }
      return p;
    }
    function drawPetal(p) {
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.scale(1, 0.35 + Math.abs(Math.cos(p.flip)) * 0.65);
      cx.globalAlpha = p.a;
      cx.fillStyle = p.c;
      const s = p.s;
      cx.beginPath();
      cx.moveTo(0, -s);
      cx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.7, s * 0.7, 0, s);
      cx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.6, 0, -s);
      cx.fill();
      cx.restore();
    }
    function frame() {
      if (!running) return;
      cx.clearRect(0, 0, W, H);
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.sw += 0.02;
        p.flip += 0.04;
        p.rot += p.vr;
        p.vx += (p.drift - p.vx) * 0.02;
        p.vy += (p.fall - p.vy) * 0.02;
        p.x += p.vx + Math.sin(p.sw) * 0.6;
        p.y += p.vy;
        if (p.y > H + 20 || p.x < -40 || p.x > W + 40) {
          if (p.burst) { list.splice(i, 1); continue; }
          Object.assign(p, make(false), { y: -20 });
        }
        drawPetal(p);
      }
      requestAnimationFrame(frame);
    }
    return {
      start() {
        if (reducedMotion || running) return;
        resize();
        addEventListener("resize", resize);
        const n = W < 600 ? 22 : 34;
        for (let i = 0; i < n; i++) list.push(make(false));
        for (let i = 0; i < 40; i++) list.push(make(true));
        running = true;
        requestAnimationFrame(frame);
      },
    };
  })();

  /* ---------- open the invitation ---------- */
  const cover = $("#cover");
  function openInvite() {
    if (document.body.classList.contains("opened")) return;
    scrollTo(0, 0);
    cover.classList.add("opening");
    document.body.classList.remove("locked");
    document.body.classList.add("opened");
    music.wanted = true;
    music.play();
    petals.start();
    setTimeout(() => cover.classList.add("gone"), reducedMotion ? 50 : 1900);
  }
  $("#openBtn").addEventListener("click", openInvite);
})();
