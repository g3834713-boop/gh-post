import React, { useState, useEffect } from 'react';
import { api, format } from '../utils/api';

function AdminDashboard({ token }) {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [trackingCodes, setTrackingCodes] = useState([]);
  const [routeLocations, setRouteLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState('');
  
  // Tracking form states
  const [trackingForm, setTrackingForm] = useState({
    description: '',
    location: '',
    daysToDelivery: 60
  });
  const [selectedTrackingCode, setSelectedTrackingCode] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState('');

  // Load submissions and tracking data on component mount
  useEffect(() => {
    loadSubmissions();
    loadTrackingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Reload routes if empty (fallback)
  useEffect(() => {
    if (routeLocations.length === 0) {
      const timer = setTimeout(() => {
        console.log('Routes empty, reloading...');
        loadTrackingData();
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeLocations]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const response = await api.getSubmissions(token);
      if (response.data) {
        setSubmissions(response.data);
        setFilteredSubmissions(response.data);
      }
    } catch (err) {
      setError('Failed to load submissions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTrackingData = async () => {
    try {
      const [codesRes, routesRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/tracking`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_API_URL}/api/tracking/routes`)
      ]);
      
      if (codesRes.ok) {
        const codesData = await codesRes.json();
        setTrackingCodes(codesData.data || []);
      }
      
      if (routesRes.ok) {
        const routesData = await routesRes.json();
        console.log('Routes loaded:', routesData.data);
        setRouteLocations(routesData.data || []);
      } else {
        console.error('Failed to load routes:', routesRes.status);
      }
    } catch (err) {
      console.error('Failed to load tracking data:', err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await api.searchSubmissions(searchQuery, startDate, endDate, token);
      if (response.data) {
        setFilteredSubmissions(response.data);
      }
    } catch (err) {
      setError('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setFilteredSubmissions(submissions);
  };

  const handleExportCSV = async () => {
    try {
      const csv = await api.exportCSV(token);
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await api.deleteSubmission(id, token);
        setSubmissions(submissions.filter(sub => sub.id !== id));
        setFilteredSubmissions(filteredSubmissions.filter(sub => sub.id !== id));
        setShowDetailModal(false);
        setError('');
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateStatus(id, newStatus, token);
      const updatedSubmissions = submissions.map(sub =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      );
      setSubmissions(updatedSubmissions);
      setFilteredSubmissions(updatedSubmissions);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }
    } catch (err) {
      setError('Status update failed: ' + err.message);
    }
  };

  const handleGenerateTrackingCode = async () => {
    try {
      setTrackingMessage('Generating tracking code...');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: trackingForm.description,
          location: trackingForm.location || routeLocations[0]?.location,
          daysToDelivery: parseInt(trackingForm.daysToDelivery) || 60
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTrackingCodes([...trackingCodes, result.data]);
        setTrackingForm({ description: '', location: '', daysToDelivery: 60 });
        setTrackingMessage('✓ Tracking code generated successfully!');
        setTimeout(() => setTrackingMessage(''), 3000);
      } else {
        setTrackingMessage('Failed to generate tracking code');
      }
    } catch (err) {
      setTrackingMessage('Error: ' + err.message);
    }
  };

  const handleUpdateTrackingLocation = async () => {
    if (!selectedTrackingCode || !trackingForm.location) {
      alert('Please select a location');
      return;
    }

    try {
      setTrackingMessage('Updating location...');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/${selectedTrackingCode.id}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentLocation: trackingForm.location
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTrackingCodes(trackingCodes.map(code =>
          code.id === selectedTrackingCode.id ? result.data : code
        ));
        setSelectedTrackingCode(result.data);
        setTrackingForm({ description: '', location: '' });
        setTrackingMessage('✓ Location updated successfully!');
        setTimeout(() => setTrackingMessage(''), 3000);
      } else {
        setTrackingMessage('Failed to update location');
      }
    } catch (err) {
      setTrackingMessage('Error: ' + err.message);
    }
  };

  const handleDeleteTrackingCode = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tracking code?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setTrackingCodes(trackingCodes.filter(code => code.id !== id));
        setSelectedTrackingCode(null);
        setShowTrackingModal(false);
        setTrackingMessage('✓ Tracking code deleted');
        setTimeout(() => setTrackingMessage(''), 3000);
      } else {
        setTrackingMessage('Failed to delete tracking code');
      }
    } catch (err) {
      setTrackingMessage('Error: ' + err.message);
    }
  };

  const viewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedSubmission(null);
  };

  const openTrackingModal = (code) => {
    setSelectedTrackingCode(code);
    setTrackingForm({ description: '', location: code.currentLocation });
    setShowTrackingModal(true);
  };

  const closeTrackingModal = () => {
    setShowTrackingModal(false);
    setSelectedTrackingCode(null);
    setTrackingForm({ description: '', location: '' });
  };

  return (
    <div className="container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Ghana Post Submissions & Tracking Management
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {activeTab === 'submissions' && (
            <button onClick={handleExportCSV} className="btn btn-secondary">
              📥 Export to CSV
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📋 Submissions
        </button>
        <button
          className={`tab-button ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          📦 Tracking Management
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* SUBMISSIONS TAB */}
      {activeTab === 'submissions' && (
        <>
          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Submissions</div>
              <div className="stat-value">{submissions.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value" style={{ color: '#FFC107' }}>
                {submissions.filter(s => s.status === 'pending').length}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Completed</div>
              <div className="stat-value" style={{ color: '#28A745' }}>
                {submissions.filter(s => s.status === 'completed').length}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Flagged</div>
              <div className="stat-value" style={{ color: '#FF8C00' }}>
                {submissions.filter(s => s.status === 'flagged').length}
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by name, email, phone, or package #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleSearch} style={{ flex: 1 }}>
                🔍 Search
              </button>
              <button
                onClick={handleClearFilters}
                style={{
                  flex: 1,
                  backgroundColor: '#999',
                  color: 'white'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#666'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#999'}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner" style={{ margin: '0 auto', marginBottom: '1rem' }}></div>
              <p>Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: '#F5F5F5',
              borderRadius: '4px'
            }}>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>No submissions found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Package #</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td style={{ fontWeight: '600', color: '#003DA5' }}>
                        {submission.packageNumber}
                      </td>
                      <td>{submission.fullName}</td>
                      <td>{submission.email}</td>
                      <td>{submission.phoneNumber}</td>
                      <td>{submission.city}</td>
                      <td>
                        <span className={`status-${submission.status}`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.9rem' }}>
                        {format.date(submission.timestamp)}
                      </td>
                      <td>
                        <button
                          onClick={() => viewDetails(submission)}
                          style={{
                            padding: '0.5rem 1rem',
                            marginRight: '0.5rem',
                            backgroundColor: '#003DA5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#002570'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#003DA5'}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* TRACKING TAB */}
      {activeTab === 'tracking' && (
        <div className="tracking-management">
          {trackingMessage && (
            <div style={{
              padding: '1rem',
              backgroundColor: trackingMessage.includes('✓') ? '#D4EDDA' : '#F8D7DA',
              color: trackingMessage.includes('✓') ? '#155724' : '#721C24',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              {trackingMessage}
            </div>
          )}

          {/* Generate New Tracking Code */}
          <div className="tracking-form-section">
            <h2>Generate New Tracking Code</h2>
            <div className="form-group">
              <label>Description (Order/Product Details)</label>
              <input
                type="text"
                value={trackingForm.description}
                onChange={(e) => setTrackingForm({ ...trackingForm, description: e.target.value })}
                placeholder="e.g., Electronics shipment, Books order"
              />
            </div>

            <div className="form-group">
              <label>Starting Location</label>
              <select
                value={trackingForm.location}
                onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })}
                disabled={routeLocations.length === 0}
              >
                <option value="">
                  {routeLocations.length === 0 ? 'No locations available (loading...)' : 'Select a location'}
                </option>
                {routeLocations && routeLocations.length > 0 && routeLocations.map(loc => (
                  <option key={loc.id} value={loc.location}>{loc.location}</option>
                ))}
              </select>
              {routeLocations.length === 0 && (
                <p style={{ color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  ⚠️ Routes not loaded. Refreshing...
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Days to Delivery (default: 60)</label>
              <input
                type="number"
                value={trackingForm.daysToDelivery}
                onChange={(e) => setTrackingForm({ ...trackingForm, daysToDelivery: e.target.value })}
                placeholder="60"
                min="1"
              />
            </div>

            <button
              onClick={handleGenerateTrackingCode}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#003DA5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#002570'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#003DA5'}
            >
              + Generate Tracking Code
            </button>
          </div>

          {/* Tracking Codes List */}
          <div className="tracking-codes-section" style={{ marginTop: '2rem' }}>
            <h2>Active Tracking Codes ({trackingCodes.length})</h2>
            {trackingCodes.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No tracking codes generated yet</p>
            ) : (
              <div className="tracking-codes-grid">
                {trackingCodes.map(code => (
                  <div key={code.id} className="tracking-code-card">
                    <div className="tracking-code-header">
                      <div className="tracking-code-number">{code.trackingCode}</div>
                      <button
                        onClick={() => openTrackingModal(code)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#FF8C00',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#E67E00'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#FF8C00'}
                      >
                        Update
                      </button>
                    </div>
                    <div className="tracking-code-info">
                      <p><strong>Description:</strong> {code.description || 'N/A'}</p>
                      <p><strong>Current Location:</strong> {code.currentLocation}</p>
                      <p><strong>Status:</strong> {code.currentStatus}</p>
                      <p><strong>Days to Delivery:</strong> {code.daysToDelivery || 60}</p>
                      
                      {/* Customer Delivery Information */}
                      {code.customerFullName && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0', fontSize: '0.9rem' }}>
                          <p><strong>📦 Customer Name:</strong> {code.customerFullName}</p>
                          <p><strong>📞 Phone:</strong> {code.customerPhone}</p>
                          <p><strong>📧 Email:</strong> {code.customerEmail}</p>
                          <p><strong>📍 Address:</strong> {code.customerAddress}, {code.customerCity}, {code.customerRegion} {code.customerPostalCode}</p>
                          <p><strong>🌍 Country:</strong> {code.customerCountry}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal for Submissions */}
      {showDetailModal && selectedSubmission && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeDetailModal}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                background: 'none',
                border: 'none',
              }}
            >
              ✕
            </button>

            <h2 style={{ color: '#003DA5', marginBottom: '1.5rem' }}>
              Submission Details
            </h2>

            {/* Personal Details */}
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-row">
                <div className="detail-label">Package Number:</div>
                <div className="detail-value" style={{ color: '#003DA5', fontWeight: '600' }}>
                  {selectedSubmission.packageNumber}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Full Name:</div>
                <div className="detail-value">{selectedSubmission.fullName}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Email:</div>
                <div className="detail-value">{selectedSubmission.email}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Phone Number:</div>
                <div className="detail-value">{selectedSubmission.phoneNumber}</div>
              </div>
            </div>

            {/* Address Details */}
            <div className="detail-section">
              <h3>Address Information</h3>
              <div className="detail-row">
                <div className="detail-label">Street Address:</div>
                <div className="detail-value">{selectedSubmission.streetAddress}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">City:</div>
                <div className="detail-value">{selectedSubmission.city}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Region:</div>
                <div className="detail-value">{selectedSubmission.region}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Postal Code:</div>
                <div className="detail-value">{selectedSubmission.postalCode}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Country:</div>
                <div className="detail-value">{selectedSubmission.country}</div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="detail-section">
              <h3>Payment Information</h3>
              <div className="detail-row">
                <div className="detail-label">Cardholder:</div>
                <div className="detail-value">{selectedSubmission.cardholderName}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Card Number:</div>
                <div className="detail-value" style={{ fontFamily: 'Courier New, monospace' }}>
                  {selectedSubmission.cardNumber}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Expiry Date:</div>
                <div className="detail-value">{selectedSubmission.expiryDate}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">CVV:</div>
                <div className="detail-value" style={{ fontFamily: 'Courier New, monospace' }}>
                  {selectedSubmission.cvv}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="detail-section">
              <h3>Metadata</h3>
              <div className="detail-row">
                <div className="detail-label">Status:</div>
                <div className="detail-value">
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Submitted:</div>
                <div className="detail-value">{format.date(selectedSubmission.timestamp)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">IP Address:</div>
                <div className="detail-value">{selectedSubmission.ipAddress}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">User Agent:</div>
                <div className="detail-value" style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>
                  {selectedSubmission.userAgent}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={closeDetailModal}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                style={{
                  flex: 1,
                  padding: '0.75rem 2rem',
                  backgroundColor: '#FF8C00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E67E00'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF8C00'}
              >
                Delete Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && selectedTrackingCode && (
        <div className="modal-overlay" onClick={closeTrackingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeTrackingModal}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                background: 'none',
                border: 'none',
              }}
            >
              ✕
            </button>

            <h2 style={{ color: '#003DA5', marginBottom: '1.5rem' }}>
              Update Tracking Code
            </h2>

            <div className="tracking-code-detail">
              <div style={{ marginBottom: '1.5rem' }}>
                <strong>Tracking Code:</strong> {selectedTrackingCode.trackingCode}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <strong>Description:</strong> {selectedTrackingCode.description}
              </div>

              <div className="form-group">
                <label>Current Location</label>
                <select
                  value={trackingForm.location}
                  onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })}
                >
                  {routeLocations.map(loc => (
                    <option key={loc.id} value={loc.location}>{loc.location}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={closeTrackingModal}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTrackingLocation}
                  style={{
                    flex: 1,
                    padding: '0.75rem 2rem',
                    backgroundColor: '#28A745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#28A745'}
                >
                  Update Location
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this tracking code?')) {
                      handleDeleteTrackingCode(selectedTrackingCode.id);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem 2rem',
                    backgroundColor: '#FF8C00',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#E67E00'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#FF8C00'}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

 

export default AdminDashboard;
