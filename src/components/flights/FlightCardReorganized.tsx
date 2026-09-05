import { Link } from "react-router-dom";
import { Luggage } from "lucide-react";
import type { Flight } from "../../types";
import { airlineByCode } from "../../data/airlines";
import { formatDuration, formatTime, stopsLabel } from "../../data/flights";
import { formatCurrency } from "../../utils/pricing";

export default function FlightCardReorganized({ flight }: { flight: Flight }) {
  const airline = airlineByCode(flight.airlineCode);

  return (
    <article
      id={`flight-card-${flight.id}`}
      data-testid={`flight-card-${flight.id}`}
      className="result-card-v3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: airline.logoColor }}
            aria-hidden="true"
          >
            {airline.code}
          </span>
          <p className="text-sm font-semibold text-slate-900">
            {airline.name} <span className="font-normal text-slate-400">· {flight.flightNumber}</span>
          </p>
        </div>
        <p data-testid={`flight-price-${flight.id}`} className="text-lg font-extrabold text-slate-900">
          {formatCurrency(flight.price, flight.currency)}
        </p>
      </header>

      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatTime(flight.departTime)}</p>
            <p className="text-xs text-slate-500">{flight.fromCode}</p>
          </div>
          <div className="text-center text-xs text-slate-400">
            <p>{formatDuration(flight.durationMinutes)}</p>
            <p data-testid={`flight-stops-${flight.id}`} className="font-medium">
              {stopsLabel(flight.stops)}
            </p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{formatTime(flight.arriveTime)}</p>
            <p className="text-xs text-slate-500">{flight.toCode}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Luggage className="h-3 w-3" aria-hidden="true" />
            {flight.cabin}
          </p>
          <Link
            to={`/flights/${flight.id}`}
            data-testid={`view-details-button-${flight.id}`}
            aria-label={`View details for flight ${flight.flightNumber}`}
            className="inline-flex items-center justify-center rounded-lg border-2 border-brand-950 bg-white px-5 py-2.5 text-sm font-bold text-brand-950 shadow-sm transition hover:bg-brand-950 hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
