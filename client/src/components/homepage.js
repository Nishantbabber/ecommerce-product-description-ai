import React from 'react';
import '../styles/homepage.css';

const Homepage = () => {

  const userData = localStorage.getItem('token');

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className='hero-section'>
      <img src={process.env.PUBLIC_URL + '/heroSection.webp'} alt="Hero" className="hero-image" />

        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Revolutionize Your Product Descriptions with AIProductWriter</h1>
          <p>AI-driven, SEO-optimized descriptions that engage and convert.</p>
          {!userData ? (
            <>
              <button className="cta-button" onClick={() => window.location.href = '/register'}>Create Account</button>
              <button className="cta-button" onClick={() => window.location.href = '/login'}>Sign In</button>
            </>
          ) : (
            <button className="cta-button" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
          )}
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-overview">
        <h2>Why Choose AIProductWriter?</h2>
        <div className="features">
          <div className="feature">
            <h3><i className="fa fa-brain"></i> AI-Driven Descriptions</h3>
            <p>Automatically generates engaging, optimized product descriptions.</p>
          </div>
          <div className="feature">
            <h3><i className="fa fa-search"></i> SEO Enhancement</h3>
            <p>Boosts your search engine rankings with keyword-rich content.</p>
          </div>
          <div className="feature">
            <h3><i className="fa fa-user-friends"></i> User-Friendly Interface</h3>
            <p>Seamlessly integrates into any workflow.</p>
          </div>
        </div>
      </section>

      {/* Comparison Chart */}
      <section className="comparison-chart">
        <h2>How We Compare</h2>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>AIProductWriter</th>
              <th>Direct GPT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AI-Driven Descriptions</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
            <tr>
              <td>SEO Optimization</td>
              <td>✔</td>
              <td>✘</td>
            </tr>
            <tr>
              <td>Templates</td>
              <td>✔</td>
              <td>✘</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Templates and Examples */}
      <section className="templates-and-examples">
        <h2>Explore Our Templates</h2>
        <p>Discover our range of templates for different product categories.</p>
        <a href="/examples" className="view-examples-link">View Examples</a>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"AIProductWriter transformed our product descriptions and boosted our sales!"</p>
          <cite>- Alex B.</cite>
        </div>
        <div className="testimonial">
          <p>"The SEO optimization is top-notch. Highly recommend!"</p>
          <cite>- Jamie L.</cite>
        </div>
      </section>

      {/* FAQs */}
      <section className="faqs">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How does AIProductWriter work?</h3>
          <p>AIProductWriter uses advanced AI algorithms to generate optimized product descriptions.</p>
        </div>
        <div className="faq-item">
          <h3>What makes it different from GPT?</h3>
          <p>AIProductWriter includes built-in SEO enhancements and customizable templates tailored for e-commerce.</p>
        </div>
      </section>

      {/* Demo Video */}
      <section className="demo-video">
        <h2>See AIProductWriter in Action</h2>
        <video controls>
          <source src="AIProductWriter-demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
    </div>
  );
};

export default Homepage;
