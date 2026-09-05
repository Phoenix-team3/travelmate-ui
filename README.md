# TravelMate

A modern, production-quality **mock travel booking web application** built as the target/demo application for an upcoming AI-powered autonomous QA testing project. It simulates a real consumer flight-booking product end to end (search → results → details → traveler info → review → payment → confirmation), using only local/mock data — no external travel APIs.

Its second purpose is a **built-in UI versioning system**: the app can be switched between four versions (`v1.0`–`v1.3`) that each introduce deliberate, documented UI changes (copy, styling, DOM structure, identifiers). This lets a future QA/testing engine demonstrate detecting when the UI changed and whether existing automated tests still work or need "healing."

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** (dev server / build)
- **React Router 7** (client-side routing)
- **Tailwind CSS 4** (via `@tailwindcss/vite`, zero PostCSS config)
- **lucide-react** (icons)
- Local React Context + `localStorage` for state — no backend, no external APIs

## Getting started

```bash
npm install
npm run dev       # start the Vite dev server (http://localhost:5173)
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

---

## Project structure

```
src/
  components/
    booking/        BookingSteps (progress stepper), FormField (labeled input + error)
    dev/             VersionSimulator — the floating "Dev Panel" for switching app versions
    flights/         FlightCard (dispatcher) + 3 layout variants + FlightFilters
    layout/          Header, Footer
    search/          SearchForm, AirportSelect, TravelerCabinSelector
  context/
    VersionContext.tsx   Current app version (v1.0–v1.3), persisted to localStorage
    BookingContext.tsx   Search params, search results, selected flight, traveler, booking
  data/
    airports.ts      Airport list + popular-destination cards (gradient placeholders, no external images)
    airlines.ts       Airline list (code, name, brand color)
    flights.ts        Deterministic mock-flight generator + formatting helpers
  layouts/
    MainLayout.tsx    Header + <Outlet/> + Footer + VersionSimulator, shared by every route
  pages/
    HomePage, FlightResultsPage, FlightDetailsPage, TravelerDetailsPage,
    ReviewBookingPage, PaymentPage, ConfirmationPage, TripsPage, HotelsPage,
    HelpPage, NotFoundPage
  types/
    index.ts          Shared TypeScript types (Flight, Airport, Traveler, Booking, ...)
  utils/
    seededRandom.ts   Deterministic PRNG (mulberry32) seeded from a string
    filtering.ts      Flight filter/sort logic used by the results page
    pricing.ts        Price breakdown + currency + booking-reference helpers
    validation.ts     Traveler form validation rules
  versions/
    index.ts          The version registry — see "Versioning system" below
  App.tsx              Route table
  main.tsx             App bootstrap: BrowserRouter > VersionProvider > BookingProvider > App
```

---

## User flow & routes

| Route | Page | Purpose |
|---|---|---|
| `/` | HomePage | Hero + flight search form + popular destinations |
| `/flights` | FlightResultsPage | Search results with filters + sorting |
| `/flights/:id` | FlightDetailsPage | Full itinerary, baggage, fare conditions, price breakdown |
| `/booking/traveler` | TravelerDetailsPage | Traveler form with validation |
| `/booking/review` | ReviewBookingPage | Flight + traveler + price summary, "Confirm and Pay" |
| `/booking/payment` | PaymentPage | Mock card form, "Pay Now" simulates a charge |
| `/booking/confirmation` | ConfirmationPage | Booking reference, summary, "View My Trip" / "Back to Home" |
| `/trips` | TripsPage | Shows the most recent confirmed booking ("My Trips") |
| `/hotels`, `/help` | HotelsPage, HelpPage | Placeholder pages so header nav has no dead links |
| `*` | NotFoundPage | 404 fallback |

Guard rails: `TravelerDetailsPage`, `ReviewBookingPage`, `PaymentPage`, and `ConfirmationPage` redirect back (`<Navigate>`) if their required upstream state (selected flight / traveler / booking) is missing — e.g. visiting `/booking/payment` directly without a selected flight bounces you to `/flights`.

### Booking flow state (`BookingContext`)

One context holds the entire booking session and persists it to `localStorage` (`travelmate.bookingState`) so a page refresh doesn't lose progress:

- `searchParams` — trip type, origin/destination codes, dates, traveler count, cabin class (defaults to the spec's example: BLR → CDG, 20–28 Sep 2026, 2 travelers, Economy)
- `searchResults` — the flight list generated for the last search
- `selectedFlightId` / `selectedFlight` — the flight chosen on the results/details page
- `traveler` — the traveler form values
- `booking` — the final confirmed `Booking` record (reference, flight, traveler, price, timestamp), created only after "Pay Now" succeeds

Key actions exposed by `useBooking()`: `runSearch(params)`, `selectFlight(id)`, `saveTraveler(traveler)`, `confirmBooking()`, `resetBooking()`.

---

## Mock data

No external APIs. All flight data is generated by `src/data/flights.ts`:

- `generateFlights(searchParams)` uses a **seeded PRNG** (`utils/seededRandom.ts`, mulberry32 keyed by `from-to-date-cabin`) so the same search always reproduces the same 12–17 flights — real variety, but stable across re-renders and page refreshes (important for repeatable automated testing).
- Realistic route distances are looked up from a small hard-coded distance table (`ROUTE_DISTANCE_KM`) for common city pairs, falling back to a default for unmapped routes; distance drives flight duration and price.
- Each flight gets an airline (from `data/airlines.ts`, 8 real-world airlines), a flight number, 0–2 stops (with layover hub airports and multi-segment itineraries), aircraft type, baggage allowance (varies by cabin), fare type (Saver/Value/Flex) and refundability, seats left, and a price scaled by distance, cabin class, and stop count.
- `airports.ts` lists 12 airports (Bangalore, Delhi, Mumbai, Paris, London, New York, Dubai, Singapore, Tokyo, Sydney, Frankfurt, Amsterdam) plus 4 "popular destinations" cards (gradient placeholders instead of external images, since the app is local-data-only).

Formatting/derivation helpers live alongside: `formatDuration`, `formatTime`, `formatDateLong`, `stopsLabel`, `routeLabel`.

---

## Core features

### Home / search (`HomePage` + `SearchForm`)
- Hero "Where will you go next?" + search card with trip type (round trip / one way), From/To airport selects with a swap button, departure/return date pickers, a combined Travelers + Cabin Class selector (stepper + radio popover), and the primary search CTA.
- Submitting calls `runSearch` and navigates to `/flights`.
- Clicking a "popular destination" card runs a search straight to that city.

### Flight results (`FlightResultsPage` + `FlightFilters` + `FlightCard`)
- Live result count ("N flights found"), sortable by departure time / price / duration.
- Sidebar filters: max price (range slider), stops (non-stop/1/2+), airline (checkbox list built from the current result set), departure time window (morning/afternoon/evening/night) — all combine via `utils/filtering.ts`.
- Each result renders through `FlightCard`, which dispatches to one of three structurally different layout components depending on the active app version (see below).

### Flight details (`FlightDetailsPage`)
Full multi-segment itinerary (per-leg times, airports, aircraft), cabin/checked baggage allowance, fare conditions (fare type, refundability, seats left), and a price breakdown (base × travelers, taxes, fees, total). "Continue" stores the selection and moves to the traveler step.

### Traveler details (`TravelerDetailsPage` + `utils/validation.ts`)
Collects first/last name, email, phone, date of birth, and passport number. Validation runs on submit (not on every keystroke) and surfaces per-field errors: required checks, email regex, 10-digit phone, valid non-future DOB, and a passport-number pattern.

### Review (`ReviewBookingPage`)
Read-only summary of the flight, traveler, and price breakdown with a "Confirm and Pay" CTA that moves to payment (the booking itself isn't created until payment succeeds).

### Payment (`PaymentPage`)
Mock-only card form (number, cardholder, expiry, CVV) with input masking (card number grouped in 4s, expiry auto-formatted `MM/YY`) and validation. "Pay Now" shows a brief "Processing…" state, then calls `confirmBooking()` (generates a `TM-XXXXXX` reference) and navigates to confirmation. No real payment processing of any kind.

### Confirmation (`ConfirmationPage`)
"Booking Confirmed!" with reference, traveler, flight, date, destination, and total paid; "View My Trip" goes to `/trips`, "Back to Home" resets to `/`.

---

## Versioning system

This is the app's other main purpose: a small, explicit framework for demonstrating that a UI changed between releases, built so a future QA/self-healing engine has something real to detect and reconcile.

### How it works

- `src/versions/index.ts` defines `AppVersion` (`"v1.0" | "v1.1" | "v1.2" | "v1.3"`) and a `VERSION_CONFIGS` registry — one `VersionConfig` object per version describing everything that differs: button/label text, a Tailwind className + `id` for the primary search CTA, which flight-card layout to use, where the traveler selector sits in the form, which CTA "shape" to render, whether the search form wraps in a `<div>` or `<section>`, and a human-readable list of `changes` for that version.
- `context/VersionContext.tsx` exposes `useVersion()` (current version, its config, `setVersion`, the list of available versions). The choice is persisted to `localStorage` (`travelmate.appVersion`) **and** mirrored onto `<html data-app-version="v1.x">`, so an external test runner can read the active version straight from the DOM without any app-specific API.
- Every version-sensitive component (`Header`, `SearchForm`, `FlightCard` and its 3 layout variants) reads `useVersion().config` and branches on it — there is no scattered `if (version === ...)` logic outside this one registry.

### The Version Simulator (dev panel)

A floating "Dev Panel" button (bottom-right on every page, `components/dev/VersionSimulator.tsx`) opens a panel showing:
- The current version
- A radio selector for all four versions (instant switch, no reload)
- A live "Changes in this version" bullet list pulled straight from that version's `changes` array

This panel is visually separate from the consumer-facing app and exists purely for demoing/testing version switches.

### What changes between versions

| | v1.0 (baseline) | v1.1 (copy) | v1.2 (structure) | v1.3 (layout overhaul) |
|---|---|---|---|---|
| Search button text | "Search Flights" | **"Find Flights"** | "Find Flights" | **"Search Trips"** |
| "From" field label | "From" | **"Origin"** | "Origin" | "Origin" |
| "To" field label | "To" | **"Destination"** | "Destination" | "Destination" |
| Login button | "Login" | "Login" | "Login" | **"Sign In"** |
| Search button style/id | solid blue, `id="search-flights-button"` | same | **pill + gradient**, `id="find-flights-cta"` | **dark, full-width on mobile**, `id="trips-search-cta"` |
| Search CTA composition | icon + label | icon + label | **icon-in-circle + label** (extra wrapper) | **stacked** (button + "Best fares guaranteed" helper text) |
| CTA placement | bottom of form | bottom of form | bottom of form | **top of form**, next to an added "Plan your trip" heading |
| Traveler/cabin selector position | inline in the main row | inline | **own row below** the main row | **top of the form**, above trip type |
| Form wrapper element | `<div>` | `<div>` | `<div>` | **`<section>`** |
| Flight result card | horizontal row (`FlightCardClassic`) | same | **CSS grid + grouped "fare box"** (`FlightCardGrid`) | **header/body split, outline CTA** (`FlightCardReorganized`) |

Everything in this table is driven by `versions/index.ts` — to add a `v1.4`, add one more entry to `VERSION_CONFIGS` (and a new layout/dispatch branch only if you're introducing a structurally new component, as `FlightCard` does).

---

## Built for testability (stable + intentionally changing identifiers)

Every interactive element important to a test (search form fields, the search button, filters, flight cards, "View Details", the traveler form, "Continue to Review", the payment form, "Pay Now", confirmation fields) exposes multiple ways to be located:

- `data-testid` — the primary hook for automated tests. Kept **stable across versions on the core action elements** (e.g. `data-testid="flight-search-button"` never changes, even though its visible text goes "Search Flights" → "Find Flights" → "Search Trips" and its `id` changes twice) so a QA engine can recognize "same business action, different label."
- `aria-label` — also kept semantically stable on the primary CTA (`"Search flights"`), independent of the visible label, for the same reason.
- `id`, class names, DOM nesting, and visible text **do** intentionally change across versions where the version table above says so — this is the raw material a self-healing test engine is meant to detect and reconcile.
- Native semantic HTML and ARIA roles throughout (`<fieldset>`/`<legend>` for radio/checkbox groups, `role="dialog"` for popovers/panels, `aria-invalid`/`aria-describedby`/`role="alert"` on form errors, `<nav aria-label="...">`, etc.), so elements are also findable by accessible role — never by ID alone.

## Ready for future integration (not implemented yet, by design)

The app deliberately stops short of building any QA tooling itself, but is structured so one can be bolted on:

- **Version detection**: read `document.documentElement.dataset.appVersion` (also mirrored in `localStorage.getItem("travelmate.appVersion")`).
- **Change awareness**: `versions/index.ts`'s `changes` arrays are a machine-readable summary of what differs release-to-release, ahead of any DOM diffing.
- **DOM capture / diffing, Playwright execution, selector healing, an AI QA dashboard, API testing, a Python service** — none of this exists yet; it's the next phase, built against this app as the fixed target.

## Design system

Tailwind v4 theme tokens are defined in `src/index.css` (`@theme` block): a `brand` blue scale (primary actions, links) and a `sunset` orange/coral scale (used for the v1.2 CTA restyle and the dev panel's accent color), on an off-white (`#f6f8fb`) page background. Cards use rounded-2xl/3xl corners, subtle shadows, and generous spacing throughout — deliberately styled as a consumer travel product, not an admin dashboard.
