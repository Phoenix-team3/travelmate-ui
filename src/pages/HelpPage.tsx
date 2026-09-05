import { LifeBuoy } from "lucide-react";

const FAQS = [
  {
    q: "How do I change or cancel a booking?",
    a: "Go to My Trips and select the booking you'd like to manage.",
  },
  {
    q: "What baggage allowance do I get?",
    a: "Baggage allowance depends on your cabin class and is shown on the flight details page.",
  },
  {
    q: "Is payment on TravelMate secure?",
    a: "This demo uses a mock payment form — no real card details are processed or stored.",
  },
];

export default function HelpPage() {
  return (
    <div data-testid="help-page" className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <LifeBuoy className="h-10 w-10 text-slate-300" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-slate-900">Help &amp; Support</h1>
        <p className="text-sm text-slate-500">Answers to common questions about booking with TravelMate.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">{faq.q}</p>
            <p className="mt-1 text-sm text-slate-500">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
