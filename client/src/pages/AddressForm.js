import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';

function AddressForm({ formData, setFormData }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.region.trim()) newErrors.region = 'Region/State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Save customer details to tracking code
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/${formData.packageNumber}/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          streetAddress: formData.streetAddress,
          city: formData.city,
          region: formData.region,
          postalCode: formData.postalCode,
          country: formData.country
        })
      });

      if (response.ok) {
        navigate('/track-route');
      } else {
        setErrors({ submit: 'Failed to save address. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <StepIndicator currentStep={2} />

      <div className="form-section">
        <h2>Update Delivery Address</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Please provide accurate and complete delivery information to ensure successful
          package delivery.
        </p>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        {/* Personal Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#003DA5', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Personal Information
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'error' : ''}`}
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Kwame Mensah"
                disabled={loading}
              />
              {errors.fullName && <div className="error-message">{errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                className={`form-control ${errors.phoneNumber ? 'error' : ''}`}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+233 XXX XXX XXX"
                disabled={loading}
              />
              {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              disabled={loading}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
        </div>

        {/* Address Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#003DA5', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Address Information
          </h3>

          <div className="form-group">
            <label className="form-label">
              Street Address <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.streetAddress ? 'error' : ''}`}
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="House No., Street Name, Building"
              disabled={loading}
            />
            {errors.streetAddress && <div className="error-message">{errors.streetAddress}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.city ? 'error' : ''}`}
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Accra"
                disabled={loading}
              />
              {errors.city && <div className="error-message">{errors.city}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Region/State <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.region ? 'error' : ''}`}
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="Greater Accra"
                disabled={loading}
              />
              {errors.region && <div className="error-message">{errors.region}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Postal Code <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.postalCode ? 'error' : ''}`}
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="GA-001-1234"
                disabled={loading}
              />
              {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Country <span className="required">*</span>
              </label>
              <select
                className={`form-control ${errors.country ? 'error' : ''}`}
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="Ghana">Ghana</option>
                <option value="Other">Other Countries</option>
              </select>
              {errors.country && <div className="error-message">{errors.country}</div>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={handleBack} className="btn btn-secondary btn-lg" style={{ flex: 1 }} disabled={loading}>
            ← Back
          </button>
          <button onClick={handleContinue} className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Saving...' : 'Update Now →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
