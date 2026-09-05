import { Navigate, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { airlineByCode } from "../data/airlines";
import { airportByCode } from "../data/airports";
import { formatDateLong, formatTime } from "../data/flights";
import { formatCurrency } from "../utils/pricing";
import BookingSteps from "../components/booking/BookingSteps";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { booking } = useBooking();

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const airline = airlineByCode(booking.flight.airlineCode);
  const destination = airportByCode(booking.flight.toCode);

  return (
    <div data-testid="confirmation-page" className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingSteps current="confirmation" />

      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" aria-hidden="true" />
        </span>
        <h1 data-testid="confirmation-heading" className="text-2xl font-bold text-slate-900">
          Booking Confirmed!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A confirmation email has been sent to {booking.traveler.email}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Booking reference</p>
            <p data-testid="booking-reference" className="text-xl font-extrabold tracking-wide text-brand-700">
              {booking.bookingRef}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {booking.status === "confirmed" ? "Confirmed" : "Pending"}
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Traveler</dt>
            <dd data-testid="confirmation-traveler" className="font-medium text-slate-800">
              {booking.traveler.firstName} {booking.traveler.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Flight</dt>
            <dd data-testid="confirmation-flight" className="font-medium text-slate-800">
              {airline.name} · {booking.flight.flightNumber}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Date</dt>
            <dd data-testid="confirmation-date" className="font-medium text-slate-800">
              {formatDateLong(booking.flight.departTime)} · {formatTime(booking.flight.departTime)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Destination</dt>
            <dd data-testid="confirmation-destination" className="font-medium text-slate-800">
              {destination.city} ({destination.code})
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <span className="text-sm text-slate-500">Total paid</span>
          <span data-testid="confirmation-total-paid" className="text-lg font-bold text-slate-900">
            {formatCurrency(booking.price.total, booking.flight.currency)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          id="view-my-trip-button"
          data-testid="view-my-trip-button"
          aria-label="View my trip"
          onClick={() => navigate("/trips")}
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700"
        >
          View My Trip
        </button>
        <button
          type="button"
          id="back-to-home-button"
          data-testid="back-to-home-button"
          aria-label="Back to home"
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
