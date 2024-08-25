import React, { useEffect, useState } from 'react';
import '../../styles/adminDashboard.css';

const DashboardHome = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Fetch total users and products count from the API
            try {
                const usersRes = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/admin/users-count`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                const productsRes = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/admin/products-count`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });

                const usersData = await usersRes.json();
                const productsData = await productsRes.json();

                setTotalUsers(usersData.count);
                setTotalProducts(productsData.count);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-home">
            <div className="metric-card">
                <h2>Total Users</h2>
                <p>{totalUsers}</p>
            </div>
            <div className="metric-card">
                <h2>Total Products</h2>
                <p>{totalProducts}</p>
            </div>
        </div>
    );
};

export default DashboardHome;
