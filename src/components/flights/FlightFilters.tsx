import type { Flight } from "../../types";
import { airlineByCode } from "../../data/airlines";
import { DEPARTURE_WINDOWS, type FlightFiltersState } from "../../utils/filtering";
import { formatCurrency } from "../../utils/pricing";

interface Props {
  allFlights: Flight[];
  filters: FlightFiltersState;
  onChange: (filters: FlightFiltersState) => void;
  maxPossiblePrice: number;
}

export default function FlightFilters({ allFlights, filters, onChange, maxPossiblePrice }: Props) {
  const airlineCodes = Array.from(new Set(allFlights.map((f) => f.airlineCode)));

  const toggleAirline = (code: string) => {
    const next = filters.airlines.includes(code)
      ? filters.airlines.filter((c) => c !== code)
      : [...filters.airlines, code];
    onChange({ ...filters, airlines: next });
  };

  const toggleStops = (stopCount: number) => {
    const next = filters.stops.includes(stopCount)
      ? filters.stops.filter((s) => s !== stopCount)
      : [...filters.stops, stopCount];
    onChange({ ...filters, stops: next });
  };

  const toggleWindow = (windowKey: FlightFiltersState["departureWindows"][number]) => {
    const next = filters.departureWindows.includes(windowKey)
      ? filters.departureWindows.filter((w) => w !== windowKey)
      : [...filters.departureWindows, windowKey];
    onChange({ ...filters, departureWindows: next });
  };

  const clearAll = () =>
    onChange({ airlines: [], stops: [], departureWindows: [], maxPrice: maxPossiblePrice });

  return (
    <aside
      id="flight-filters"
      data-testid="flight-filters"
      aria-label="Flight filters"
      className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-5 lg:w-72"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Filters</h2>
        <button
          type="button"
          data-testid="clear-filters-button"
          onClick={clearAll}
          className="text-xs font-semibold text-brand-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      <fieldset className="mb-6" data-testid="filter-price">
        <legend className="mb-2 text-sm font-semibold text-slate-700">Price</legend>
        <input
          type="range"
          id="filter-price-range"
          data-testid="filter-price-range"
          aria-label="Maximum price"
          min={0}
          max={maxPossiblePrice}
          step={500}
          value={filters.maxPrice || maxPossiblePrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-brand-600"
        />
        <p className="mt-1 text-xs text-slate-500">
          Up to <span data-testid="filter-price-value">{formatCurrency(filters.maxPrice || maxPossiblePrice)}</span>
        </p>
      </fieldset>

      <fieldset className="mb-6" data-testid="filter-stops">
        <legend className="mb-2 text-sm font-semibold text-slate-700">Stops</legend>
        <div className="space-y-1.5">
          {[
            { value: 0, label: "Non-stop" },
            { value: 1, label: "1 stop" },
            { value: 2, label: "2+ stops" },
          ].map((opt) => (
            <label
              key={opt.value}
              htmlFor={`filter-stops-${opt.value}`}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="checkbox"
                id={`filter-stops-${opt.value}`}
                data-testid={`filter-stops-${opt.value}`}
                checked={filters.stops.includes(opt.value)}
                onChange={() => toggleStops(opt.value)}
                className="h-4 w-4 rounded accent-brand-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6" data-testid="filter-airlines">
        <legend className="mb-2 text-sm font-semibold text-slate-700">Airlines</legend>
        <div className="space-y-1.5">
          {airlineCodes.map((code) => {
            const airline = airlineByCode(code);
            return (
              <label
                key={code}
                htmlFor={`filter-airline-${code}`}
                className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  id={`filter-airline-${code}`}
                  data-testid={`filter-airline-${code}`}
                  checked={filters.airlines.includes(code)}
                  onChange={() => toggleAirline(code)}
                  className="h-4 w-4 rounded accent-brand-600"
                />
                {airline.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset data-testid="filter-departure-time">
        <legend className="mb-2 text-sm font-semibold text-slate-700">Departure time</legend>
        <div className="space-y-1.5">
          {DEPARTURE_WINDOWS.map((window) => (
            <label
              key={window.key}
              htmlFor={`filter-departure-${window.key}`}
              className="flex cursor-pointer items-center justify-between gap-2 text-sm text-slate-600"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`filter-departure-${window.key}`}
                  data-testid={`filter-departure-${window.key}`}
                  checked={filters.departureWindows.includes(window.key)}
                  onChange={() => toggleWindow(window.key)}
                  className="h-4 w-4 rounded accent-brand-600"
                />
                {window.label}
              </span>
              <span className="text-xs text-slate-400">{window.range}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  );
}
