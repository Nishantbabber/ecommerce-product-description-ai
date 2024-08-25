import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/verfiyEmail.css';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/verify-email/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();

        if (res.status === 200) {
          setMessage('Your email has been verified successfully!');
        } else {
          setMessage(`Verification failed: ${data.msg}`);
        }
      } catch (err) {
        console.error(err);
        setMessage('An error occurred while verifying your email.');
      }
    };

    verifyEmail();
  }, [token]);

  const handleRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <div className="verify-email-container">
      <h1>{message}</h1>
      <button onClick={handleRedirect}>Go to Homepage</button>
    </div>
  );
}

export default VerifyEmail;
