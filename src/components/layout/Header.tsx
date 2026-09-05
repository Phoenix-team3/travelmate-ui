import { Link, NavLink } from "react-router-dom";
import { Plane, Menu } from "lucide-react";
import { useState } from "react";
import { useVersion } from "../../context/VersionContext";

const NAV_LINKS = [
  { label: "Flights", to: "/flights", testId: "nav-flights" },
  { label: "Hotels", to: "/hotels", testId: "nav-hotels" },
  { label: "Trips", to: "/trips", testId: "nav-trips" },
  { label: "Help", to: "/help", testId: "nav-help" },
];

export default function Header() {
  const { version, config } = useVersion();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      id="app-header"
      data-testid="app-header"
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          data-testid="brand-logo"
          aria-label="TravelMate home"
          className="flex items-center gap-2 shrink-0"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Plane className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-slate-900">TravelMate</span>
            <span
              data-testid="app-version-badge"
              aria-label={`Application version ${version}`}
              className="text-[11px] font-medium text-slate-400"
            >
              {version}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          data-testid="primary-nav"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              data-testid={link.testId}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            id="login-button"
            data-testid="login-button"
            aria-label={config.labels.loginButton}
            type="button"
            className="hidden rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:inline-flex"
          >
            {config.labels.loginButton}
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            data-testid="mobile-menu-toggle"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          data-testid="mobile-nav"
          className="flex flex-col gap-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              data-testid={`mobile-${link.testId}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            data-testid="mobile-login-button"
            aria-label={config.labels.loginButton}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-800"
          >
            {config.labels.loginButton}
          </button>
        </nav>
      )}
    </header>
  );
}
