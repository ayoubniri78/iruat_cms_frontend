# AGENTS.md

## Project layout

This is a two-part CMS project. The backend is complete; the frontend is active.

| Directory | Stack | Status |
|---|---|---|
| `backend_cms/` | Express 5 + Supabase + Cloudinary | Complete |
| `frontend/` | Vue 3 + Vite + Tailwind 3 + Supabase Auth | **Active — in progress** |

## Commands

All commands run from `frontend/`:

```bash
npm run dev        # Vite dev server
npm run build      # type-check (vue-tsc) + vite build
npm run build-only # vite build without type-check
npm run type-check # vue-tsc --build
npm run preview    # vite preview
```

No linter, no test framework, no formatter config exists in the frontend yet.

## Frontend architecture

Vue 3 Composition API (`<script setup lang="ts">`) + Pinia stores + Vue Router.

```
src/
├── assets/main.css              # Tailwind directives + font imports
├── components/
│   ├── auth/                    # LoginForm, RegisterForm, GoogleLoginButton
│   ├── dashboard/               # StatCard, RecentArticles
│   ├── profile/                 # ProfileForm, ProfileInfo (not yet routed)
│   ├── types/                   # TypeCard, TypeForm
│   └── ui/                      # BaseButton, BaseInput, AlertMessage, ConfirmModal
├── layouts/
│   ├── AdminLayout.vue          # Sidebar + topbar shell for all admin pages
│   └── AuthLayout.vue           # Centered card shell for auth pages
├── lib/
│   ├── axios.ts                 # Axios instance with auth interceptor
│   └── supabase.ts              # Supabase client singleton
├── router/index.ts              # All routes with auth guards
├── services/                    # API service modules (articles, types, images)
├── stores/                      # Pinia stores (auth, dashboard, types)
├── types/                       # TypeScript interfaces (article, type, auth)
└── views/                       # Page components
```

## Design system — Brutalist

All UI uses a **neo-brutalist / hard-shadow aesthetic**:

- Thick black borders: `border-4 border-ink`
- Hard shadows: `shadow-brutal` (4px 4px 0px 0px #000)
- Background: `bg-parchment` (#F5F0E8), cards `bg-cream` (#FAFAF5)
- Red accent: `bg-accent` (#E53935)
- Typography: `font-display` (Space Mono) for headings, `font-body` (DM Sans) for body
- Labels: `text-xs font-bold uppercase tracking-[0.2em]`
- Hover: `hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg`
- No rounded corners — sharp rectangles
- Icons: Material Symbols Outlined

## Auth is already implemented

Auth is complete: email/password register + login, Google OAuth, session persistence, route guards. The `supabase.ts` client is wired, the store is wired, the views are wired.

**Do NOT re-implement auth.** The user will integrate it with Supabase later.

## What's missing (next work)

- Articles CRUD views (M4) — placeholder routes exist, need real implementation
- Image management (M5)
- Profile page (M6)
- Mobile responsive pass (M7)

## Backend API

Base URL: `http://localhost:3000/api` (set via `VITE_API_URL`)

| Endpoint | Methods |
|---|---|
| `/articles` | GET, POST |
| `/articles/:id` | GET, PATCH, DELETE |
| `/type` | GET, POST |
| `/type/:id` | GET, PATCH, DELETE |
| `/article-images` | GET, POST (FormData) |
| `/article-images/:id` | GET, PATCH (FormData), DELETE |
