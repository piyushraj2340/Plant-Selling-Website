import { Popover } from 'antd';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import AddressList from '../../../Components/Shared/AddressList';
import { handelCalculatePricing } from './utils/productHelper';
import { calculateProductPricing } from '../productsSlice';
import { useSelector, useDispatch } from 'react-redux';

const ProductSummary = () => {
    const product = useSelector((state) => state.products.product);
    const pricing = useSelector((state) => state.products.productPricing);
    const user = useSelector((state) => state.user);
    const addressList = useSelector((state) => state.address);
    const cart = useSelector((state) => state.cart);
    
    const dispatch = useDispatch();
    
    const [cartQuantity, setCartQuantity] = useState(1);
    const [viewAddressList, setViewAddressList] = useState(false);
    
    useEffect( () => {
        const pricing = handelCalculatePricing(cartQuantity, product);
        dispatch(calculateProductPricing(pricing));
    }, [])

    const handelChangeQuantity = (e) => {
        const quantity = e.target.value;
        const pricing = handelCalculatePricing(quantity, product);
        dispatch(calculateProductPricing(pricing));
        setCartQuantity(quantity);
    }
    const handelOpenAddressList = () => {
        if (!user) return;
        setViewAddressList(!viewAddressList);
    }
    const address = null;
    
    const handleAddToCart = () => { }
    const handelBuyProduct = () => { }
    const handleUpdateCart = () => { }

    const setSelectedAddress = (_id) => {
        let address = addressList.filter((elem) => {
            return elem._id === _id;
        });
        // setAddress(address[0]);
        setViewAddressList(!viewAddressList);
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
            <div className="col-lg-3 p-4 mt-3 border">
                <p className="card-text h6">
                    <span className="text-success">In Stock</span>
                </p>
                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>Total: </p>
                <p className="card-text h3">
                    <sup>₹</sup> {pricing ? pricing.actualPriceAfterDiscount : 0}
                </p>
                <p className="text-muted small link-underline-hover" onClick={handelOpenAddressList}>
                    {
                        user ?
                            <small><i className="fas fa-map-marker-alt"></i> {address ? `Deliver to ${address.name.substring(0, address.name.indexOf(" "))} - ${address.city} ${address.pinCode}` : <span>Select delivery location</span>}</small>
                            :

                            alert("Sign in to see your addresses", <p><i className="fas fa-map-marker-alt"></i> Select delivery location</p>)
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

            {
                viewAddressList
                &&
                <AddressList addressList={addressList} setSelectedAddress={setSelectedAddress} setViewAddressList={setViewAddressList} viewAddressList={viewAddressList} redirect={`/${product && '?redirect=/product/' + product._id}`} />
            }
        </>

    )
}

export default ProductSummary