import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSimilarProductsAsync } from '../productsSlice';
import ProductCard from './ProductCard';

const SimilarProducts = ({ categoryId, currentProductId }) => {
    const dispatch = useDispatch();
    const similarProducts = useSelector(state => state.products.similarProducts);

    useEffect(() => {
        if (categoryId) {
            dispatch(getSimilarProductsAsync(categoryId));
        }
    }, [dispatch, categoryId]);

    if (!similarProducts || similarProducts.length === 0) {
        return null;
    }

    const filteredProducts = similarProducts.filter(p => p._id !== currentProductId);

    if (filteredProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-5 mb-5 px-3">
            <h5 className="text-muted border-bottom pb-2 mb-4" style={{ fontSize: "18px", fontWeight: "600" }}>Similar Products</h5>
            <div 
                className="d-flex gap-4 similar-products-container" 
                style={{ 
                    overflowX: "auto", 
                    scrollSnapType: "x mandatory", 
                    paddingBottom: "1rem",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch"
                }}
            >
                <style>{`
                    .similar-products-container::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {filteredProducts.map(product => (
                    <div 
                        key={product._id} 
                        style={{ 
                            minWidth: "280px", 
                            maxWidth: "280px", 
                            scrollSnapAlign: "start",
                            flex: "0 0 auto"
                        }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;
