import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import AddressList from './Shared/AddressList';
import noDataFound from '../Asset/img/noDataFound.jpg';
import handelDataFetch from '../utils/handelDataFetch';
import { message } from 'antd';

function Cart() {
  document.title = "Cart Information";

  const { setCartLength, setShowAnimation } = useContext(UserContext);

  const [cart, setCart] = useState([]);
  const [pricing, setPricing] = useState(null);

  const [address, setAddress] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [viewAddressList, setViewAddressList] = useState(false);


  const navigate = useNavigate();

  const handelGetDefaultAddress = async () => {
    try {
      const result = await handelDataFetch({ path: '/api/v2/user/default/address', method: "GET" }, setShowAnimation);

      if (result.status) {
        setAddress(result.result);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handelCalculatePricing = (productArray) => {
    const totalPriceWithoutDiscount = (productArray.reduce((total, curObj) => total + (curObj.pricing.priceWithoutDiscount * curObj.quantity), 0).toFixed(2));
    const actualPriceAfterDiscount = (productArray.reduce((total, curObj) => total + (curObj.pricing.priceAfterDiscount * curObj.quantity), 0)).toFixed(2);
    const discountPrice = (productArray.reduce((total, curObj) => total + (curObj.pricing.discountPrice * curObj.quantity), 0)).toFixed(2);
    const deliveryPrice = (actualPriceAfterDiscount < 500 ? 90 : 0).toFixed(2)

    const pricing = {
      totalPriceWithoutDiscount,
      actualPriceAfterDiscount,
      discountPrice,
      deliveryPrice, // calculate the delivery price dynamic
      totalPrice: (Number(actualPriceAfterDiscount) + Number(deliveryPrice)).toFixed(2)
    }
    setPricing(pricing);
  }

  const handleGetAddedCart = async () => {
    try {
      const result = await handelDataFetch({ path: '/api/v2/checkout/carts', method: "GET" }, setShowAnimation);

      if (result.status) {
        // const cartValues = result.result.reduce((total, curObj) => total + ((curObj.plant.price - curObj.plant.discount / 100 * curObj.plant.price) * curObj.quantity), 0);
        handelCalculatePricing(result.result);
        setCart(result.result);
        setCartLength({ type: "CART", length: result.result.length });
      } else {
        setCart([]);
        setPricing(null);
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetAddedCart();
    handelGetDefaultAddress();
  }, []);

  const handelGetListOfAddress = async () => {
    try {

      const result = await handelDataFetch({ path: "/api/v2/user/address", method: "GET" }, setShowAnimation);

      if (result) {
        setAddressList(result.result);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const setSelectedAddress = (_id) => {
    let address = addressList.filter((elem) => {
      return elem._id === _id;
    });
    setAddress(address[0]);
    setViewAddressList(!viewAddressList);
  }

  const handleDeleteFromCart = async (cartId) => {
    try {
      const result = await handelDataFetch({ path: `/api/v2/checkout/carts/${cartId}`, method: "DELETE" }, setShowAnimation);

      if (result.status) {
        setCartLength({ type: "CART", length: result.cartLength });
        handleGetAddedCart();
      } else {
        handleGetAddedCart();
        setCartLength({ type: "CART", length: null });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateCart = async (cartId, plant, quantity, price, discount) => {
    try {
      const result = await handelDataFetch({ path: `/api/v2/checkout/carts/${cartId}`, method: "PATCH", body: { plant, quantity, addedAtPrice: Math.round(price - discount / 100 * price) } }, setShowAnimation);

      if (result.status) {
        setCartLength({ type: "CART", length: result.result.length });
        handleGetAddedCart();
      } else {
        setCartLength({ type: "CART", length: null });
        handleGetAddedCart();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handelBuyProduct = async () => {
    try {
      const data = {
        cartOrProducts: cart,
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

  return (
    <section className='cart bg-section'>
      <div className='container py-5'>
        <div className="s-cart border rounded-3 bg-light p-3">
          <div className="border-bottom p-2 pb-0">
            <h3 className="h3 mb-0">Shopping Cart</h3>
            <p className='text-muted small'><i>{(cart ?? 0) && Number(cart.length)} items in cart.</i></p>
          </div>
          <div className="s-cart-items row m-0 p-0">
            <div className="m-0 p-0 col-md-8">
              {
                cart && cart.length !== 0
                  ?
                  cart.map((elem) => {
                    return (
                      <div key={elem._id} className="item mt-4 pt-2 pb-2 border-bottom">
                        <div className="row">
                          <div className="item-img col-5 col-md-4 col-xl-3 m-0 p-0">
                            <div className="img border">
                              <img src={elem.plant.images[0].url} alt="flowering plant" />
                            </div>
                          </div>
                          <div className="item-content col-7 col-md-8 col-xl-9">
                            <div className="row">
                              <div className='m-0'>
                                <div className='m-0'>
                                  <Link to={`/product/${elem.plant._id}`} className='link-dark link-underline-hover'><h3 className='h5 mb-0'>{elem.plant.plantName}</h3></Link>
                                </div>
                                <p className='m-0'><small><Link to={`/nursery/store/view/${elem.nursery._id}`} className='small link-secondary link-underline-hover'><i className="fas fa-store"></i> {elem.nursery.nurseryName}</Link></small></p>
                                <p className="text-muted small m-0" style={{ fontSize: "14px", margin: "0" }}>
                                  Price: <small className='text-decoration-line-through'>₹ {elem.plant.price}</small>
                                </p>
                                <p className="card-text h5 m-0">
                                  <span className="text-success">-{elem.plant.discount}%</span> ₹{((elem.plant.price - elem.plant.discount / 100 * elem.plant.price) * elem.quantity).toFixed(2)}
                                </p>
                                <p className="card-text m-0 text-success small"><small>In Stock</small></p>

                              </div>
                              <div className='m-0 d-flex small'>
                                <p className="m-0 d-none-md">Quantity: </p>
                                <select value={elem.quantity} onChange={(e) => { handleUpdateCart(elem._id, elem.plant, e.target.value, elem.price, elem.discount); elem.quantity = e.target.value; }} style={{ margin: "0 0 0 4px" }} name="quantity" id="quantity">
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
                              </div>
                            </div>
                            <div className="item-content-menu d-none-lg">
                              <div className="d-flex">
                                <p className="m-0 menu p-2" onClick={() => handleDeleteFromCart(elem._id)}>
                                  <i className='fas fa-trash-alt p-2'></i>
                                  <span className='menu-text p-1 center'>Delete</span>
                                </p>
                                <p className="m-0 menu p-2">
                                  <i className='fas fa-bookmark p-2'></i>
                                  <span className='menu-text p-1 center'>Save for later</span>
                                </p>
                                <p className="m-0 menu p-2">
                                  <i className='fas fa-share-alt p-2'></i>
                                  <span className='menu-text p-1 center'>Share</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="menu-control d-lg">
                            <div className="d-flex justify-content-around mt-3 mb-3">
                              <p className="m-0 small" onClick={() => handleDeleteFromCart(elem._id)}>
                                <i className='fas fa-trash-alt p-2'></i>
                                <span className='p-1 center'>Delete</span>
                              </p>
                              <p className="m-0 small">
                                <i className='fas fa-bookmark p-2'></i>
                                <span className='p-1 center'>Save for later</span>
                              </p>
                              <p className="m-0 small">
                                <i className='fas fa-share-alt p-2'></i>
                                <span className='p-1 center'>Share</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })

                  :

                  <div className='w-100'>
                    <img src={noDataFound} alt="Empty Cart" className='img-fluid' />
                  </div>

              }
              <div className="d-flex flex-row-reverse p-3">
                <p className='h5'>Subtotal ({(cart ?? 0) && Number(cart.length)} item): <small className='small'>₹</small><b>{pricing && pricing.actualPriceAfterDiscount}</b></p>
              </div>
            </div>
            <div className="m-0 p-0 col-md-4 summary">
              <div className="p-3">
                <div className="row">
                  <h4 className="h4 border-bottom p-3">Summary</h4>
                </div>
                <div className="row">
                  <p className="d-flex justify-content-between">
                    <small>ITEMS {(cart ?? 0) && Number(cart.length)}</small>
                    <span><small className='small'>Subtotal ₹</small><b>{pricing && pricing.actualPriceAfterDiscount}</b></span>
                  </p>
                  <p className="text-muted small link-underline-hover" onClick={() => { handelGetListOfAddress(); setViewAddressList(!viewAddressList) }}>
                    <small><i className="fas fa-map-marker-alt"></i> {address ? `Deliver to ${address.name.substring(0, address.name.indexOf(" "))} - ${address.city} ${address.pinCode}` : "Select delivery location"}</small>
                  </p>
                  <p className="text-muted mb-0">
                    <small className='small'>Have Coupon?</small>
                  </p>
                  <p className="text-muted mt-1 input-group">
                    <input style={{ width: "70%" }} type="text" className='form-control' name="coupon" id="coupon" />
                    <button style={{ width: "30%" }} className='form-control btn btn-info'>Apply</button>
                  </p>
                  <p className="text-muted border-bottom pb-3">
                    <i className='fas fa-info-circle'></i>
                    {
                      pricing && pricing.actualPriceAfterDiscount > 500 ?
                        <span className="m-0">
                          <small className='small'> Eligible for FREE Delivery. <Link>Detail</Link></small>
                        </span>
                        :
                        <span className="m-0">
                          <small className='small'> Add items of </small><small>₹</small><b>{pricing && (500 - Number(pricing.actualPriceAfterDiscount)).toFixed(2)}</b><small> to get the for FREE Delivery <Link>Detail</Link></small>
                        </span>
                    }

                  </p>
                  <div className="row border-bottom pb-2">
                    <p className="text-muted d-flex justify-content-between">
                      <small>Total : </small>
                      <span>₹<b>{pricing && pricing.totalPriceWithoutDiscount}</b></span>
                    </p>
                    <p className="text-muted d-flex justify-content-between">
                      <small>Discount : </small>
                      <span>- ₹<b>{pricing && pricing.discountPrice}</b></span>
                    </p>
                    <p className="text-muted d-flex justify-content-between">
                      <small>Delivery : </small>
                      <span>₹<b>{pricing && pricing.deliveryPrice}</b></span>
                    </p>
                    <p className="text-muted d-flex justify-content-between">
                      <small>Subtotal : </small>
                      <span>₹<b>{pricing && pricing.actualPriceAfterDiscount}</b></span>
                    </p>
                  </div>
                  <div className="d-flex flex-row-reverse p-3">
                    <p className="h5">Total: <sup>₹</sup>{pricing && pricing.totalPrice}</p>
                  </div>
                  <div className="row m-0">
                    <button onClick={handelBuyProduct} className="btn btn-success">Checkout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewAddressList && <AddressList addressList={addressList} setSelectedAddress={setSelectedAddress} setViewAddressList={setViewAddressList} viewAddressList={viewAddressList} redirect={"/?redirect=/cart"} />}
    </section>
  )
}

export default Cart