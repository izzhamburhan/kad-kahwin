# Malaysian Digital Wedding Invitation Platforms: Competitor Research

Checked on 1 November 2026, against the live websites.

## How this was gathered

- Each platform's home page was fetched, plus its pricing or package page where one exists (`nakjemput.com/pakej`, `raikad.com/harga`, `jemputan.me/packages`, `kadkahwinmy.com/faq/digital`, one `aliveinvite.com` design page).
- Three sites render their content with JavaScript and gave little text to a plain fetch: Jemputan.me, Ajaklah and Kadkahwinmy. For these, the raw HTML and app bundle were read for what the product exposes, such as route names, form fields and template prices. Findings from that source are marked **(from app code)**. They show what the software contains, not what a given package includes.
- Visual quality was judged from what pages describe and how their demos are named, not from hands-on testing of every demo. Animation claims are the platform's own words.
- **Not verified** means the information did not appear on the pages checked. It does not mean the platform lacks the feature.
- Prices are one-time unless stated. Struck-through "was" prices are as shown on the site.
- Claims such as "5,000+ couples", "No. 1" and star ratings are the platforms' own and were not checked.

---

## 1. Platform profiles

### 1. Jemputan.me — https://jemputan.me
- **UI/UX and visual design:** A Vue single-page app. Its description says "DIY kad digital anda di Studio kami", so it offers a self-serve editor. Events covered: weddings, birthdays and aqiqah.
- **Animation:** An envelope image is preloaded, which points to an envelope opening **(from app code)**. Other effects are not verified.
- **Templates:** The count is not verified. The editor ships Arabic calligraphy assets such as "Assalamualaikum" and a rich-text editor **(from app code)**.
- **RSVP and guest management:** The RSVP form has configurable fields: name, home address, vehicle plate number, company name, job title, notes, wishes, attending or not, and pax **(from app code)**.
- **Guest list and tracking:** Not verified.
- **Maps and Waze:** Not verified.
- **DuitNow and gifts:** A Malaysian and Bruneian bank list and a "Registry" module are present **(from app code)**. DuitNow QR is not verified.
- **Music, gallery, countdown:** Not verified.
- **Customisation:** DIY studio editor.
- **Pricing:** Not verified. The packages page did not render.
- **Unique selling points:** Business-style RSVP fields (company, job title, plate number) suit corporate events and VIP parking. It also has PDF view and vouchers **(from app code)**.

### 2. KahwinNow — https://kahwinnow.com
- **UI/UX:** Card previews with a demo URL per design (e.g. `/floral-001/preview`) and per package.
- **Animation:** A "Motion" design category exists. Specific effects are not verified.
- **Templates:** 300+ designs in the categories Floral, Motion, Khat and Traditional.
- **RSVP:** Yes, on Honey Moon and above. Guestbook with host deletion of messages.
- **Guest list and tracking:** A testimonial mentions monitoring attendance. A dashboard is not described.
- **Maps and Waze:** Google Maps and Waze.
- **DuitNow and gifts:** "Money Gift" pays directly into the host's bank account. DuitNow is not named. Wishlist of 10 items on Golden Star.
- **Music:** Choose from a song list or add a YouTube link.
- **Gallery:** Photo gallery. Video is not verified.
- **Countdown:** Yes. Also add-to-calendar and contact buttons.
- **Customisation:** Form-based. You pick a design, fill in the details, and can edit until the event date.
- **Pricing:**

  | Package | Price | Contents |
  |---|---|---|
  | Cinta Rahmah | RM39 (was RM60) | Contact, location, calendar, music, guestbook, gallery, countdown |
  | Honey Moon | RM59 (was RM80) | Cinta Rahmah plus RSVP and Money Gift |
  | Golden Star | RM89 (was RM110) | Honey Moon plus wishlist (10 items) and a PDF version |

- **Unique selling points:** Large catalogue. Done-for-you processing in 1–2 working days. 24/7 support. Claims 2,800+ bookings since 2023.

### 3. NakJemput — https://nakjemput.com
- **UI/UX:** Positioned as "ready in about 5 minutes" and shared via WhatsApp.
- **Animation:** Not verified.
- **Templates:** 278+ designs.
- **RSVP:** "RSVP Automatik" with one-click confirm, on Premium.
- **Guest list and tracking:** Not verified.
- **Maps and Waze:** "Lokasi + Waze". Maps on both tiers.
- **DuitNow and gifts:** Money Gift (online salam kaut) and a wishlist, both on Premium. The meta description mentions a "QR duit hadiah". DuitNow is not named.
- **Music:** Both tiers.
- **Gallery:** Both tiers. YouTube video on Premium.
- **Countdown:** Both tiers. Also calendar and contact.
- **Customisation:** Custom design and BM/EN language on Premium. PDF on Premium (beta).
- **Pricing:**

  | Package | Price | Notes |
  |---|---|---|
  | Basic | RM27.90 | No visitor limit. Link never expires. Details editable for 90 days. |
  | Premium | RM57.90 | Adds RSVP, money gift, wishlist, guestbook, YouTube, BM/EN, custom design and PDF. Editable for 180 days. |

- **Unique selling points:** Lowest entry price among the paid-only platforms. Gift wishlist to avoid duplicate gifts. Claims 1,000+ customers.

### 4. Kadkahwinmy — https://kadkahwinmy.com
- **UI/UX:** A combined digital and physical card business.
- **Animation:** Not verified. The site has (hidden) info pages for "Motion (MY)" video and "Keepsake" **(from app code)**.
- **Templates:** "Pelbagai pilihan design". The count is not verified.
- **RSVP:** Yes.
- **Guest list and tracking:** Not verified.
- **Maps:** A location map. The provider is not verified.
- **DuitNow and gifts:** Not verified.
- **Music:** Yes.
- **Gallery:** Yes.
- **Countdown:** Not verified.
- **Customisation:** Not verified.
- **Pricing:** Not verified.
- **Unique selling points:** One vendor for both digital and printed cards. Has an agent/reseller programme (terms page present) **(from app code)**.

### 5. AliveInvite — https://aliveinvite.com
- **UI/UX:** A catalogue organised by category and filterable by tag and colour. A "Nak try?" tool previews a card with your own names.
- **Animation:** Not verified. Front-end controllers named `gift-box-preview` and `welcome-board-preview` suggest gift box and welcome board products **(from app code, not verified as features)**.
- **Templates:** About 40 designs linked from the home page. Categories: Be Different, Floral & Botanical, Islamic Contemporary, Simple & Minimalist, Traditional Pattern, Rustic & Vintage. Tags: Botanical, Ethnic, Geometrical, Marble, Tropical, Watercolour.
- **RSVP, guest tracking, maps, gifts, music, gallery and countdown:** All not verified.
- **Pricing:** RM50.0 for "AliveInvite Digital Card", shown on the design page checked.
- **Unique selling points:** Live preview with your own names before buying. Linked to nikahsatu.com deals.

### 6. Kahwin Studio — https://www.kahwinstudio.com
- **UI/UX:** Bilingual BM/EN. A free trial with no sign-up. One page holds akad, reception and directions.
- **Animation:** Not verified beyond the countdown.
- **Templates:** 13 themes. Free tier: 2 (Classic, Garden). Named themes: Botanica, Garden, Serenade, Istana, Classic, Senja. Demo at `/demo/<theme>`.
- **RSVP:** Unlimited RSVPs on all plans. The free tier shows details for only the first 5.
- **Guest list and tracking:** Dashboard and CSV export on Standard and Premium. Digital guestbook.
- **Maps:** "Peta dan panduan arah" on all plans. The provider is not named.
- **DuitNow and gifts:** Salam kaut via DuitNow QR and e-wallets on Standard. Up to 3 QR options on Premium.
- **Music and countdown:** All plans.
- **Gallery:** Free has 1 cover photo. Standard and Premium have 6 photos plus per-section photos. Premium adds a **digital disposable camera via QR** (guest photos and voice messages) and a post-event guest memories gallery with downloads.
- **Customisation:** Story entries (3 on Free, 15 on Standard). Custom link. Branding removed. Printable message cards. Premium includes a personal designer, with a first draft within 3 working days. **Edits after sharing keep the same link.**
- **Pricing:**

  | Plan | Price |
  |---|---|
  | Free | RM0 |
  | Standard | RM59 (was RM79) |
  | Premium | RM119 (was RM159) |
  | Standard → Premium upgrade | RM60 |

- **Unique selling points:** A real free tier, a guest photo and voice capture loop, and a human designer option.

### 7. Raikad — https://raikad.com
- **UI/UX:** Templates for weddings, birthdays and open houses. "Mudah disunting".
- **Animation:** Not verified.
- **Templates:** The count is not verified. Sample at `/templates/wedding-elegant/preview`.
- **RSVP:** "RSVP pintar" with an RSVP dashboard and a pax limit per invitation.
- **Guest list and tracking:** **QR check-in** and CSV export. Guestbook.
- **Maps:** "Peta" is mentioned. The provider is not verified.
- **DuitNow and gifts:** Not verified.
- **Music and gallery:** Yes.
- **Countdown:** Not verified.
- **Pricing:** RM0 ("Raikad Percuma", described as free "buat masa ini"). No bank card needed.
- **Unique selling points:** Free, and the only platform found with QR check-in at the venue.

### 8. Ajaklah — https://ajaklah.com
- **UI/UX:** The rendered marketing text was not available. The app is Laravel and Inertia.
- **Animation:** Template components include `VideoLoader` and `KainSongketVideo`, which point to video openings **(from app code)**.
- **Templates:** About 101 template components **(from app code)**. They include KainSongket, SongketNila, Istana, IstanaTropika, IslamicArch, EmeraldMasjid, TiraiTaman, Newspaper, SilhouetteDance, TwilightLanterns, plus aqiqah, birthday and children's themes.
- **RSVP:** RSVP pages with manage and live feed routes **(from app code)**.
- **Guest list and tracking:** Reports and an invitation QR **(from app code)**.
- **Gallery:** A **live guest photo gallery**: QR upload, moderation with auto-approve, a live feed, a cover from a photo, and download **(from app code)**.
- **Gifts:** Wishlist routes **(from app code)**. DuitNow is not verified.
- **Maps, music and countdown:** Not verified.
- **Customisation:** "Own design" templates and a PDF design export **(from app code)**.
- **Pricing:** Featured wedding templates cost **RM25.00 or RM30.00**, from template data on the home page. Paid add-ons exist (add-on payment route). Exact add-on prices are not verified.
- **Unique selling points:** A wedding vendor marketplace with bookings, a live photo wall, and a PDF export **(from app code)**.

### 9. Kad2u — https://kad2u.com
- **UI/UX:** Mobile-friendly. Shareable link and QR code. Covers many event types, including wedding, engagement, aqiqah, Raya, Deepavali, CNY and corporate.
- **Animation:** The card's opener can be customised. Specific effects are not verified.
- **Templates:** A "Design Catalog". The count is not verified.
- **RSVP:** All plans, with a dashboard total.
- **Guest list and tracking:** **Guest Name Link** (a personalised link per guest) and RSVP CSV export, both on Exclusive.
- **Maps, gifts and countdown:** Not verified.
- **Music:** Premium and above.
- **Gallery:** Gallery and "Memory Album" on Premium and above.
- **Customisation:** Theme colour, font, opener, and key sections.
- **Pricing:**

  | Plan | Price | Cards | Adds |
  |---|---|---|---|
  | Basic | RM29 | 1 | RSVP, QR code, theme colour |
  | Premium | RM59 | 2 | Guestbook, gallery, music |
  | Exclusive | RM99 | 10 | Guest Name Link, CSV export |

- **Unique selling points:** Multi-card bundles and broad multi-cultural event coverage.

### 10. Creatr — https://creatr.my
- **UI/UX:** "Interactive mini-website". Setup in about 5 minutes with no credit card.
- **Animation:** Motion video themes. Ultimate includes a **60-second 1080p MP4 motion video** for WhatsApp and Instagram.
- **Templates:** 5 (Floral, Cinematic, Moden, Royal, Islamic).
- **RSVP:** Starter and above. Guestbook on Premium and above. **Guest time slots** on Premium.
- **Guest list and tracking:** Not verified.
- **Maps:** Google Maps and Waze on all plans.
- **DuitNow and gifts:** Money gift and angpow QR on Premium and above. DuitNow is not named.
- **Music and gallery:** Premium and above.
- **Countdown:** All plans.
- **Customisation:** Invitation wording in **Formal, Santai or Pantun** style. Unlimited edits on Premium and above.
- **Pricing:**

  | Plan | Price | Link validity |
  |---|---|---|
  | Starter | RM49 | 60 days |
  | Premium | RM79 | 1 year |
  | Ultimate | RM129 | Lifetime, plus motion video |

  Payment by FPX or e-wallet.
- **Unique selling points:** Three tools in one: invitation, motion video and wording. Claims 5,000+ couples and a 4.9★ rating.

### 11. Kunjung.my — https://kunjung.my
- **UI/UX:** 9:16 cards with a "Scroll" prompt. There is a builder at `/build` and a sample at `kunjung.my/aina-hakim`. The page includes an AI chat block.
- **Animation:** Theme names include "Animated". Specific effects are not verified.
- **Templates:** 9 themes across weddings, Raya, birthdays and receptions.
- **RSVP:** Attending, not attending or **maybe**, with pax and a message. Unlimited RSVPs on Premium.
- **Guest list and tracking:** A dashboard with totals for attending and maybe, and pax per guest.
- **Maps:** Google Maps on Premium. Waze is not verified.
- **DuitNow and gifts:** "Salam Kaup QR" with DuitNow or Touch 'n Go.
- **Music:** Premium.
- **Gallery and countdown:** Not verified.
- **Customisation:** Colours and a custom URL slug. Watermark removed on Premium.
- **Pricing:** Free RM0. **Premium RM25 per event.** Payment by FPX via ToyyibPay.
- **Unique selling points:** The cheapest paid tier found. Short custom links. A ready-made WhatsApp caption.

### 12. EkadInvite — https://ekadinvite.my
- **UI/UX:** "Tap to preview". Setup in under 10 minutes. Cards are not indexed by Google.
- **Animation:** **Particle effects** on both plans.
- **Templates:** 325+ designs, 13 categories, 22 event types. Custom designs by WhatsApp.
- **RSVP:** Unlimited, attending or not, with **adult and child companions**.
- **Guest list and tracking:** A live dashboard with stats. CSV export with search and filters, including name, phone, status, count and date.
- **Maps:** Google Maps and Waze in one tap, a copy-address button, and **parking, surau and location notes**.
- **DuitNow and gifts:** On Diamond: DuitNow QR, bank details, and 5 e-wallets (TNG, GrabPay, Boost, ShopeePay, DuitNow). Structured gift registry.
- **Music:** Both plans, with a YouTube option.
- **Gallery:** 10 photos (Gold) or 20 (Diamond). Video by YouTube link. "Kisah Kami" photo timeline on Diamond.
- **Countdown:** Live, on both plans. Add-to-calendar.
- **Customisation:** Accent colours, font pairings, particle effects, **multiple events in one link (Akad and Resepsi)**, parents' names, a prayer section, BM, EN or bilingual. On Diamond: **VIP invitations with personalised names and titles (Dato', Datin) and private notes**, schedule, and social links.
- **Pricing:** **Gold RM29**, **Diamond RM69**, one-time. Cards never expire. 48-hour refund if the card is not yet published. Payment by FPX, DuitNow, card, Apple Pay or Google Pay.
- **Unique selling points:** The most complete practical feature set at a low price.

### 13. Invito Studio — https://invitostudio.com/wedding-invitations/malaysia
- **UI/UX:** A regional platform with a Malaysia landing page. Opens inside WhatsApp with no app needed.
- **Animation:** The most explicit about reveal mechanics: **cinematic loading** (Dolce Vita), **wax seal reveal** (Riviera Chic), **gift box opening** (First Light), and **premium unboxing** (Golden Milestone).
- **Templates:** 45 in total. Six highlighted, mostly European styles (Italian, Mediterranean, illustrated).
- **RSVP:** One-tap with headcount. Responses go to a dashboard. 1,000 guests cost the same as 100.
- **Maps:** "Live map navigation". The provider is not named.
- **DuitNow and gifts, music, gallery, countdown:** Not verified.
- **Customisation:** Malay, English, or both mixed.
- **Pricing:** Premium at about **USD 15** one-time. The page also shows LKR 4,500. An RM price is not shown.
- **Unique selling points:** Showpiece opening animations. Little Malaysian cultural content.

### 14. OhMyKad — https://www.ohmykad.com
- **UI/UX:** Cards "arrive sealed". A tap or scroll reveals the names. **AI drafts the full card from a short description.**
- **Animation:** Sealed reveal. "Effects" on Flair.
- **Templates:** The count is not verified. Six samples, e.g. "Dusty Rose Peonies", "Jasmine Garden Frame", "Gold Tekat on Emerald Velvet". Covers weddings, aqiqah, Raya and birthdays.
- **RSVP:** One tap, "Yes, with pleasure" or "Sadly, we can't come", with a headcount. Guest list with party sizes on Flair.
- **Maps:** Waze and Maps.
- **DuitNow and gifts:** Bank transfer or DuitNow QR on Flair. Gift registry on Grand.
- **Music and countdown:** On Charm (the free tier). The countdown shows days remaining.
- **Gallery:** 3 photos on Flair.
- **Wishes:** A written wishes wall on Flair. **Voice wishes (up to 300)** on Grand.
- **Customisation:** Motifs and styles on Charm. Your own cover and colours, plus a printable card, on Grand.
- **Pricing:**

  | Plan | Price |
  |---|---|
  | Charm | Free (was RM29) |
  | Flair | RM49 per card (was RM69) |
  | Grand | RM99 per card (was RM129) |

- **Unique selling points:** The AI-generated card, voice wishes, and the sealed-card reveal.

### 15. Mawaddah — https://mawaddah.my
- **Not reachable.** DNS lookups for `mawaddah.my` and `www.mawaddah.my` failed (ENOTFOUND) on 1 November 2026. **Every field is Not verified.**

---

## 2. Competitor comparison matrix

Key: ✓ = stated on the site · P = only on a paid or higher tier · C = seen in app code only · NV = not verified

| Platform | Templates | Opening animation | RSVP | Dashboard / CSV | QR check-in | Maps / Waze | DuitNow / money gift | Music | Gallery | Countdown | BM/EN | Per-guest link | Price (RM) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Jemputan.me | NV (DIY studio) | Envelope (C) | ✓ custom fields (C) | NV | NV | NV | Bank list, registry (C) | NV | NV | NV | ✓ (C) | NV | NV |
| KahwinNow | 300+ | "Motion" category | P | NV | NV | ✓ both | P (bank) | ✓ + YouTube | ✓ | ✓ | NV | NV | 39 / 59 / 89 |
| NakJemput | 278+ | NV | P | NV | NV | ✓ Waze | P | ✓ | ✓ | ✓ | P | NV | 27.90 / 57.90 |
| Kadkahwinmy | NV | Motion video (C) | ✓ | NV | NV | Map (NV provider) | NV | ✓ | ✓ | NV | NV | NV | NV |
| AliveInvite | ~40 shown | NV | NV | NV | NV | NV | NV | NV | NV | NV | NV | NV | 50 |
| Kahwin Studio | 13 | NV | ✓ (5 visible free) | P | NV | ✓ (NV provider) | P DuitNow + e-wallet | ✓ | P + guest camera | ✓ | ✓ | NV | 0 / 59 / 119 |
| Raikad | NV | NV | ✓ | ✓ CSV | **✓** | Map (NV provider) | NV | ✓ | ✓ | NV | NV | NV | 0 |
| Ajaklah | ~101 (C) | Video loaders (C) | ✓ (C) | Reports (C) | Invitation QR (C) | NV | Wishlist (C) | NV | Live guest wall (C) | NV | NV | NV | 25–30 per template |
| Kad2u | NV | Custom opener | ✓ | P CSV | NV | NV | NV | P | P | NV | NV | **P Guest Name Link** | 29 / 59 / 99 |
| Creatr | 5 | Cinematic + MP4 video | ✓ + time slots | NV | NV | ✓ both | P angpow QR | P | P | ✓ | NV | NV | 49 / 79 / 129 |
| Kunjung | 9 | "Animated" themes | ✓ incl. maybe | ✓ | NV | P Google | ✓ DuitNow / TNG | P | NV | NV | NV | NV | 0 / 25 per event |
| EkadInvite | 325+ | Particles | ✓ adults + kids | ✓ CSV + filter | NV | ✓ both + parking/surau | P DuitNow + 5 e-wallets | ✓ + YouTube | ✓ 10/20 | ✓ | ✓ | **P VIP titles** | 29 / 69 |
| Invito Studio | 45 | **Wax seal, gift box, unboxing** | ✓ | ✓ | NV | "Live map" | NV | NV | NV | NV | ✓ | NV | ~USD 15 |
| OhMyKad | NV (6 samples) | Sealed tap reveal | ✓ | P guest list | NV | ✓ both | P DuitNow | ✓ | P (3) | ✓ | NV | NV | 0 / 49 / 99 |
| Mawaddah | Not reachable | — | — | — | — | — | — | — | — | — | — | — | — |
| **This repo (VOWÉ MY)** | 7 designs (Zamrud, Kampung, Songket, Pelamin, Surat, Batik, Sirih) | **Scroll-driven cultural stories** | ✓ pax, dietary, WhatsApp | ✓ CSV | ✗ | ✓ both + embed | ✓ bank + QR image | ✓ | ✓ (default design) | ✓ + Google Cal / ICS | ✓ | ✓ `?to=` | — |

## 3. Features common to most competitors

These are table stakes. Shipping without them loses the comparison at a glance.

1. One shareable link sent over WhatsApp, with no app and no guest login.
2. RSVP with attending or not and a pax count.
3. Google Maps and/or Waze buttons.
4. Background music. Two platforms (KahwinNow, EkadInvite) allow YouTube links.
5. Countdown to the event.
6. Photo gallery, usually capped at 3–20 photos by tier.
7. Salam kaut / money gift by bank details or DuitNow QR, usually on a paid tier.
8. Guestbook or wishes wall.
9. One-time pricing, with no subscriptions. The paid entry point clusters around **RM25–RM50** and the top tier around **RM89–RM129**.
10. Template volume as the main marketing claim (278+, 300+, 325+).
11. Multiple event types (aqiqah, Raya open house, birthdays), served by the same engine.

## 4. Features missing or poorly implemented

These are gaps across the 14 reachable sites. "Rare" means seen on at most one or two.

| Gap | What was seen | Why it matters |
|---|---|---|
| **The opening is decoration, not a story.** | Most offer a static template plus an effect: particles, a sealed reveal, an envelope. Only Invito Studio names distinct reveal mechanics, and those are European (wax seal, Italian Riviera). | The first 5 seconds decide whether a guest scrolls. Malaysian cultural metaphors (tepak sirih, songket, pelamin, kampung) are almost untouched as *interactions*. They appear only as pictures. |
| **Venue-day flow is rare.** | QR check-in only on Raikad. Ajaklah has an invitation QR in its code. | Hosts have no way to see on the day who has arrived compared with who RSVPed. |
| **Crowd control** | Guest time slots only on Creatr. | Malaysian open-house style receptions (11am–4pm) suffer peak-hour crowding. Slots and "datang pukul berapa" spread the load. |
| **Personal invitations** | Per-guest links only on Kad2u Exclusive (RM99) and EkadInvite Diamond (VIP titles). | Names with honorifics (Dato', Tuan Haji) matter culturally and lift RSVP rates. |
| **Multi-majlis weddings** | Only EkadInvite mentions akad and resepsi in one link. No site showed **separate RSVP per event** (e.g. majlis pihak perempuan vs bertandang pihak lelaki, on different dates and places). | Many Malay weddings have two or three majlis. Guests RSVP to the wrong one or the host merges spreadsheets. |
| **Core features held back** | RSVP and money gift usually need the middle tier (KahwinNow, NakJemput, Creatr, OhMyKad). Link expiry exists: Creatr Starter lasts 60 days, NakJemput edits close after 90/180 days. | Feels nickel-and-dimed. A free or cheap tier that includes RSVP is a wedge. |
| **Gift ledger** | Gifts go straight to the bank, and no platform shows the host "who said they sent what". | Hosts struggle to write thank-yous and match transfers. |
| **Reminders and post-event** | No site stated RSVP reminders, an H-1 WhatsApp reminder, a thank-you broadcast, or delivery of the photo album. Only Kahwin Studio and Ajaklah had post-event photo collection. | The relationship ends at the event, so the platform misses a second moment of delight. |
| **Accessibility and performance** | No site stated reduced-motion support, contrast or load size. | Heavy animated cards on older Android phones and slow mobile data hurt elderly guests, who are a core audience. |
| **Privacy** | Only EkadInvite stated its cards are not indexed by Google. PDPA handling was not stated on any page checked. | Cards contain parents' names, addresses and bank accounts. |
| **Price transparency** | Jemputan.me, Kadkahwinmy and AliveInvite (beyond one design) do not show clear package pricing on the pages checked. | Buyers compare on WhatsApp screenshots, and unclear pricing loses them. |

## 5. Best UI/UX examples found

1. **Invito Studio** has the strongest *opening craft*: named reveal mechanics (wax seal, gift box, unboxing, cinematic loader) shown as separate demos. The lesson: give each template one signature interaction and name it.
2. **OhMyKad** has the cleanest *creation flow*: the AI drafts the whole card from a few words. It also has three clearly named tiers (Charm, Flair, Grand), a sealed-card reveal, and voice wishes.
3. **EkadInvite** has the most complete *practical guest information*: parking, surau, copy address, adult and child pax, VIP honorifics, akad and resepsi in one link, CSV with filters, and five e-wallets. The lesson: details that save the guest a WhatsApp question.
4. **Kahwin Studio** has the best *trust and lifecycle* design: a free trial without sign-up, edits that keep the same link, a digital disposable camera via QR, and a post-event memories gallery.
5. **Creatr** has the best *distribution assets*: an MP4 motion video for WhatsApp Status and Instagram Stories, and a choice of Formal, Santai or **Pantun** wording.
6. **Raikad** is the best *operations* tool: QR check-in plus pax limits for each invitation, at RM0.

## 6. Opportunities and differentiation strategy

### Where to win

The market has split into **volume catalogues** (KahwinNow, NakJemput, EkadInvite: 300+ near-static templates at RM27–RM89) and a few **showpiece openers** (Invito Studio, which is not Malaysian in content). No one combines *cinematic, culturally Malaysian storytelling* with *complete guest operations*. This repo already has the rarer half: scroll-driven designs built on Malay material culture.

**Positioning: "Kad kahwin yang bercerita": fewer designs, each one an interactive Malaysian story, with the full guest journey behind it.**

### Recommended features

P0 = needed for parity · P1 = differentiator · P2 = delight

| Priority | Feature | Status in this repo |
|---|---|---|
| P0 | RSVP with pax, dietary and WhatsApp | ✓ have |
| P0 | Google Maps, Waze and an embedded map | ✓ have |
| P0 | DuitNow QR and bank details, with copy-account | ✓ have (QR image) |
| P0 | Countdown, Google Calendar and .ics | ✓ have |
| P0 | Music with a tap-to-start toggle | ✓ have |
| P0 | Guestbook | ✓ have |
| P0 | Admin dashboard and CSV | ✓ have |
| P0 | Per-guest link (`?to=Name`) | ✓ have. Add honorific presets (Dato', Datin, Tuan Haji…). |
| P0 | Gallery and story in the alternate designs | Partial. Only the default design renders them. |
| P0 | Parking, surau and dress-code notes | ✓ have (GuestNotes). Add a surau line. |
| P1 | **Multi-majlis with per-event RSVP** (pihak perempuan / pihak lelaki / akad) | ✗ |
| P1 | **Time-slot RSVP** ("Saya akan datang sekitar 12–1 ptg") with a peak-hour chart in admin | ✗ |
| P1 | **QR check-in**: each RSVP gets a QR, and an usher scans it at the door to see arrived against expected live | ✗ |
| P1 | **Gift ledger**: guest taps "Saya dah salam kaut" with an optional amount and note, and the host gets a thank-you list | ✗ |
| P1 | **WhatsApp share kit**: OG image per design, a caption in Formal/Santai/Pantun style, a reminder message template | Partial (OG image) |
| P1 | **One signature interaction per design**, named in marketing ("Buka tepak sirih", "Tenun songket", "Jalan ke pelamin") | ✓ the 6 alternate designs; the default design uses an envelope and seal |
| P2 | Guest photo wall via QR at the venue, moderated, downloadable after | ✗ |
| P2 | Voice wishes (short audio) | ✗ |
| P2 | MP4 export of the opening for WhatsApp Status | ✗ |
| P2 | Pantun generator for wording (BM) with an English gloss | ✗ |
| P2 | Post-event thank-you page that reuses the same link | ✗ |
| Always | Reduced-motion path, under 300 KB of JS on first load, works on older Android, noindex by default, PDPA note | Reduced motion ✓. Others need auditing. |

### Pricing guidance (from the market data above)

- The market anchors at **RM25–RM59 for a full-featured card** and **RM89–RM129 for premium**, with free tiers at Kahwin Studio, Raikad, Kunjung and OhMyKad.
- Do not gate RSVP or salam kaut behind a paywall. Competitors do, and it is the most visible friction point. Charge for **signature cinematic designs, multi-majlis, QR check-in and the photo wall** instead.

### Differentiation in one line per audience

- **Couple:** "Your invitation opens like a tepak sirih, not like a PDF."
- **Parents (the real buyers):** "Proper adab: honorifics, doa, pantun, every majlis and side in one link."
- **Guests:** "Where to park, where to pray, when it's less crowded, and how to salam kaut, in one tap."
- **On the day:** "Know who has arrived."
---

## 7. Code analysis with REA (1 November 2026)

[REA](https://github.com/morluto/rea) 6.8.0 `analyze_web_bundle` was run on 22 competitor pages (each home page, plus the card demo where one exists) and on four pages of this site. Each page was opened in a local Chrome, and REA read the scripts the page had already loaded. Nothing was submitted, logged into or called, and no code, artwork or wording was copied.

**How to read it:** routes and endpoints are static findings. They show what the software contains, not what customers can reach or what a package includes. JavaScript sizes are uncompressed script source, excluding images and fonts.

The visual version of this section is the "Kad Kahwin Teardown" page (a private Claude artifact): https://claude.ai/artifact/Yah4qKJEPujJczkCgVRwCo

### Stack, weight and routes by platform

| Platform (page) | Built with | Scripts | JS | Revealing routes or modules |
|---|---|---|---|---|
| KahwinNow (card demo) | jQuery 1.11, AOS, particles.js, flipdown, slick | 16 | 375 KB | Card animation is AOS fade-ins, particles and a flip-clock countdown |
| NakJemput (home) | jQuery 3.6, Bootstrap, Modernizr | 13 | 929 KB | Server-rendered; no client routes |
| Jemputan.me (home) | Vue SPA (Laravel Mix), axios | 6 | 843 KB | `/studio`, `/registry`, `/pdf`, `/font-gallery`, `/vendor-program`, `/review/:uid/:oid`, `/voucheruser`, `/api/fav/add` |
| Kadkahwinmy (home) | Same bundle layout as Jemputan.me | 4 | 896 KB | `/catalog/physical`, `/pricelist/physical`, `/delivery`, `/wedding-gallery`, `/api/reviews` |
| AliveInvite (design preview) | Rails, Hotwire Turbo, Stimulus | 38 | 242 KB | Controllers: `gift_box_form`, `welcome-board`, `wizard_form`, `rsvp_modal`, `purchase_lookup`, `guestbook_table` |
| Kahwin Studio (card demo) | Next.js, React | 29 | 1,554 KB | Site routes: `/themes`, `/try`, `/premium`, `/rsvp`, `/blog` |
| Raikad (card demo) | Next.js, React, PostHog (session recording) | 39 | 1,826 KB | `/dashboard/memories/:event`, `/dashboard/ucapan/:event`, `/dashboard/maklum-balas`, `/api/guest-memories` |
| Ajaklah (home) | Laravel, Inertia, Vue (Vite) | 10 | 558 KB | `vendors.index`, `bookings.index`, `galleries.preview`, `wishlists.preview` |
| Kad2u (card demo) | PHP, inline scripts only | 1 | not measurable | — |
| Creatr (card demo) | Next.js, React | 13 | 502 KB | Page title reads "KadKahwinSaya"; no client routes exposed |
| Kunjung (card demo) | Next.js, React | 10 | 593 KB | `/build`, `/dashboard`, `/api/chatbot` |
| EkadInvite (home) | Next.js, React, Sentry | 30 | 1,653 KB | 22 `/event-*` pages (incl. tahlil, valaikappu, shou-yan, berkhatan), 14 `/guides/*` (incl. `salam-kaut-duitnow`), `/reviews/write` |
| Invito Studio (card demo) | Next.js, React | 11 | 1,301 KB | `/api/guest-memories`; 10 country pages and pages by faith |
| OhMyKad (home) | Nuxt, Vue (Vite) | 104 | 1,365 KB | 141 routes: `/maker`, `/admin/ai-usage`, `/reseller/vouchers`, `/claim/:code`, `/picture-cards`, `/ar/mena` |
| Mawaddah | — | — | — | DNS did not resolve |
| **This site** (`/sirih`) | Next.js 16 static export, React, motion | 8 | 670 KB (was 911 KB) | react-dom 224 KB, motion 188 KB, Next.js runtime 181 KB; Supabase now loads only in the admin |

### What it adds to the earlier findings

- **Gaps now verified from app code:** guest photo memories (Raikad, Invito Studio, plus Ajaklah's live gallery); self-serve builders (Jemputan.me `/studio`, OhMyKad `/maker` with AI usage tracking, Kunjung `/build`); reseller and voucher programmes (OhMyKad, Jemputan.me); physical add-ons (AliveInvite gift boxes and welcome boards, Kadkahwinmy printed cards with delivery); post-order review requests (Jemputan.me, EkadInvite, Kadkahwinmy).
- **Shared software, likely:** Jemputan.me and Kadkahwinmy load the same bundle layout and share route and API names (`/design/:id/:name`, `/finishpay`, `/api/login`, `/api/forgotpassword`). REA cannot confirm who runs them.
- **Same endpoint name:** Raikad and Invito Studio both call `/api/guest-memories`. That may be coincidence.
- **This site was mid-weight.** At 911 KB it was heavier than KahwinNow (375 KB), Creatr (502 KB) and Kunjung (593 KB). Guest pages now call Supabase's REST API with plain `fetch` and only the admin loads the Supabase client, which brings `/sirih` to about 670 KB (measured from the local build; modern browsers skip the 109 KB `noModule` polyfill).

### Updated build order

1. ~~Load Supabase on demand (effort S).~~ Done: guest pages use REST; the client is admin-only.
2. Guest memories wall with moderation and album download (M).
3. RSVP per majlis, with time slots (M).
4. Salam kaut ledger and thank-you list (S).
5. QR check-in at the door (M).
6. WhatsApp share kit with honorifics and pantun captions (S; per-guest `?to=` links already exist).
7. Three search guides: ayat jemputan for WhatsApp, salam kaut by DuitNow, sample aturcara (S).
8. Self-serve builder, only if the product starts selling to other couples (L).

Out of scope: reseller vouchers, vendor marketplaces and physical add-ons. This product makes the digital card directly.
