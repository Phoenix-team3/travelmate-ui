import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { routeLabel, formatDateLong } from "../data/flights";
import FlightCard from "../components/flights/FlightCard";
import FlightFilters from "../components/flights/FlightFilters";
import { applyFilters, createDefaultFilters, sortFlights, type FlightFiltersState, type SortOption } from "../utils/filtering";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "departure", label: "Departure time" },
  { value: "price", label: "Price (lowest first)" },
  { value: "duration", label: "Duration (shortest first)" },
];

export default function FlightResultsPage() {
  const { searchParams, searchResults, runSearch } = useBooking();
  const [sortBy, setSortBy] = useState<SortOption>("price");
  const [filters, setFilters] = useState<FlightFiltersState>(() => createDefaultFilters(searchResults));

  useEffect(() => {
    if (searchResults.length === 0) {
      runSearch(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilters(createDefaultFilters(searchResults));
  }, [searchResults]);

  const maxPossiblePrice = useMemo(
    () => (searchResults.length ? Math.max(...searchResults.map((f) => f.price)) : 0),
    [searchResults]
  );

  const visibleFlights = useMemo(() => {
    const filtered = applyFilters(searchResults, filters);
    return sortFlights(filtered, sortBy);
  }, [searchResults, filters, sortBy]);

  if (searchResults.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" data-testid="flight-results-loading">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div data-testid="flight-results-page" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900" data-testid="results-route-heading">
          {routeLabel(searchParams.fromCode, searchParams.toCode)}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {formatDateLong(new Date(`${searchParams.departDate}T00:00:00`).toISOString())} ·{" "}
          {searchParams.travelers} {searchParams.travelers === 1 ? "Traveler" : "Travelers"} · {searchParams.cabin}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <FlightFilters
          allFlights={searchResults}
          filters={filters}
          onChange={setFilters}
          maxPossiblePrice={maxPossiblePrice}
        />

        <div className="flex-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p data-testid="flight-results-count" className="text-sm font-medium text-slate-600">
              <span className="font-bold text-slate-900">{visibleFlights.length}</span> flights found
            </p>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <label htmlFor="sort-select" className="sr-only">
                Sort flights
              </label>
              <select
                id="sort-select"
                data-testid="sort-select"
                aria-label="Sort flights by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort by: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div data-testid="flight-results-list" className="flex flex-col gap-4">
            {visibleFlights.length === 0 ? (
              <div
                data-testid="no-flights-message"
                className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500"
              >
                No flights match your filters. Try clearing some filters.
              </div>
            ) : (
              visibleFlights.map((flight) => <FlightCard key={flight.id} flight={flight} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
