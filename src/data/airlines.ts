import type { Airline } from "../types";

export const airlines: Airline[] = [
  { code: "AI", name: "Air India", logoColor: "#e2231a" },
  { code: "6E", name: "IndiGo", logoColor: "#0f3c74" },
  { code: "EK", name: "Emirates", logoColor: "#d4142a" },
  { code: "SQ", name: "Singapore Airlines", logoColor: "#1a3a6b" },
  { code: "LH", name: "Lufthansa", logoColor: "#05164d" },
  { code: "AF", name: "Air France", logoColor: "#002157" },
  { code: "BA", name: "British Airways", logoColor: "#075aaa" },
  { code: "QR", name: "Qatar Airways", logoColor: "#5c0632" },
];

export const airlineByCode = (code: string): Airline =>
  airlines.find((a) => a.code === code) ?? airlines[0];
