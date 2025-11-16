import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

function AdminLogin({ setAdminToken }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.adminLogin(username, password);
      if (response.accessToken) {
        setAdminToken(response.accessToken);
        localStorage.setItem('adminToken', response.accessToken);
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-sm">
      <div className="form-section" style={{ marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ color: '#003DA5', marginBottom: '0.5rem' }}>Admin Login</h2>
          <p style={{ color: '#666' }}>Ghana Post Submissions Dashboard</p>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Username <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={loading || !username || !password}
          >
            {loading ? 'Logging In...' : 'Login to Dashboard'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#F5F5F5',
          borderRadius: '4px',
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>Demo Credentials:</p>
          <p>Username: <strong>admin</strong></p>
          <p>Password: <strong>ghanapost2024</strong></p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
