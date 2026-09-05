import { Navigate, useNavigate } from "react-router-dom";
import { CalendarDays, Mail, Phone, User } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { airlineByCode } from "../data/airlines";
import { formatDateLong, formatDuration, formatTime, stopsLabel } from "../data/flights";
import { computePriceBreakdown, formatCurrency } from "../utils/pricing";
import BookingSteps from "../components/booking/BookingSteps";

export default function ReviewBookingPage() {
  const navigate = useNavigate();
  const { selectedFlight, traveler, searchParams } = useBooking();

  if (!selectedFlight || !traveler) {
    return <Navigate to="/flights" replace />;
  }

  const airline = airlineByCode(selectedFlight.airlineCode);
  const price = computePriceBreakdown(selectedFlight, searchParams.travelers);

  return (
    <div data-testid="review-booking-page" className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingSteps current="review" />
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Review your booking</h1>

      <section
        data-testid="review-flight-summary"
        aria-labelledby="review-flight-heading"
        className="mb-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="review-flight-heading" className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          Flight
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: airline.logoColor }}
              aria-hidden="true"
            >
              {airline.code}
            </span>
            <div>
              <p className="font-semibold text-slate-900">{airline.name}</p>
              <p className="text-sm text-slate-500">Flight {selectedFlight.flightNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {formatDateLong(selectedFlight.departTime)}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{formatTime(selectedFlight.departTime)}</p>
            <p className="text-xs text-slate-500">{selectedFlight.fromCode}</p>
          </div>
          <div className="text-center text-xs text-slate-500">
            <p>{formatDuration(selectedFlight.durationMinutes)}</p>
            <p>{stopsLabel(selectedFlight.stops)}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{formatTime(selectedFlight.arriveTime)}</p>
            <p className="text-xs text-slate-500">{selectedFlight.toCode}</p>
          </div>
        </div>
      </section>

      <section
        data-testid="review-traveler-summary"
        aria-labelledby="review-traveler-heading"
        className="mb-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="review-traveler-heading" className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          Traveler
        </h2>
        <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {traveler.firstName} {traveler.lastName}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {traveler.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {traveler.phone}
          </p>
          <p className="flex items-center gap-2 text-slate-500">Passport: {traveler.passportNumber}</p>
        </div>
      </section>

      <section
        data-testid="review-price-breakdown"
        aria-labelledby="review-price-heading"
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 id="review-price-heading" className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          Price breakdown
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Base fare × {searchParams.travelers}</dt>
            <dd className="font-medium text-slate-800">{formatCurrency(price.base, selectedFlight.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Taxes &amp; surcharges</dt>
            <dd className="font-medium text-slate-800">{formatCurrency(price.taxes, selectedFlight.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Convenience fees</dt>
            <dd className="font-medium text-slate-800">{formatCurrency(price.fees, selectedFlight.currency)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
            <dt>Total</dt>
            <dd data-testid="review-total-price">{formatCurrency(price.total, selectedFlight.currency)}</dd>
          </div>
        </dl>
      </section>

      <button
        type="button"
        id="confirm-and-pay-button"
        data-testid="confirm-and-pay-button"
        aria-label="Confirm and pay"
        onClick={() => navigate("/booking/payment")}
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-700 sm:w-auto sm:px-10"
      >
        Confirm and Pay
      </button>
    </div>
  );
}
