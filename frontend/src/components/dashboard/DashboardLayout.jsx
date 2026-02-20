import DashboardNavbar from "./DashboardNavbar";
import { Outlet } from "react-router-dom";
import DashboardContent from "./DashboardContent";
import DashboardFooter from "./DashboardFooter";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19]">
      <DashboardNavbar />
     
      <main className="flex-1 p-6">
        <DashboardContent />
         <Outlet />
      </main>
      <DashboardFooter />
    </div>
  );
}
