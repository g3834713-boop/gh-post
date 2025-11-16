import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DeliveryStatus from './pages/DeliveryStatus';
import AddressForm from './pages/AddressForm';
import PaymentForm from './pages/PaymentForm';
import SuccessPage from './pages/SuccessPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import TermsAndConditions from './pages/TermsAndConditions';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/index.css';

function App() {
  const [formData, setFormData] = useState({
    packageNumber: 'GH-PKG-2024-001234',
    fullName: '',
    phoneNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Ghana',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <Router>
      <Header />
      <Navbar adminToken={adminToken} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<DeliveryStatus formData={formData} setFormData={setFormData} />} />
          <Route path="/address" element={<AddressForm formData={formData} setFormData={setFormData} />} />
          <Route path="/payment" element={<PaymentForm formData={formData} setFormData={setFormData} />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />

          {/* Admin Routes */}
          <Route 
            path="/admin/login" 
            element={adminToken ? <Navigate to="/admin" /> : <AdminLogin setAdminToken={setAdminToken} />} 
          />
          <Route 
            path="/admin" 
            element={adminToken ? <AdminDashboard token={adminToken} /> : <Navigate to="/admin/login" />} 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
