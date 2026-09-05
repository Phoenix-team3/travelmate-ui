import type { Flight, PriceBreakdown } from "../types";

export function computePriceBreakdown(flight: Flight, travelers: number): PriceBreakdown {
  const base = flight.price * travelers;
  const taxes = Math.round(base * 0.12);
  const fees = Math.round(499 * travelers);
  const total = base + taxes + fees;
  return { base, taxes, fees, total, currency: flight.currency };
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TM-${ref}`;
}
