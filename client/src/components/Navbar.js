import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ adminToken, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none', color: 'white' }}>
        <span className="navbar-brand-text">Ghana Post</span>
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
        <Link to="/services" style={{ color: 'white', textDecoration: 'none' }}>Services</Link>
        <Link to="/careers" style={{ color: 'white', textDecoration: 'none' }}>Careers</Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
        {adminToken ? (
          <>
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className="admin-logout">
              Logout
            </button>
          </>
        ) : null}
        <img
          src="https://www.ghanapost.com.gh/_next/image?url=%2Flogo2.png&w=384&q=75"
          alt="Ghana Post Logo"
          className="navbar-logo-right"
        />
      </div>
    </nav>
  );
}

export default Navbar;
