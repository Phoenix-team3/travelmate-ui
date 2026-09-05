import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import FlightResultsPage from "./pages/FlightResultsPage";
import FlightDetailsPage from "./pages/FlightDetailsPage";
import TravelerDetailsPage from "./pages/TravelerDetailsPage";
import ReviewBookingPage from "./pages/ReviewBookingPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import TripsPage from "./pages/TripsPage";
import HotelsPage from "./pages/HotelsPage";
import HelpPage from "./pages/HelpPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightResultsPage />} />
        <Route path="/flights/:id" element={<FlightDetailsPage />} />
        <Route path="/booking/traveler" element={<TravelerDetailsPage />} />
        <Route path="/booking/review" element={<ReviewBookingPage />} />
        <Route path="/booking/payment" element={<PaymentPage />} />
        <Route path="/booking/confirmation" element={<ConfirmationPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
