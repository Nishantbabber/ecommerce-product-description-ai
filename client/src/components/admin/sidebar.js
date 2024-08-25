import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/adminDashboard.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => isActive ? 'active-link' : undefined}
                            end
                        >
                            Dashboard Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) => isActive ? 'active-link' : undefined}
                        >
                            Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/products"
                            className={({ isActive }) => isActive ? 'active-link' : undefined}
                        >
                            Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/reports"
                            className={({ isActive }) => isActive ? 'active-link' : undefined}
                        >
                            Reports
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
