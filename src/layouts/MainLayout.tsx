import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VersionSimulator from "../components/dev/VersionSimulator";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main id="main-content" data-testid="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <VersionSimulator />
    </div>
  );
}
