# Milestones

## M1 — API layer + Axios setup ✅

1. `npm install axios`
2. Create `src/lib/axios.ts` — Axios instance with `VITE_API_URL` base, request interceptor to attach Supabase session token, response interceptor for 401 handling
3. Create `src/types/article.ts` — Article, ArticleImage interfaces
4. Create `src/types/type.ts` — Type (CMS type) interface
5. Create `src/services/articles.service.ts` — `getAll`, `getById`, `create`, `update`, `delete`
6. Create `src/services/types.service.ts` — `getAll`, `getById`, `create`, `update`, `delete`
7. Create `src/services/images.service.ts` — `getAll`, `getById`, `create` (FormData upload), `update` (replace), `delete`

## M2 — Dashboard ✅

1. Create `src/stores/dashboard.store.ts` — fetch article count, type count, recent articles
2. Create `src/views/DashboardView.vue` — stat cards, recent list, "New article" link
3. Create `src/components/dashboard/StatCard.vue` — number + label, neo-brutalist style
4. Create `src/components/dashboard/RecentArticles.vue` — top 5 articles list
5. Add empty state when no articles or types exist

## M3 — Types management ✅

1. Create `src/stores/types.store.ts` — types list, CRUD actions
2. Create `src/views/TypesView.vue` — list + "Create" button
3. Create `src/components/types/TypeCard.vue` — single type row with edit/delete
4. Create `src/components/types/TypeForm.vue` — name input, create/edit mode
5. Create `src/components/ui/ConfirmModal.vue` — reusable delete confirmation
6. Wire create/edit/delete with loading and error states

## M4 — Articles management ✅

1. Create `src/stores/articles.store.ts` — articles list, CRUD actions, search state
2. Create `src/views/ArticlesView.vue` — list with search bar
3. Create `src/views/ArticleDetailView.vue` — full article display + image grid + edit/delete buttons
4. Create `src/views/ArticleCreateView.vue` — form: title, slug (auto-generate from title), content (textarea), type select
5. Create `src/views/ArticleEditView.vue` — pre-filled form, same fields as create
6. Create `src/components/articles/ArticleForm.vue` — shared form component for create/edit
7. Add search/filter input on articles list
8. Wire delete with ConfirmModal

## M5 — Image management ✅

1. Create `src/components/images/ImageUploader.vue` — file input, upload on select, progress bar
2. Create `src/components/images/ImageGrid.vue` — thumbnail grid with main image badge
3. Create `src/components/images/ImageCard.vue` — single image: preview, set-main, delete, replace
4. Wire image upload to article create/edit flow (upload after article is created, using returned ID)
5. Wire image delete with confirmation
6. Wire image replace (upload new, delete old)
7. Add upload progress indicator

## M6 — Profile page ✅

1. Add `/profile` route to `src/router/index.ts` with `requiresAuth` meta
2. Create `src/views/ProfileView.vue` — mount ProfileInfo + ProfileForm
3. Wire ProfileInfo to `authStore.user` data

## M7 — Polish + responsive ✅

1. Audit all views for loading spinner, empty state, error message
2. Mobile pass: sidebar/drawer nav, stack layouts on small screens
3. Review route guards — ensure all protected routes redirect correctly
4. Final visual consistency check against neo-brutalist design system

---

## M8 — Simplify profile (read-only name + email) ✅

> Goal: Remove the edit form. Profile page shows name + email only, no modification.

1. **Rewrite `src/views/ProfileView.vue`**
   - Remove ProfileForm import and usage entirely
   - Single centered card with avatar icon, display name, email
   - Remove `handleFormSubmit`, `formLoading`, `formSuccess`, `formError` refs

2. **Delete `src/components/profile/ProfileForm.vue`** — no longer needed

3. **Delete `src/components/profile/ProfileInfo.vue`** — content inlined into ProfileView

## M9 — Fix image upload flow (is_main + field name bug) ✅

> Goal: Image upload actually works end-to-end. One image per article, marked as `is_main: true`.

1. **Fix `src/components/images/ImageUploader.vue`**
   - `article_id` → `articleId` (camelCase to match backend)
   - Add `formData.append('is_main', 'true')`

2. **Fix `src/views/ArticleDetailView.vue`**
   - Use `articlesStore.currentArticle.images` instead of separate `fetchImages()` call
   - Remove `images` ref, `fetchImages()`, `imagesLoading`, `handleSetMain`

3. **Simplify `src/components/images/ImageCard.vue`** — remove set-main button, keep delete only

4. **Simplify `src/components/images/ImageGrid.vue`** — remove `select-main` emit

## M10 — Article edit form + shared component ✅

> Goal: ArticleEditView actually works. Shared form for create/edit.

1. **Create `src/components/articles/ArticleForm.vue`**
   - Shared form: title, slug (auto-generate on create, manual on edit), content textarea, type select
   - Props: `mode` ('create'|'edit'), `initialTitle`, `initialSlug`, `initialContent`, `initialTypeId`, `loading`, `error`
   - Emits: `submit` with `{ title, slug, content, type_id }`

2. **Rewrite `src/views/ArticleCreateView.vue`**
   - Use `ArticleForm` component instead of inline form
   - Keep breadcrumb, page header, router-link cancel

3. **Rewrite `src/views/ArticleEditView.vue`**
   - Replace stub ("Formulaire à venir") with real form
   - Use `ArticleForm` component with `mode="edit"` and pre-filled initial values from `articlesStore.currentArticle`
   - On submit: call `articlesStore.updateArticle()` then redirect to detail

## M11 — Articles list thumbnail placeholder ✅

> Goal: Show a camera icon next to each article in the list (no real thumbnail yet).

1. **Update `src/views/ArticlesView.vue`**
   - Add a camera icon (`add_a_photo` or `photo_library` Material Symbol) before the article title in both desktop rows and mobile cards
   - Fixed-size square: `w-10 h-10 bg-ink/5 border-2 border-ink/20 flex items-center justify-center`
   - No image loading — just the placeholder icon for now

## M12 — Fix duplicate is_main constraint on multi-image upload ✅

> Goal: Allow uploading multiple images per article. Only the first image gets `is_main: true`. Subsequent uploads get `is_main: false`.
> 
> **Bug**: Supabase has a unique constraint `one_main_image_per_article` on `(article_id) WHERE is_main = true`. The ImageUploader always sends `is_main: 'true'`, so the second upload fails with `23505 duplicate key value violates unique constraint`.

1. **Fix `src/components/images/ImageUploader.vue`**
   - Add a new prop: `hasImage: boolean` (default `false`)
   - Only append `is_main: 'true'` when `hasImage` is false
   - When `hasImage` is true, append `is_main: 'false'`
   - This way: first image → main, subsequent images → not main

2. **Update `src/views/ArticleDetailView.vue`**
   - Pass `:has-image="articleImages.length > 0"` to `ImageUploader`
   - `articleImages` is already a computed from `currentArticle.images`

3. **Verify**: upload 2+ images to the same article — no 23505 error
