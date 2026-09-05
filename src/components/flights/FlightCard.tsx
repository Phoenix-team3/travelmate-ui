import type { Flight } from "../../types";
import { useVersion } from "../../context/VersionContext";
import FlightCardClassic from "./FlightCardClassic";
import FlightCardGrid from "./FlightCardGrid";
import FlightCardReorganized from "./FlightCardReorganized";

export default function FlightCard({ flight }: { flight: Flight }) {
  const { config } = useVersion();

  if (config.flightCardLayout === "grid") return <FlightCardGrid flight={flight} />;
  if (config.flightCardLayout === "reorganized") return <FlightCardReorganized flight={flight} />;
  return <FlightCardClassic flight={flight} />;
}
