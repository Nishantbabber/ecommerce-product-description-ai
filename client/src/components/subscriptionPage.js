import React from 'react';

function SubscriptionPage() {
  const handleSubscribe = (plan) => {
    // Logic to handle subscription, probably involving payment gateway integration
  };

  return (
    <div className="subscription-page">
      <h1>Choose Your Plan</h1>
      <div className="plans">
        <div className="plan">
          <h2>Basic</h2>
          <p>$10/month</p>
          <button onClick={() => handleSubscribe('basic')}>Subscribe</button>
        </div>
        <div className="plan">
          <h2>Pro</h2>
          <p>$20/month</p>
          <button onClick={() => handleSubscribe('pro')}>Subscribe</button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
