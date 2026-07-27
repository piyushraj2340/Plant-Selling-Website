import React from 'react';
import { Rating } from 'react-simple-star-rating';
import { Link, useNavigate } from 'react-router-dom';
import { transformImageUrl } from '../../../utils/imageUtils';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../../cart/cartSlice';
import { initCheckoutProcessAsync } from '../../checkout/checkoutSlice';
import { handelCalculatePricing } from './utils/productHelper';
import { message } from 'antd';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.data);

    // Strip HTML from description
    const rawDescription = product.description || '';
    const cleanDescription = rawDescription.replace(/<[^>]+>/g, '');

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent Link navigation
        if (!user) {
            message.warning("Please sign in to add plants to your cart!");
            return;
        }

        const pricing = handelCalculatePricing(1, product);

        const data = {
            user: user._id,
            nursery: product.nursery._id || product.nursery,
            plant: product._id,
            quantity: 1,
            pricing: {
                priceWithoutDiscount: pricing.totalPriceWithoutDiscount,
                priceAfterDiscount: pricing.actualPriceAfterDiscount,
                discount: product.discount,
                discountPrice: pricing.discountPrice
            }
        };

        dispatch(addToCartAsync(data));
        message.success("Added to cart!");
    };

    const handleBuyNow = (e) => {
        e.preventDefault(); // Prevent Link navigation
        if (!user) {
            message.warning("Please sign in to buy plants!");
            return;
        }

        const pricing = handelCalculatePricing(1, product);

        // Also add to cart behind the scenes as fallback
        const data = {
            user: user._id,
            nursery: product.nursery._id || product.nursery,
            plant: product._id,
            quantity: 1,
            pricing: {
                priceWithoutDiscount: pricing.totalPriceWithoutDiscount,
                priceAfterDiscount: pricing.actualPriceAfterDiscount,
                discount: product.discount,
                discountPrice: pricing.discountPrice
            }
        };
        dispatch(addToCartAsync(data));

        const checkoutData = {
            data: {
                cartOrProducts: [
                    {
                        plant: {
                            _id: product._id,
                            plantName: product.plantName,
                            images: product.images,
                            discount: product.discount,
                            price: product.price,
                        },
                        nursery: product.nursery._id || product.nursery,
                        quantity: 1
                    }
                ],
                pricing,
                shippingInfo: null
            },
            navigate
        };

        dispatch(initCheckoutProcessAsync(checkoutData));
    };

    return (
        <Link className='text-dark' style={{ textDecoration: "none", display: 'block', height: '100%' }} to={`/product/${product._id}`}>
            <div className="modern-product-card">
                <div className="card-img-wrapper">
                    <img src={transformImageUrl(product.images[0].url)} alt={product.plantName} />
                </div>
                <div className="card-body-content">
                    <div className="mb-2">
                        <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <i className="fas fa-tag me-1"></i>
                            {product.category ? (product.category.name || "N/A") : "N/A"}
                        </span>
                    </div>
                    <h4 className="plant-name">{product.plantName}</h4>

                    <p className="text-muted line-clamp-2" style={{ fontSize: "0.85rem", marginBottom: "12px", minHeight: "36px" }}>
                        {cleanDescription}
                    </p>

                    <div className="price-container">
                        <div className="d-flex flex-column">
                            <p className="plant-price mb-0">
                                ₹ {Math.round(product.price - (product.discount / 100 * product.price))}
                            </p>
                            {product.discount > 0 && (
                                <div className="d-flex align-items-center gap-2 mt-1">
                                    <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.85rem' }}>
                                        ₹ {product.price}
                                    </span>
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                                        {product.discount}% OFF
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="ratings-container">
                            <Rating
                                initialValue={product.ratings || 0}
                                readonly={true}
                                size={18}
                                allowFraction={true}
                            />
                            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>({product.numOfReviews || 0})</span>
                        </div>
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="card-hover-actions">
                    <button className="btn-action btn-add-cart" onClick={handleAddToCart} title="Add to Cart">
                        <i className="fas fa-shopping-cart"></i> Add
                    </button>
                    <button className="btn-action btn-buy-now" onClick={handleBuyNow} title="Buy Now">
                        <i className="fas fa-bolt"></i> Buy
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;

