import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Booking, Flight, SearchParams, Traveler } from "../types";
import { generateFlights } from "../data/flights";
import { computePriceBreakdown, generateBookingReference } from "../utils/pricing";

const STORAGE_KEY = "travelmate.bookingState";

export const DEFAULT_SEARCH_PARAMS: SearchParams = {
  tripType: "roundtrip",
  fromCode: "BLR",
  toCode: "CDG",
  departDate: "2026-09-20",
  returnDate: "2026-09-28",
  travelers: 2,
  cabin: "Economy",
};

interface PersistedState {
  searchParams: SearchParams;
  searchResults: Flight[];
  selectedFlightId: string | null;
  traveler: Traveler | null;
  booking: Booking | null;
}

interface BookingContextValue extends PersistedState {
  selectedFlight: Flight | null;
  runSearch: (params: SearchParams) => Flight[];
  selectFlight: (flightId: string) => void;
  saveTraveler: (traveler: Traveler) => void;
  confirmBooking: () => Booking;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

function readStoredState(): PersistedState {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as PersistedState;
    } catch {
      // ignore malformed storage, fall through to defaults
    }
  }
  return {
    searchParams: DEFAULT_SEARCH_PARAMS,
    searchResults: [],
    selectedFlightId: null,
    traveler: null,
    booking: null,
  };
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(readStoredState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const runSearch = (params: SearchParams): Flight[] => {
    const results = generateFlights(params);
    setState((prev) => ({
      ...prev,
      searchParams: params,
      searchResults: results,
      selectedFlightId: null,
    }));
    return results;
  };

  const selectFlight = (flightId: string) => {
    setState((prev) => ({ ...prev, selectedFlightId: flightId }));
  };

  const saveTraveler = (traveler: Traveler) => {
    setState((prev) => ({ ...prev, traveler }));
  };

  const selectedFlight = useMemo(
    () => state.searchResults.find((f) => f.id === state.selectedFlightId) ?? null,
    [state.searchResults, state.selectedFlightId]
  );

  const confirmBooking = (): Booking => {
    if (!selectedFlight || !state.traveler) {
      throw new Error("Cannot confirm booking without a selected flight and traveler details");
    }
    const price = computePriceBreakdown(selectedFlight, state.searchParams.travelers);
    const booking: Booking = {
      bookingRef: generateBookingReference(),
      flight: selectedFlight,
      traveler: state.traveler,
      searchParams: state.searchParams,
      price,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    setState((prev) => ({ ...prev, booking }));
    return booking;
  };

  const resetBooking = () => {
    setState({
      searchParams: DEFAULT_SEARCH_PARAMS,
      searchResults: [],
      selectedFlightId: null,
      traveler: null,
      booking: null,
    });
  };

  const value: BookingContextValue = {
    ...state,
    selectedFlight,
    runSearch,
    selectFlight,
    saveTraveler,
    confirmBooking,
    resetBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}
