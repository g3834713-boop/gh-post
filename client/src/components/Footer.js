import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Ghana Post</h4>
          <ul>
            <li><a href="/about">Our Company</a></li>
            <li><a href="#careers">Working at Ghana Post</a></li>
            <li><a href="/termsandconditions">Terms & Conditions</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact Us</a></li>
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
