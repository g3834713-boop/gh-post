import React from 'react';
import '../styles/index.css';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Standard Delivery',
      description: 'Reliable domestic delivery service for packages within Ghana',
      icon: '📦',
      features: ['2-5 business days', 'Track your package', 'Signature on delivery', 'Affordable rates']
    },
    {
      id: 2,
      title: 'Express Delivery',
      description: 'Fast tracked delivery service for urgent shipments',
      icon: '⚡',
      features: ['Next day delivery', 'Priority handling', 'Real-time tracking', 'Premium service']
    },
    {
      id: 3,
      title: 'International Shipping',
      description: 'Send parcels to destinations worldwide',
      icon: '🌍',
      features: ['Over 220 countries', 'Customs clearance', 'Insurance available', 'Door-to-door service']
    },
    {
      id: 4,
      title: 'Business Solutions',
      description: 'Bulk shipping and corporate solutions for businesses',
      icon: '💼',
      features: ['Volume discounts', 'Dedicated account manager', 'API integration', 'Invoicing support']
    },
    {
      id: 5,
      title: 'Document Services',
      description: 'Secure delivery of important documents and certificates',
      icon: '📄',
      features: ['Registered mail', 'Certificate of posting', 'Safe handling', 'Record keeping']
    },
    {
      id: 6,
      title: 'Financial Services',
      description: 'Money transfer and payment solutions',
      icon: '💰',
      features: ['Domestic transfers', 'International remittance', 'Secure transactions', 'Competitive rates']
    }
  ];

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Comprehensive postal and logistics solutions tailored to your needs</p>
      </div>

      <div className="services-container">
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              <button className="btn btn-service">Learn More</button>
            </div>
          ))}
        </div>
      </div>

      <section className="why-choose-ghana-post">
        <h2>Why Choose Ghana Post?</h2>
        <div className="reasons-grid">
          <div className="reason-card">
            <h4>🏆 Trusted Since 1901</h4>
            <p>Over 120 years of reliable postal service</p>
          </div>
          <div className="reason-card">
            <h4>📍 Nationwide Coverage</h4>
            <p>Access to locations across all regions of Ghana</p>
          </div>
          <div className="reason-card">
            <h4>⏱️ Timely Delivery</h4>
            <p>Committed to on-time delivery of your shipments</p>
          </div>
          <div className="reason-card">
            <h4>🔒 Secure & Safe</h4>
            <p>Your packages handled with utmost care and security</p>
          </div>
          <div className="reason-card">
            <h4>📱 Easy Tracking</h4>
            <p>Real-time tracking of your deliveries online</p>
          </div>
          <div className="reason-card">
            <h4>💬 24/7 Support</h4>
            <p>Customer support available when you need us</p>
          </div>
        </div>
      </section>

      <section className="service-process">
        <h2>How It Works</h2>
        <div className="process-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Submit Your Package</h4>
            <p>Bring your package to any Ghana Post office or use our online portal</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Get Tracking Number</h4>
            <p>Receive a unique tracking number for your shipment</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Track Progress</h4>
            <p>Monitor your package in real-time from dispatch to delivery</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Delivery Complete</h4>
            <p>Receive your package at the destination with confirmation</p>
          </div>
        </div>
      </section>

      <section className="pricing-info">
        <h2>Pricing</h2>
        <p>
          Our pricing varies based on destination, package weight, and service type. 
          <br />
          <strong>Get an instant quote:</strong> Visit our office or use our online quote tool.
        </p>
        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Get a Quote
        </button>
      </section>
    </div>
  );
};

export default Services;
