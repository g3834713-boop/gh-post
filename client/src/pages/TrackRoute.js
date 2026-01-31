import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';

function TrackRoute({ formData }) {
  const navigate = useNavigate();
  const [trackingData, setTrackingData] = useState(null);
  const [routeLocations, setRouteLocations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(null);

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
    const fetchData = async () => {
      try {
        // Fetch tracking data
        const trackRes = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/${formData.packageNumber}`);
        if (trackRes.ok) {
          const trackJson = await trackRes.json();
          setTrackingData(trackJson.data);

          // Use computedDaysRemaining from server if present, otherwise fallback to stored daysToDelivery
          if (typeof trackJson.data.computedDaysRemaining === 'number') {
            setDaysRemaining(trackJson.data.computedDaysRemaining);
          } else if (typeof trackJson.data.daysToDelivery === 'number') {
            setDaysRemaining(trackJson.data.daysToDelivery);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData.packageNumber]);

  const getCurrentLocationIndex = () => {
    if (!trackingData || !routeLocations.length) return 0;
    
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

  const handleContinue = () => {
    navigate('/success');
  };

  const handleBack = () => {
    navigate('/address');
  };

  if (loading) {
    return (
      <div className="container">
        <StepIndicator currentStep={2} />
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto', marginBottom: '1rem' }}></div>
          <p>Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="container">
        <StepIndicator currentStep={2} />
        <div className="status-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#d32f2f', fontSize: '1.1rem' }}>Error loading tracking information</p>
          <button onClick={handleBack} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentLocationIndex();

  // Determine the description/status for the current route location
  const currentLocationDescription = (routeLocations && routeLocations[currentIndex] && routeLocations[currentIndex].description)
    ? routeLocations[currentIndex].description
    : (trackingData.currentStatus || trackingData.description || 'Order Placed');

  return (
    <div className="container">
      <StepIndicator currentStep={2} />

      <div className="status-card">
        <div className="status-header">
          <div className="status-number">Your Package Tracking Number</div>
          <div className="package-number">{trackingData.trackingcode || trackingData.trackingCode}</div>
          <div className="status-badge">📍 {trackingData.currentstatus || trackingData.currentStatus}</div>
        </div>

        {/* Days Remaining Counter */}
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
            {daysRemaining || trackingData.daysToDelivery || 60} days
          </div>
          <p style={{ color: '#999', margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
            Products shipped via sea freight
          </p>
        </div>

        {/* Current Location Info */}
        <div className="alert-banner">
          <div className="alert-icon">📦</div>
          <div className="alert-content">
            <h2>Current Location</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{trackingData.currentLocation}</p>
            <p style={{ marginTop: '0.5rem', color: '#666' }}>{currentLocationDescription}</p>
            {trackingData.description && trackingData.description !== currentLocationDescription && (
              <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#777' }}>
                {trackingData.description}
              </p>
            )}
          </div>
        </div>

        {/* Shipment Route Timeline */}
        <div className="tracking-route-section" style={{ marginTop: '2rem' }}>
          <h3>Shipment Route Progress</h3>
          <div className="route-timeline">
            {routeLocations.map((location, idx) => (
              <div key={idx} className={`route-step ${idx <= currentIndex ? 'completed' : 'pending'}`}>
                <div className="route-marker">
                  {idx <= currentIndex ? '✓' : idx + 1}
                </div>
                <div className="route-info">
                  <p className="route-location" style={{ fontWeight: '600' }}>{location.location}</p>
                  <p className="route-description" style={{ color: '#999', fontSize: '0.9rem' }}>
                    {location.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        {trackingData.customerFullName && (
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '1.5rem',
            borderRadius: '4px',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#003DA5', marginBottom: '1rem' }}>Delivery Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
              <div>
                <p style={{ color: '#999' }}>Recipient Name</p>
                <p style={{ fontWeight: '600' }}>{trackingData.customerFullName}</p>
              </div>
              <div>
                <p style={{ color: '#999' }}>Phone</p>
                <p style={{ fontWeight: '600' }}>{trackingData.customerPhone}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: '#999' }}>Address</p>
                <p style={{ fontWeight: '600' }}>
                  {trackingData.customerAddress}, {trackingData.customerCity}, {trackingData.customerRegion}, {trackingData.customerPostalCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={handleBack} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
            ← Back
          </button>
          <button onClick={handleContinue} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
            Complete →
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
        <p>Need help? Contact Ghana Post Customer Service at +233 (0) 362 291 130</p>
      </div>
    </div>
  );
}

export default TrackRoute;
