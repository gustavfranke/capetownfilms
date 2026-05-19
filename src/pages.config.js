// Minimal pages config - routing is handled explicitly in App.jsx
import Home from './pages/Home';
import FunnelVariantA from './pages/FunnelVariantA';
import FunnelVariantB from './pages/FunnelVariantB';
import Admin from './pages/Admin';

export const PAGES = {
  "Home": Home,
  "FunnelVariantA": FunnelVariantA,
  "FunnelVariantB": FunnelVariantB,
  "Admin": Admin,
};

export const pagesConfig = {
  mainPage: "Home",
  Pages: PAGES,
};