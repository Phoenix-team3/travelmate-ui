import type { Traveler } from "../types";

export type TravelerErrors = Partial<Record<keyof Traveler, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;
const PASSPORT_RE = /^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/i;

export function validateTraveler(traveler: Traveler): TravelerErrors {
  const errors: TravelerErrors = {};

  if (!traveler.firstName.trim()) errors.firstName = "First name is required";
  else if (traveler.firstName.trim().length < 2) errors.firstName = "First name is too short";

  if (!traveler.lastName.trim()) errors.lastName = "Last name is required";
  else if (traveler.lastName.trim().length < 2) errors.lastName = "Last name is too short";

  if (!traveler.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(traveler.email.trim())) errors.email = "Enter a valid email address";

  if (!traveler.phone.trim()) errors.phone = "Phone number is required";
  else if (!PHONE_RE.test(traveler.phone.trim())) errors.phone = "Enter a valid 10-digit phone number";

  if (!traveler.dob) errors.dob = "Date of birth is required";
  else {
    const dobDate = new Date(traveler.dob);
    if (Number.isNaN(dobDate.getTime()) || dobDate > new Date()) {
      errors.dob = "Enter a valid date of birth";
    }
  }

  if (!traveler.passportNumber.trim()) errors.passportNumber = "Passport number is required";
  else if (!PASSPORT_RE.test(traveler.passportNumber.trim())) {
    errors.passportNumber = "Enter a valid passport number (e.g. A1234567)";
  }

  return errors;
}

export function isTravelerValid(traveler: Traveler): boolean {
  return Object.keys(validateTraveler(traveler)).length === 0;
}
