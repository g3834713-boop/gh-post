import React, { useEffect } from 'react';
import StepIndicator from '../components/StepIndicator';

function PaymentForm({ formData }) {
  useEffect(() => {
    // Redirect to WhatsApp on component mount
    const whatsappNumber = '233800800800'; // Ghana Post customer service
    const message = encodeURIComponent(
      `Hello! I need assistance with my package delivery.\\n\\n` +
      `Package #: ${formData.packageNumber}\\n` +
      `Name: ${formData.fullName}\\n` +
      `Phone: ${formData.phoneNumber}\\n` +
      `Delivery Address: ${formData.streetAddress}, ${formData.city}, ${formData.region}, ${formData.country}\\n\\n` +
      `Please help me complete my delivery arrangement.`
    );
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  }, [formData]);

  return (
    <div className="container">
      <StepIndicator currentStep={3} />
      <div className="form-section" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2>Connecting to Ghana Post Support...</h2>
        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '1rem' }}>
          You will be redirected to WhatsApp to chat with our customer service team.
        </p>
        <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '2rem' }}>
          If you are not redirected, please message us at +233 800 800 800
        </p>
      </div>
    </div>
  );
}

export default PaymentForm;
