import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Search } from "lucide-react";
import type { CabinClass, SearchParams, TripType } from "../../types";
import { useVersion } from "../../context/VersionContext";
import { useBooking } from "../../context/BookingContext";
import AirportSelect from "./AirportSelect";
import TravelerCabinSelector from "./TravelerCabinSelector";

export default function SearchForm() {
  const { config } = useVersion();
  const { searchParams, runSearch } = useBooking();
  const navigate = useNavigate();
  const [form, setForm] = useState<SearchParams>(searchParams);

  const update = (patch: Partial<SearchParams>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSwap = () => {
    update({ fromCode: form.toCode, toCode: form.fromCode });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(form);
    navigate("/flights");
  };

  const searchButton = (
    <button
      type="submit"
      id={config.searchButtonId}
      data-testid="flight-search-button"
      aria-label="Search flights"
      className={config.searchButtonClassName}
    >
      {config.ctaVariant === "iconSplit" ? (
        <>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span>{config.labels.searchButton}</span>
        </>
      ) : (
        <>
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>{config.labels.searchButton}</span>
        </>
      )}
    </button>
  );

  const travelerSelector = (
    <TravelerCabinSelector
      travelers={form.travelers}
      cabin={form.cabin}
      onChange={(travelers, cabin: CabinClass) => update({ travelers, cabin })}
    />
  );

  const Wrapper = config.formWrapperTag;

  return (
    <Wrapper
      id="flight-search-card"
      data-testid="flight-search-card"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-7"
    >
      <form onSubmit={handleSubmit} data-testid="flight-search-form" aria-label="Flight search form">
        {config.ctaVariant === "stackedActions" && (
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-slate-900">Plan your trip</h2>
            <div className="flex flex-col items-stretch gap-1">
              {searchButton}
              <span className="text-center text-[11px] text-slate-400">Best fares guaranteed</span>
            </div>
          </div>
        )}

        {config.travelerSelectorPosition === "topOfForm" && (
          <div className="mb-4 max-w-xs" data-testid="traveler-selector-row-top">
            {travelerSelector}
          </div>
        )}

        <fieldset className="mb-4 flex items-center gap-6" data-testid="trip-type-toggle">
          <legend className="sr-only">Trip type</legend>
          <label htmlFor="trip-type-roundtrip" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="radio"
              id="trip-type-roundtrip"
              name="trip-type"
              value="roundtrip"
              data-testid="trip-type-roundtrip"
              checked={form.tripType === "roundtrip"}
              onChange={() => update({ tripType: "roundtrip" as TripType })}
              className="h-4 w-4 accent-brand-600"
            />
            Round trip
          </label>
          <label htmlFor="trip-type-oneway" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="radio"
              id="trip-type-oneway"
              name="trip-type"
              value="oneway"
              data-testid="trip-type-oneway"
              checked={form.tripType === "oneway"}
              onChange={() => update({ tripType: "oneway" as TripType, returnDate: "" })}
              className="h-4 w-4 accent-brand-600"
            />
            One way
          </label>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <div className="relative lg:col-span-3">
            <AirportSelect
              id="origin-select"
              testId="airport-select-from"
              name="fromCode"
              label={config.labels.fromLabel}
              value={form.fromCode}
              onChange={(code) => update({ fromCode: code })}
              excludeCode={form.toCode}
            />
          </div>

          <div className="flex items-end justify-center lg:col-span-1">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap origin and destination"
              data-testid="swap-airports-button"
              className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:rotate-180 hover:text-brand-600"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="lg:col-span-3">
            <AirportSelect
              id="destination-select"
              testId="airport-select-to"
              name="toCode"
              label={config.labels.toLabel}
              value={form.toCode}
              onChange={(code) => update({ toCode: code })}
              excludeCode={form.fromCode}
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="depart-date" className="mb-1.5 block text-xs font-semibold text-slate-500">
              Departure
            </label>
            <input
              type="date"
              id="depart-date"
              name="departDate"
              data-testid="depart-date-input"
              aria-label="Departure date"
              value={form.departDate}
              onChange={(e) => update({ departDate: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="return-date" className="mb-1.5 block text-xs font-semibold text-slate-500">
              Return
            </label>
            <input
              type="date"
              id="return-date"
              name="returnDate"
              data-testid="return-date-input"
              aria-label="Return date"
              value={form.returnDate}
              disabled={form.tripType === "oneway"}
              onChange={(e) => update({ returnDate: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {config.travelerSelectorPosition === "inline" && (
            <div className="sm:col-span-2 lg:col-span-1" data-testid="traveler-selector-row-inline">
              {travelerSelector}
            </div>
          )}
        </div>

        {config.travelerSelectorPosition === "belowRow" && (
          <div className="mt-4 max-w-xs" data-testid="traveler-selector-row-below">
            {travelerSelector}
          </div>
        )}

        {config.ctaVariant !== "stackedActions" && (
          <div className="mt-5 flex justify-end">{searchButton}</div>
        )}
      </form>
    </Wrapper>
  );
}
