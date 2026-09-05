import { Plane } from "lucide-react";
import { useVersion } from "../../context/VersionContext";

export default function Footer() {
  const { version } = useVersion();

  return (
    <footer data-testid="app-footer" className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Plane className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-semibold text-slate-700">TravelMate</span>
          <span data-testid="app-version-footer" className="text-xs text-slate-400">
            {version}
          </span>
        </div>
        <p>Mock travel booking experience — for demo &amp; testing purposes only.</p>
      </div>
    </footer>
  );
}
