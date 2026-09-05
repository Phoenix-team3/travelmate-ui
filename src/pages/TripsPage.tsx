import { Link } from "react-router-dom";
import { PlaneTakeoff } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { airlineByCode } from "../data/airlines";
import { airportByCode } from "../data/airports";
import { formatDateLong, formatTime } from "../data/flights";
import { formatCurrency } from "../utils/pricing";

export default function TripsPage() {
  const { booking } = useBooking();

  return (
    <div data-testid="trips-page" className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My Trips</h1>

      {!booking ? (
        <div
          data-testid="no-trips-message"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <PlaneTakeoff className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <p className="text-sm text-slate-500">You don't have any upcoming trips yet.</p>
          <Link
            to="/"
            data-testid="search-flights-link"
            className="mt-1 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Search flights
          </Link>
        </div>
      ) : (
        <div data-testid="trip-card" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {booking.bookingRef}
            </p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Confirmed
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {airportByCode(booking.flight.fromCode).city} → {airportByCode(booking.flight.toCode).city}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {airlineByCode(booking.flight.airlineCode).name} · {booking.flight.flightNumber} ·{" "}
            {formatDateLong(booking.flight.departTime)} · {formatTime(booking.flight.departTime)}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Traveler: {booking.traveler.firstName} {booking.traveler.lastName}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            Total paid: {formatCurrency(booking.price.total, booking.flight.currency)}
          </p>
        </div>
      )}
    </div>
  );
}
