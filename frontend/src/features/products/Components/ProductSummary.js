import { Popover, message } from 'antd';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AddressList from '../../common/AddressList';
import { handelCalculatePricing } from './utils/productHelper';
import { calculateProductPricing } from '../productsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedAddress, addressListDataFetchAsync } from '../../address/addressSlice';
import { addToCartAsync, cartDataUpdateQuantityAsync, setSelectedCart } from '../../cart/cartSlice';
import { initCheckoutProcessAsync } from '../../checkout/checkoutSlice';

const ProductSummary = () => {
    const product = useSelector((state) => state.products.product);
    const pricing = useSelector((state) => state.products.productPricing);
    const user = useSelector((state) => state.user.user);
    const addressList = useSelector((state) => state.address.addressList);
    const selectedAddress = useSelector((state) => state.address.selectedAddress);
    const cartsList = useSelector((state) => state.cart.carts);
    const cart = useSelector((state) => state.cart.selectedCart);

    const dispatch = useDispatch();

    const [cartQuantity, setCartQuantity] = useState(cart ? cart.quantity : 1);
    const [viewAddressList, setViewAddressList] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            !addressList.length && dispatch(addressListDataFetchAsync());
        }
    }, [dispatch, user])

    useEffect(() => {
        addressList.length && dispatch(setSelectedAddress(addressList[0]));
    }, [dispatch, addressList])

    useEffect(() => {
        const findCart = cartsList.find(cart => cart.plant._id === product._id);
        dispatch(setSelectedCart(findCart));
        setCartQuantity(findCart ? findCart.quantity : 1);
    }, [dispatch, product, cartsList])

    useEffect(() => {
        const pricing = handelCalculatePricing(cartQuantity, product);
        dispatch(calculateProductPricing(pricing));
    }, [product, cartQuantity])

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

    const handleAddToCart = () => {
        const data = {
            user: user._id,
            nursery: product.nursery._id,
            plant: product._id,
            quantity: cartQuantity,
            pricing: {
                priceWithoutDiscount: pricing.totalPriceWithoutDiscount,
                priceAfterDiscount: pricing.actualPriceAfterDiscount,
                discount: product.discount,
                discountPrice: (Number(pricing.totalPriceWithoutDiscount) - Number(pricing.actualPriceAfterDiscount)).toFixed(2)
            }
        }
        dispatch(addToCartAsync(data));
    }
    const handelBuyProduct = () => {
        !cart && handleAddToCart();
        const data = {
            data: {
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
                shippingInfo: selectedAddress
            },
            navigate
        }

        dispatch(initCheckoutProcessAsync(data));
    }

    const handleUpdateCart = () => {
        if (cart) {
            console.log("cart " + cart);
            dispatch(cartDataUpdateQuantityAsync({ cartId: cart._id, quantity: cartQuantity }));
        } else {
            message.error("Plant not added into the cart.")
        }
    }

    const handelSelectedAddress = (_id) => {
        let address = addressList.find((elem) => {
            return elem._id === _id;
        });
        dispatch(setSelectedAddress(address));
        setViewAddressList(!viewAddressList)
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
                            <small><i className="fas fa-map-marker-alt"></i> {selectedAddress ? `Deliver to ${selectedAddress.name.substring(0, selectedAddress.name.indexOf(" "))} - ${selectedAddress.city} ${selectedAddress.pinCode}` : <span>Select delivery location</span>}</small>
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
                <AddressList addressList={addressList} handelSelectedAddress={handelSelectedAddress} setViewAddressList={setViewAddressList} viewAddressList={viewAddressList} redirect={`/${product && '?redirect=/product/' + product._id}`} />
            }
        </>

    )
}

export default ProductSummary