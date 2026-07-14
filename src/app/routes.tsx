import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

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
  {
    path: "/admin",
    Component: Admin,
  },
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
      { path: "*", Component: NotFound },
    ],
  },
]);
