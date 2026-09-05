/**
 * Central version registry for TravelMate.
 *
 * Every intentional UI difference between app versions is described here as
 * data rather than scattered `if (version === ...)` checks, so a future
 * external QA engine can also read this file to know, ahead of time, what
 * changed between two versions (labels, layout variants, DOM structure
 * flags) without having to diff screenshots blindly.
 */

export const APP_VERSIONS = ["v1.0", "v1.1", "v1.2", "v1.3"] as const;
export type AppVersion = (typeof APP_VERSIONS)[number];

export const DEFAULT_VERSION: AppVersion = "v1.0";

export type FlightCardLayout = "classic" | "grid" | "reorganized";
export type TravelerSelectorPosition = "inline" | "belowRow" | "topOfForm";
export type CtaVariant = "button" | "iconSplit" | "stackedActions";

export interface VersionLabels {
  searchButton: string;
  fromLabel: string;
  toLabel: string;
  loginButton: string;
}

export interface VersionConfig {
  version: AppVersion;
  label: string;
  labels: VersionLabels;
  searchButtonClassName: string;
  searchButtonId: string;
  flightCardLayout: FlightCardLayout;
  travelerSelectorPosition: TravelerSelectorPosition;
  ctaVariant: CtaVariant;
  formWrapperTag: "div" | "section";
  /** Human readable summary of what changed vs. the previous version, shown in the Version Simulator panel. */
  changes: string[];
}

export const VERSION_CONFIGS: Record<AppVersion, VersionConfig> = {
  "v1.0": {
    version: "v1.0",
    label: "v1.0 — Baseline",
    labels: {
      searchButton: "Search Flights",
      fromLabel: "From",
      toLabel: "To",
      loginButton: "Login",
    },
    searchButtonClassName:
      "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.98]",
    searchButtonId: "search-flights-button",
    flightCardLayout: "classic",
    travelerSelectorPosition: "inline",
    ctaVariant: "button",
    formWrapperTag: "div",
    changes: ["Initial baseline release."],
  },
  "v1.1": {
    version: "v1.1",
    label: "v1.1 — Copy refresh",
    labels: {
      searchButton: "Find Flights",
      fromLabel: "Origin",
      toLabel: "Destination",
      loginButton: "Login",
    },
    searchButtonClassName:
      "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-[0.98]",
    searchButtonId: "search-flights-button",
    flightCardLayout: "classic",
    travelerSelectorPosition: "inline",
    ctaVariant: "button",
    formWrapperTag: "div",
    changes: [
      '"Search Flights" → "Find Flights"',
      '"From" → "Origin"',
      '"To" → "Destination"',
    ],
  },
  "v1.2": {
    version: "v1.2",
    label: "v1.2 — Structural refresh",
    labels: {
      searchButton: "Find Flights",
      fromLabel: "Origin",
      toLabel: "Destination",
      loginButton: "Login",
    },
    searchButtonClassName:
      "group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sunset-500 to-sunset-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-sunset-500/30 transition hover:brightness-105 active:scale-[0.98]",
    searchButtonId: "find-flights-cta",
    flightCardLayout: "grid",
    travelerSelectorPosition: "belowRow",
    ctaVariant: "iconSplit",
    formWrapperTag: "div",
    changes: [
      "Search button restyled (pill shape, gradient background, new id)",
      "Traveler selector moved to its own row below the main search fields",
      "Primary CTA rebuilt as an icon + label split button",
      "Flight result card restructured to a grid layout",
    ],
  },
  "v1.3": {
    version: "v1.3",
    label: "v1.3 — Layout overhaul",
    labels: {
      searchButton: "Search Trips",
      fromLabel: "Origin",
      toLabel: "Destination",
      loginButton: "Sign In",
    },
    searchButtonClassName:
      "group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-950 px-7 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-brand-900 active:scale-[0.98] sm:w-auto",
    searchButtonId: "trips-search-cta",
    flightCardLayout: "reorganized",
    travelerSelectorPosition: "topOfForm",
    ctaVariant: "stackedActions",
    formWrapperTag: "section",
    changes: [
      '"Find Flights" → "Search Trips"',
      "Search form re-nested inside a <section> with the CTA moved above the fields",
      "Traveler selector moved to the top of the form",
      "Login button renamed to \"Sign In\"",
      "Flight result card actions reorganized (price + CTA regrouped, stacked layout)",
    ],
  },
};

export function getVersionConfig(version: AppVersion): VersionConfig {
  return VERSION_CONFIGS[version];
}

export function isValidVersion(value: string | null): value is AppVersion {
  return !!value && (APP_VERSIONS as readonly string[]).includes(value);
}
