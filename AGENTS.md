# AGENTS.md: Wedding Command Center (master brief)

Read this file fully at the start of every session. It is the source of truth.
If a request conflicts with this file, tell me before acting.

---

## 1. What we are building

A private, mobile-first, installable PWA that my family uses to manage my
brother's wedding. Three wedding functions, each with its own dashboard, plus
shared accommodation. Real users: me, my parents, a few relatives. Many are not
tech-savvy. It must feel like a normal phone app.

Hard constraint: Rs 0 spend. Free tiers only. No paid APIs, no WhatsApp
integration, no app-store publishing.

Placeholders to replace in config (never hardcode in many places):
- Couple: [Bride] & [Groom]
- Functions: [Function 1], [Function 2], [Function 3] (one of them is the Sangeet)
- Dates, venue: [to configure in a `functions` table + a single config file]

## 2. Time-boxed MVP scope (2-day build)

BUILD:
1. Login (Supabase auth, pre-created family accounts, no public signup)
2. Home screen with 3 function tiles + Kankotri tile + Accommodation tile
3. Excel guest import (preview, column mapping, duplicate flagging) + guest table
   with search and filters (city, function, household)
4. Kankotri household visit checklist with remaining count
5. Bills & Payments per function with phone photo upload and compression
6. PWA install + Vercel deploy
7. CSV export of guests and payments (backup)

CUT FOR NOW (do not build unless I ask): Sangeet module, vendor .vcf import,
roles beyond "authenticated user" and "admin", tasks, storage dashboard, audit
history, RSVP analytics, offline editing, WhatsApp anything, travel tracking,
variable-length stays. Accommodation is a simple room <-> guest assignment only,
and only if time remains.

Do NOT add features I did not ask for. Do NOT inflate scope.

## 3. Tech stack (fixed)

- Next.js (App Router) + TypeScript + Tailwind CSS
- shadcn/ui as the base components, restyled with our tokens
- Supabase: Postgres, Auth, Storage (private bucket)
- @supabase/ssr for auth in Next.js
- SheetJS for Excel parsing (client-side). Check SheetJS's current recommended
  install method, as the old npm package may be outdated.
- browser-image-compression for receipt photos
- PWA: web manifest + icons only. No service worker unless I ask.
- Hosting: Vercel (verify current free-tier terms). Source: GitHub.

## 4. Data model (propose, explain, then wait for my approval)

Entities, all with uuid primary keys, created_at, updated_at:

- functions: name, date, venue, notes, accent_key, sort_order
- households: name, city, area, address_note
- guests: household_id, full_name, phone (optional, sensitive), city (normalized),
  notes
- function_guests: guest_id, function_id, invitation_status, rsvp_status
  (invited/confirmed/declined/unknown). UNIQUE(guest_id, function_id)
- kankotri_visits: household_id (UNIQUE), status (not_visited/delivered/
  needs_revisit), visited_on, visited_by, note
- vendors: name, category, phone, notes (can stay minimal in MVP)
- payments: function_id, vendor_id (nullable), payee_text, title, amount_paise
  (integer), paid_on, status, notes
- payment_attachments: payment_id, storage_path, mime_type, size_bytes
- rooms, room_assignments: only if accommodation is built

Rules:
- A person exists once. Function membership lives in function_guests.
- Households are separate from guests. One household = one Kankotri visit,
  but headcount is per person.
- Store money as integer paise or integer rupees, never floats. Display as
  Indian format, e.g. Rs 1,25,000.
- Normalize cities (e.g. Bombay -> Mumbai) through a small mapping table or
  function, not scattered string checks.
- Never use the Excel row number as an ID.

## 5. Security rules (non-negotiable)

- Enable Row Level Security on EVERY table. No table without policies.
- Only authenticated users can read or write. Anonymous users get nothing.
- Admin-only: import, delete, user management, exports of everything.
- Storage bucket for receipts is PRIVATE. Serve images via short-lived signed
  URLs. No public permanent links.
- Validate uploads: allowed MIME types (jpeg, png, webp, heic converted if
  possible), max size, and file count per payment.
- Secrets: never commit .env files. Never put service-role keys in client code.
  .gitignore must cover .env*. Use NEXT_PUBLIC_ only for the Supabase URL and
  anon key.
- Never commit real guest data, phone numbers or bills. Use fake seed data only.
  The real Excel file stays out of the repo.
- After each feature, tell me how to verify that a logged-out user cannot read
  the data.

## 6. UX rules (phone first)

- Design for 390px wide first, then scale up to laptop.
- Min 48px tap targets, base font 16px or larger, WCAG AA contrast.
- Prominent Home and Back. Bottom nav: Home, Guests, Kankotri, Bills, More.
- Every screen needs: loading state, empty state ("No bills added yet"), and
  error state with a plain-language message.
- Never silently lose entered data. Show clear saved / failed feedback.
- Confirm before delete.
- Use Indian number and date formatting (DD MMM YYYY).
- Keep forms short. Numeric keyboard for amounts, date picker for dates,
  camera/gallery for photos.
- Respect prefers-reduced-motion.
- Honor iPhone safe-area insets. No horizontal scrolling.

## 7. Design system: "Pastel Garden Wedding"

Mood: soothing, elegant, pastel Indian wedding garden. Calm, soft, never busy.
Inspired by (not copied from) mood-reference images I provide: a scalloped arch
frame, pastel nature scene, peacocks, and a floating envelope-with-flowers motif.
All artwork must be original vector (SVG). Do not trace or copy reference images.

### Colour tokens (define as CSS variables + Tailwind theme)
- --bg-page: #FBE9E7 (soft pastel pink)
- --arch-frame: #E8B7B3 (dusty rose)
- --panel-cream: #FFF8F0
- --sage: #9DB59A
- --powder-blue: #A9C3DA
- --gold: #C8A45D (thin hairlines and tiny accents only)
- --text: #1A1616 (black text everywhere)
- Function accents: --peach #F6CDB0, --sage-light #BBD3B5, --lavender #CFC6E8

### Typography (via next/font/google)
- "Alex Brush": LARGE display text only (couple names, function titles, screen
  titles). Big and prominent, often 40px to 64px on mobile.
- "Cormorant Garamond" 600: subheadings, dates, venue lines.
- "Lora" or "Inter": all body text, tables, forms, buttons, numbers.
- Never use Alex Brush for small text, numbers, table content or buttons.

### Components
- Rounded-2xl cards, soft shadows, cream surfaces on pink background.
- Gold hairline dividers (1px) between sections.
- ArchHeader: scalloped/ogee arch frame, dusty-rose border, cream inner panel.
  Contains small "|| Shree Ganesh Namah ||", [Bride] & [Groom] in large Alex
  Brush, date + venue in Cormorant Garamond, and a simple peacock on each side
  of the names.
- FunctionTile: arch-shaped top edge, its own pastel accent, Alex Brush title,
  1 to 2 live counts in the body font.
- EnvelopeTile (Kankotri): styled as a pastel pink envelope with a small flower
  bouquet peeking out, and a badge showing households remaining.
- GardenBackdrop: soft low-opacity sage and powder-blue scene (leaves, small
  pond, pavilion silhouette) at the bottom of the Home screen, behind content.
- FloatingDecor: a few small elements (flower, leaf, petal, tiny envelope)
  drifting slowly in the background at low opacity via CSS animation. Keep them
  away from text and buttons. Disabled under prefers-reduced-motion.
- BottomNav: large icons with labels.

### Where decoration is allowed
- Home screen: full decoration (arch, peacocks, garden, floating elements).
- Function dashboards: arch-shaped header with the function's accent colour,
  light decoration only.
- Inner screens (guest table, bills, forms): clean and highly readable. Pink
  background, cream cards, black text, gold hairlines, a small leaf motif in the
  header only.

### Illustration approach
Keep SVGs lightweight (inline or small files). Peacocks and flowers should be
simple, stylised, flat or soft-gradient shapes. If an illustration looks crude,
flag it and I will supply or generate a better asset. Do not spend time
perfecting it.

## 8. Import rules (guest Excel)

- Layout of the real file is UNKNOWN. Do not assume it. Build a column-mapping
  step so any sheet can be mapped to app fields.
- Preview before saving. Show counts: rows, new households, new guests, flagged.
- Flag: missing names, malformed phones, duplicate names within a household,
  probable duplicates across households, unknown cities.
- Never silently overwrite existing records. Re-importing must be safe
  (idempotent or with a clear merge review).
- Build and test with a FAKE sample sheet that includes: multi-person
  households, Bombay/Mumbai variants, blank rows, duplicate names, trailing
  spaces, and a few Gujarati/Hindi names.

## 9. Photo upload rules

- Accept camera or gallery. Multiple images per payment.
- Compress in-browser before upload. Target roughly 200 to 500 KB while keeping
  text legible. Offer an "original quality" option with a storage warning.
- Store in the private bucket under a path like
  receipts/{function_id}/{payment_id}/{uuid}.jpg. Save only the path in the DB.
- Show a thumbnail plus tap-to-zoom. Handle upload failure with retry.

## 10. Git and working rules

- Small, logical commits. Conventional style: feat:, fix:, docs:, chore:,
  refactor:, test:.
- One feature per commit. Do not make huge multi-feature changes.
- I make the commits. You may suggest the message. Show me the diff summary first.
- Work on feature branches (feature/xyz). Never push secrets.
- Before writing code for a new feature: state the plan in a few lines, list
  files you will touch, then proceed.
- After each feature: tell me how to test it, including what could go wrong.
- Explain non-obvious code, especially schema, RLS policies and the upload flow,
  in plain language. I am a second-year CSE student and I must be able to
  explain everything in an interview.
- If something is stuck for more than ~30 minutes, propose a simpler approach.
- Prefer boring, well-known solutions over clever ones.

## 11. Definition of done (MVP)

- [ ] Installs to a phone home screen with an icon and opens full-screen
- [ ] Logged-out users cannot see any data
- [ ] Fake Excel imports with preview and flagged issues
- [ ] Guest table filters by city, function, household with correct counts
- [ ] Kankotri: marking a household delivered updates the remaining count
- [ ] Payments can be added with compressed photos and viewed later
- [ ] CSV export of guests and payments works
- [ ] Looks good and is readable on a real phone
- [ ] Deployed on Vercel, README written, no secrets in the repo
