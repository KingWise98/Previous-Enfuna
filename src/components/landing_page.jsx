import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing_page.css';

const LandingPage = ({ onSignupRedirect, onLoginRedirect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  
  // Platform features for the slider - Using working Unsplash images
  const sliderImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&auto=format&fit=crop&q=80',
      title: 'Unified Payment Processing',
      description: 'QR, Mobile Money, Card, USSD & Cash - All in One Platform'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=80',
      title: 'Smart POS System',
      description: 'Complete Point of Sale for Businesses & Merchants'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      title: 'Real-Time Analytics',
      description: 'Instant Insights & Business Intelligence'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80',
      title: 'Credit Scoring Engine',
      description: 'AI-powered Underwriting & Loan Eligibility'
    }
  ];

  // Feature cards with SVG icons
  const features = [
    {
      title: 'Multi-Channel Payments',
      description: '5 payment channels in one unified system',
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      title: 'Real-Time Ledger',
      description: 'Automated accounting & balance tracking',
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      )
    },
    {
      title: 'Quick Expense',
      description: 'Instant expense logging from any screen',
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>
        </svg>
      )
    },
    {
      title: 'Secure & Compliant',
      description: 'PCI-DSS, KYC verification & biometric security',
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      )
    }
  ];

  // User type cards
  const userTypes = [
    {
      type: 'Riders',
      color: '#0125DC',
      features: ['Trip Management', 'Delivery Tracking', 'Earnings Dashboard', 'Quick Expense']
    },
    {
      type: 'Drivers',
      color: '#0125DC',
      features: ['Queue System', 'Ride Management', 'Driver Reports', 'Vehicle Tracking']
    },
    {
      type: 'Vendors',
      color: '#0125DC',
      features: ['Inventory POS', 'Sales Reports', 'Customer Management', 'QR Payments']
    },
    {
      type: 'Merchants',
      color: '#0125DC',
      features: ['Multi-Branch', 'Staff Management', 'Advanced Inventory', 'Analytics']
    },
    {
      type: 'Businesses',
      color: '#0125DC',
      features: ['Invoicing', 'Quotations', 'Customer Accounts', 'Bulk Payments']
    },
    {
      type: 'Admins',
      color: '#0125DC',
      features: ['User Management', 'Transaction Monitoring', 'Risk Control', 'Settlements']
    }
  ];

  // Payment channels with SVG icons
  const paymentChannels = [
    { 
      name: 'QR Code', 
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1h6v6H1V1zm2 2v2h2V3H3zM17 1h6v6h-6V1zm2 2v2h2V3h-2zM1 17h6v6H1v-6zm2 2v2h2v-2H3zM3 3h2v2H3V3zm4 4h2v2H7V7zm2-2h2v2H9V5zm2 2h2v2h-2V7zm2-2h2v2h-2V5zm2 2h2v2h-2V7zm0 2h2v2h-2V9zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2H7v-2zm8 4h2v2h-2v-2zm2-2h2v2h-2v-2zm2 0h2v2h-2v-2zm2 2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm0-2h2v2h-2v-2zm-2-2h2v2h-2v-2z"/>
        </svg>
      )
    },
    { 
      name: 'Mobile Money', 
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zM12 6.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 10.38 9.5 9s1.12-2.5 2.5-2.5z"/>
        </svg>
      )
    },
    { 
      name: 'Card Tap', 
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      )
    },
    { 
      name: 'Payment Link', 
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
      )
    },
    { 
      name: 'USSD', 
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      )
    },
    { 
      name: 'Cash', 
      svg: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1z"/>
        </svg>
      )
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sliderImages.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleGetStarted = () => {
    onSignupRedirect();
  };

  const handleTryDemo = () => {
    onSignupRedirect();
  };

  const handleLoginRedirect = () => {
    onLoginRedirect();
  };

  return (
    <div className="landing-page">
      {/* Header with Logo */}
      <header className="header">
        <div className="logo-container">
          <img 
            src="/start.png" 
            alt="Platform Logo" 
            className="logo-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' fill='%230125DC' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='20' font-weight='bold'%3Eexpo%3C/text%3E%3C/svg%3E";
            }}
          />
          
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav">
          <a href="#features" className="nav-link">Features</a>
          <a href="#users" className="nav-link">For Users</a>
          <a href="#payment" className="nav-link">Payments</a>
          <a href="#demo" className="nav-link">Demo</a>
        </nav>
        
        <div className="header-buttons">
          <button className="get-started-button" onClick={handleLoginRedirect}>
            Login
          </button>
          <button className="demo-button" onClick={handleGetStarted}>
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button" 
          onClick={() => setShowMobileMenu(true)}
        >
          ☰
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${showMobileMenu ? 'active' : ''}`}>
        <button className="close-menu" onClick={() => setShowMobileMenu(false)}>
          ×
        </button>
        <a href="#features" className="nav-link" onClick={() => setShowMobileMenu(false)}>
          Features
        </a>
        <a href="#users" className="nav-link" onClick={() => setShowMobileMenu(false)}>
          For Users
        </a>
        <a href="#payment" className="nav-link" onClick={() => setShowMobileMenu(false)}>
          Payments
        </a>
        <a href="#demo" className="nav-link" onClick={() => setShowMobileMenu(false)}>
          Demo
        </a>
        <div className="mobile-nav-buttons">
          <button className="get-started-button" onClick={handleLoginRedirect}>
            Login
          </button>
          <button className="demo-button" onClick={handleGetStarted}>
            Sign Up
          </button>
        </div>
      </div>

      {/* Main Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          Complete Digital Payments & POS Platform
        </h1>
        <p className="hero-subtitle">
          Multi-tenant ecosystem for Riders, Drivers, Merchants, Businesses & Agents.
          Unified payments, real-time ledger, and AI credit scoring in one platform.
        </p>
        <div className="hero-buttons">
          <button className="hero-cta" onClick={handleGetStarted}>
            Get Started Free
          </button>
          <button className="demo-button" onClick={handleTryDemo}>
            Try Live Demo
          </button>
        </div>
      </section>

      {/* Image Slider */}
      <section className="slider-section">
        <h2 className="section-title">Platform Highlights</h2>
        
        <div className="image-slider">
          <div 
            className="slider-track"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`
            }}
          >
            {sliderImages.map((slide) => (
              <div key={slide.id} className="slide">
                <img 
                  src={slide.src} 
                  alt={slide.title}
                  className="slide-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/1200x600/0125DC/FFFFFF?text=${encodeURIComponent(slide.title)}`;
                  }}
                />
                <div className="slide-content">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="slider-controls">
            <button onClick={() => setIsPlaying(!isPlaying)} className="control-button">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={handlePrevSlide} className="control-button">◀</button>
            <span className="slide-counter">{currentSlide + 1} / {sliderImages.length}</span>
            <button onClick={handleNextSlide} className="control-button">▶</button>
          </div>
        </div>
        
        <div className="slider-dots">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setCurrentSlide(index);
                setIsPlaying(false);
              }}
            />
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="features-section">
        <h2 className="section-title">Core Modules & Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card fade-in">
              <div className="feature-icon">
                {feature.svg}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="modules-section">
          <h3 className="section-title" style={{ fontSize: '28px', marginBottom: '40px' }}>
            Complete Application Scope
          </h3>
          <div className="modules-grid">
            {[
              'Payments Engine',
              'POS System',
              'Expense Tracking',
              'Wallet & Ledger',
              'Accounting',
              'Reporting',
              'Credit Scoring',
              'KYC/Compliance',
              'Notifications',
              'Staff Management'
            ].map((module, index) => (
              <div key={index} className="module-chip">
                {module}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="users" className="users-section">
        <h2 className="section-title">For Every User Type</h2>
        <div className="users-grid">
          {userTypes.map((user, index) => (
            <div key={index} className="user-card fade-in">
              <h3>{user.type}</h3>
              <ul className="user-features">
                {user.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button 
                className="get-started-button"
                onClick={handleGetStarted}
              >
                Start as {user.type}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="demo-section">
        <h2 className="section-title">Platform Demo</h2>
        <div className="demo-container">
          <div className="video-placeholder">
            <div className="video-overlay">
              <button className="play-button" onClick={handleVideoPlay}>
                ▶
              </button>
              <div className="video-info">
                <h3>Platform Walkthrough</h3>
                <p>See how our unified payment ecosystem works</p>
              </div>
            </div>
            <video
              ref={videoRef}
              className="demo-video"
              poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80"
              onError={(e) => {
                e.target.onerror = null;
                e.target.poster = 'https://placehold.co/1200x600/0125DC/FFFFFF?text=Demo+Video+Placeholder';
              }}
            >
              <source 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                type="video/mp4" 
              />
              <source 
                src="https://assets.mixkit.co/videos/preview/mixkit-people-paying-with-a-credit-card-4533-large.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="demo-features">
            <h3>What You'll See</h3>
            <ul>
              <li>Multi-user dashboard navigation</li>
              <li>Unified payment processing</li>
              <li>Real-time ledger updates</li>
              <li>Quick expense logging</li>
              <li>Credit scoring demo</li>
              <li>Multi-branch management</li>
              <li>Staff management tools</li>
              <li>Advanced reporting</li>
            </ul>
            <button className="demo-button" style={{ marginTop: 'auto' }} onClick={handleTryDemo}>
              Request Full Demo
            </button>
          </div>
        </div>
      </section>

      {/* Payment Channels */}
      <section id="payment" className="payment-section">
        <h2 className="section-title">Integrated Payment Channels</h2>
        <div className="payment-channels">
          {paymentChannels.map((channel, index) => (
            <div key={index} className="channel-card fade-in">
              <div className="channel-icon">
                {channel.svg}
              </div>
              <span>{channel.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" style={{ margin: '100px 0' }}>
        <h2 className="hero-title">Ready to Transform Your Business?</h2>
        <p className="hero-subtitle">
          Join thousands of businesses using our platform. Start accepting payments,
          managing operations, and growing your business today.
        </p>
        <div className="hero-buttons">
          <button className="hero-cta" onClick={handleGetStarted}>
            Get Started Free
          </button>
          <button className="demo-button" onClick={handleTryDemo}>
            Schedule Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img 
              src="/start.png" 
              alt="Platform Logo" 
              className="logo-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' fill='white' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230125DC' font-family='Arial, sans-serif' font-size='20' font-weight='bold'%3Eexpo%3C/text%3E%3C/svg%3E";
              }}
            />
            <p>
              Multi-tenant Digital Payments + POS + Income Digitization + 
              Credit Scoring Ecosystem for modern businesses.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#users">User Types</a>
              <a href="#payment">Payments</a>
              <a href="#demo">Demo</a>
            </div>
            <div className="footer-column">
              <h4>Modules</h4>
              <a href="#">Payments</a>
              <a href="#">POS</a>
              <a href="#">Accounting</a>
              <a href="#">Credit Scoring</a>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <a href="#" onClick={handleGetStarted}>Get Started</a>
              <a href="#">API Docs</a>
              <a href="#">Support</a>
              <a href="#">Contact Sales</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Digital Payments Platform. All rights reserved.</p>
          <div className="social-links">
            <a href="#" className="social-icon">📱</a>
            <a href="#" className="social-icon">💻</a>
            <a href="#" className="social-icon">📧</a>
            <span style={{ marginLeft: '20px', opacity: 0.8 }}>Android | iOS | Web</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;