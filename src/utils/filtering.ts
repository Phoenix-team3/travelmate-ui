import type { Flight } from "../types";

export type SortOption = "price" | "duration" | "departure";
export type DepartureWindow = "morning" | "afternoon" | "evening" | "night";

export interface FlightFiltersState {
  airlines: string[];
  stops: number[];
  departureWindows: DepartureWindow[];
  maxPrice: number;
}

export const DEPARTURE_WINDOWS: { key: DepartureWindow; label: string; range: string }[] = [
  { key: "morning", label: "Morning", range: "6:00 AM - 12:00 PM" },
  { key: "afternoon", label: "Afternoon", range: "12:00 PM - 6:00 PM" },
  { key: "evening", label: "Evening", range: "6:00 PM - 12:00 AM" },
  { key: "night", label: "Night", range: "12:00 AM - 6:00 AM" },
];

export function getDepartureWindow(iso: string): DepartureWindow {
  const hour = new Date(iso).getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 24) return "evening";
  return "night";
}

export function createDefaultFilters(flights: Flight[]): FlightFiltersState {
  const maxPrice = flights.length ? Math.max(...flights.map((f) => f.price)) : 0;
  return { airlines: [], stops: [], departureWindows: [], maxPrice };
}

export function applyFilters(flights: Flight[], filters: FlightFiltersState): Flight[] {
  return flights.filter((flight) => {
    if (filters.airlines.length && !filters.airlines.includes(flight.airlineCode)) return false;
    if (filters.stops.length) {
      const bucket = flight.stops >= 2 ? 2 : flight.stops;
      if (!filters.stops.includes(bucket)) return false;
    }
    if (filters.departureWindows.length) {
      if (!filters.departureWindows.includes(getDepartureWindow(flight.departTime))) return false;
    }
    if (filters.maxPrice && flight.price > filters.maxPrice) return false;
    return true;
  });
}

export function sortFlights(flights: Flight[], sortBy: SortOption): Flight[] {
  const copy = [...flights];
  if (sortBy === "price") return copy.sort((a, b) => a.price - b.price);
  if (sortBy === "duration") return copy.sort((a, b) => a.durationMinutes - b.durationMinutes);
  return copy.sort((a, b) => new Date(a.departTime).getTime() - new Date(b.departTime).getTime());
}
