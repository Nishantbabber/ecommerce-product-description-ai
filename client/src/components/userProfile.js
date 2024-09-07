import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/userProfile.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountManagement = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [subscriptionStatus, setSubscriptionData] = useState(null);
  const [createdAt, setcreatedAt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Fetch user profile data to prefill the form
    const fetchProfile = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({
          username: data.username || '',
          email: data.email || '',
          currentPassword: '',
          newPassword: '',
        });
        setcreatedAt(data.createdAt || null); // Set subscription data
        setSubscriptionData(data.subscriptionStatus || null); // Set subscription data
      } else {
        console.error('Error fetching profile:', data);
      }
    };

    fetchProfile();
  }, [navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast(data.msg || 'Something went wrong.', 'error');
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };


  const showToast = (message, type) => {
    toast.dismiss(); // Dismiss any existing toasts
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    }
  };

  const trialEndDate = new Date(new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((trialEndDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="account-management">
      <h2>Account Management</h2>
      <button onClick={goToDashboard} className="back-button">
        Back to Dashboard
      </button>
      <div className="profile-info">
        <p><strong>Username:</strong> {formData.username}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        {subscriptionStatus && (
          <div className="subscription-info">
            <p><strong>Subscription Status:</strong> {subscriptionStatus.status}</p>
            {subscriptionStatus.status === 'trial' && (
              <p><strong>Trial Days Remaining:</strong> {daysLeft} {daysLeft === 1 ? 'day' : 'days'}</p>
            )}
            <p><strong>Product Limit:</strong> {subscriptionStatus.productLimit}</p>
            <p><strong>Enhancement Limit:</strong> {subscriptionStatus.enhanceLimit}</p>
          </div>
        )}
        {/* {subscriptionStatus && subscriptionStatus.status === 'trial' && (
          <div>
            <button onClick={() => navigate('/subscribe')}>Subscribe Now</button>
          </div>
        )} */}
      </div>
      <form onSubmit={onSubmit} className="profile-form">
        <div>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={onChange}
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="submit-button">Update Password</button>
      </form>
    </div>
  );
};

export default AccountManagement;
