import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import HeroCarousel from "./pages/Home";
import Gallery from "./pages/Gallery";
import Footer from "./layout/Footer";
import GalleryDetails from "./pages/GalleryDetails";
import Contact from "./pages/Contact";
import CartPage from "./pages/Cart";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroCarousel />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/products/:id" element={<GalleryDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFound />} />
          {/* 404 səhifəsi */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
