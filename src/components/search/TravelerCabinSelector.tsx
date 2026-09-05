import { useEffect, useRef, useState } from "react";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import type { CabinClass } from "../../types";

const CABIN_OPTIONS: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];

interface Props {
  travelers: number;
  cabin: CabinClass;
  onChange: (travelers: number, cabin: CabinClass) => void;
  compact?: boolean;
}

export default function TravelerCabinSelector({ travelers, cabin, onChange, compact }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      data-testid="traveler-cabin-selector"
    >
      <label htmlFor="traveler-cabin-trigger" className="mb-1.5 block text-xs font-semibold text-slate-500">
        Travelers &amp; Cabin
      </label>
      <button
        type="button"
        id="traveler-cabin-trigger"
        data-testid="traveler-cabin-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-left text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 ${
          compact ? "py-2.5" : "py-3.5"
        }`}
      >
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {travelers} {travelers === 1 ? "Traveler" : "Travelers"}, {cabin}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Select travelers and cabin class"
          data-testid="traveler-cabin-panel"
          className="absolute z-30 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Travelers</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease travelers"
                data-testid="travelers-decrement"
                disabled={travelers <= 1}
                onClick={() => onChange(Math.max(1, travelers - 1), cabin)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 disabled:opacity-30"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span data-testid="travelers-count" className="w-4 text-center text-sm font-semibold">
                {travelers}
              </span>
              <button
                type="button"
                aria-label="Increase travelers"
                data-testid="travelers-increment"
                disabled={travelers >= 9}
                onClick={() => onChange(Math.min(9, travelers + 1), cabin)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 disabled:opacity-30"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <fieldset data-testid="cabin-class-options">
            <legend className="mb-2 text-sm font-medium text-slate-700">Cabin Class</legend>
            <div className="space-y-1">
              {CABIN_OPTIONS.map((option) => (
                <label
                  key={option}
                  htmlFor={`cabin-option-${option}`}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    id={`cabin-option-${option}`}
                    name="cabin-class"
                    value={option}
                    checked={cabin === option}
                    onChange={() => onChange(travelers, option)}
                    data-testid={`cabin-option-${option.toLowerCase().replace(/\s+/g, "-")}`}
                    className="h-3.5 w-3.5 accent-brand-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            data-testid="traveler-cabin-done"
            onClick={() => setOpen(false)}
            className="mt-4 w-full rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
