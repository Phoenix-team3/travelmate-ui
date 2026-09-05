import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import type { Traveler } from "../types";
import { useBooking } from "../context/BookingContext";
import { validateTraveler, type TravelerErrors } from "../utils/validation";
import FormField from "../components/booking/FormField";
import BookingSteps from "../components/booking/BookingSteps";

const EMPTY_TRAVELER: Traveler = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  passportNumber: "",
};

export default function TravelerDetailsPage() {
  const navigate = useNavigate();
  const { selectedFlight, traveler, saveTraveler } = useBooking();
  const [form, setForm] = useState<Traveler>(traveler ?? EMPTY_TRAVELER);
  const [errors, setErrors] = useState<TravelerErrors>({});
  const [submitted, setSubmitted] = useState(false);

  if (!selectedFlight) {
    return <Navigate to="/flights" replace />;
  }

  const update = (field: keyof Traveler, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validateTraveler(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      saveTraveler(form);
      navigate("/booking/review");
    }
  };

  return (
    <div data-testid="traveler-details-page" className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <BookingSteps current="traveler" />
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Traveler details</h1>
      <p className="mb-6 text-sm text-slate-500">Enter details exactly as they appear on the traveler's passport.</p>

      <form
        onSubmit={handleSubmit}
        noValidate
        data-testid="traveler-form"
        aria-label="Traveler details form"
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            id="traveler-first-name"
            testId="traveler-first-name"
            name="firstName"
            label="First name"
            value={form.firstName}
            onChange={(v) => update("firstName", v)}
            error={submitted ? errors.firstName : undefined}
            placeholder="Asha"
          />
          <FormField
            id="traveler-last-name"
            testId="traveler-last-name"
            name="lastName"
            label="Last name"
            value={form.lastName}
            onChange={(v) => update("lastName", v)}
            error={submitted ? errors.lastName : undefined}
            placeholder="Rao"
          />
        </div>

        <FormField
          id="traveler-email"
          testId="traveler-email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={(v) => update("email", v)}
          error={submitted ? errors.email : undefined}
          placeholder="asha.rao@example.com"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            id="traveler-phone"
            testId="traveler-phone"
            name="phone"
            type="tel"
            label="Phone number"
            value={form.phone}
            onChange={(v) => update("phone", v.replace(/[^\d]/g, ""))}
            error={submitted ? errors.phone : undefined}
            placeholder="9876543210"
            maxLength={10}
          />
          <FormField
            id="traveler-dob"
            testId="traveler-dob"
            name="dob"
            type="date"
            label="Date of birth"
            value={form.dob}
            onChange={(v) => update("dob", v)}
            error={submitted ? errors.dob : undefined}
          />
        </div>

        <FormField
          id="traveler-passport"
          testId="traveler-passport"
          name="passportNumber"
          label="Passport number"
          value={form.passportNumber}
          onChange={(v) => update("passportNumber", v.toUpperCase())}
          error={submitted ? errors.passportNumber : undefined}
          placeholder="A1234567"
          maxLength={9}
        />

        <button
          type="submit"
          id="continue-to-review-button"
          data-testid="continue-to-review-button"
          aria-label="Continue to review"
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-700 sm:w-auto sm:px-10"
        >
          Continue to Review
        </button>
      </form>
    </div>
  );
}
