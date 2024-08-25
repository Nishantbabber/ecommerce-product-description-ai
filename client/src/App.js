import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import ProductForm from './components/productForm';
import EditProduct from './components/editProduct';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import VerifyEmail from './components/verfiyEmail';
import AccountManagement from './components/userProfile'
import AdminDashboard from './components/admin/adminDashboard';



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productForm" element={<ProductForm />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/user-profile/" element={<AccountManagement />} />
          <Route path="/admin/*" element={<AdminDashboard />} /> {/* Use a wildcard to handle nested routes */}
        </Routes>
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} closeOnClick pauseOnHover rtl={false} />
      </div>
    </Router>
  );
}

export default App;
