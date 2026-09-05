import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div data-testid="not-found-page" className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="text-sm text-slate-500">We couldn't find the page you're looking for.</p>
      <Link to="/" className="mt-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
        Back to Home
      </Link>
    </div>
  );
}
