import React, { useState, useEffect } from 'react';

function SubscriptionInfo() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/profile`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const data = await res.json();
      setSubscription(data.subscription);
    };

    fetchSubscription();
  }, []);

  return (
    <div className="subscription-info">
      <h2>Your Subscription</h2>
      {subscription && (
        <div>
          <p>Plan: {subscription.plan}</p>
          <p>Trial Ends: {new Date(subscription.trialEndDate).toLocaleDateString()}</p>
          <p>Products Remaining: {subscription.productLimit}</p>
          <p>Enhancements Remaining: {subscription.enhanceLimit}</p>
        </div>
      )}
      {subscription && subscription.status === 'trial' && (
        <div>
          <button onClick={() => navigate('/subscribe')}>Subscribe Now</button>
        </div>
      )}
    </div>
  );
}

export default SubscriptionInfo;
