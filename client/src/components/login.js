import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(process.env.REACT_APP_BACKEND_API_URL)
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);

        // Fetch the user profile to get the role
        const profileRes = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/profile`, {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': data.token,
          },
        });

        const profileData = await profileRes.json();

        if (profileData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        showToast(data.msg, 'error');
      }
    } catch (err) {
      showToast(err || 'Login error', 'error');
    }
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
    <div className="login-container">
      <div className="left-section">
        <div className="welcome-message">
          <h1>{process.env.REACT_APP_BACKEND_API_URL}</h1>
          <h2>Welcome to AIProductWriter</h2>
          <p>New to AIProductWriter? Register here to experience the best AI tool for product design.</p>
          <a href="/register" className="register-button">Register</a>
        </div>
      </div>
      <div className="right-section">
        <h1 className="company-name">AIProductWriter</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email or Username</label>
            <input
              type="text"
              id="emailOrUsername"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="text-input"
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
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="forget-password-container">
            <a href="/forgot-password" className="forget-password">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
