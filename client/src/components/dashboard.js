import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './productList';
import '../styles/userDashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    isEmailVerified: false,
    subscriptionStatus: null,
    createdAt: '',
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/profile`, {
          method: 'GET',
          headers: { 'x-auth-token': token },
        });
        const data = await res.json();
        if (data.username && data.email) {
          setUserData({
            username: data.username,
            email: data.email,
            isEmailVerified: data.isEmailVerified,
            subscriptionStatus: data.subscriptionStatus,
            createdAt: data.createdAt,
          });
        } else {
          console.error('Failed to fetch user data');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleEmailVerification = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      if (res.ok) {
        showToast('Verification email sent. Please check your inbox.', 'success');
      } else {
        showToast('Failed to send verification email', 'error');
      }
    } catch (err) {
      showToast(err, 'error');
      console.error(err);
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
  // Calculate the trial end date based on createdAt
  const trialEndDate = new Date(new Date(userData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((trialEndDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome, {userData.username}</h1>
          {userData.subscriptionStatus && (
            <p className="limit-message">
              {userData.subscriptionStatus.status === 'trial'
                ? `Trial Days Remaining: ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`
                : 'Subscription Active'}
            </p>
          )}
          {userData.subscriptionStatus && (
            <div className="subscription-limits">
              {userData.subscriptionStatus.productLimit <= 0 && (
                <p className="limit-message">Product limit reached.</p>
              )}
              {userData.subscriptionStatus.enhanceLimit <= 0 && (
                <p className="limit-message">Enhancement limit reached.</p>
              )}
            </div>
          )}
        </div>
        <div className="header-right">
          <a href="/productForm" className="add-product-button">Add Product</a>
          <div className="user-dropdown">
            <button className="user-dropdown-button" onClick={toggleDropdown}>
              {userData.username}
            </button>
            {dropdownVisible && (
              <div className="dropdown-content">
                <a href="/user-profile" className="profile-button">Profile</a>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        {!userData.isEmailVerified && (
          <div className="email-verification-message">
            <p>Your email is not verified. Please check your inbox for a verification email.
              <a onClick={handleEmailVerification} className="verify-email">Verify Email</a>
            </p>
          </div>
        )}
        <ProductList />
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} AIProductWriter All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
