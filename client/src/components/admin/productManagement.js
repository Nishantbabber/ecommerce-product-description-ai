import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/productManagement.css'; // Import your CSS file for styling

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.BACKEND_API_URL}/api/admin/products?page=${page}&limit=10`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${process.env.BACKEND_API_URL}/api/admin/products/${id}`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });
                fetchProducts(currentPage); // Refresh the product list
            } catch (err) {
                setError('Failed to delete product');
                console.error(err);
            }
        }
    };

    const handlePageChange = (page) => {
        fetchProducts(page);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="product-management">
            <h1>Product Management</h1>
            <Link to="/productForm" className="add-product-button">Add New Product</Link>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Product Id</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.title}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>₹{product.price}</td>
                            <td>
                                <Link to={`/edit-product/${product._id}`} className="edit-button">Edit</Link>
                                <button onClick={() => handleDelete(product._id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;
