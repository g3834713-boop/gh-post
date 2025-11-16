import React from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';

function DeliveryStatus({ formData, setFormData }) {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/address');
  };

  return (
    <div className="container">
      <StepIndicator currentStep={1} />
      
      <div className="status-card">
        <div className="status-header">
          <div className="status-number">Your Package Tracking Number</div>
          <div className="package-number">{formData.packageNumber}</div>
          <div className="status-badge">⚠️ DELIVERY FAILED</div>
        </div>

        <div className="alert-banner">
          <div className="alert-icon">🚫</div>
          <div className="alert-content">
            <h2>Delivery Failed - Action Required</h2>
            <p>
              Your package delivery was unsuccessful. We need you to update your delivery
              address to ensure successful delivery. Please review the issues below and provide
              the necessary corrections.
            </p>
          </div>
        </div>

        <div className="bullet-points">
          <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Reasons for Delivery Failure:</p>
          <ul>
            <li>Incorrect or incomplete delivery address provided</li>
            <li>Recipient address could not be verified in our system</li>
            <li>Additional address confirmation required for successful delivery</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1.5rem', color: '#666', lineHeight: '1.6' }}>
            To proceed with the re-delivery of your package, please update your delivery
            address with accurate and complete information. A delivery service fee of GHC 12.20
            will be required.
          </p>
          <button onClick={handleContinue} className="btn btn-primary btn-lg btn-block">
            Continue to Update Address →
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        <p>Need help? Contact Ghana Post Customer Service at +233 (0) 800 800 800</p>
      </div>
    </div>
  );
}

export default DeliveryStatus;
