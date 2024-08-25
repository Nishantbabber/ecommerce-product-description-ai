import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/editProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        imageUrl: '',
        targetAudience: '',
        features: '',
        usageScenarios: '',
        tone: '',
        keywords: '',
        benefits: '',
        comparableProducts: ''
    });

    const [showAdvanced, setShowAdvanced] = useState(false); // Manage advanced fields visibility

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products/${id}`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            const data = await res.json();
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        // Restrict the input to numbers and allow only one decimal place
        if (/^\d*\.?\d{0,1}$/.test(value)) {
            setProduct({ ...product, [e.target.name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(product)
        });
        const data = await res.json();
        if (data.msg === 'Product updated successfully') {
            navigate('/dashboard');
        }
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="edit-form-container">
            <form onSubmit={handleSubmit} className="edit-form">
                <h2>Edit Product</h2>
                <div>
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                        placeholder="Product Title"
                        required
                    />
                </div>
                <div>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Product Description"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="price"
                        value={product.price}
                        onChange={handlePriceChange}
                        placeholder="Price"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="imageUrl"
                        value={product.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL"
                    />
                </div>
                {showAdvanced && (
                    <>
                        <div>
                            <input
                                type="text"
                                placeholder="Target Audience"
                                name="targetAudience"
                                value={product.targetAudience}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Key Features"
                                name="features"
                                value={product.features}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Usage Scenarios"
                                name="usageScenarios"
                                value={product.usageScenarios}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Tone (e.g., professional, casual)"
                                name="tone"
                                value={product.tone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="SEO Keywords"
                                name="keywords"
                                value={product.keywords}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Product Benefits"
                                name="benefits"
                                value={product.benefits}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Comparable Products"
                                name="comparableProducts"
                                value={product.comparableProducts}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                <div className="advanced-toggle">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        {showAdvanced ? 'Basic Fields' : 'Advanced Fields'}
                    </button>
                    {!showAdvanced && (
                        <p className="advanced-info">
                            Additional fields for more accurate results.
                        </p>
                    )}
                </div>
                <input
                    type="submit"
                    value="Update Product"
                />
                <button onClick={goToDashboard} className="back-button">
                    Back to Dashboard
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
