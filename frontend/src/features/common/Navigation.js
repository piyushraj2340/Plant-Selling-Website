import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import useUserData from '../../hooks/useUserData';

const Navigation = () => {
    const cartLength = useSelector((state) => state.cart.cartLength);
    const {userData:user} = useUserData();

    const [viewSearchFilter, setViewSearchFilter] = useState(false);
    const [navBarToggle, setNavBarToggle] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const toggleSearchFilterButtonRef = useRef(null);
    const dropdownSearchFilterRef = useRef(null);
    const toggleNavBarRef = useRef(null);
    const dropdownNavBarRef = useRef(null);

    const logoImg = 'https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/plant_seller_bg_none';

    useEffect(() => {
        // Close menu when clicking outside of the menu area
        const handleCloseSearchFilter = (event) => {
            if (dropdownSearchFilterRef.current && !dropdownSearchFilterRef.current.contains(event.target) && toggleSearchFilterButtonRef.current && !toggleSearchFilterButtonRef.current.contains(event.target)) {
                setViewSearchFilter(false);
            }
        };

        const handleCloseNavBarMenu = (event) => {
            if (toggleNavBarRef.current && !toggleNavBarRef.current.contains(event.target) && dropdownNavBarRef.current && !dropdownNavBarRef.current.contains(event.target)) {
                setNavBarToggle(false);
            }
        };

        document.addEventListener('click', handleCloseSearchFilter);
        document.addEventListener('click', handleCloseNavBarMenu);

        return () => {
            document.removeEventListener('click', handleCloseSearchFilter);
            document.removeEventListener('click', handleCloseNavBarMenu);
        };
    }, []);

    useEffect(() => {
        // Extract the category query parameter and update the selected categories
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category');
        if (category) {
            setSelectedCategories(category.split(','));
        } else {
            setSelectedCategories([]);
        }
    }, [location.search]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) => {
            if (category === 'all') {
                return prev.includes('all') ? [] : ['all'];
            } else {
                if (prev.includes(category)) {
                    return prev.filter((cat) => cat !== category);
                } else {
                    return [...prev.filter((cat) => cat !== 'all'), category];
                }
            }
        });
    };

    // Function to handle the search query generation
    const handelSearchProduct = () => {
        const categoryString = selectedCategories.join(',') || 'all';
        const query = `/products/?search=${encodeURIComponent(searchKeyword)}&category=${encodeURIComponent(categoryString)}`;
        if (searchKeyword.trim()) {
            setNavBarToggle(false);
            navigate(query);
        } else {
            message.error('Empty search keyword');
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handelSearchProduct();
        }
    };

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top w-100">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><img src={logoImg} alt="plant seller logo" className='logo-img' /></Link>
                <button ref={toggleNavBarRef} className="navbar-toggler" type="button" onClick={() => setNavBarToggle(!navBarToggle)} >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div ref={dropdownNavBarRef} className={`collapse navbar-collapse justify-content-around transition ${navBarToggle ? "show " : ""}`}>
                    <div className="d-flex col-md-5 col-lg-7">
                        <div className="input-group">
                            <div className="dropdown">
                                <button id="filerSearch" ref={toggleSearchFilterButtonRef} type="button" className="btn btn-info dropdown-toggle" style={{ borderRadius: "0.375rem 0 0 0.375rem" }} onClick={() => { setViewSearchFilter(!viewSearchFilter) }}>
                                    <i className='fas fa-filter'></i> <span className='d-md-none d-lg-inline-block'>Filter</span>
                                </button>
                                <div className={`dropdown-menu p-2 ${viewSearchFilter && 'd-block'} `} ref={dropdownSearchFilterRef} >
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="allProducts" id="allProducts" className='form-check-input' onChange={() => handleCategoryChange('all')} checked={selectedCategories.includes('all')} />
                                        <label htmlFor="allProducts" className='form-check-label '>All Products</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="flower" id="flower" className='form-check-input' onChange={() => handleCategoryChange('flowering-plants')} checked={selectedCategories.includes('flowering-plants') || selectedCategories.includes('all')}/>
                                        <label htmlFor="flower" className='form-check-label '>Flowering</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="medicinal" id="medicinal" className='form-check-input' onChange={() => handleCategoryChange('medicinal-plants')} checked={selectedCategories.includes('medicinal-plants') || selectedCategories.includes('all')}/>
                                        <label htmlFor="medicinal" className='form-check-label '>Medicinal</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="ornamental" id="ornamental" className='form-check-input' onChange={() => handleCategoryChange('ornamental-plants')} checked={selectedCategories.includes('ornamental-plants') || selectedCategories.includes('all')}/>
                                        <label htmlFor="ornamental" className='form-check-label '>Ornamental</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="indoor" id="indoor" className='form-check-input' onChange={() => handleCategoryChange('indoor-plants')} checked={selectedCategories.includes('indoor-plants') || selectedCategories.includes('all')} />
                                        <label htmlFor="indoor" className='form-check-label '>Indoor</label>
                                    </div>
                                </div>
                            </div>
                            <input
                                className="form-control border-none"
                                type="search"
                                placeholder="Search Keywords"
                                style={{ boxShadow: "none" }}
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn btn-info" type="button" onClick={handelSearchProduct}>
                                <i className='fas fa-search'></i>
                            </button>
                        </div>
                    </div>
                    <div className="navbar-nav d-flex justify-content-end">
                        <div className="nav-item">
                            <Link className="nav-link d-flex" to="/products" onClick={() => setNavBarToggle(false)}>Products</Link>
                        </div>
                        <div className="nav-item">
                            <Link className="nav-link" to="/contact-us" onClick={() => setNavBarToggle(false)}>Contact Us</Link>
                        </div>
                        <div className="nav-item">
                            <Link className="nav-link" to={`${user ? "/profile" : "/login"}`} onClick={() => setNavBarToggle(false)}><i className='fas fa-user-alt'></i>{user ? " Profile" : " Login"}</Link>
                        </div>
                        <div className="nav-item">
                            <Link style={{ position: "relative" }} className="nav-link" to="/cart" onClick={() => setNavBarToggle(false)}>
                                <i style={{ fontSize: "23px" }} className="fas fa-shopping-cart small"> </i>
                                <span style={{ fontSize: "10px", position: "absolute", top: "0px", left: "18px" }} className='badge bg-success'>{cartLength ?? 0}</span>
                                <span> Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default React.memo(Navigation);
