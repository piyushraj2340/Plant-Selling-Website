import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAsync } from '../productsSlice';
import { getAllCategoriesAsync } from '../../category/categorySlice';
import { transformImageUrl } from '../../../utils/imageUtils';
import { Pagination, Select } from 'antd';

const Products = () => {
    const { products, pagination } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.category);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const searchKeyword = queryParams.get('search');
    const category = queryParams.get('category');
    const sort = queryParams.get('sort') || 'recommended';
    const page = parseInt(queryParams.get('page') || '1', 10);
    const categoryList = category ? category.split(',') : [];

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";

    useEffect(() => {
        dispatch(getAllCategoriesAsync({ status: 'Active' }));
        
        const query = {};
        if (searchKeyword) query.search = searchKeyword;
        if (category) query.category = category;
        if (sort) query.sort = sort;
        if (page) query.page = page;

        dispatch(getAllProductsAsync(query));
    }, [location.search, dispatch]);

    const updateUrlParams = (key, value) => {
        const newParams = new URLSearchParams(location.search);
        if (value && value !== 'all') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== 'page') newParams.set('page', '1'); // Reset to page 1 on filter change
        navigate(`/products/?${newParams.toString()}`);
    };

    const handelSearchProductsByCategory = (catId) => {
        if(catId === 'all') {
            updateUrlParams('category', 'all');
        } else {
            let newCatList;
            if (categoryList.includes(catId)) {
                newCatList = categoryList.filter((cat) => cat !== catId);
            } else {
                newCatList = [...categoryList.filter((cat) => cat !== 'all'), catId];
            }
            updateUrlParams('category', newCatList.join(','));
        }
    }

    const handleSortChange = (value) => {
        updateUrlParams('sort', value);
    };

    const handlePageChange = (page) => {
        updateUrlParams('page', page);
    };

    return (
        <div className="container product-container mb-4 mb-md-5">
            <div className="p-2 d-flex justify-content-between align-items-center flex-wrap">
                <h1 className='text-center p-2 mb-0'>Available Plants for Sell</h1>
                <div className="d-flex align-items-center">
                    <span className="me-2 fw-bold">Sort By:</span>
                    <Select value={sort} onChange={handleSortChange} style={{ width: 160 }}>
                        <Select.Option value="recommended">Recommended</Select.Option>
                        <Select.Option value="price_asc">Price: Low to High</Select.Option>
                        <Select.Option value="price_desc">Price: High to Low</Select.Option>
                        <Select.Option value="name_asc">Name: A to Z</Select.Option>
                        <Select.Option value="name_desc">Name: Z to A</Select.Option>
                        <Select.Option value="newest">Newest Arrivals</Select.Option>
                    </Select>
                </div>
            </div>
            <div className="p-2 d-flex flex-wrap justify-content-center align-item-center">
                <button onClick={() => handelSearchProductsByCategory("all")} className={`btn ${categoryList.includes('all') ? 'btn-primary' : 'btn-secondary'} m-1`}>All</button>
                {categories && categories.map(cat => (
                    <button key={cat._id} onClick={() => handelSearchProductsByCategory(cat._id)} className={`btn ${categoryList.includes(cat._id) || categoryList.includes('all') ? 'btn-primary' : 'btn-secondary'} m-1`}>
                        {cat.name}
                    </button>
                ))}
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
                                            <p className="card-text">{elem.category ? elem.category.name : "N/A"}</p>
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
            {pagination && pagination.totalProducts > 0 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        current={pagination.currentPage}
                        total={pagination.totalProducts}
                        pageSize={pagination.limit}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
            <div className="w-100 mt-4">
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
