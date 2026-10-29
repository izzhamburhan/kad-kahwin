# VOWÉ MY: Izzat & Aishah

A mobile-first digital wedding invitation (Next.js, Tailwind, Motion), published as a static site on GitHub Pages.

- `/` is the invitation, with the envelope opening, countdown, schedule, map, RSVP and guestbook.
- `/admin` is the organiser dashboard, for settings, RSVPs, the guest list and wishes.

## Run locally

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

Add `?to=Pak%20Long%20Hamid` to the URL and the envelope is addressed to that guest.

## Where the content lives

| What | Where |
| --- | --- |
| Built-in invitation details | `src/lib/defaults.ts` |
| Malay / English UI text | `src/lib/i18n.ts` |
| Themes (Zamrud, Gading, Nila) | `src/app/globals.css` |
| Background music | `public/audio/lagu.mp3` (royalty-free, generated) |
| Photos / DuitNow QR | put files in `public/`, then reference them from `/admin` or `defaults.ts` |
| WhatsApp link preview | `src/app/opengraph-image.png` |

Story, gallery and gift are switched off until you fill them in. Contacts appear once you add someone. Turn sections on and off under **/admin → Tetapan → Paparkan bahagian**.

## Two modes

**Demo mode** is the default when no Supabase keys are set. Everything is stored in each visitor's own browser:

- RSVPs and wishes never reach you, and the form says so to the guest.
- If you set `rsvp.whatsapp` in `defaults.ts`, guests get a "Send via WhatsApp" button so their reply still reaches you.
- `/admin` edits only your own browser. To change what guests see, edit `src/lib/defaults.ts` and push.

**Supabase mode** stores RSVPs, wishes and settings for real, and `/admin` needs a login.

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Go to **Authentication → Users → Add user** and create your organiser login. Under **Authentication → Providers → Email**, turn off "Allow new users to sign up".
4. In the SQL editor, run: `insert into public.admins (email) values ('you@example.com');`
5. Copy **Project URL** and **anon public key** from **Project Settings → API**:
   - Locally, put them in `web/.env.local` as `NEXT_PUBLIC_SUPABASE_URL=…` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=…`.
   - On GitHub, add them as repository secrets with the same names (**Settings → Secrets and variables → Actions**), then re-run the deploy workflow.

Privacy: row-level security lets anyone read the invitation and the public guestbook, and submit one RSVP per phone number within the guest limit. Only listed admins can read RSVPs or the guest list.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds `web/` on every push to `master` that touches `web/`.
One-time setup: **Settings → Pages → Source: GitHub Actions**.

Live URL: `https://<user>.github.io/<repo>/`
