import type { CabinClass, Flight, FlightSegment, SearchParams } from "../types";
import { airlines } from "./airlines";
import { airportByCode } from "./airports";
import { createSeededRandom } from "../utils/seededRandom";

const ROUTE_DISTANCE_KM: Record<string, number> = {
  "BLR-CDG": 7860,
  "BLR-DXB": 2670,
  "BLR-SIN": 3160,
  "BLR-NRT": 6540,
  "BLR-LHR": 8040,
  "BLR-JFK": 14100,
  "BLR-SYD": 9140,
  "BLR-FRA": 7440,
  "BLR-AMS": 7620,
  "BLR-DEL": 1740,
  "BLR-BOM": 840,
  "DEL-CDG": 6590,
  "DEL-DXB": 2200,
  "DEL-LHR": 6700,
  "BOM-CDG": 7020,
  "BOM-DXB": 1930,
};

function distanceFor(fromCode: string, toCode: string): number {
  const key = `${fromCode}-${toCode}`;
  const reverseKey = `${toCode}-${fromCode}`;
  return ROUTE_DISTANCE_KM[key] ?? ROUTE_DISTANCE_KM[reverseKey] ?? 6000;
}

const CABIN_MULTIPLIER: Record<CabinClass, number> = {
  Economy: 1,
  "Premium Economy": 1.6,
  Business: 3.2,
  First: 5.5,
};

const AIRCRAFT_TYPES = [
  "Airbus A320neo",
  "Airbus A350-900",
  "Boeing 777-300ER",
  "Boeing 787-9 Dreamliner",
  "Airbus A321neo",
  "Boeing 737 MAX 8",
];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

function toISO(date: Date): string {
  return date.toISOString();
}

/**
 * Deterministically generates a realistic set of mock flights for a given
 * route + date so results stay stable across re-renders and refreshes,
 * while still varying meaningfully between different searches.
 */
export function generateFlights(searchParams: SearchParams): Flight[] {
  const { fromCode, toCode, departDate, cabin } = searchParams;
  const seed = `${fromCode}-${toCode}-${departDate}-${cabin}`;
  const random = createSeededRandom(seed);
  const distanceKm = distanceFor(fromCode, toCode);
  const flightCount = 12 + Math.floor(random() * 6); // 12-17 flights

  const baseDate = departDate ? new Date(`${departDate}T00:00:00`) : new Date();
  const flights: Flight[] = [];

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(random() * airlines.length)];
    const stops = random() < 0.4 ? 0 : random() < 0.75 ? 1 : 2;
    const cruiseMinutes = Math.round((distanceKm / 850) * 60);
    const layoverMinutes = stops > 0 ? Math.round(70 + random() * 90) * stops : 0;
    const durationMinutes = cruiseMinutes + layoverMinutes + Math.round(random() * 40 - 20);

    const departHour = Math.floor(random() * 24);
    const departMinute = Math.floor(random() * 4) * 15;
    const departTime = new Date(baseDate);
    departTime.setHours(departHour, departMinute, 0, 0);
    const arriveTime = addMinutes(departTime, durationMinutes);

    const basePricePerKm = 5.4 + random() * 2.4;
    const stopsDiscount = stops === 0 ? 1.12 : stops === 1 ? 1 : 0.88;
    const price = Math.round(
      ((distanceKm * basePricePerKm * stopsDiscount * CABIN_MULTIPLIER[cabin]) / 100) * 100
    );

    const flightNumber = `${airline.code}${100 + Math.floor(random() * 899)}`;
    const stopAirports: string[] = [];
    const segments: FlightSegment[] = [];

    if (stops === 0) {
      segments.push({
        airlineCode: airline.code,
        flightNumber,
        fromCode,
        toCode,
        departTime: toISO(departTime),
        arriveTime: toISO(arriveTime),
        durationMinutes,
        aircraft: AIRCRAFT_TYPES[Math.floor(random() * AIRCRAFT_TYPES.length)],
      });
    } else {
      const candidateHubs = ["DXB", "DEL", "SIN", "FRA", "AMS"].filter(
        (c) => c !== fromCode && c !== toCode
      );
      let segmentStart = departTime;
      let remaining = durationMinutes;
      for (let s = 0; s <= stops; s++) {
        const isLast = s === stops;
        const hub = candidateHubs[(s + Math.floor(random() * candidateHubs.length)) % candidateHubs.length];
        const legDuration = isLast
          ? remaining
          : Math.round(remaining / (stops - s + 1));
        remaining -= legDuration;
        const segFrom = s === 0 ? fromCode : stopAirports[s - 1];
        const segTo = isLast ? toCode : hub;
        const segArrive = addMinutes(segmentStart, legDuration);
        segments.push({
          airlineCode: airline.code,
          flightNumber: `${airline.code}${100 + Math.floor(random() * 899)}`,
          fromCode: segFrom,
          toCode: segTo,
          departTime: toISO(segmentStart),
          arriveTime: toISO(segArrive),
          durationMinutes: legDuration,
          aircraft: AIRCRAFT_TYPES[Math.floor(random() * AIRCRAFT_TYPES.length)],
        });
        if (!isLast) {
          stopAirports.push(hub);
          segmentStart = addMinutes(segArrive, Math.round(70 + random() * 90));
        }
      }
    }

    const fareType = random() < 0.4 ? "Saver" : random() < 0.8 ? "Value" : "Flex";

    flights.push({
      id: `${fromCode}${toCode}-${departDate}-${i}-${flightNumber}`,
      airlineCode: airline.code,
      flightNumber,
      fromCode,
      toCode,
      departTime: toISO(departTime),
      arriveTime: toISO(arriveTime),
      durationMinutes,
      stops,
      stopAirports,
      segments,
      price,
      currency: "INR",
      cabin,
      seatsLeft: 1 + Math.floor(random() * 9),
      baggage: {
        cabin: cabin === "Economy" ? "7 kg" : "10 kg",
        checked:
          cabin === "Economy"
            ? "20 kg"
            : cabin === "Premium Economy"
            ? "25 kg"
            : "35 kg",
      },
      fareType,
      refundable: fareType !== "Saver",
    });
  }

  return flights.sort(
    (a, b) => new Date(a.departTime).getTime() - new Date(b.departTime).getTime()
  );
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${pad(m)}m`;
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatDateLong(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

export function stopsLabel(stops: number): string {
  if (stops === 0) return "Non-stop";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
}

export function routeLabel(fromCode: string, toCode: string): string {
  const from = airportByCode(fromCode);
  const to = airportByCode(toCode);
  return `${from.city} (${from.code}) → ${to.city} (${to.code})`;
}
