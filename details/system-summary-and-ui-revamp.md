# Demo Hotel Management — System Summary and Airbnb‑style UI Revamp Plan

## Overview

This document summarizes how the API, client UI, and Playwright E2E tests work in the Demo Hotel Management project, and proposes a phased revamp of the UI to follow design patterns similar to Airbnb.

---

## API Summary (`api/`)

- Server
  - `src/index.ts`: Express server on `:3000`, serves compiled client from `client/dist` in production.
  - Integrations: `mongoose` (MongoDB), `cloudinary` (image uploads), `stripe` (payments), `cookie-parser` (JWT cookie), `dotenv`.
  - Middleware: `verifyToken` reads `auth_token` cookie and attaches `req.userId`.
  - CORS: currently commented out; enable for dev with `origin: http://localhost:5173`, `credentials: true`.

- Auth & Users
  - `POST /api/auth/login`: validates credentials, sets `auth_token` HTTP‑only cookie, returns `userId`.
  - `GET /api/users/me`: returns current user (sans password), requires `auth_token`.
  - `POST /api/users/register`: creates a user; basic validation and bcrypt hashing.
  - `GET /api/auth/validate-token`: used by client to check login state (endpoint referenced client‑side; ensure it exists on the server).

- Hotels (Public search & details)
  - `GET /api/hotels`: latest hotels (`sort -lastUpdated`).
  - `GET /api/hotels/search`: filtered search by destination, capacity, facilities, types, stars, price, sort, pagination.
  - `GET /api/hotels/:id`: hotel detail.

- Bookings (Payments + create)
  - `POST /api/hotels/:hotelId/booking/payment-intent`: creates Stripe PaymentIntent (currency `lkr`), requires `auth_token`.
  - `POST /api/hotels/:hotelId/booking`: verifies PaymentIntent and appends booking to hotel.

- My Hotels (Host CRUD)
  - `POST /api/my-hotels`: create hotel; multipart upload via `multer.memoryStorage`, images uploaded to Cloudinary.
  - `GET /api/my-hotels`: list hotels for `req.userId`.
  - `GET /api/my-hotels/:id`: fetch one hotel for `req.userId`.
  - `PUT /api/my-hotels/:hotelId`: update hotel and (optionally) images.

- My Bookings (User history)
  - `GET /api/my-bookings`: returns each hotel but filtered to bookings of `req.userId`.

- Data Models (`shared/types.ts`, `models/hotel.ts`)
  - `HotelType`: metadata, `imageUrls`, `bookings`, `lastUpdated`.
  - `BookingType`: guest details, dates, counts, `totalCost`.
  - `UserType`: basic auth profile.

- Environment Requirements
  - `MONGO`: MongoDB connection string.
  - `CLOUDINARY_*`: Cloudinary credentials.
  - `STRIPE_API_KEY`: Stripe secret key.
  - `JWT_SECRET_KEY`: for signing JWT.
  - For dev with Vite on `5173`, enable CORS and set `VITE_API_BASE_URL` to `http://localhost:3000` (see Client section).

---

## Client UI Summary (`client/`)

- Tech stack
  - React + TypeScript + Vite (port `5173`), TailwindCSS, React Router, React Query.
  - Contexts: `AppContext` (toasts, auth state), `SearchContext` (destination, dates, guest counts, hotelId, persisted via `sessionStorage`).
  - `api-client.ts`: all fetch calls use `import.meta.env.VITE_API_BASE_URL || ""` and then `.../api/*`. In dev, set `VITE_API_BASE_URL` to point to the API server.

- Core Pages
  - `Home`: shows latest destinations (`fetchHotels`) rendered as cards.
  - `Search`: filterable hotel search with pagination, sort, types, facilities, stars, max price.
  - `Details`: photo grid, facilities list, star rating; guest info form triggers login if unauthenticated.
  - `Booking`: Stripe `Elements` renders card UI; creates payment intent and booking for authenticated users.
  - `MyHotels`: host list; `AddHotel` and `EditHotels` support creation and editing with image uploads.
  - `MyBookings`: shows user bookings grouped by hotel.
  - `Login`/`Register`: mutation calls to auth/users endpoints, toasts on success/failure.

- Dev setup considerations
  - Run client dev server: `VITE_API_BASE_URL=http://localhost:3000 npm run dev`.
  - Ensure API CORS allows `http://localhost:5173` with credentials so cookies (`auth_token`) flow.
  - Alternatively, configure Vite proxy for `/api` to `http://localhost:3000`.

---

## E2E Tests Summary (`e2e/`)

- Playwright tests target `http://localhost:5173` and exercise:
  - `auth.spec.ts`: login and registration flows, verifying header links and Sign Out.
  - `manage-hotels.spec.ts`: login, add hotel with images, view and edit hotels.
  - `search-hotel.spec.ts`: search results, hotel detail navigation; booking flow scaffolded (commented code for Stripe inputs).

- How to run (expected):
  1. API: `cd api && npm install && npm run build && npm run start` (or `npm run e2e` with `.env.e2e`).
  2. Client: `cd client && npm install && VITE_API_BASE_URL=http://localhost:3000 npm run dev`.
  3. Tests: `cd e2e && npm install && npx playwright test`.
  4. Required env: MongoDB, Cloudinary, Stripe, JWT secret; CORS enabled; `VITE_API_BASE_URL` set.

- Current blocker observed
  - Dependency installation failed due to network (`npm ECONNRESET`). As a result, servers and tests could not be executed here. When network is restored, run the commands above.

---

## Notable Gaps and Quick Fixes

- CORS is commented in `api/src/index.ts`. Enable it for dev:
  ```ts
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  ```
- Ensure `GET /api/auth/validate-token` exists server‑side to match client expectations.
- In dev, set `VITE_API_BASE_URL` or add Vite proxy for `/api`.
- Confirm currency (`lkr`) and amounts in Stripe meet your use case.

---

## Airbnb‑Style UI Revamp Plan

### Goals
- Emphasize discovery with a clean visual hierarchy, generous white space, and a photo‑first layout.
- Fast, intuitive filters with sticky header and quick chips.
- Consistent component library with design tokens for typography, color, spacing, and shadows.

### Design System Foundations
- Create `components/ui/` with primitives: `Button`, `Input`, `Select`, `Chip`, `Badge`, `Card`, `Modal`, `Sheet`, `Tabs`.
- Design tokens: `colors.ts`, `spacing.ts`, `typography.ts`, `shadows.ts` (Tailwind config or CSS vars).
- Accessibility: focus states, keyboard nav, ARIA roles for forms and modals.

### Key Screens
- Header & Global Search
  - Sticky header with global search bar (destination, dates, guests) always accessible.
  - Account menu with avatar, quick links (`My Bookings`, `My Hotels`, `Sign Out`).

- Home
  - Hero section with featured categories (chips) and curated collections.
  - Photo tiles with subtle hover elevation and price/rating overlays.

- Search Results
  - Left sticky filter column with: price slider, type chips, facilities, star rating, instant sort.
  - Right grid of listing cards with larger photos, rating stars, price per night, city/country, and a heart icon for wishlisting.
  - Optional split view with map (later phase).

- Listing Detail
  - Photo mosaic top section (1 large + 4 small), expanded gallery modal.
  - Key facts: rating, reviews count, location, amenities grid.
  - Booking panel: calendar picker with price breakdown and total; prominent CTA.

- Auth
  - Modal login/register for smoother flow; redirect preserved post‑auth.

- Host (My Hotels)
  - Reskinned forms with grouped sections (Basics, Photos, Amenities, Pricing) and progress indicators.
  - Inline image uploader with reorder and remove.

### Technical Implementation Plan
- Routing: keep React Router; add route‑based code splitting if needed.
- State/data: continue React Query; add optimistic updates for hotel edits. Consider `Zustand` (lightweight) for UI state (modals, maps).
- Forms: retain `react-hook-form`; add yup/zod for schema validation (better errors).
- Payments: retain Stripe Elements; upgrade UI of the payment panel.
- Performance: image lazy‑loading, responsive breakpoints, and list virtualization for long grids.

### Phased Roadmap (Recommended)
1) Foundations: design tokens and UI primitives; re‑skin Header.
2) Home: hero and category chips; new card design.
3) Search: sticky filter bar, revamped grid, sorting.
4) Detail: photo mosaic and booking panel.
5) Auth: modal flows; polish toasts.
6) Host: MyHotels add/edit forms; image manager.
7) Optional: Map view in search; wishlists.
8) QA & Accessibility: keyboard nav, focus order, contrast.

### File/Component Targets
- `src/components/Header.tsx`: new sticky header, global search.
- `src/components/SearchBar.tsx`: consolidate into global search component.
- `src/pages/Search.tsx`: layout refactor with filter sidebar and card grid.
- `src/components/SearchResultCard.tsx`: new card with photo focus, rating, price.
- `src/pages/Details.tsx`: photo mosaic, amenities grid, booking panel.
- `src/pages/Booking.tsx` & `src/forms/BookingForm/*`: refined payment UI.
- `src/pages/MyHotels.tsx`, `src/pages/AddHotel.tsx`, `src/pages/EditHotels.tsx`: segmented host forms, image manager.

---

## Next Steps
- Unblock dependencies (resolve npm network error) and run servers.
- Enable CORS and set `VITE_API_BASE_URL` for local dev.
- Start implementing phase 1 (design tokens + header) behind a feature flag or branch.
- Iterate with snapshots and E2E smoke tests in Playwright.

If you’d like, I can start implementing Phase 1 (Header + tokens) and wire up a proxy so the dev client talks to the API seamlessly.