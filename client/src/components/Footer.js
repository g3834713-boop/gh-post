import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Ghana Post</h4>
          <ul>
            <li><Link to="/about">Our Company</Link></li>
            <li><a href="#careers">Working at Ghana Post</a></li>
            <li><Link to="/termsandconditions">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Connect with Us</h4>
          <ul>
            <li><a href="https://wa.me/233xxx">💬 WhatsApp</a></li>
            <li><a href="#feedback">⚐ Provide Website Feedback</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Ghana Post Company Limited. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
