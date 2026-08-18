# Product Requirements Document — CMS Frontend

## 1. Goal

Build a minimal, clean and responsive admin dashboard for managing a CMS.

The frontend consumes an existing REST API built with Express, Supabase and Cloudinary.

## 2. Tech Stack

* Vue 3
* TypeScript
* Vite
* Tailwind CSS
* Pinia
* Vue Router
* Axios

Authentication is already implemented with Supabase. Do not reimplement it.

## 3. Main Features

### Dashboard

Display:

* Number of articles
* Number of types
* Recent articles
* Quick action to create an article

### Articles

Users can:

* List articles
* View an article
* Create an article
* Edit an article
* Delete an article
* Search/filter articles

Article fields:

* Title
* Slug
* Content
* Type
* Author (user id = author id )

### Images

Users can:

* Upload multiple images to an article
* Preview images
* Select one main image
* Delete an image
* Replace an image

Article creation uses two API operations:

1. Create the article
2. Upload its images using the returned article ID

### Types

Users can:

* List types
* Create a type
* Edit a type
* Delete a type

## 4. Pages

```text
/login
/register
/dashboard
/articles
/articles/create
/articles/:id
/articles/:id/edit
/types
/profile
```

## 5. UI

Use the existing neo-brutalist design system in login view :

* Uppercase labels
* Wide tracking
* Minimal animations
* Responsive layout

Reuse existing components from `src/components/ui/`.

## 6. Architecture

```text
views
  ↓
components
  ↓
Pinia stores
  ↓
API services
  ↓
Express REST API
```

Use reusable components and keep business/API logic outside Vue views.

Do not modify the backend unless explicitly requested.

## 7. UX Requirements

Provide:

* Loading states
* Empty states
* Error messages
* Success notifications
* Delete confirmations
* Image upload progress/state

Keep the interface minimal. Avoid unnecessary features and UI complexity.

## 8. Success Criteria

The user can:

1. Log in
2. Access the dashboard
3. Create an article
4. Upload article images
5. Set a main image
6. Edit an article
7. Manage article types
8. Delete articles/images
9. Navigate the CMS comfortably on desktop and mobile
