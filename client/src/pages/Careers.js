import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

const Careers = () => {
  const navigate = useNavigate();

  const jobListings = [
    {
      id: 1,
      title: 'Regional Security Coordinator',
      location: 'Accra East Region, Western Region, Central Region, Volta Region, Brong Ahafo Region, Upper East Region, Upper West Region',
      type: 'Full-time',
      posted: 'November 14, 2024'
    },
    {
      id: 2,
      title: 'Head Marketing',
      location: 'HQ-Accra',
      type: 'Full-time',
      posted: 'March 27, 2024'
    },
    {
      id: 3,
      title: 'Head Investigations and Security',
      location: 'HQ-Accra',
      type: 'Full-time',
      posted: 'March 27, 2024'
    }
  ];

  const benefits = [
    { icon: '❤️', title: 'We care about your well-being', description: 'We pride ourselves on creating a safe space for all our employees to bring their full selves to work. As team members, you\'ll enjoy a range of health coverage, disability, and benefit plans.' },
    { icon: '🚀', title: 'We foster your career growth', description: 'You\'ll find the support you need to expand your career, explore new roles, find your voice, and feel valued for your contributions.' }
  ];

  const steps = [
    { number: 1, title: 'Search', description: 'Visit www.ghanapost.com.gh/jobs' },
    { number: 2, title: 'Browse & Apply', description: 'Browse our exciting opportunities, and apply now.' },
    { number: 3, title: 'Job Alerts', description: 'Set up job alerts to be notified when positions fitting your skills, location, and interests become available.' },
    { number: 4, title: 'Apply', description: 'When the perfect job for you becomes available, apply using our application page.' }
  ];

  const expectations = [
    'You will get an email confirming your application was received.',
    'Your application will be reviewed by our team, and those selected for an interview are contacted.',
    'Selected candidates are interviewed by our hiring board.',
    'Successful candidates are invited to participate in the next step of our hiring process.',
    'Successful candidates will be contacted and asked to join our team.',
    'Our culture is inclusive and barrier-free, so please advise us if you have any restrictions that require accommodation (all your information will be kept confidential).'
  ];

  const handleApplyNow = (jobTitle) => {
    // Store job title in sessionStorage to pre-fill the contact form
    sessionStorage.setItem('jobApplication', jobTitle);
    navigate('/contact');
  };

  return (
    <div className="careers-page">
      <div className="careers-header">
        <h1>Careers</h1>
        <h2>Start your future here</h2>
        <p>Ghana is the country we serve and proudly represent. Our people are the face, spirit, and future of Ghana Post. Join a workplace that's supportive, welcoming, and inclusive as we deliver more to all Ghanaians.</p>
      </div>

      <div className="careers-container">
        {/* Available Jobs Section */}
        <section className="available-jobs-section">
          <h2>Available Jobs</h2>
          <div className="jobs-listing">
            {jobListings.map(job => (
              <div key={job.id} className="job-listing-card">
                <div className="job-listing-header">
                  <h3>{job.title}</h3>
                  <p className="job-posted">Posted: {job.posted}</p>
                </div>
                <div className="job-listing-details">
                  <p><strong>📍 Location:</strong> {job.location}</p>
                  <p><strong>💼 Type:</strong> {job.type}</p>
                </div>
                <button className="btn btn-apply-job" onClick={() => handleApplyNow(job.title)}>Apply Now</button>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section 1 */}
        <section className="benefits-section-large">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-large-card">
              <div className="benefit-large-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </section>

        {/* Application Steps Section */}
        <section className="application-steps">
          <h2>Interested in joining us?</h2>
          <p className="section-subtitle">Start applying in four steps:</p>
          <div className="steps-grid">
            {steps.map(step => (
              <div key={step.number} className="step-card-large">
                <div className="step-number-large">{step.number}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expectations Section */}
        <section className="expectations-section">
          <h2>What you can expect</h2>
          <p className="section-subtitle">Here are the next steps once you've applied:</p>
          <div className="expectations-list">
            {expectations.map((expectation, idx) => (
              <div key={idx} className="expectation-item">
                <span className="check-mark">✓</span>
                <p>{expectation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h2>Come work with us</h2>
          <p>Grow your career and take pride in helping deliver a stronger Ghana. We'd love to have you join us.</p>
          <button className="btn btn-cta" onClick={() => handleApplyNow('General Application')}>Apply now</button>
        </section>
      </div>
    </div>
  );
};

export default Careers;
