import { Check } from "lucide-react";

const STEPS = [
  { key: "traveler", label: "Traveler Details" },
  { key: "review", label: "Review Booking" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export default function BookingSteps({ current }: { current: StepKey }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <ol data-testid="booking-steps" aria-label="Booking progress" className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-2 sm:gap-4">
            <div
              data-testid={`booking-step-${step.key}`}
              data-active={isActive}
              className="flex items-center gap-2"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isDone
                    ? "bg-brand-600 text-white"
                    : isActive
                    ? "bg-brand-600 text-white ring-4 ring-brand-100"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isActive ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && <span className="h-px w-6 bg-slate-200 sm:w-10" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
