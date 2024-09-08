import React, { useEffect, useState } from 'react';
import '../styles/example.css';
import { useNavigate } from 'react-router-dom';
import Header from './header';

const ExamplesPage = () => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const exampleProducts = [
        { id: 1, title: 'Stylish Jacket', description: 'A trendy jacket for all seasons.', category: 'Fashion', price: 2499, imageUrl: '/Jacket.webp' },
        { id: 2, title: 'Smartphone', description: 'The latest smartphone with amazing features.', category: 'Electronics', price: 45999, imageUrl: '/Smartphone.webp' },
        { id: 3, title: 'Modern Sofa', description: 'A comfortable and stylish sofa for your living room.', category: 'Home Products', price: 15999, imageUrl: '/homeproduct.webp' },
        { id: 4, title: 'Luxury Skincare', description: 'High-quality skincare for glowing skin.', category: 'Beauty', price: 3999, imageUrl: 'Beauty.webp' },
        { id: 5, title: 'Sports Shoes', description: 'Durable and lightweight shoes for running.', category: 'Sports & Fitness', price: 2999, imageUrl: 'shoes.webp' },
        { id: 6, title: 'Cutting board', description: 'A cutting board is a durable board on which to place material for cutting.', category: 'kitchenware', price: 199, imageUrl: 'kitchenware.webp' },
        { id: 7, title: 'Remote Control Car', description: 'Experience high-speed off-road adventures with this remote control toy.', category: 'Toy', price: 499, imageUrl: 'toy.webp' },
        { id: 8, title: 'IKIGAI', description: 'The Japanese secret to a long and happy life.', category: 'Books', price: 99, imageUrl: 'book.webp' },

    ];
    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);
    const importProduct = async (product) => {
        setIsSubmitting(true);

        const formData = {
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            imageUrl: product.imageUrl,
            // Add other fields as needed, like targetAudience, features, etc.
        };

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Product imported successfully
                alert('Product imported successfully!');
                navigate('/dashboard'); // Redirect to the dashboard after success
            } else {
                const data = await res.json();
                alert(data.msg || 'Failed to import product.');
            }
        } catch (error) {
            alert('Error importing product. Please try again later.');
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <Header />
            <div className="examples-page">
                <h1>Explore Product Descriptions by Category</h1>
                <div className="product-grid">
                    {exampleProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            {product.imageUrl ? (
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
                            <div className="import-button">
                                {isLoggedIn ? (
                                    <button
                                        onClick={() => importProduct(product)}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Importing...' : 'Import to My Products'}
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/login')}>Login to Import</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
};

export default ExamplesPage;
