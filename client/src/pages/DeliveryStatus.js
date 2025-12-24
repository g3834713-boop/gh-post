import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';

function DeliveryStatus({ formData, setFormData }) {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [trackingData, setTrackingData] = useState(null);
  const [routeLocations, setRouteLocations] = useState([]);

  const trackingRegex = /^GH-PKG-\d{4}-\d{6}$/;

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/routes`);
        if (response.ok) {
          const result = await response.json();
          setRouteLocations(result.data || []);
        }
      } catch (err) {
        console.error('Failed to load routes', err);
      }
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            setHasSearched(true);
            return 100;
          }
          return prev + (100 / 70);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleTrack = () => {
    setError('');
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    if (!trackingRegex.test(trackingNumber)) {
      setError('Invalid format. Use GH-PKG-YYYY-XXXXXX');
      return;
    }

    setLoadingProgress(0);
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/${trackingNumber}`);
        if (!res.ok) {
          setError('Tracking code not found');
          setIsLoading(false);
          setLoadingProgress(0);
          return;
        }
        const json = await res.json();
        setTrackingData(json.data);
        setFormData(prev => ({ ...prev, packageNumber: trackingNumber }));
      } catch (err) {
        console.error(err);
        setError('Error fetching tracking data');
        setIsLoading(false);
        setLoadingProgress(0);
      }
    }, 7100);
  };

  const getCurrentLocationIndex = () => {
    if (!trackingData) return 0;
    const idx = routeLocations.findIndex(r => r.location === trackingData.currentLocation);
    return idx >= 0 ? idx : 0;
  };

  const handleContinue = () => navigate('/address');
  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value.toUpperCase());
    setError('');
  };

  if (isLoading) {
    return (
      <div className="container">
        <StepIndicator currentStep={1} />
        <div className="status-card">
          <div className="loading-section">
            <h2>Searching for your package...</h2>
            <div className="loading-bar-container">
              <div className="loading-bar" style={{ width: `${loadingProgress}%` }} />
            </div>
            <p className="loading-text">{Math.round(loadingProgress)}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasSearched && trackingData) {
    const currentLocationIndex = getCurrentLocationIndex();
    return (
      <div className="container">
        <StepIndicator currentStep={1} />
        <div className="status-card">
          <div className="status-header">
            <div className="status-number">Your Package Tracking Number</div>
            <div className="package-number">{trackingData.trackingCode}</div>
            <div className="status-badge">📍 {trackingData.currentStatus}</div>
          </div>

          <div className="tracking-route-section">
            <h3>Shipment Route</h3>
            <div className="route-timeline">
              {routeLocations.map((location, idx) => (
                <div key={idx} className={`route-step ${idx <= currentLocationIndex ? 'completed' : 'pending'}`}>
                  <div className="route-marker">{idx <= currentLocationIndex ? '✓' : idx + 1}</div>
                  <div className="route-info">
                    <p className="route-location">{location.location}</p>
                    <p className="route-description">{location.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="alert-banner">
            <div className="alert-icon">📦</div>
            <div className="alert-content">
              <h2>Current Location</h2>
              <p>{trackingData.currentLocation}</p>
              <p className="status-text">{trackingData.currentStatus}</p>
              {trackingData.estimatedDelivery && (
                <p className="estimated-delivery">Estimated Delivery: {trackingData.estimatedDelivery}</p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={handleContinue} className="btn btn-primary btn-lg btn-block">Continue →</button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>Need help? Contact Ghana Post Customer Service at +233 (0) 800 800 800</p>
        </div>
      </div>
    );
  }

  if (hasSearched) {
    return (
      <div className="container">
        <StepIndicator currentStep={1} />
        <div className="status-card">
          <div className="status-header">
            <div className="status-number">Your Package Tracking Number</div>
            <div className="package-number">{trackingNumber}</div>
            <div className="status-badge">⚠️ DELIVERY FAILED</div>
          </div>

          <div className="alert-banner">
            <div className="alert-icon">🚫</div>
            <div className="alert-content">
              <h2>Delivery Failed - Action Required</h2>
              <p>Your package delivery was unsuccessful. Please update your address to proceed with re-delivery.</p>
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
            <button onClick={handleContinue} className="btn btn-primary btn-lg btn-block">Continue to Update Address →</button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>Need help? Contact Ghana Post Customer Service at +233 (0) 800 800 800</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <StepIndicator currentStep={1} />
      <div className="status-card">
        <div className="tracking-input-section">
          <h1>Track Your Package</h1>
          <p className="section-subtitle">Enter your tracking number to check the status of your delivery</p>

          <div className="tracking-form">
            <div className="form-group">
              <label htmlFor="tracking">Package Tracking Number</label>
              <input
                type="text"
                id="tracking"
                value={trackingNumber}
                onChange={handleInputChange}
                placeholder="GH-PKG-2024-001234"
                className={`tracking-input ${error ? 'input-error' : ''}`}
              />
              <p className="input-hint">Format: GH-PKG-YYYY-XXXXXX</p>
              {error && <p className="error-message">⚠️ {error}</p>}
            </div>
            <button onClick={handleTrack} className="btn btn-primary btn-lg">Track Package</button>
          </div>

          <div className="tracking-info">
            <h3>How to find your tracking number:</h3>
            <ul>
              <li>Check your shipping confirmation email</li>
              <li>Look at your receipt or shipping label</li>
              <li>Contact the shipper if you don't have your tracking number</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        <p>Need help? Contact Ghana Post Customer Service at +233 (0) 800 800 800</p>
      </div>
    </div>
  );
}

export default DeliveryStatus;
