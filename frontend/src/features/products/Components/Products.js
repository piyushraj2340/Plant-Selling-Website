import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAsync } from '../productsSlice';
import { getAllCategoriesAsync } from '../../category/categorySlice';
import { transformImageUrl } from '../../../utils/imageUtils';
import { Pagination, Select } from 'antd';
import ProductCard from './ProductCard';
import Animation from '../../common/Animation';

const Products = () => {
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('productViewMode') || 'grid';
    });
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('productViewMode', mode);
    };

    const { products, pagination, isLoading } = useSelector((state) => state.products);
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
        if (catId === 'all') {
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
                <h1 className='text-center p-0 md:p-2 mb-2 md:mb-0'>Available Plants for Sell</h1>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <span className="me-2 fw-bold">Sort By:</span>
                        <Select value={sort} onChange={handleSortChange} style={{ width: 160 }} className="me-3">
                            <Select.Option value="recommended">Recommended</Select.Option>
                            <Select.Option value="price_asc">Price: Low to High</Select.Option>
                            <Select.Option value="price_desc">Price: High to Low</Select.Option>
                            <Select.Option value="name_asc">Name: A to Z</Select.Option>
                            <Select.Option value="name_desc">Name: Z to A</Select.Option>
                            <Select.Option value="newest">Newest Arrivals</Select.Option>
                        </Select>
                    </div>


                    <div className="view-toggle-group">
                        <button
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => handleViewModeChange('grid')}
                            title="Grid View"
                        >
                            <span className="material-symbols-outlined">grid_view</span>
                        </button>
                        <button
                            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => handleViewModeChange('list')}
                            title="List View"
                        >
                            <span className="material-symbols-outlined">view_list</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="category-chip-container">
                <button onClick={() => handelSearchProductsByCategory("all")} className={`category-chip-btn ${categoryList.includes('all') || categoryList.length === 0 ? 'active' : ''}`}>All</button>
                {categories && categories.map(cat => (
                    <button key={cat._id} onClick={() => handelSearchProductsByCategory(cat._id)} className={`category-chip-btn ${categoryList.includes(cat._id) && !categoryList.includes('all') ? 'active' : ''}`}>
                        {cat.name}
                    </button>
                ))}
            </div>
            <div className={`px-2 mt-4 ${viewMode === 'grid' ? 'product-grid-layout' : 'product-list-layout'}`}>
                {
                    products &&
                    products.map((elem) => (
                        <div key={elem._id}>
                            <ProductCard product={elem} />
                        </div>
                    ))
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
                    isLoading ? <Animation /> :
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
