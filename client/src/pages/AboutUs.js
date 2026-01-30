import React, { useState } from 'react';

const AboutUs = () => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (key) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  const getImageUrl = (key, primaryUrl, fallback = null) => {
    if (imageErrors[key]) {
      return fallback || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0UwRTBFMCIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjIwMCIgeT0iMTUwIiBzdHlsZT0iZm9udC1zaXplOjE2cHg7ZmlsbDojOTk5O2ZvbnQtZmFtaWx5OkFyaWFsIj5JbWFnZSBOb3QgTG9hZGVkPC90ZXh0Pjwvc3ZnPg==';
    }
    return primaryUrl;
  };

  return (
    <div className="container">
      <div
        className="about-hero"
        style={{
          backgroundImage:
            `url('${getImageUrl('hero', 'https://www.ghanapost.com.gh/_next/image?url=%2Fbuilding.jpg&w=1080&q=75')}')`,
        }}
      >
        <div className="hero-inner">
          <h1>About Ghana Post</h1>
          <p className="hero-sub">Prompt, Efficient, Reliable and Secure Communication and Financial Services.</p>
        </div>
      </div>

      <div className="form-section about-content two-column">
        <div className="content-main">
          <h2>Company History</h2>
          <p>
            In July 1999, Ghana Postal Services Corporation was converted to a limited liability
            company. This conversion placed the company in the same legal and regulatory operating
            environment as similar private enterprises, enabling it to operate successfully in a
            competitive commercial environment and widening its objectives.
          </p>

          <p>
            As the nation's designated operator, with a network of 360 post offices across the
            country, Ghana Post provides courier, financial services (remittances, post assurance,
            and agency services), and traditional mail services.
          </p>

          <p>
            Over the past 4 years, Ghana Post has been on a turnaround path leading to significant
            growth through innovation and the introduction of new services and expansion of its
            fleet. The digitisation of the Post Offices has been at the centre of the turnaround
            strategy, allowing the Company flexibility to easily add on new services, while the
            introduction of digital addresses by the government has come to enhance delivery of
            mails and parcels.
          </p>

          <p>
            Our online platform, Ghpostpay, was launched in 2019 to allow customers to access our
            services remotely.
          </p>

          <h3>Awards &amp; Recognition</h3>
          <ul>
            <li>Best EMS Call Centre 2017 by the Universal Postal Union in Switzerland</li>
            <li>Best Customer Care Award 2018 by the Universal Postal Union in Switzerland</li>
            <li>Public Sector Campaign of the Year 2018 by Marketing World Awards</li>
            <li>CIMG President Special Awards 2018</li>
            <li>Most Reliable and Fastest Courier Company in West Africa 2019 by Pillars Modern Ghana Awards</li>
            <li>Excellence in Innovation and Technology 2019</li>
            <li>Outstanding Contribution to the Shipping Industry 2019 by Ghana Shippers Awards</li>
          </ul>

          <p>
            In the year 2020 UPU report on performance of postal administrations, Ghana Post was rated
            as the 57th world-best postal administration and 1st in Africa. In the same year, Ghana
            Post was ranked the 36th best administration among the EMS cooperative members of 192
            globally.
          </p>

          <h3>Mission</h3>
          <p>
            To provide Prompt, Efficient, Reliable and Secure Communication and Financial Services to
            Domestic and Foreign Customers for profit.
          </p>

          <h3>Vision</h3>
          <p>To make Ghana Post a commercially focused and compliance-driven organisation.</p>

          <h3>Core Values</h3>
          <p>Teamwork, Integrity, Drive, Excellence.</p>

          <h3>Objectives</h3>
          <ul>
            <li>Expand the postal network to viable areas and delegate non-viable areas to appropriate commissioned agents.</li>
            <li>Improve mail security.</li>
            <li>Provide ancillary services such as financial services to augment the traditional ones.</li>
            <li>Promote all postal products to create awareness of their existence.</li>
          </ul>
        </div>

        <aside className="content-side">
          <div className="side-card">
            <img
              src={getImageUrl('logo', 'https://www.ghanapost.com.gh/_next/image?url=%2Flogo2.png&w=384&q=75')}
              alt="Ghana Post Logo"
              onError={() => handleImageError('logo')}
              loading="lazy"
            />
            <p style={{ marginTop: '0.75rem' }}>
              <strong>G.P.O. Asafoatse Nettey Road</strong>
              <br />Accra Central, Ghana, GA-183-8164
            </p>
            <p>
              <a href="mailto:info@ghpostoff.com.gh">info@ghpostoff.com.gh</a>
            </p>
            <p>
              <a href="tel:+233302668138">+233 (0)302 668 138</a>
            </p>
          </div>

          <div className="side-card">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/services">Services</a>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="form-section">
        <h2>Leadership</h2>
        <div className="card-grid leadership-grid">
          <div className="card leader">
            <img
              src={getImageUrl('rita', 'https://www.ghanapost.com.gh/_next/image?url=%2Frita.jpg&w=256&q=75')}
              alt="Rita Sraha"
              onError={() => handleImageError('rita')}
              loading="lazy"
            />
            <h4>RITA SRAHA</h4>
            <div>Managing Director</div>
          </div>

          <div className="card leader">
            <img
              src={getImageUrl('stephen', 'https://www.ghanapost.com.gh/_next/image?url=%2Fstephen2.jpeg&w=256&q=75')}
              alt="Stephen Bennieh"
              onError={() => handleImageError('stephen')}
              loading="lazy"
            />
            <h4>STEPHEN KINGSLEY BENNIEH ESQ</h4>
            <div>Dep. Managing Director – F&amp;A</div>
          </div>

          <div className="card leader">
            <img
              src={getImageUrl('kwesi', 'https://www.ghanapost.com.gh/_next/image?url=%2Fcco.jpg&w=256&q=75')}
              alt="Kwesi Owusu-Abrokwa"
              onError={() => handleImageError('kwesi')}
              loading="lazy"
            />
            <h4>KWESI OWUSU-ABROKWA</h4>
            <div>Chief Commercial Officer - CCO</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

