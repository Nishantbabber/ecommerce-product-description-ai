import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/productListing.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FinalizeDescriptionModal from './finalizeDescriptionModal';
import { Modal, Button } from 'react-bootstrap';
import Joyride from 'react-joyride';


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
    const [runTour, setRunTour] = useState(false); // State to control the tour
    const [steps, setSteps] = useState([]); // State to manage the tour steps
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

            if (data.length === 1 && !localStorage.getItem('isFirstProductTourShown')) {
                startTour();
                localStorage.setItem('isFirstProductTourShown', 'true');
            }
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

    const startTour = () => {
        setSteps([
            {
                target: '.edit-button',
                content: 'Click here to edit your product.',
            },
            {
                target: '.delete-button',
                content: 'Click here to delete your product.',
            },
            {
                target: '.enhance-preview-buttons button:first-child',
                content: 'Click here to enhance your product description.',
            },
            {
                target: '.enhance-preview-buttons button:last-child',
                content: 'Click here to preview the enhanced product description.',
            },
        ]);
        setRunTour(true); // Start the tour
    };

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        INR: '₹',
        CAD: '$',
        AUD: '$',
        CNY: '¥',
        RUB: '₽',
        // Add more currencies as needed
    };
    function getCurrencySymbol(currencyCode) {
        return currencySymbols[currencyCode] || currencyCode; // Fallback to code if symbol not found
    }

    const copyToClipboard = (description) => {
        navigator.clipboard.writeText(description).then(() => {
            showToast('Description copied to clipboard!', 'success');
        }).catch(err => {
            showToast('Failed to copy description', 'error');
        });
    };

    const downloadTextFile = () => {
        const textContent = products.map(product =>
            `Product: ${product.title}\nDescription: ${product.description}\nPrice: ${product.price}\n\n`
        ).join('\n');

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'products.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const downloadCSV = () => {
        // Define the CSV headers
        const headers = ['Product Name', 'Product Description', 'Product Price'];

        // Map the products into CSV rows
        const csvContent = products.map(product => {
            const title = `"${product.title.replace(/"/g, '""')}"`;  // Escape double quotes in title
            const description = `"${product.description.replace(/"/g, '""')}"`;  // Escape double quotes in description
            const price = product.price ? `"${product.price}"` : '""';  // Ensure price is formatted or empty

            return `${title},${description},${price}`;
        }).join('\n');

        // Add headers to the CSV content
        const fullCsvContent = `${headers.join(',')}\n${csvContent}`;

        // Create CSV Blob and initiate download
        const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'products.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const hasMultipleProducts = products.length > 1;

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
                                        <p className="product-price">Price: {getCurrencySymbol(product.currency)}{product.price}</p>
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
                                            <button onClick={() => copyToClipboard(product.description)}>Copy to Clipboard</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {hasMultipleProducts && (
                            <div className="download-buttons">
                                <button onClick={downloadCSV}>
                                    Download CSV
                                </button>
                                <button onClick={downloadTextFile}>
                                    Download Text File
                                </button>
                            </div>
                        )}
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
            <Joyride
                steps={steps}
                run={runTour}
                continuous
                showSkipButton
                showProgress
                styles={{
                    options: {
                        zIndex: 10000, // Ensure the tour is above other elements
                    },
                }}
                callback={(data) => {
                    if (data.status === 'finished' || data.status === 'skipped') {
                        setRunTour(false); // Stop the tour after it's finished or skipped
                    }
                }}
            />
        </div>
    );
};

export default ProductList;
