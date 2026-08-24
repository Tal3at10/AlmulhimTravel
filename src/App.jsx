import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/errors/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import WhatsAppButton from './components/ui/WhatsAppButton';
import ScrollToTop from './components/utils/ScrollToTop';
import LoadingSpinner from './components/ui/LoadingSpinner';
import PromoPopup from './components/ui/PromoPopup';
import AmbientAudio from './components/ui/AmbientAudio';

// Lazy load pages for code splitting (Performance enhancement)
const Home = React.lazy(() => import('./pages/Home'));
const PackageDetails = React.lazy(() => import('./pages/PackageDetails'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const AllPackages = React.lazy(() => import('./pages/AllPackages'));
const Destinations = React.lazy(() => import('./pages/Destinations'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const HotelDetails = React.lazy(() => import('./pages/HotelDetails'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const HotelPriceComparison = React.lazy(() => import('./pages/HotelPriceComparison'));
const FlightResults = React.lazy(() => import('./pages/FlightResults'));
const FlightHotelPackages = React.lazy(() => import('./pages/FlightHotelPackages'));
const SeatSelection = React.lazy(() => import('./pages/SeatSelection'));
const FlightCheckout = React.lazy(() => import('./pages/FlightCheckout'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const BookingSuccess = React.lazy(() => import('./pages/BookingSuccess'));
const ManageBooking = React.lazy(() => import('./pages/ManageBooking'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ExternalRedirect = React.lazy(() => import('./pages/ExternalRedirect'));
const InstallmentsSandbox = React.lazy(() => import('./pages/InstallmentsSandbox'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const BlogList = React.lazy(() => import('./pages/BlogList'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const VisaServices = React.lazy(() => import('./pages/VisaServices'));
const AirportTransfers = React.lazy(() => import('./pages/AirportTransfers'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const CustomPackageRequest = React.lazy(() => import('./pages/CustomPackageRequest'));
const CustomerProposalPage = React.lazy(() => import('./pages/CustomerProposalPage'));
// Global loading fallback mechanism during lazy fetches
const SuspenseFallback = () => (
  <div className="flex justify-center items-center h-screen bg-[#fdfbf7]">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />

          {/* Toast Notifications */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#071428',
                color: '#fff',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#C9A227',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              {/* Pages without navbar */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/:id" element={<CustomerProposalPage />} />
              <Route path="/flights/checkout" element={<FlightCheckout />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/redirect" element={<ExternalRedirect />} />
              <Route path="/installments-sandbox" element={<InstallmentsSandbox />} />

              {/* Pages with MainLayout */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/package/:id" element={<MainLayout><PackageDetails /></MainLayout>} />

              <Route path="/hotel/:hotelId" element={<MainLayout><HotelDetails /></MainLayout>} />
              <Route path="/hotels" element={<MainLayout><SearchResults /></MainLayout>} />
              <Route path="/compare-hotels" element={<MainLayout><HotelPriceComparison /></MainLayout>} />
              <Route path="/flights" element={<MainLayout><FlightResults /></MainLayout>} />
               <Route path="/flight-hotel-packages" element={<MainLayout><FlightHotelPackages /></MainLayout>} />
              <Route path="/seat-selection" element={<MainLayout><SeatSelection /></MainLayout>} />
              <Route path="/manage-booking" element={<MainLayout><ManageBooking /></MainLayout>} />
              <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
              <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
              <Route path="/blog" element={<MainLayout><BlogList /></MainLayout>} />
              <Route path="/blog/:slug" element={<MainLayout><BlogPost /></MainLayout>} />
              <Route path="/visas" element={<MainLayout><VisaServices /></MainLayout>} />
              <Route path="/transfers" element={<MainLayout><AirportTransfers /></MainLayout>} />
              <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
              <Route path="/destinations" element={<MainLayout><AllPackages /></MainLayout>} />
              <Route path="/offers" element={<MainLayout><Destinations /></MainLayout>} />
              <Route path="/custom-package" element={<MainLayout><CustomPackageRequest /></MainLayout>} />
              <Route path="/privacy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
              <Route path="/terms" element={<MainLayout><TermsAndConditions /></MainLayout>} />
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </Suspense>
          {/* <PromoPopup /> */}
          <AmbientAudio />
          <WhatsAppButton />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
