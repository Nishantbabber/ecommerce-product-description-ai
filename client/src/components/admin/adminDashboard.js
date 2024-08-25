import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar';
import DashboardHome from './dashboardHome';
import UserManagement from './userManagement';
import ProductManagement from './productManagement';
import { useNavigate } from 'react-router-dom';
import '../../styles/adminDashboard.css';

const AdminDashboard = () => {

    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
      };
    
      const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
      };
    

    return (
        <div className="admin-dashboard">
            <Sidebar />
            <div className="dashboard-content">
                <header className="admin-dashboard-header">
                    <div className="header-left">
                    <h1>Admin Dashboard</h1>
                    </div>
                    <div className="header-right">
                        <div className="user-dropdown">
                            <button className="user-dropdown-button" onClick={toggleDropdown}>
                                Profile
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

                <main>
                    <Routes>
                        <Route path="/" element={<DashboardHome />} /> {/* Default route */}
                        <Route path="users" element={<UserManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        {/* Add other routes for products, reports, etc. here */}
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
