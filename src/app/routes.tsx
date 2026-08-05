import { createBrowserRouter, isRouteErrorResponse, useRouteError } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Donate from "./pages/Donate";
import Legal from "./pages/Legal";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Pledge } from "./pages/Pledge";
import { NetraSurakshaPledge } from "./pages/NetraSurakshaPledge";
import { VolunteerPledge } from "./pages/VolunteerPledge";
import { VisionWarriorPledge } from "./pages/VisionWarriorPledge";
import { VerifyCertificate } from "./pages/VerifyCertificate";



import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminNews from "./pages/admin/AdminNews";
import AdminNewsTicker from "./pages/admin/AdminNewsTicker";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminTeamRoles from "./pages/admin/AdminTeamRoles";
import AdminPledges from "./pages/admin/AdminPledges";
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

function ErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Something went wrong while rendering this page.';

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <p className="text-8xl font-bold text-primary/20 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>202</p>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Something went wrong</h1>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">An unexpected error occurred. Please try again.</p>
        <p className="text-xs text-red-500 mb-6 opacity-70">{message}</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
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
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "programs", element: <AdminPrograms /> },
      { path: "events", element: <AdminEvents /> },
      { path: "news", element: <AdminNews /> },
      { path: "news/ticker", element: <AdminNewsTicker /> },
      { path: "gallery", element: <AdminGallery /> },
      { path: "messages", element: <AdminMessages /> },
      { path: "contact-messages", element: <AdminMessages /> },
      { path: "applications", element: <AdminApplications /> },
      { path: "donations", element: <AdminDonations /> },
      { path: "pledges", element: <AdminPledges /> },
      { path: "team-roles", element: <AdminTeamRoles /> },

      // Any future protected admin routes go here
    ],
  },
  // Public Routes
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "events", Component: Events },
      { path: "news", Component: News },
      { path: "news/:id", Component: NewsArticle },
      { path: "gallery", Component: Gallery },
      { path: "contact", Component: Contact },
      { path: "apply", Component: Apply },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
      { path: "account", Component: Account },
      { path: "donate", Component: Donate },
      { path: "legal", Component: Legal },
      { path: "nasha-mukt-pledge", Component: Pledge },
      { path: "pledge", Component: Pledge },
      { path: "netra-suraksha-pledge", Component: NetraSurakshaPledge },
      { path: "netra-suraksha", Component: NetraSurakshaPledge },
      { path: "volunteer-certificate", Component: VolunteerPledge },
      { path: "vision-warrior", Component: VisionWarriorPledge },
      { path: "delegate-registration", Component: Pledge },
      { path: "verify-certificate", Component: VerifyCertificate },
      { path: "*", Component: NotFound },
    ],

  },
]);

