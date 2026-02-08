/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Home from './pages/Home';
import ThankYou from './pages/ThankYou';
import AdminDashboard from './pages/AdminDashboard';
import AdminLeads from './pages/AdminLeads';
import AdminPages from './pages/AdminPages';
import AdminABTest from './pages/AdminABTest';
import AdminMedia from './pages/AdminMedia';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminFAQs from './pages/AdminFAQs';
import AdminAutomations from './pages/AdminAutomations';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import FunnelVariantA from './pages/FunnelVariantA';
import FunnelVariantB from './pages/FunnelVariantB';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "ThankYou": ThankYou,
    "AdminDashboard": AdminDashboard,
    "AdminLeads": AdminLeads,
    "AdminPages": AdminPages,
    "AdminABTest": AdminABTest,
    "AdminMedia": AdminMedia,
    "AdminTestimonials": AdminTestimonials,
    "AdminFAQs": AdminFAQs,
    "AdminAutomations": AdminAutomations,
    "AdminAnalytics": AdminAnalytics,
    "AdminSettings": AdminSettings,
    "FunnelVariantA": FunnelVariantA,
    "FunnelVariantB": FunnelVariantB,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};