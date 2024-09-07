import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('User created successfully', 'success');
        localStorage.setItem('isRegistered', 'true');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        showToast(data.msg, 'error');
      }
    } catch (err) {
      showToast(err, 'error');
    }
    setLoading(false);
  };

  const showToast = (message, type) => {
    toast.dismiss(); // Dismiss any existing toasts
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    }
  };
  return (
    <div className="register-container">
      <div className="left-section">
        <img src="your-background-image.jpg" alt="Background" className="background-image" />
        <div className="welcome-message">
          <h2>Join AIProductWriter</h2>
          <p>Become a part of our community and enjoy the best AI tools for product design.</p>
          <a href="/login" className="login-button">Login</a>
        </div>
      </div>
      <div className="right-section">
        <a href="/">
        <h1 className="company-name">AIProductWriter</h1>
        </a>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
      {(loading) && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
