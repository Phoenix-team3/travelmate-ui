import { Hotel } from "lucide-react";

export default function HotelsPage() {
  return (
    <div data-testid="hotels-page" className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-20 text-center sm:px-6 lg:px-8">
      <Hotel className="h-10 w-10 text-slate-300" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-slate-900">Hotels</h1>
      <p className="text-sm text-slate-500">Hotel booking is coming soon to TravelMate.</p>
    </div>
  );
}
