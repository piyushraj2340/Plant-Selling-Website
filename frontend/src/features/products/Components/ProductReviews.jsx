import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviewsAsync, addProductReviewAsync } from '../productsSlice';
import { Rating } from 'react-simple-star-rating';
import { message } from 'antd';

const ProductReviews = ({ plantId }) => {
    const dispatch = useDispatch();
    const { productReviews, isLoading } = useSelector(state => state.products);
    const user = useSelector(state => state.user.user); // Assuming user is in state.user
    
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (plantId) {
            dispatch(getProductReviewsAsync(plantId));
        }
    }, [dispatch, plantId]);

    const handleRating = (rate) => {
        setRating(rate);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            message.warning("Please provide a rating before submitting.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const res = await dispatch(addProductReviewAsync({ plantId, rating, reviewText })).unwrap();
            if (res.status) {
                message.success(res.message || "Review submitted successfully and is pending approval.");
                setRating(0);
                setReviewText('');
            }
        } catch (error) {
            message.error(error.message || "Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="col-12 mt-5">
            <h4 className="h4 fw-bold border-bottom pb-2 mb-4">Customer Reviews</h4>
            
            <div className="row">
                <div className="col-md-7 mb-4">
                    {isLoading && <p>Loading reviews...</p>}
                    {!isLoading && productReviews.length === 0 && (
                        <p className="text-muted">No reviews yet. Be the first to review this plant!</p>
                    )}
                    
                    {productReviews.map(review => (
                        <div key={review._id} className="card border-0 border-bottom mb-3 pb-3 rounded-0">
                            <div className="d-flex align-items-center mb-2">
                                <div className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px', fontSize: '18px' }}>
                                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">{review.user?.name || 'Anonymous'}</h6>
                                    <Rating initialValue={review.rating} readonly={true} size={16} />
                                </div>
                                {review.isBuyer && (
                                    <span className="badge bg-success ms-auto d-flex align-items-center">
                                        <i className="fas fa-check-circle me-1"></i> Verified Buyer
                                    </span>
                                )}
                            </div>
                            {review.review && <p className="mb-0 mt-2 text-muted">{review.review}</p>}
                        </div>
                    ))}
                </div>

                <div className="col-md-5">
                    <div className="bg-light p-4 rounded border">
                        <h5 className="h5 mb-3">Write a Review</h5>
                        {user ? (
                            <form onSubmit={submitReview}>
                                <div className="mb-3">
                                    <label className="form-label d-block text-muted mb-1">Your Rating</label>
                                    <Rating
                                        onClick={handleRating}
                                        initialValue={rating}
                                        size={25}
                                        allowFraction={false}
                                        transition
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="reviewText" className="form-label text-muted">Your Review (Optional)</label>
                                    <textarea 
                                        className="form-control" 
                                        id="reviewText" 
                                        rows="4" 
                                        placeholder="What did you like or dislike?"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted mb-2">You must be logged in to write a review.</p>
                                <a href="/login" className="btn btn-outline-success btn-sm px-4">Login</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
