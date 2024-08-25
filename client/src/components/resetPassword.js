import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/resetPassword.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

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

            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/user/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Password reset successful', 'success');
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
        <div className="reset-password-container">
            <h1 className="company-name">AIProductWriter</h1>
            <form onSubmit={onSubmit} className="reset-password-form">
                <h2>Reset Password</h2>
                <div>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <input type="submit" value="Reset Password" disabled={loading} />
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

export default ResetPassword;
