
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Categories from "./components/Categories";
import POIs from "./components/POIs";
import Events from "./components/Events";
import Landing from "./pages/Landing";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/portal" element={<Layout />}>
            <Route index element={<Navigate to="/portal/categories" replace />} />
            <Route path="categories" element={<Categories />} />
            <Route path="pois" element={<POIs />} />
            <Route path="events" element={<Events />} />
          </Route>
          {/* Legacy routes for backward compatibility */}
          <Route path="/categories" element={<Navigate to="/portal/categories" replace />} />
          <Route path="/pois" element={<Navigate to="/portal/pois" replace />} />
          <Route path="/events" element={<Navigate to="/portal/events" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
