import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import Animation from './Shared/Animation';
import { UserContext } from '../App';
import AddressList from './Shared/AddressList';
import noPlantsImage from '../Asset/img/noDataFound.jpg';
import FullScreenImageView from './Shared/FullScreenImageView';
import handelDataFetch from '../Controller/handelDataFetch';

const Product = () => {

    const [cart, setCart] = useState(null);
    const [cartQuantity, setCartQuantity] = useState(1);
    const [address, setAddress] = useState(null);
    const [addressList, setAddressList] = useState(null);
    const [viewAddressList, setViewAddressList] = useState(false);

    const params = useParams();
    const productId = params.id;

    const [product, setProduct] = useState(null);
    const [nurseryName, setNurseryName] = useState("store name");

    const [showAnimation, setShowAnimation] = useState(false);

    const [viewImgByIndex, setViewImgByIndex] = useState(0);

    const { setCartLength } = useContext(UserContext);

    const handleIsProductIsAddedToCart = async () => {
        try {
            const result = await handelDataFetch({ path: `/api/v2/isAddedCart/${productId}`, method: "GET" }, setShowAnimation);

            if (result.status) {
                setCart(result.result);
                setCartQuantity(result.result.quantity);
                setCartLength({ type: "CART", length: result.result.length });
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleGetProductData = async () => {
        try {
            const result = await handelDataFetch({path: `/api/v2/products/plant/${productId}`, method: "GET"}, setShowAnimation);

            if (result.status) {
                setProduct(result.result);
                setNurseryName(result.result.nurseryName);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getDefaultAddress = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/default/address", method: "GET" }, setShowAnimation);

            if (result.status) {
                setAddress(result.result);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        handleIsProductIsAddedToCart();
        handleGetProductData();
        getDefaultAddress();
    }, []);

    const getListOfAddress = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/address", method: "GET" }, setShowAnimation);

            if (result) {
                setAddressList(result.result);
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleAddToCart = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/cart", method: "POST", body: { plant: product._id, quantity: cartQuantity, addedAtPrice: Math.round(product.price - product.discount / 100 * product.price) } }, setShowAnimation);

            if (result.status) {
                setCart(result.result);
                setCartLength({ type: "CART", length: result.result.length });
            } else {
                setCartLength({ type: "CART", length: null });
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateCart = async () => {
        try {
            const result = await handelDataFetch({ path: `/api/v2/cart/${cart._id}`, method: "PATCH", body: { quantity: cartQuantity, addedAtPrice: Math.round(product.price - product.discount / 100 * product.price) } }, setShowAnimation);

            if (result.status) {
                handleIsProductIsAddedToCart();
                setCartLength({ type: "CART", length: result.result.length });
            } else {
                setCartLength({ type: "CART", length: null });
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setSelectedAddress = (_id) => {
        let address = addressList.filter((elem) => {
            return elem._id === _id;
        });
        setAddress(address[0]);
        setViewAddressList(!viewAddressList);
    }


    return (
        <>

            {
                product ?
                    <div className='container mt-3 p-2 bg-light'>
                        <div className="row">
                            <div className="col-lg-4 p-2 p-lg-0 d-flex flex-column flex-column-reverse align-items-center align-items-md-start flex-md-row p-0">
                                <div className="plant-side-img d-flex flex-md-column col-md-2">
                                    {
                                        product.images.map((elem, index) => {
                                            return (
                                                <div key={index} onClick={() => setViewImgByIndex(index)} className="img border p-1 mt-1 mb-1">
                                                    <img className='img-fluid' src={elem.url} alt="Plants" />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <div className="col-md-10 plant-slide-img p-1">
                                    <div className="img border">
                                        <img className='img-fluid' src={product.images[viewImgByIndex].url} alt="product" width="100%" height="350px" data-toggle="modal" data-target="#plant-img-full-size" />
                                    </div>

                                    <FullScreenImageView img={product.images[viewImgByIndex].url} id="plant-img-full-size" />
                                </div>
                            </div>
                            <div className="col-lg-5 ps-4 mt-3">
                                <div className="row">
                                    <h3 className='h3 mb-0'>{product.plantName}</h3>
                                    <small style={{ position: "relative", top: "9px", left: "3px" }}><Link to={`/nursery/public/view/${product.nursery}`} className='small link-secondary'><i className="fas fa-store"></i> {nurseryName}</Link></small>
                                    <p className="card-text">
                                        <Rating initialValue={3 + Math.random() * 2} readonly={true} size={20} allowFraction={true} />
                                        <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                                            <Link to={'/rating-link'}>{Math.floor(Math.random() * 200)} ratings</Link>
                                        </small>
                                        <span style={{ position: "relative", top: "3px" }}>|</span>
                                        <small className='ps-2 pe-2' style={{ position: "relative", top: "4px" }}>
                                            <Link to={'/rating-link'}>{Math.floor(Math.random() * 200)} answered questions</Link>
                                        </small>
                                    </p>
                                    <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>
                                        Price : <small className='text-decoration-line-through'>₹ {product.price}</small>
                                    </p>
                                    <p className="card-text h3">
                                        <span className="text-success">-{product.discount}%</span> <sup>₹</sup>{Math.round(product.price - product.discount / 100 * product.price)}
                                    </p>
                                    <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Category</p>
                                    <p className="card-text">{product.category}</p>
                                    <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Description</p>
                                    <p className="card-text">{product.description}</p>
                                </div>
                            </div>
                            <div className="col-lg-3 p-4 mt-3 border">
                                <p className="card-text h6">
                                    <span className="text-success">In Stock</span>
                                </p>
                                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Total: </p>
                                <p className="card-text h3">
                                    <sup>₹</sup>{
                                        cart ?
                                            Math.round(product.price - product.discount / 100 * product.price) * cart.quantity
                                            :
                                            Math.round(product.price - product.discount / 100 * product.price) * 1
                                    }
                                </p>
                                <p className="text-muted small link-underline-hover" onClick={() => { getListOfAddress(); setViewAddressList(!viewAddressList) }}>
                                    <small><i className="fas fa-map-marker-alt"></i> {address ? `Deliver to ${address.name.substring(0, address.name.indexOf(" "))} - ${address.city} ${address.pinCode}` : "Select delivery location"}</small>
                                </p>
                                <p className="text-muted">
                                    <small>Quantity: </small>
                                    <select onChange={(e) => { setCartQuantity(Number(e.target.value)) }} value={cart ? cart.quantity : cartQuantity} style={{ margin: "0 0 0 4px" }} name="quantity" id="quantity">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </select>
                                </p>
                                <p className="card-text">
                                    {
                                        cart ?
                                            cart.quantity === cartQuantity ?
                                                <Link style={{ width: "100%" }} to={`/cart`} className='btn btn-secondary'>Go To Cart</Link>
                                                :
                                                <button style={{ width: "100%" }} onClick={handleUpdateCart} className='btn btn-primary'>Update Your Cart</button>
                                            :
                                            <button style={{ width: "100%" }} onClick={handleAddToCart} className='btn btn-primary'>Add to Cart</button>
                                    }
                                </p>
                                <p className="card-text">
                                    <button style={{ width: "100%" }} className='btn btn-success'>Order Now</button>
                                </p>
                            </div>
                        </div>
                    </div>
                    :


                    <div className="container">
                        <div className="row">
                            <div className="img d-flex justify-content-center">
                                <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                            </div>
                        </div>
                        <div className="row">
                            <div className="d-flex d-flex flex-column align-items-center">
                                <h3 className="h3" style={{ fontFamily: "cursive" }}>No Product Found</h3>
                                <Link to="/products"><i className="fas fa-arrow-left"></i> Back To Products</Link>
                            </div>
                        </div>
                    </div>

            }

            {
                viewAddressList
                &&
                <AddressList addressList={addressList} setSelectedAddress={setSelectedAddress} setViewAddressList={setViewAddressList} viewAddressList={viewAddressList} />
            }
            {
                showAnimation && <Animation />
            }
        </>

    )
}

export default Product