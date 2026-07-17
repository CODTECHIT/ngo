import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminMessages from "./pages/admin/AdminMessages";
import { ProtectedRoute } from "./components/ProtectedRoute";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <p className="text-8xl font-bold text-primary/20 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>404</p>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Page Not Found</h1>
        <p className="text-muted-foreground mb-6" style={{ fontFamily: "'Lato', sans-serif" }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded font-bold text-sm hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Lato', sans-serif" }}>
          Return Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Admin Routes
  {
    path: "/admin/ngo/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/ngo",
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "programs", element: <AdminPrograms /> },
      { path: "events", element: <AdminEvents /> },
      { path: "gallery", element: <AdminGallery /> },
      { path: "messages", element: <AdminMessages /> },
      { path: "contact-messages", element: <AdminMessages /> },
      // Any future protected admin routes go here
    ],
  },
  // Public Routes
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "events", Component: Events },
      { path: "gallery", Component: Gallery },
      { path: "news", Component: News },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "account", Component: Account },
      { path: "*", Component: NotFound },
    ],
  },
]);
