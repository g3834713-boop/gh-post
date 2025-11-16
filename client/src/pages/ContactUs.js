import React, { useState } from 'react';
import '../styles/index.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    department: 'general'
  });

  const [submitted, setSubmitted] = useState(false);

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Customer Support' },
    { value: 'complaints', label: 'Complaints' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'business', label: 'Business Partnership' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          department: 'general'
        });
        
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Error sending message. Please try again.');
    }
  };

  return (
    <div className="contact-us">
      <div className="contact-header">
        <h1>Contact Ghana Post</h1>
        <p>We're here to help. Get in touch with us for any inquiries or feedback.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          
          <div className="info-section">
            <h3>📍 Head Office</h3>
            <p>Ghana Post Company Limited<br/>
               Accra, Ghana</p>
          </div>

          <div className="info-section">
            <h3>📞 Phone</h3>
            <p>+233 (0) 302 665 700<br/>
               +233 (0) 302 665 701</p>
          </div>

          <div className="info-section">
            <h3>✉️ Email</h3>
            <p>
              <a href="mailto:info@ghanapost.com.gh">info@ghanapost.com.gh</a><br/>
              <a href="mailto:support@ghanapost.com.gh">support@ghanapost.com.gh</a>
            </p>
          </div>

          <div className="info-section">
            <h3>🕐 Business Hours</h3>
            <p>Monday - Friday: 8:00 AM - 4:30 PM<br/>
               Saturday: 8:00 AM - 12:00 PM<br/>
               Sunday: Closed</p>
          </div>

          <div className="info-section">
            <h3>🌐 Social Media</h3>
            <p>
              <a href="https://www.facebook.com/ghanapost" target="_blank" rel="noopener noreferrer">Facebook</a> | 
              <a href="https://www.twitter.com/ghanapost" target="_blank" rel="noopener noreferrer"> Twitter</a> | 
              <a href="https://www.instagram.com/ghanapost" target="_blank" rel="noopener noreferrer"> Instagram</a>
            </p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              ✓ Thank you for your message! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Please enter your message here..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
