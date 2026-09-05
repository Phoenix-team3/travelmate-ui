import { Link } from "react-router-dom";
import { Luggage } from "lucide-react";
import type { Flight } from "../../types";
import { airlineByCode } from "../../data/airlines";
import { formatDuration, formatTime, stopsLabel } from "../../data/flights";
import { formatCurrency } from "../../utils/pricing";

export default function FlightCardGrid({ flight }: { flight: Flight }) {
  const airline = airlineByCode(flight.airlineCode);

  return (
    <article
      id={`flight-card-${flight.id}`}
      data-testid={`flight-card-${flight.id}`}
      className="result-card-v2 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:grid-cols-[1fr_auto]"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: airline.logoColor }}
            aria-hidden="true"
          >
            {airline.code}
          </span>
          <div className="sm:hidden">
            <p className="text-sm font-semibold text-slate-900">{airline.name}</p>
            <p className="text-xs text-slate-500">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{airline.name}</p>
            <p className="text-xs text-slate-500">{flight.flightNumber}</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-900">{formatTime(flight.departTime)}</p>
            <p className="text-xs text-slate-500">
              {flight.fromCode} · {formatDuration(flight.durationMinutes)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-900">{formatTime(flight.arriveTime)}</p>
            <p data-testid={`flight-stops-${flight.id}`} className="text-xs text-slate-500">
              {flight.toCode} · {stopsLabel(flight.stops)}
            </p>
          </div>
        </div>
      </div>

      <div
        className="fare-summary-box flex flex-row items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 sm:w-56 sm:flex-col sm:items-end"
        data-testid={`fare-summary-${flight.id}`}
      >
        <div className="text-right">
          <p data-testid={`flight-price-${flight.id}`} className="text-xl font-extrabold text-slate-900">
            {formatCurrency(flight.price, flight.currency)}
          </p>
          <p className="flex items-center justify-end gap-1 text-xs text-slate-500">
            <Luggage className="h-3 w-3" aria-hidden="true" />
            {flight.cabin}
          </p>
        </div>
        <Link
          to={`/flights/${flight.id}`}
          data-testid={`view-details-button-${flight.id}`}
          aria-label={`View details for flight ${flight.flightNumber}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-sunset-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sunset-600 sm:w-auto"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
