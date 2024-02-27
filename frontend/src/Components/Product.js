import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import Animation from './Shared/Animation';
import { UserContext } from '../App';
import AddressList from './Shared/AddressList';
import noPlantsImage from '../Asset/img/noDataFound.jpg';
import FullScreenImageView from './Shared/FullScreenImageView';
import handelDataFetch from '../Controller/handelDataFetch';
import { Popover, message } from 'antd';

const Product = () => {

    const [product, setProduct] = useState(null);

    const [user, setUser] = useState(null);
    
    const [address, setAddress] = useState(null);
    const [addressList, setAddressList] = useState(null);
    const [viewAddressList, setViewAddressList] = useState(false);

    const [cart, setCart] = useState(null);
    const [cartQuantity, setCartQuantity] = useState(1);

    const [pricing, setPricing] = useState(null);

    const params = useParams();
    const productId = params.id;

    const [showAnimation, setShowAnimation] = useState(false);

    const [viewImgByIndex, setViewImgByIndex] = useState(0);

    const {isUserLogin, setCartLength } = useContext(UserContext);

    const navigate = useNavigate();

    const handleIsProductIsAddedToCart = async () => {
        try {
            const result = await handelDataFetch({ path: `/api/v2/checkout/isPlantsAddedToCart/${productId}`, method: "GET" }, setShowAnimation);

            if (result.status) {
                setCart(result.result);
                setCartQuantity(result.result.quantity);
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleGetAddedCart = async () => {
        try {
            const result = await handelDataFetch({ path: '/api/v2/checkout/carts', method: "GET" }, setShowAnimation);

            if (result.status) {
                setCartLength({ type: "CART", length: result.result.length });
            } else {
                setCartLength({ type: "CART", length: null });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handelGetDefaultAddress = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/user/default/address", method: "GET" }, setShowAnimation);

            if (result.status) {
                setAddress(result.result);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handelUserData = async () => {
        try {
            const result = await handelDataFetch({ path: '/api/v2/user/profile', method: "GET" }, setShowAnimation);

            if (result.status) {
                handleIsProductIsAddedToCart();
                handleGetAddedCart();
                handelGetDefaultAddress();
                setUser(result.result);
            } else {
                setCartLength({ type: "CART", length: null });
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handelCalculatePricing = (quantity, productObj = product) => {
        const totalPriceWithoutDiscount = (productObj.price * quantity).toFixed(2);
        const actualPriceAfterDiscount = (totalPriceWithoutDiscount - (totalPriceWithoutDiscount * productObj.discount / 100)).toFixed(2);
        const discountPrice = (totalPriceWithoutDiscount - actualPriceAfterDiscount).toFixed(2);
        const deliveryPrice = (actualPriceAfterDiscount) < 500 ? 90.00 : 0;

        const pricing = {
            totalPriceWithoutDiscount,
            actualPriceAfterDiscount,
            discountPrice,
            deliveryPrice, // calculate the delivery price dynamic
            totalPrice: (Number(actualPriceAfterDiscount) + Number(deliveryPrice)).toFixed(2)
        }
        setPricing(pricing);
    }

    const handelChangeQuantity = (e) => {
        const quantity = e.target.value;
        handelCalculatePricing(quantity);
        setCartQuantity(quantity);
    }

    const handleGetProductData = async () => {
        try {
            const result = await handelDataFetch({ path: `/api/v2/products/plant/${productId}`, method: "GET" }, setShowAnimation);

            if (result.status) {
                const quantity = cart && cart.quantity || 1;
                setCartQuantity(quantity);
                handelCalculatePricing(quantity, result.result);
                setProduct(result.result);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleGetProductData();
        isUserLogin && handelUserData();
    }, []);

    document.title = product ? product.plantName : "Plant info";

    const handelGetListOfAddress = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/user/address", method: "GET" }, setShowAnimation);

            if (result) {
                setAddressList(result.result);
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddToCart = async () => {
        if (!user) return;
        try {
            const cart = {
                plant: product._id,
                nursery: product.nursery,
                quantity: cartQuantity,
                pricing: {
                    priceWithoutDiscount: pricing.totalPriceWithoutDiscount,
                    priceAfterDiscount: pricing.actualPriceAfterDiscount,
                    discount: product.discount,
                    discountPrice: (Number(pricing.totalPriceWithoutDiscount) - Number(pricing.actualPriceAfterDiscount)).toFixed(2)
                }
            }
            const result = await handelDataFetch({ path: "/api/v2/checkout/carts", method: "POST", body: cart }, setShowAnimation);

            if (result.status) {
                setCart(result.result);
                handleGetProductData();
                handleGetAddedCart();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateCart = async () => {
        try {
            const result = await handelDataFetch({ path: `/api/v2/checkout/carts/${cart._id}`, method: "PATCH", body: { quantity: cartQuantity, addedAtPrice: Math.round(product.price - product.discount / 100 * product.price) } }, setShowAnimation);

            if (result.status) {
                handleIsProductIsAddedToCart();
            } else {
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

    const handelOpenAddressList = () => {
        if (!user) return;
        handelGetListOfAddress();
        setViewAddressList(!viewAddressList);
    }

    const handelBuyProduct = async () => {
        try {
            const data = {
                cartOrProducts: [
                    {
                        plant: {
                            _id: product._id,
                            plantName: product.plantName,
                            images: product.images,
                            discount: product.discount,
                            price: product.price,
                        },
                        nursery: product.nursery,
                        quantity: cartQuantity
                    }
                ],
                pricing,
                shippingInfo: address
            }

            const result = await handelDataFetch({ path: "/api/v2/checkout", method: "POST", body: data }, setShowAnimation);

            message.config({
                top: 100,
                maxCount: 3,
                CSSProperties: {
                    backgroundColor: "#000",
                    color: "#fff"
                }
            })



            if (result.status) {
                if (address) {
                    navigate("/checkout/confirm");
                } else {
                    navigate("/checkout/shipping");
                }
            } else {

                message.error("An error occurred during order processing");
            }

        } catch (error) {
            console.log(error);
        }
    }


    const loginAlertUI = (
        <div>
            <Link to={`/login/${product && '?redirect=/product/' + product._id}`} className='btn btn-sm btn-warning'>Login</Link>
        </div>
    )

    const alert = (title, content) => {
        return (
            <Popover content={loginAlertUI} title={title} trigger="click">
                {content}
            </Popover>
        )
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
                                                <div key={elem.public_id} onClick={() => setViewImgByIndex(index)} className="img border p-1 mt-1 mb-1">
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
                                    <small style={{ position: "relative", top: "5px", left: "3px" }}><Link to={`/nursery/public/view/${product.nursery._id}`} className='small link-secondary'><i className="fas fa-store"></i> {product.nursery.nurseryName}</Link></small>
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
                                    <sup>₹</sup> {pricing.actualPriceAfterDiscount}
                                </p>
                                <p className="text-muted small link-underline-hover" onClick={handelOpenAddressList}>
                                    {
                                        user ?
                                            <small><i className="fas fa-map-marker-alt"></i> {address ? `Deliver to ${address.name.substring(0, address.name.indexOf(" "))} - ${address.city} ${address.pinCode}` : <span>Select delivery location</span>}</small>
                                            :

                                            alert("Sign in to see your addresses", <span>Select delivery location</span>)
                                    }

                                </p>
                                <p className="text-muted">
                                    <small>Quantity: </small>
                                    <select onChange={(e) => { handelChangeQuantity(e) }} value={cartQuantity} style={{ margin: "0 0 0 4px" }} name="quantity" id="quantity">
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
                                        user && user._id === product.user ?
                                            < Link to={`/nursery/plant/update/${product._id}`} style={{ width: "100%" }} className='btn btn-primary'>Edit Your Plants</Link>
                                            :
                                            cart ?
                                                cart.quantity === cartQuantity ?
                                                    <Link style={{ width: "100%" }} to={`/cart`} className='btn btn-secondary'>Go To Cart</Link>
                                                    :
                                                    <button style={{ width: "100%" }} onClick={handleUpdateCart} className='btn btn-primary'>Update Your Cart</button>
                                                :
                                                user && < button onClick={handleAddToCart} style={{ width: "100%" }} className='btn btn-primary'>Add to Cart</button>

                                    }

                                    {
                                        !user &&

                                        alert("Sign in to add plants to cart", < button style={{ width: "100%" }} className='btn btn-primary'>Add to Cart</button>)
                                    }

                                </p>
                                <p className="card-text">
                                    {
                                        user ?
                                            !(user._id === product.user) && <button onClick={handelBuyProduct} style={{ width: "100%" }} className='btn btn-success'>Order Now</button>
                                            :
                                            alert("Sign in to buy this plant", <button style={{ width: "100%" }} className='btn btn-success'>Order Now</button>)
                                    }
                                </p>
                            </div>
                        </div>
                    </div >
                    :

                    // no product found
                    <div className="container mb-4 mb-md-5">
                        <div className="row">
                            <div className="d-flex justify-content-center">
                                <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                            </div>
                        </div>
                        <div className="row">
                            <div className="d-flex d-flex flex-column align-items-center">
                                <h3 className="h3" style={{ fontFamily: "cursive" }}>No Product Found</h3>
                                <Link to="/products" className='btn'><i className="fas fa-arrow-left"></i> Back To Products</Link>
                            </div>
                        </div>
                    </div>

            }

            {
                viewAddressList
                &&
                <AddressList addressList={addressList} setSelectedAddress={setSelectedAddress} setViewAddressList={setViewAddressList} viewAddressList={viewAddressList} redirect={`/${product && '?redirect=/product/' + product._id}`} />
            }
            {
                showAnimation && <Animation />
            }
        </>

    )
}

export default Product