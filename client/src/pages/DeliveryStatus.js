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

  // Reset page state when user navigates to track new package (fresh start)
  useEffect(() => {
    // Clear all search results and form data to start fresh
    setTrackingNumber('');
    setHasSearched(false);
    setError('');
    setIsLoading(false);
    setLoadingProgress(0);
    setTrackingData(null);
    // Reset formData to clear any previous tracking
    setFormData(prev => ({ 
      ...prev, 
      packageNumber: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      streetAddress: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'Ghana'
    }));
  }, [setFormData]);

  const handleTrack = async (overrideNumber) => {
    setError('');
    
    // Safely handle conversion: if overrideNumber is passed, use it; otherwise use trackingNumber from state
    let inputValue = overrideNumber !== undefined ? overrideNumber : trackingNumber;
    
    // CRITICAL FIX: If an object is passed (e.g., entire formData by accident), extract packageNumber property
    if (typeof inputValue === 'object' && inputValue !== null) {
      console.warn('[WARNING] Object passed to handleTrack, extracting packageNumber property', inputValue);
      inputValue = inputValue.packageNumber || '';
    }
    
    // Ensure it's a string
    if (typeof inputValue !== 'string') {
      inputValue = '';
    } else {
      inputValue = inputValue.trim().toUpperCase();
    }
    
    console.log('Tracking input:', inputValue, 'Type:', typeof inputValue);
    
    if (!inputValue) {
      setError('Please enter a tracking number');
      return;
    }
    if (!trackingRegex.test(inputValue)) {
      setError(`Invalid format. Use GH-PKG-YYYY-XXXXXX (got: ${inputValue})`);
      console.log('Regex test failed for:', inputValue, 'against pattern:', trackingRegex);
      return;
    }
    
    const num = inputValue;

    setLoadingProgress(0);
    setIsLoading(true);

    // Simulate loading for better UX (while API request is in flight)
    // Takes ~3-4 seconds to reach 90%
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 8;
      });
    }, 100);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/${num}`);
      clearInterval(progressInterval);
      setLoadingProgress(100);

      if (!res.ok) {
        setError('Tracking code not found');
        setIsLoading(false);
        setLoadingProgress(0);
        return;
      }
      const json = await res.json();
      setTrackingData(json.data);
      setFormData(prev => ({ ...prev, packageNumber: num }));
      setHasSearched(true);
      setIsLoading(false);
    } catch (err) {
      clearInterval(progressInterval);
      console.error('API Error:', err);
      setError('Error fetching tracking data');
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  // Auto-search when formData.packageNumber exists (site open/current code)
  useEffect(() => {
    if (formData?.packageNumber && typeof formData.packageNumber === 'string' && !hasSearched && !isLoading) {
      console.log('[AUTO-SEARCH] Triggering with packageNumber:', formData.packageNumber);
      setTrackingNumber(formData.packageNumber);
      // IMPORTANT: Pass only the string value, not the entire object
      handleTrack(formData.packageNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.packageNumber]);

  const getCurrentLocationIndex = () => {
    if (!trackingData) return 0;
    
    // PRIORITY: Use admin-set currentLocation (user-facing truth)
    // If admin explicitly set a location, use it as the current progress
    if (trackingData.currentLocation) {
      const adminIdx = routeLocations.findIndex(r => r.location === trackingData.currentLocation);
      if (adminIdx >= 0) {
        return adminIdx;
      }
    }
    
    // Fallback: If no admin location or it's not in route, use computed location
    if (typeof trackingData.computedIndex === 'number') {
      return trackingData.computedIndex;
    } else if (trackingData.computedLocation) {
      const compIdx = routeLocations.findIndex(r => r.location === trackingData.computedLocation);
      return compIdx >= 0 ? compIdx : 0;
    }
    
    return 0;
  };

  const handleContinue = () => navigate('/address');
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    console.log('[INPUT CHANGE] New value:', value, 'Type:', typeof value);
    setTrackingNumber(value);
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

          {/* Days Remaining Counter (if available) */}
          {(trackingData.computedDaysRemaining !== undefined || trackingData.daysToDelivery) && (
            <div style={{
              backgroundColor: '#E3F2FD',
              border: '2px solid #1976D2',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Estimated Days to Delivery</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976D2' }}>
                {trackingData.computedDaysRemaining || trackingData.daysToDelivery || 60} days
              </div>
            </div>
          )}

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
              {trackingData.description && (
                <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#777' }}>
                  {trackingData.description}
                </p>
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

  if (hasSearched && error) {
    return (
      <div className="container">
        <StepIndicator currentStep={1} />
        <div className="status-card">
          <div className="status-header">
            <div className="status-number">Your Package Tracking Number</div>
            <div className="package-number">{trackingNumber}</div>
            <div className="status-badge">⚠️ NOT FOUND</div>
          </div>

          <div className="alert-banner">
            <div className="alert-icon">🚫</div>
            <div className="alert-content">
              <h2>Tracking Code Not Found</h2>
              <p>{error}</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={() => {
                setHasSearched(false);
                setTrackingNumber('');
                setError('');
              }} 
              className="btn btn-primary btn-lg btn-block"
            >
              Try Again →
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
            <button onClick={() => handleTrack()} className="btn btn-primary btn-lg">Track Package</button>
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
