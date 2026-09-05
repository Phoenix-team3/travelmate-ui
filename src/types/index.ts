export type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";

export type TripType = "roundtrip" | "oneway";

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logoColor: string;
}

export interface FlightSegment {
  airlineCode: string;
  flightNumber: string;
  fromCode: string;
  toCode: string;
  departTime: string; // ISO datetime
  arriveTime: string; // ISO datetime
  durationMinutes: number;
  aircraft: string;
}

export interface Flight {
  id: string;
  airlineCode: string;
  flightNumber: string;
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  durationMinutes: number;
  stops: number;
  stopAirports: string[];
  segments: FlightSegment[];
  price: number;
  currency: string;
  cabin: CabinClass;
  seatsLeft: number;
  baggage: {
    cabin: string;
    checked: string;
  };
  fareType: "Saver" | "Flex" | "Value";
  refundable: boolean;
}

export interface SearchParams {
  tripType: TripType;
  fromCode: string;
  toCode: string;
  departDate: string; // yyyy-mm-dd
  returnDate: string; // yyyy-mm-dd
  travelers: number;
  cabin: CabinClass;
}

export interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  passportNumber: string;
}

export interface PriceBreakdown {
  base: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
}

export interface Booking {
  bookingRef: string;
  flight: Flight;
  traveler: Traveler;
  searchParams: SearchParams;
  price: PriceBreakdown;
  createdAt: string;
  status: "confirmed" | "pending";
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}
