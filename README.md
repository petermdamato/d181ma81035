# Source Signal

A G2-style directory where registered users can browse data vendors and leave reviews. Built with **Next.js** (App Router) and **Supabase**.

## Project structure

```
app/
  layout.tsx, page.tsx, globals.css, not-found.tsx
  companies/           # Vendor directory
    page.tsx           # List all vendors
    [slug]/page.tsx    # Vendor detail + reviews
    [slug]/review/     # Write a review (authenticated)
  reviews/page.tsx     # All reviews
  login/page.tsx       # Sign in / sign up
  dashboard-protected-routes/   # User dashboard (protected)
  api/auth/callback/   # Supabase OAuth/session callback
components/
  Header.tsx, Footer.tsx
  ui/                  # Button, Card, Input
  directory/           # CompanyCard, CompanyList
  reviews/             # ReviewCard, ReviewList
lib/
  utils.ts
  supabase/            # client, server, middleware
types/
  database.ts          # Company, Review types
supabase/
  schema.sql           # Tables + RLS (run in Supabase SQL editor)
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL editor, run the contents of `supabase/schema.sql` to create `companies` and `reviews` (and RLS).

3. **Environment**

   Copy `.env.local.example` to `.env.local` and set:

   - `NEXT_PUBLIC_SUPABASE_URL` – project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – anon/public key  

   In Supabase: **Settings → API** for both values.

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Design

- **Palette:** `#456926`, `#233620`, `#546B4C`, `#071205`, `#ACAEA1` (primary/surface), `#B4442C` / `#6D1C07` (accent).
- **Auth:** Supabase Auth (email/password, Google). Protected routes (e.g. dashboard) redirect to `/login` when unauthenticated.

### OAuth (Google)

To enable Google sign-in:

1. In Supabase: **Authentication → Providers** → enable **Google**.
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/) (APIs & Services → Credentials) and add the Client ID and Secret to Supabase.
3. In Supabase **Authentication → URL Configuration**, add `http://localhost:3000/api/auth/callback` (and your production URL) to **Redirect URLs**.

### Company claim (optional)

To let companies claim their profile (email verification, then only they can edit):

- **Supabase:** Add `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role key) so the app can create/verify claim tokens.
- **Resend:** Sign up at [resend.com](https://resend.com), create an API key, and set `RESEND_API_KEY`. Optionally set `RESEND_FROM_EMAIL` (e.g. `noreply@yourdomain.com`; otherwise uses Resend’s default).
- **URL:** Set `NEXT_PUBLIC_APP_URL` in production (e.g. `https://yourdomain.com`) so verification emails use the correct link.

Run migration `010_company_claimed_and_claim_tokens.sql` so `companies` has `claimed`, `claimed_contact`, `claimed_by_user_id` and the `company_claim_tokens` table exists.

### AI vendor search (optional)

The “Search vendors with AI” flow uses OpenAI to collect search criteria via chat and then rank matching vendors. Set `OPENAI_API_KEY` in `.env.local`. The app uses the `gpt-4o-mini` model. Run migration `011_ai_search_sessions.sql` to store search sessions.

## Requirements

- Node.js **≥20.9.0** (for Next.js 16).
