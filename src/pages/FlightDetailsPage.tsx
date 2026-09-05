import { useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Briefcase, Luggage, PlaneTakeoff } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { generateFlights, formatDuration, formatTime, formatDateLong, stopsLabel } from "../data/flights";
import { airlineByCode } from "../data/airlines";
import { airportByCode } from "../data/airports";
import { computePriceBreakdown, formatCurrency } from "../utils/pricing";

export default function FlightDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { searchResults, searchParams, selectFlight } = useBooking();

  const flight = useMemo(() => {
    const fromResults = searchResults.find((f) => f.id === id);
    if (fromResults) return fromResults;
    return generateFlights(searchParams).find((f) => f.id === id) ?? null;
  }, [id, searchResults, searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!flight) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center" data-testid="flight-not-found">
        <p className="text-slate-600">We couldn't find that flight. It may have expired — try searching again.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-brand-600 hover:underline">
          Back to search
        </Link>
      </div>
    );
  }

  const airline = airlineByCode(flight.airlineCode);
  const price = computePriceBreakdown(flight, searchParams.travelers);

  const handleContinue = () => {
    selectFlight(flight.id);
    navigate("/booking/traveler");
  };

  return (
    <div data-testid="flight-details-page" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/flights"
        data-testid="back-to-results-link"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to results
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white"
              style={{ backgroundColor: airline.logoColor }}
              aria-hidden="true"
            >
              {airline.code}
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900" data-testid="details-airline-name">
                {airline.name}
              </h1>
              <p className="text-sm text-slate-500" data-testid="details-flight-number">
                Flight {flight.flightNumber} · {flight.cabin}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-slate-900" data-testid="details-price">
              {formatCurrency(flight.price, flight.currency)}
            </p>
            <p className="text-xs text-slate-500">per traveler</p>
          </div>
        </div>

        <section aria-labelledby="itinerary-heading" data-testid="flight-itinerary" className="mb-6">
          <h2 id="itinerary-heading" className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            Itinerary
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            {formatDateLong(flight.departTime)} · {stopsLabel(flight.stops)} · {formatDuration(flight.durationMinutes)} total
          </p>
          <div className="space-y-6">
            {flight.segments.map((segment, index) => {
              const from = airportByCode(segment.fromCode);
              const to = airportByCode(segment.toCode);
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <PlaneTakeoff className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    {index < flight.segments.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-slate-200" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-slate-900">
                        {formatTime(segment.departTime)} · {from.city} ({from.code})
                      </p>
                      <p className="text-xs text-slate-400">{segment.aircraft}</p>
                    </div>
                    <p className="text-sm text-slate-500">
                      Flight {segment.flightNumber} · {formatDuration(segment.durationMinutes)}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {formatTime(segment.arriveTime)} · {to.city} ({to.code})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="baggage-heading"
          data-testid="baggage-info"
          className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"
        >
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Cabin baggage</p>
              <p className="text-sm text-slate-500">{flight.baggage.cabin}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Luggage className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Checked baggage</p>
              <p className="text-sm text-slate-500">{flight.baggage.checked}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="fare-heading" data-testid="fare-conditions" className="mb-6">
          <h2 id="fare-heading" className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Fare conditions
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              {flight.fareType} fare
            </span>
            <span>{flight.refundable ? "Refundable (fee applies)" : "Non-refundable"}</span>
            <span>{flight.seatsLeft} seats left at this price</span>
          </div>
        </section>

        <section aria-labelledby="price-breakdown-heading" data-testid="price-breakdown" className="mb-6 border-t border-slate-100 pt-6">
          <h2 id="price-breakdown-heading" className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Price breakdown
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Base fare × {searchParams.travelers}</dt>
              <dd className="font-medium text-slate-800">{formatCurrency(price.base, flight.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Taxes &amp; surcharges</dt>
              <dd className="font-medium text-slate-800">{formatCurrency(price.taxes, flight.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Convenience fees</dt>
              <dd className="font-medium text-slate-800">{formatCurrency(price.fees, flight.currency)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
              <dt>Total</dt>
              <dd data-testid="details-total-price">{formatCurrency(price.total, flight.currency)}</dd>
            </div>
          </dl>
        </section>

        <button
          type="button"
          id="continue-to-traveler-button"
          data-testid="continue-button"
          aria-label="Continue to traveler details"
          onClick={handleContinue}
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-700 sm:w-auto sm:px-10"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
