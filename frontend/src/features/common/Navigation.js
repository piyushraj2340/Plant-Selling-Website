import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Navigation = () => {
    const cartLength = useSelector((state) => state.cart.cartLength);
    const user = useSelector(state => state.user.user);

    const [viewSearchFilter, setViewSearchFilter] = useState(false);
    const [navBarToggle, setNavBarToggle] = useState(false);

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

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top w-100">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/"><img src={logoImg} alt="plant seller logo" className='logo-img' /></Link>
                <button ref={toggleNavBarRef} className="navbar-toggler" type="button" onClick={() => setNavBarToggle(!navBarToggle)} >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div ref={dropdownNavBarRef} className={`collapse navbar-collapse justify-content-around transition ${navBarToggle? "show " : ""}`}>
                    <div className="d-flex col-md-5 col-lg-7">
                        <div className="input-group">
                            <div className="dropdown">
                                <button id="filerSearch" ref={toggleSearchFilterButtonRef} type="button" className="btn btn-info dropdown-toggle" style={{ borderRadius: "0.375rem 0 0 0.375rem" }} onClick={() => { setViewSearchFilter(!viewSearchFilter) }}>
                                    <i className='fas fa-filter'></i> <span className='d-md-none d-lg-inline-block'>Filter</span>
                                </button>
                                <div className={`dropdown-menu p-2 ${viewSearchFilter && 'd-block'} `} ref={dropdownSearchFilterRef} >
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="allProducts" id="allProducts" className='form-check-input' />
                                        <label htmlFor="allProducts" className='form-check-label '>All Products</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="flower" id="flower" className='form-check-input' />
                                        <label htmlFor="flower" className='form-check-label '>Flowering</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="medicinal" id="medicinal" className='form-check-input' />
                                        <label htmlFor="medicinal" className='form-check-label '>Medicinal</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="ornamental" id="ornamental" className='form-check-input' />
                                        <label htmlFor="ornamental" className='form-check-label '>Ornamental</label>
                                    </div>
                                    <div className="form-check font-weight-bold">
                                        <input type="checkbox" name="indoor" id="indoor" className='form-check-input' />
                                        <label htmlFor="indoor" className='form-check-label '>Indoor</label>
                                    </div>
                                </div>
                            </div>
                            <input className="form-control border-none" type="text" placeholder="Search Keywords" style={{ boxShadow: "none" }} />
                            <button className="btn btn-info" type="button"><i className='fas fa-search'></i></button>
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
                                <span style={{ fontSize: "10px", position: "absolute", top: "0px", left: "18px" }} className='badge bg-success'>{cartLength??0}</span>
                                <span> Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navigation


