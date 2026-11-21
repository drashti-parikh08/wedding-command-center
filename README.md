# Wedding Command Center

A private, mobile-first, installable Progressive Web Application (PWA) designed for family members to effortlessly coordinate and manage wedding events across three functions, guest lists, and shared accommodation. Built specifically for simplicity on mobile screens, it enables real-time tracking for Kankotri (invitation) household visits, guest lists with city and function filters, and per-function expense receipts with in-browser image compression—all operating completely within free-tier services.

**Status:** In development (Phase 0 complete)

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router) + [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (customized with "Pastel Garden Wedding" tokens)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth, Private Storage)
- **Authentication:** Supabase SSR Auth (`@supabase/ssr`)
- **Excel Parsing:** SheetJS (client-side guest imports)
- **Image Compression:** `browser-image-compression` (receipt photo optimization)
- **PWA:** Web App Manifest + standalone mobile presentation
- **Hosting:** [Vercel](https://vercel.com/) (GitHub CI/CD)

---

## Getting Started

### 1. Prerequisites
- Node.js (v20+ or v24+)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and supply your Supabase project credentials:
```bash
cp .env.example .env.local
```

### 4. Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
