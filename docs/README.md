# Documentation Directory

This directory stores engineering notes, design records, architecture diagrams, and testing guides for the **Wedding Command Center**.

## Planned Contents

1. **`SCHEMA.md` / `DATABASE.md`**
   - Entity-Relationship (ER) diagrams explaining the core models (`functions`, `households`, `guests`, `function_guests`, `kankotri_visits`, `payments`, `payment_attachments`).
   - Detailed justification for structural decisions (e.g. why households and guests are decoupled, and why function attendance is a join table).
   - Line-by-line breakdown of Row Level Security (RLS) policies.

2. **`DECISIONS.md` (Architecture Decision Records)**
   - 5 to 8 major design choices, tradeoffs evaluated, and final decisions (e.g. Rs 0 budget constraint, client-side Excel processing, client-side image compression before upload, signed URL delivery for receipts).

3. **`SECURITY.md`**
   - RLS verification checklist for verifying that logged-out/anonymous callers cannot read or modify any wedding data.
   - Storage bucket security and signed-URL expiration policies.

4. **`DEPLOYMENT.md`**
   - Vercel setup, environment variable configuration, and Supabase redirect URI configuration.
   - Step-by-step PWA installation guides for iOS Safari and Android Chrome tailored for family members.
