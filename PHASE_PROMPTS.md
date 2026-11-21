# PHASE_PROMPTS.md: paste one at a time

How to use:
1. Put AGENTS.md in the repo root first.
2. Paste ONE prompt, let the agent finish, test it yourself, then commit.
3. Do not skip ahead. If a phase is going badly, simplify it.
4. Replace [Bride], [Groom] and the function names whenever you are ready.

Suggested commit after each phase is listed at the end of that phase.

---

## Phase 0: Setup (about 1 hour)

```
Read AGENTS.md fully. Do not write feature code yet.

Task: set up the project foundation.
1. Create a Next.js (App Router) + TypeScript + Tailwind project.
2. Add shadcn/ui and configure it.
3. Create a proper .gitignore (must ignore .env*, node_modules, .next).
4. Create .env.example with placeholder names only:
   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
5. Create a README with project name, one-paragraph description, stack, and a
   "Status: in development" line.
6. Create a /docs folder and tell me what you would put there.

Then: show me the folder structure, and explain in plain language what each
top-level file/folder does. Tell me the exact steps I must do manually in the
Supabase dashboard (create project, where to find URL and anon key).
```
Commit: `chore: initialize Next.js project with Tailwind and shadcn`

---

## Phase 1: Database schema and security (about 2 hours)

```
Read AGENTS.md sections 4 and 5.

Task: design the database schema and security policies.
1. Propose the full SQL schema for the MVP tables. Before writing the SQL, show
   me a short table list with columns and relationships, and explain WHY
   households and guests are separate and why function_guests exists.
2. After I approve, write the migration SQL (in /supabase/migrations or a single
   schema.sql I can paste into the Supabase SQL editor).
3. Add Row Level Security on every table with policies:
   - authenticated users can read and write the operational tables
   - admin-only for destructive actions and import
   Implement "admin" in the simplest safe way (e.g. a profiles table with a role
   column, checked in policies). Explain your choice.
4. Create a PRIVATE storage bucket "receipts" with policies for authenticated
   users.
5. Create seed SQL with FAKE data: 3 functions, about 12 households, about 35
   guests, a few payments. No real names or numbers.
6. Give me a manual test checklist to prove a logged-out user gets nothing.

Explain each RLS policy line by line in plain language.
```
Commit: `feat: add database schema, RLS policies and fake seed data`

---

## Phase 2: Auth and app shell (about 1.5 hours)

```
Read AGENTS.md sections 3, 5 and 6.

Task: authentication and navigation shell. No decorative theming yet; use plain
shadcn styling.
1. Supabase auth with email + password via @supabase/ssr. No public signup.
   (I will create family accounts in the Supabase dashboard.)
2. Login page, protected routes with middleware, logout.
3. Layout with a mobile bottom nav: Home, Guests, Kankotri, Bills, More.
4. Placeholder pages for each route, plus function routes /f/[functionId].
5. Loading, empty and error states as reusable components.
6. A profiles row is created for each new auth user (trigger or documented step).

Show me how to verify that visiting a protected URL while logged out redirects
to login.
```
Commit: `feat: add authentication, route protection and navigation shell`

---

## Phase 3: Theme tokens and Home screen (about 2 to 3 hours)

```
Read AGENTS.md section 7 (design system) and 6 (UX rules).
I am attaching mood-reference images. Take inspiration from their palette, arch
framing, pastel nature feel, peacocks and floating envelope. Do NOT copy them.
Make original SVG artwork.

Task: apply the "Pastel Garden Wedding" theme.
1. Create design tokens (CSS variables + Tailwind theme) for colours and fonts
   exactly as in AGENTS.md. Load fonts with next/font/google.
2. Build reusable components: ArchHeader, FunctionTile, EnvelopeTile,
   GardenBackdrop, FloatingDecor, BottomNav (restyled).
3. Build the Home page at 390px width first:
   - ArchHeader with Ganesh line, [Bride] & [Groom] in large Alex Brush,
     date/venue, and a simple peacock on each side
   - Three FunctionTiles using real counts from the database (guests per
     function)
   - EnvelopeTile for Kankotri with households-remaining badge
   - Accommodation tile
   - GardenBackdrop at the bottom, low opacity
   - FloatingDecor, subtle, disabled under prefers-reduced-motion
4. Inner pages stay clean; only a small leaf motif in the header.
5. Read function names, date and venue from the database/config, not hardcoded.

Show the result at mobile width. List anything that looks crude (especially
peacocks) so I can decide whether to supply better assets. Do not polish
endlessly; give me a solid first version.
```
Commit: `feat: add pastel garden theme tokens and home screen`

---

## Phase 4: Guest import and guest table (about 3 to 4 hours)

```
Read AGENTS.md sections 4 and 8.

Task: Excel guest import and guest table. The real sheet layout is unknown, so
build for flexibility.
1. Admin-only import page: choose .xlsx or .csv, parse client-side.
2. Column mapping step: let me map sheet columns to name, household/family,
   city, phone, and function-invitation columns (Function 1/2/3). Remember the
   mapping during the session.
3. Preview screen: total rows, new households, new guests, and flagged problems
   (missing name, bad phone, duplicates, unknown city, blank rows). Let me fix
   or skip flagged rows.
4. City normalization (e.g. Bombay -> Mumbai) via a small editable mapping.
5. Confirm import creates households, guests, function_guests and one
   kankotri_visits row per household. Re-running must not duplicate people.
6. Guest table: search by name, filters for city, function and household, sort,
   and clear counts. State whether each count is people or households.
7. Manual add/edit/delete guest (delete with confirmation).
8. Generate a FAKE sample .xlsx I can use to test, with messy cases.

Explain how duplicate detection works and its limits.
```
Commit: `feat: add Excel guest import with preview and mapping` and
`feat: add guest table with search and filters`

---

## Phase 5: Kankotri checklist (about 2 hours)

```
Read AGENTS.md sections 4 and 6.

Task: Kankotri household visit checklist.
1. List households (NOT guests), with name, city/area, member count.
2. Big, thumb-friendly "Mark delivered" action; also "Needs revisit" and undo.
3. Record visited_on and visited_by (current user).
4. Filters: Not visited / Delivered / Needs revisit, plus city. Search by family.
5. Counts at the top: total households, delivered, remaining.
6. A household of 5 guests counts as 1 visit and 5 people.
7. Update the Home screen envelope badge from real data.
8. Optimistic update with rollback and a clear error message if the save fails.

Give me test steps, including what happens on a slow connection.
```
Commit: `feat: add Kankotri household visit checklist`

---

## Phase 6: Bills and payments with photos (about 4 hours)

```
Read AGENTS.md sections 4, 5 and 9.

Task: Bills & Payments per function.
1. Per-function Bills & Payments list, latest first, with search and filters
   (title, vendor/payee, date, status).
2. Add/Edit form: title, amount in rupees (numeric keyboard), payee (free text;
   vendor link optional), date picker, function, status, notes.
3. Photo upload: camera or gallery, multiple images, in-browser compression with
   browser-image-compression targeting about 200 to 500 KB, preview before
   saving, retry on failure, optional "original quality" with warning.
4. Upload to the PRIVATE "receipts" bucket using the path pattern in AGENTS.md.
   Save only paths and metadata in payment_attachments.
5. Payment detail page: show details and thumbnails via signed URLs, tap to zoom.
6. Edit/replace photo, delete with confirmation.
7. Totals per function (paid, and due if tracked). Indian rupee formatting.
8. Validate: positive amounts, required fields, file type and size limits.

Explain how signed URLs work and why the bucket is private. Give me a test that
proves a logged-out user cannot open a receipt URL.
```
Commit: `feat: add bills and payments with compressed receipt upload`

---

## Phase 7: PWA install and deploy (about 1.5 hours)

```
Read AGENTS.md sections 3 and 6.

Task: make it an installable PWA and deploy.
1. Web manifest: name "Wedding Command Center" (short name "Wedding"),
   standalone display, theme_color and background_color #FBE9E7, start_url "/".
2. Icons: arch shape with a gold monogram on pink. Provide 192, 512 and maskable
   versions, plus an Apple touch icon. Generate them as lightweight assets.
3. iPhone support: apple-mobile-web-app meta tags, safe-area insets, viewport-fit.
4. No service worker unless truly needed.
5. Vercel deployment guide: connect GitHub repo, set the two environment
   variables, set Supabase auth redirect URLs for the deployed domain.
6. Give me install instructions for Android (Chrome) and iPhone (Safari) that I
   can send to my parents, in simple words.
7. List the free-tier limits I should re-check for Vercel and Supabase.
```
Commit: `feat: add PWA manifest, icons and deployment config`

---

## Phase 8: Export, polish and README (about 2 hours)

```
Read AGENTS.md sections 2 and 11.

Task: backup export, polish and documentation.
1. Admin-only CSV export of guests (with households, functions) and payments.
   Optionally a script/instructions to download receipt files for backup.
2. Review every screen at 390px: spacing, tap targets, text size, contrast.
3. Add missing loading, empty and error states.
4. Run a security pass: confirm RLS on all tables, bucket private, no secrets in
   the repo, no service-role key in client code. Report findings honestly.
5. Write a strong README: problem, who uses it, screenshots placeholders,
   architecture diagram (mermaid), data model, security approach, decisions and
   tradeoffs, what is deferred, how to run locally with fake data.
6. Add a docs/DECISIONS.md with 5 to 8 key design decisions and why.

List anything in the Definition of Done that is NOT yet satisfied.
```
Commit: `feat: add CSV export` / `docs: write README and decision log`

---

## Optional Phase 9: only if time remains

Pick ONE at a time:
- Accommodation: rooms and guest/household room assignments (one shared view)
- Sangeet: performances with ordered songs
- Vendors: directory, plus .vcf import with a manual fallback

```
Read AGENTS.md. Task: build [chosen module] following the existing schema style,
RLS rules and design system. Propose the schema changes first, wait for my
approval, then implement.
```

---

## Handy "rescue" prompts

Agent went off-track:
```
Stop. Re-read AGENTS.md. List what you changed that was not requested. Revert
the extras and continue only with the current task.
```

You don't understand some code:
```
Explain [file/function] line by line as if I'm a second-year CS student. Then
tell me what could break and how I would test it.
```

Stuck for a long time:
```
We've been stuck on this a while. Propose the simplest alternative that still
meets the requirement, and tell me what we lose by choosing it.
```

Before every commit:
```
Summarize the diff in 3 to 5 lines and propose a conventional commit message.
Check that no secrets, real data or debug leftovers are included.
```
