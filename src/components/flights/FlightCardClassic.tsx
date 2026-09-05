import { Link } from "react-router-dom";
import { Luggage, PlaneTakeoff } from "lucide-react";
import type { Flight } from "../../types";
import { airlineByCode } from "../../data/airlines";
import { formatDuration, formatTime, stopsLabel } from "../../data/flights";
import { formatCurrency } from "../../utils/pricing";

export default function FlightCardClassic({ flight }: { flight: Flight }) {
  const airline = airlineByCode(flight.airlineCode);

  return (
    <article
      id={`flight-card-${flight.id}`}
      data-testid={`flight-card-${flight.id}`}
      className="flight-result-card flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3 sm:w-48">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: airline.logoColor }}
          aria-hidden="true"
        >
          {airline.code}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{airline.name}</p>
          <p className="text-xs text-slate-500">{flight.flightNumber}</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-4 sm:gap-8">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">{formatTime(flight.departTime)}</p>
          <p className="text-xs text-slate-500">{flight.fromCode}</p>
        </div>
        <div className="flex flex-col items-center text-slate-400">
          <p className="text-xs">{formatDuration(flight.durationMinutes)}</p>
          <div className="my-1 flex w-20 items-center gap-1">
            <span className="h-px flex-1 bg-slate-300" />
            <PlaneTakeoff className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="h-px flex-1 bg-slate-300" />
          </div>
          <p data-testid={`flight-stops-${flight.id}`} className="text-xs font-medium">
            {stopsLabel(flight.stops)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">{formatTime(flight.arriveTime)}</p>
          <p className="text-xs text-slate-500">{flight.toCode}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:w-52 sm:flex-col sm:items-end">
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
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
