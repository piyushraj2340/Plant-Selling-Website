import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAsync, getProductsByCategoryAsync, searchProductsAsync } from '../productsSlice';
import { transformImageUrl } from '../../../utils/imageUtils';

const Products = () => {
    const products = useSelector((state) => state.products.products);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const searchKeyword = queryParams.get('search');
    const category = queryParams.get('category');
    const categoryList = category ? category.split(',') : [];

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";

    useEffect(() => {
        if (!searchKeyword && !category) {
            // Case 1: /products
            dispatch(getAllProductsAsync());
        } else if (category && !searchKeyword) {
            // Case 2: /products/?category='some category'
            if(categoryList.length === 1 && category === 'all') {
                dispatch(getAllProductsAsync());
            } else {
                dispatch(getProductsByCategoryAsync(category));
            }
        } else if (searchKeyword && !category) {
            // Case 3: /products/?search='some keyword'
            dispatch(searchProductsAsync({ search: searchKeyword, category: null }));
        } else if (searchKeyword && category) {
            // Case 4: /products/?search='some keyword'&category='some category'
            dispatch(searchProductsAsync({ search: searchKeyword, category }));
        }
    }, [location.search, dispatch]);

    const handelSearchProductsByCategory = (category) => {
        if(category === 'all' && categoryList.length === 0 && category === 'all') {
            navigate(`/products`);
        } else {
            let query;
            if(category === 'all') {
                query = 'all';
            }else if (categoryList.includes(category)) {
                query = categoryList.filter((cat) => cat !== category);
            } else {
                query = [...categoryList.filter((cat) => cat !== 'all'), category];
            }
            navigate(`/products/?category=${query}`);
        }
    }

    return (
        <div className="container product-container mb-4 mb-md-5">
            <div className="p-2">
                <h1 className='text-center p-2'>Available Plants for Sell</h1>
            </div>
            <div className="p-2 d-flex flex-wrap justify-content-center align-item-center">
                <button onClick={() => handelSearchProductsByCategory("all")} className={`btn ${categoryList.includes('all') ? 'btn-primary' : 'btn-secondary'} m-1`}>All</button>
                <button onClick={() => handelSearchProductsByCategory("flowering-plants")} className={`btn ${categoryList.includes('flowering-plants') || categoryList.includes('all') ? 'btn-primary' : 'btn-secondary'} btn-primary m-1`}>Flowering Plants</button>
                <button onClick={() => handelSearchProductsByCategory("medicinal-plants")} className={`btn ${categoryList.includes('medicinal-plants') || categoryList.includes('all') ? 'btn-primary' : 'btn-secondary'} m-1`}>Medicinal Plants</button>
                <button onClick={() => handelSearchProductsByCategory("ornamental-plants")} className={`btn ${categoryList.includes('ornamental-plants') || categoryList.includes('all') ? 'btn-primary' : 'btn-secondary'} m-1`}>Ornamental Plants</button>
                <button onClick={() => handelSearchProductsByCategory("indoor-plants")} className={`btn ${categoryList.includes('indoor-plants') || categoryList.includes('all') ? 'btn-primary' : 'btn-secondary'} m-1`}>Indoor Plants</button>
            </div>
            <div className="product-content px-2">
                {
                    products &&
                    products.map((elem) => {
                        return (
                            <div key={elem._id} className="px-1 d-flex center-text overflow-hidden">
                                <Link className='text-dark' style={{ textDecoration: "none" }} to={`/product/${elem._id}`}>
                                    <div className="card my-1">
                                        <img className="img-fluid" src={transformImageUrl(elem.images[0].url)} alt="Card plants" />
                                        <div className="card-body">
                                            <h4 className="card-title">{elem.plantName}</h4>
                                            <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>price</p>
                                            <p className="card-text">₹ {Math.round(elem.price - elem.discount / 100 * elem.price)}</p>
                                            <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>category</p>
                                            <p className="card-text">{elem.category}</p>
                                            <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>ratings</p>
                                            <p className="card-text">
                                                <Rating
                                                    initialValue={3 + Math.random() * 2}
                                                    readonly={true}
                                                    size={20}
                                                    allowFraction="true"
                                                />
                                                <small style={{ position: "relative", top: "4px" }}>{elem.noOfRatings}</small>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                }
            </div>
            <div className="w-100">
                {
                    products.length === 0 &&
                    <div className="d-flex justify-content-center">
                        <div className=''>
                            <div className="row">
                                <div className="img d-flex justify-content-center">
                                    <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex d-flex flex-column align-items-center">
                                    <h3 className="h3" style={{ fontFamily: "cursive" }}>No Product Found</h3>
                                    <Link onClick={() => window.location.reload()}><i className="fa fa-refresh"></i> Refresh Your Page</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Products;
