import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container">
      <div className="success-message" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2>Payment Processing!</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Your payment of GHC 12.20 is being processed.
        </p>
        <p>
          Your package will be re-delivered to the updated address within <strong>2-3 business days</strong>.
        </p>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <p>📧 A confirmation email has been sent to your email address.</p>
          <p>📍 You can track your delivery status using your package number.</p>
          <p>📞 For support, contact Ghana Post at +233 (0) 800 800 800</p>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Redirecting to home in a few seconds...</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
