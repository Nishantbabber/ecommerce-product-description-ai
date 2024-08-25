import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import '../styles/productListing.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FinalizeDescriptionModal from './finalizeDescriptionModal'; // Make sure the path is correct
import { Modal, Button } from 'react-bootstrap';



const ProductList = () => {
    const navigate = useNavigate(); // Use useNavigate
    const [products, setProducts] = useState([]);
    const [previewDescription, setPreviewDescription] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const [loadingEnhance, setLoadingEnhance] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [enhancedProduct, setEnhancedProduct] = useState(null);
    const productsPerPage = 9;

    const showToast = (message, type) => {
        toast.dismiss(); // Dismiss any existing toasts
        if (type === 'success') {
            toast.success(message);
        } else if (type === 'error') {
            toast.error(message);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            const data = await res.json();
            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const enhanceDescription = async (id, existingDescription = null) => {
        setLoadingEnhance(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products/enhance/${id}`, {
                method: 'POST',
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: existingDescription ? JSON.stringify({ description: existingDescription }) : null,
            });

            if (res.ok) {
                const data = await res.json();
                setEnhancedProduct(data);  // Save enhanced product data
                setShowModal(true);  // Show modal after enhancement
            } else if (res.status === 403) {
                const data = await res.json();
                showToast(data.msg || 'Enhancement limit reached. Please subscribe to continue.', 'error');
            } else {
                showToast(res.statusText || 'Failed to enhance description', 'error');
            }
        } catch (error) {
            showToast(error || 'Error enhancing description', 'error');
        } finally {
            setLoadingEnhance(false);
        }
    };

    const saveDescription = async (updatedDescription) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products/${enhancedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: updatedDescription }),
            });

            if (res.ok) {
                showToast('Description saved successfully!', 'success');
                setShowModal(false);
            } else {
                showToast('Failed to save description', 'error');
            }
        } catch (error) {
            showToast('Error saving description', 'error');
        }
    };

    const handleEditAgain = () => {
        if (enhancedProduct) {
            enhanceDescription(enhancedProduct._id, enhancedProduct.description);
        }
    };

    const previewEnhancedDescription = async (id) => {
        setLoadingPreview(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products/preview/${id}`, {
                method: 'POST',
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.enhancedDescription) {
                    setPreviewDescription(data.enhancedDescription);
                    setShowPreview(true);
                } else {
                    showToast('Failed to preview the description', 'error');
                }
            } else {
                showToast(res.statusText || 'Failed to fetch enhanced description', 'error');
            }
        } catch (error) {
            showToast(error || 'Error previewing description', 'error');
        } finally {
            setLoadingPreview(false);
        }
    };

    const editProduct = (id) => {
        // Redirect to an edit form with the product ID
        navigate(`/edit-product/${id}`);
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            if (res.ok) {
                setProducts(products.filter(product => product._id !== id));
            } else {
                const errorData = await res.json();
                console.log(errorData);
                showToast(errorData || 'Failed to delete product', 'error');
            }
        } catch (error) {
            showToast(error || 'Error deleting product', 'error');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterCategory(e.target.value);
    };

    const filteredProducts = products.filter(product => {
        return (
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterCategory === '' || product.category === filterCategory)
        );
    });

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    function isImageValid(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    return (
        <div>
            <div className="search-filter-wrapper">
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search by product name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <select value={filterCategory} onChange={handleFilterChange}>
                        <option value="">All Categories</option>
                        {[...new Set(products.map(product => product.category))].map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="product-list-container">
                {loading ? (
                    <div className="loading-overlay">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">Loading...</div>
                        </div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-message">
                        <p>No products found. Please add a few products to get started.</p>
                        <a href="/productForm" className="add-product-button">Add New Product</a>
                    </div>
                ) : (
                    <div>
                        <header className="product-list-header">
                            <h1>Product Catalog</h1>
                            <p className="subtitle">Manage and view your products efficiently.</p>
                        </header>
                        <div className="product-grid">
                            {currentProducts.map(product => (
                                <div key={product._id} className="product-card">
                                    {product.imageUrl && isImageValid(product.imageUrl) ? (
                                        <img src={product.imageUrl} alt={product.title} className="product-image" />
                                    ) : (
                                        <div className="no-image">
                                            <p>No Image Available</p>
                                        </div>
                                    )}
                                    <div className="product-details">
                                        <h2>{product.title}</h2>
                                        <p className="product-description">{product.description}</p>
                                    </div>
                                    <div className="product-meta">
                                        <p className="product-category">Category: {product.category}</p>
                                        <p className="product-price">Price: ₹{product.price}</p>
                                    </div>
                                    <div className="buttons">
                                        <div className="enhance-preview-buttons">
                                            <button onClick={() => enhanceDescription(product._id)} disabled={loadingEnhance}>
                                                {loadingEnhance ? 'Enhancing...' : 'Enhance Description'}
                                            </button>
                                            <button onClick={() => previewEnhancedDescription(product._id)} disabled={loadingPreview}>
                                                {loadingPreview ? 'Previewing...' : 'Preview Description'}
                                            </button>
                                        </div>
                                        <div className="edit-delete-buttons">
                                            <button className="edit-button" onClick={() => editProduct(product._id)}>Edit</button>
                                            <button className="delete-button" onClick={() => deleteProduct(product._id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span>Page {currentPage}</span>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={indexOfLastProduct >= filteredProducts.length}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                <Modal show={showPreview} onHide={() => setShowPreview(false)}>
                    <div className="modal-backdrop"></div> {/* Dark background overlay */}

                    <Modal.Header>
                        <Modal.Title>Enhanced Description Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{previewDescription}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPreview(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Loading indicators for global state */}
                {(loadingEnhance || loadingPreview) && (
                    <div className="loading-overlay">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">Loading...</div>
                        </div>
                    </div>
                )}
                {enhancedProduct && (
                    <FinalizeDescriptionModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        handleSave={() => saveDescription(enhancedProduct.description)}
                        handleEditAgain={handleEditAgain}
                        productData={enhancedProduct}
                    />
                )}

            </div>
        </div>
    );
};

export default ProductList;
