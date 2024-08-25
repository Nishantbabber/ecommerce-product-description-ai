import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/productForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = () => {

    const showToast = (message, type) => {
        toast.dismiss(); // Dismiss any existing toasts
        if (type === 'success') {
            toast.success(message);
        } else if (type === 'error') {
            toast.error(message);
        }
    };

    const [formData, setFormData] = useState({
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
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { title, description, category, price, imageUrl, targetAudience, features, usageScenarios, tone, keywords, benefits, comparableProducts } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);

        const res = await fetch(`${process.env.BACKEND_API_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            showToast('Product created successfully!', 'success');
            setFormData({
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
            navigate('/dashboard');
        } else {
            const data = await res.json();
            showToast(data.msg || 'Product limit reached. Please subscribe to continue.', 'error');
        }

        setIsSubmitting(false);
    };

    const handlePriceChange = e => {
        const value = e.target.value;
        // Restrict the input to numbers and allow only one decimal place
        if (/^\d*\.?\d{0,1}$/.test(value)) {
            setFormData({ ...formData, [e.target.name]: value });
        }
    };

    const goToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="product-form-container">
            <form onSubmit={onSubmit} className="product-form">
                <h2>Add New Product</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Product Title"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Product Description"
                        name="description"
                        value={description}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Category"
                        name="category"
                        value={category}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Price"
                        name="price"
                        value={price}
                        onChange={handlePriceChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Image URL"
                        name="imageUrl"
                        value={imageUrl}
                        onChange={onChange}
                    />
                </div>
                {showAdvanced && (
                    <>
                        <div>
                            <input
                                type="text"
                                placeholder="Target Audience"
                                name="targetAudience"
                                value={formData.targetAudience}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Key Features"
                                name="features"
                                value={formData.features}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Usage Scenarios"
                                name="usageScenarios"
                                value={formData.usageScenarios}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Tone (e.g., professional, casual)"
                                name="tone"
                                value={formData.tone}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="SEO Keywords"
                                name="keywords"
                                value={formData.keywords}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Product Benefits"
                                name="benefits"
                                value={formData.benefits}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Comparable Products"
                                name="comparableProducts"
                                value={formData.comparableProducts}
                                onChange={onChange}
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
                    value="Submit Product"
                    disabled={isSubmitting}
                />
                <button onClick={goToDashboard} className="back-button">
                    Back to Dashboard
                </button>

            </form>
        </div>
    );
};

export default ProductForm;
