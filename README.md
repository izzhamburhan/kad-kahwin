# Kad Kahwin Digital — Izzat & Aisyah

A single-page, mobile-first digital wedding invitation. There is no build step: open `index.html` in a browser.

```
index.html   page structure
style.css    look & animations
app.js       behaviour (cover, countdown, RSVP, calendar, QR, music, petals)
config.js    ALL the details — edit this file only
```

## 1. Edit the details

Everything shown on the page comes from `config.js`: names, parents, date/time, venue, schedule, phone numbers, RSVP deadline, bank details, wishlist, music.
**All values currently in it are placeholders**, so replace them before sharing.

- Dates use ISO format with the Malaysia offset, e.g. `2026-12-19T11:00:00+08:00`.
  The Malay date, Hijri date, countdown and calendar entry are calculated from it automatically.
- Phone numbers use international format without `+`, e.g. `60123456789`.
- `venue.mapQuery` can be a place name or a `"lat,lng"` pair. The pair is more precise.

## 2. Personalised guest link

Add `?to=Name` to the link and the cover shows "Kepada <Name>":

```
https://your-site/?to=Pak%20Long%20Hamid
```

## 3. Real DuitNow QR & music

- Save your bank's DuitNow QR image as e.g. `assets/duitnow.png` and set `gift.qrImage: "assets/duitnow.png"`.
  Until then the page shows a **generated placeholder QR that cannot receive payment**.
- Music: with `music.src` empty, a built-in generated music-box melody plays.
  To use a song, put an mp3 you have the rights to in `assets/` and set `music.src: "assets/lagu.mp3"`.

## 4. RSVP

By default, the RSVP form opens WhatsApp with a pre-filled message to `rsvp.whatsapp`.

To collect replies in a Google Sheet instead:

1. Create a Google Sheet. Add the header row: `Masa | Nama | Telefon | Kehadiran | Pax | Ucapan`.
2. Open **Extensions → Apps Script** and paste:
   ```js
   function doPost(e) {
     const s = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const p = e.parameter;
     s.appendRow([new Date(), p.name, p.phone, p.attend, p.pax, p.wish]);
     return ContentService.createTextOutput("ok");
   }
   ```
3. Click **Deploy → New deployment → Web app**. Set *Execute as: Me* and *Who has access: Anyone*.
4. Copy the web app URL into `rsvp.endpoint` in `config.js`.

## 5. Publish

Any static host works:

- **Netlify Drop**: drag the folder onto https://app.netlify.com/drop.
- **GitHub Pages**: push the folder to a repo, then go to Settings → Pages → Deploy from branch.

The share QR in the footer always points to the page's own URL, so it is correct after publishing.
