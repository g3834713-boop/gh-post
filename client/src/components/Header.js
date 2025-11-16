import React from 'react';

const Header = () => {
  return (
    <div className="top-header">
      <div className="top-header-left">
        <p>
          <strong>P.O. Asafoatse Nettey Road</strong><br />
          Accra Central, Ghana, GA-183-8164
        </p>
        <p>
          <strong>Email:</strong> info@ghanapost.com.gh
        </p>
      </div>
      <div className="top-header-right">
        <a href="tel:+233xxx">📞 +233 (0) XXX XXX XXX</a>
        <a href="https://wa.me/233xxx">💬 WhatsApp</a>
      </div>
    </div>
  );
};

export default Header;
