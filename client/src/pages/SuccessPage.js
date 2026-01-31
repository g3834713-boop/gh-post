import React, { useEffect } from 'react';

function SuccessPage() {
  useEffect(() => {
    // No automatic redirect - user stays on success page
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
          Your package will be delivered to the updated address within <strong>given business days</strong>.
        </p>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <p>📍 You can track your delivery status using your package number anytime.</p>
          <p>📞 Need help? Contact Ghana Post Customer Service</p>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Message us at +233 800 800 800 on WhatsApp if you have any questions</p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
