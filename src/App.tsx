import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Department from "./pages/Department.tsx";
import Sermons from "./pages/Sermons.tsx";
import HistoryPage from "./pages/HistoryPage.tsx";
import Auth from "./pages/Auth.tsx";
import { AdminLayout } from "./components/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import SiteSettings from "./pages/admin/SiteSettings.tsx";
import BishopAdmin from "./pages/admin/BishopAdmin.tsx";
import HistoryAdmin from "./pages/admin/HistoryAdmin.tsx";
import PastorsAdmin from "./pages/admin/PastorsAdmin.tsx";
import SermonsAdmin from "./pages/admin/SermonsAdmin.tsx";
import MinistriesAdmin from "./pages/admin/MinistriesAdmin.tsx";
import EventsAdmin from "./pages/admin/EventsAdmin.tsx";
import GalleryAdmin from "./pages/admin/GalleryAdmin.tsx";
import OrderAdmin from "./pages/admin/OrderAdmin.tsx";
import UsersAdmin from "./pages/admin/UsersAdmin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ministries/:id" element={<Department />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="bishop" element={<BishopAdmin />} />
              <Route path="history" element={<HistoryAdmin />} />
              <Route path="pastors" element={<PastorsAdmin />} />
              <Route path="sermons" element={<SermonsAdmin />} />
              <Route path="ministries" element={<MinistriesAdmin />} />
              <Route path="events" element={<EventsAdmin />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="order" element={<OrderAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
