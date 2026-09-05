import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import type { PaymentDetails } from "../types";
import { useBooking } from "../context/BookingContext";
import { computePriceBreakdown, formatCurrency } from "../utils/pricing";
import FormField from "../components/booking/FormField";
import BookingSteps from "../components/booking/BookingSteps";

const EMPTY_PAYMENT: PaymentDetails = { cardNumber: "", cardHolder: "", expiry: "", cvv: "" };

function formatCardNumber(value: string): string {
  const digits = value.replace(/[^\d]/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/[^\d]/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

type PaymentErrors = Partial<Record<keyof PaymentDetails, string>>;

function validatePayment(payment: PaymentDetails): PaymentErrors {
  const errors: PaymentErrors = {};
  const digitsOnly = payment.cardNumber.replace(/\s/g, "");

  if (!digitsOnly) errors.cardNumber = "Card number is required";
  else if (digitsOnly.length !== 16) errors.cardNumber = "Enter a valid 16-digit card number";

  if (!payment.cardHolder.trim()) errors.cardHolder = "Cardholder name is required";

  if (!payment.expiry) errors.expiry = "Expiry date is required";
  else if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) errors.expiry = "Use MM/YY format";

  if (!payment.cvv) errors.cvv = "CVV is required";
  else if (!/^\d{3,4}$/.test(payment.cvv)) errors.cvv = "Enter a valid CVV";

  return errors;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { selectedFlight, traveler, searchParams, confirmBooking } = useBooking();
  const [form, setForm] = useState<PaymentDetails>(EMPTY_PAYMENT);
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!selectedFlight || !traveler) {
    return <Navigate to="/flights" replace />;
  }

  const price = computePriceBreakdown(selectedFlight, searchParams.travelers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validatePayment(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setProcessing(true);
    window.setTimeout(() => {
      confirmBooking();
      navigate("/booking/confirmation");
    }, 900);
  };

  return (
    <div data-testid="payment-page" className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingSteps current="payment" />
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Payment</h1>
      <p className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        This is a mock payment form — no real charges are made.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        data-testid="payment-form"
        aria-label="Payment form"
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <FormField
          id="payment-card-number"
          testId="payment-card-number"
          name="cardNumber"
          label="Card number"
          value={form.cardNumber}
          onChange={(v) => setForm((p) => ({ ...p, cardNumber: formatCardNumber(v) }))}
          error={submitted ? errors.cardNumber : undefined}
          placeholder="4242 4242 4242 4242"
          maxLength={19}
        />

        <FormField
          id="payment-card-holder"
          testId="payment-card-holder"
          name="cardHolder"
          label="Cardholder name"
          value={form.cardHolder}
          onChange={(v) => setForm((p) => ({ ...p, cardHolder: v }))}
          error={submitted ? errors.cardHolder : undefined}
          placeholder="Asha Rao"
        />

        <div className="grid grid-cols-2 gap-5">
          <FormField
            id="payment-expiry"
            testId="payment-expiry"
            name="expiry"
            label="Expiry (MM/YY)"
            value={form.expiry}
            onChange={(v) => setForm((p) => ({ ...p, expiry: formatExpiry(v) }))}
            error={submitted ? errors.expiry : undefined}
            placeholder="09/29"
            maxLength={5}
          />
          <FormField
            id="payment-cvv"
            testId="payment-cvv"
            name="cvv"
            type="password"
            label="CVV"
            value={form.cvv}
            onChange={(v) => setForm((p) => ({ ...p, cvv: v.replace(/[^\d]/g, "").slice(0, 4) }))}
            error={submitted ? errors.cvv : undefined}
            placeholder="123"
            maxLength={4}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm">
          <span className="text-slate-500">Total amount</span>
          <span data-testid="payment-total-price" className="text-lg font-bold text-slate-900">
            {formatCurrency(price.total, selectedFlight.currency)}
          </span>
        </div>

        <button
          type="submit"
          id="pay-now-button"
          data-testid="pay-now-button"
          aria-label="Pay now"
          disabled={processing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
        >
          {processing && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
