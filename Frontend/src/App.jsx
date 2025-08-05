import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthProvider, ProtectedRoute } from './components/AuthContext';
import AuthPanel from './components/Auth';
import Navbar from './components/Navbar';
import Footer from './pages/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Menu from './pages/Menu';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import About from './pages/AboutUs';
import Offer from './pages/Offer';
import FAQPage from './pages/FAQ';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderHistory from './components/OrderHistory';
import OrderConfirmation from './components/OrderConfirmation';
import ErrorBoundary from './components/ErrorBoundary';
import { store, persistor } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ErrorBoundary>
            <Navbar />
          </ErrorBoundary>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
            <Route path="/menu" element={<ErrorBoundary><Menu /></ErrorBoundary>} />
            <Route path="/food/:id" element={<ErrorBoundary><FoodDetails /></ErrorBoundary>} />
            <Route path="/login" element={<AuthPanel isOpen={true} onClose={() => {}} initialMode="login" />} />
            <Route path="/register" element={<AuthPanel isOpen={true} onClose={() => {}} initialMode="signup" />} />
            <Route path="/contact" element={<ErrorBoundary><ContactUs /></ErrorBoundary>} />
            <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />
            <Route path="/offers" element={<ErrorBoundary><Offer /></ErrorBoundary>} />
            <Route path="/faq" element={<ErrorBoundary><FAQPage /></ErrorBoundary>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cart" element={<ErrorBoundary><Cart /></ErrorBoundary>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          </Routes>
          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;