import { useNavigate } from "react-router-dom";
import { popularDestinations } from "../data/airports";
import { useBooking } from "../context/BookingContext";
import SearchForm from "../components/search/SearchForm";

export default function HomePage() {
  const navigate = useNavigate();
  const { runSearch, searchParams } = useBooking();

  const handleDestinationClick = (code: string) => {
    const params = { ...searchParams, toCode: code };
    runSearch(params);
    navigate("/flights");
  };

  return (
    <div data-testid="home-page">
      <section className="bg-gradient-to-b from-brand-950 via-brand-800 to-brand-600 pb-28 pt-16 text-white sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-200">
            Flights · Hotels · Trips
          </p>
          <h1
            data-testid="hero-heading"
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Where will you go next?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-brand-100 sm:text-lg">
            Search hundreds of routes and book your next trip in minutes.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <SearchForm />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular destinations</h2>
            <p className="mt-1 text-sm text-slate-500">Inspiration for your next getaway</p>
          </div>
        </div>

        <div
          data-testid="popular-destinations"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {popularDestinations.map((dest) => (
            <button
              key={dest.code}
              type="button"
              onClick={() => handleDestinationClick(dest.code)}
              data-testid={`destination-card-${dest.code}`}
              aria-label={`Search flights to ${dest.city}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`h-32 w-full bg-gradient-to-br ${dest.gradient}`} aria-hidden="true" />
              <div className="p-4">
                <h3 className="text-base font-bold text-slate-900">{dest.city}</h3>
                <p className="text-xs text-slate-500">{dest.country}</p>
                <p className="mt-2 text-xs font-medium text-slate-400">{dest.tagline}</p>
                <p className="mt-3 text-sm font-semibold text-brand-700">
                  From ₹{dest.fromPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
