import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forgotPassword.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const showToast = (message, type) => {
        toast.dismiss(); // Dismiss any existing toasts
        if (type === 'success') {
            toast.success(message);
        } else if (type === 'error') {
            toast.error(message);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier }),
            });

            const data = await res.json();
            if (res.ok) {
                showToast('Password reset link sent to your email if the account exists.', 'success');
                setTimeout(() => navigate('/'), 2000);
            } else {
                showToast(data.msg || 'Something went wrong.', 'error');
            }
        } catch (err) {
            showToast('Something went wrong.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <h1 className="company-name">AIProductWriter</h1>
            <form onSubmit={onSubmit} className="forgot-password-form">
                <h2>Forgot Password</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Enter your User ID or Email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                </div>
                <input type="submit" value="Submit" disabled={loading}/>
            </form>
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
};

export default ForgotPassword;
