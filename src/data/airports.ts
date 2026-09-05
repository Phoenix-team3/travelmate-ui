import type { Airport } from "../types";

export const airports: Airport[] = [
  { code: "BLR", city: "Bangalore", name: "Kempegowda International Airport", country: "India" },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport", country: "France" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "United Kingdom" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "United States" },
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "United Arab Emirates" },
  { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore" },
  { code: "NRT", city: "Tokyo", name: "Narita International Airport", country: "Japan" },
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith Airport", country: "Australia" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "AMS", city: "Amsterdam", name: "Amsterdam Airport Schiphol", country: "Netherlands" },
];

export const airportByCode = (code: string): Airport =>
  airports.find((a) => a.code === code) ?? airports[0];

export interface PopularDestination {
  city: string;
  code: string;
  country: string;
  tagline: string;
  fromPrice: number;
  gradient: string;
}

export const popularDestinations: PopularDestination[] = [
  {
    city: "Paris",
    code: "CDG",
    country: "France",
    tagline: "City of lights",
    fromPrice: 42500,
    gradient: "from-rose-400 to-orange-300",
  },
  {
    city: "Dubai",
    code: "DXB",
    country: "UAE",
    tagline: "Desert luxury",
    fromPrice: 21800,
    gradient: "from-amber-400 to-yellow-200",
  },
  {
    city: "Singapore",
    code: "SIN",
    country: "Singapore",
    tagline: "Garden city",
    fromPrice: 26900,
    gradient: "from-emerald-400 to-teal-300",
  },
  {
    city: "Tokyo",
    code: "NRT",
    country: "Japan",
    tagline: "Neon & tradition",
    fromPrice: 38200,
    gradient: "from-indigo-400 to-sky-300",
  },
];
