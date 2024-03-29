import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddressList from '../../common/AddressList';
import { useDispatch, useSelector } from 'react-redux';
import { cartDataDeleteAsync, cartDataFetchAsync, cartDataUpdateQuantityAsync, setCartPricing } from '../cartSlice';
import { addressListDataFetchAsync, setSelectedAddress } from '../../address/addressSlice';
import { clearIsSessionError, initCheckoutProcessAsync } from '../../checkout/checkoutSlice';
import handelShareProduct from '../../../utils/handelShareProduct';
import { message } from 'antd';

function Cart() {
  const user = useSelector(state => state.user.user);
  const cart = useSelector(state => state.cart.carts);
  const addressList = useSelector(state => state.address.addressList);
  const selectedAddress = useSelector(state => state.address.selectedAddress);
  const cartPriceDetails = useSelector(state => state.cart.cartPriceDetails);

  const dispatch = useDispatch();

  const [viewAddressList, setViewAddressList] = useState(false);

  const noDataFound = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearIsSessionError());
    dispatch(cartDataFetchAsync());
  }, [])

  useEffect(() => {
    if (user) {
      dispatch(addressListDataFetchAsync());
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(setCartPricing(cart));
  }, [dispatch, cart]);

  useEffect(() => {
    addressList.length && dispatch(setSelectedAddress(addressList[0]));
  }, [dispatch, addressList])


  const handelSelectedAddress = (_id) => {
    let address = addressList.filter((elem) => {
      return elem._id === _id;
    });
    dispatch(setSelectedAddress(address[0]));
    setViewAddressList(!viewAddressList);
  }

  const handleDeleteFromCart = async (cartId) => {
    dispatch(cartDataDeleteAsync(cartId));
    dispatch(setCartPricing());
  }

  const handleUpdateCart = async (cartId, quantity) => {
    dispatch(cartDataUpdateQuantityAsync({ cartId, quantity }))
  }

  const handelBuyProduct = async () => {

    const data = {
      data: {
        cartOrProducts: cart,
        pricing: cartPriceDetails,
        shippingInfo: selectedAddress
      },
      navigate
    }

    dispatch(initCheckoutProcessAsync(data));
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

                    const productData = {
                      title: "Share " + elem.plantName + " Plants",
                      text: elem.description,
                      url: window.location.origin + `/product/${elem.plant._id}`,
                    }

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
                                <select value={elem.quantity} onChange={(e) => { handleUpdateCart(elem._id, e.target.value); }} style={{ margin: "0 0 0 4px" }} name="quantity" id="quantity">
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
                                <p className="m-0 menu p-2" onClick={() => handelShareProduct(productData, message)}>
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
                <p className='h5'>Subtotal ({(cart ?? 0) && Number(cart.length)} item): <small className='small'>₹</small><b>{cartPriceDetails && cartPriceDetails.actualPriceAfterDiscount}</b></p>
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
                    <span><small className='small'>Subtotal ₹</small><b>{cartPriceDetails && cartPriceDetails.actualPriceAfterDiscount}</b></span>
                  </p>
                  <p className="text-muted small link-underline-hover" onClick={() => { setViewAddressList(!viewAddressList) }}>
                    <small><i className="fas fa-map-marker-alt"></i> {selectedAddress ? `Deliver to ${selectedAddress.name.substring(0, selectedAddress.name.indexOf(" "))} - ${selectedAddress.city} ${selectedAddress.pinCode}` : "Select delivery location"}</small>
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
                      cartPriceDetails && cartPriceDetails.actualPriceAfterDiscount > 500 ?
                        <span className="m-0">
                          <small className='small'> Eligible for FREE Delivery. <Link>Detail</Link></small>
                        </span>
                        :
                        <span className="m-0">
                          <small className='small'> Add items of </small><small>₹</small><b>{cartPriceDetails && (500 - Number(cartPriceDetails.actualPriceAfterDiscount)).toFixed(2)}</b><small> to get the for FREE Delivery <Link>Detail</Link></small>
                        </span>
                    }

                  </p>
                  <div className="row border-bottom pb-2">
                    <p className="text-muted d-flex justify-content-between">
                      <small>Total : </small>
                      <span>₹<b>{cartPriceDetails && cartPriceDetails.totalPriceWithoutDiscount}</b></span>
                    </p>
                    <p className="text-muted d-flex justify-content-between">
                      <small>Discount : </small>
                      <span>- ₹<b>{cartPriceDetails && cartPriceDetails.discountPrice}</b></span>
                    </p>
                    <p className="text-muted d-flex justify-content-between">
                      <small>Delivery : </small>
                      <span>₹<b>{cartPriceDetails && cartPriceDetails.deliveryPrice}</b></span>
                    </p>
                    <p className="text-muted d-flex justify-content-between">
                      <small>Subtotal : </small>
                      <span>₹<b>{cartPriceDetails && cartPriceDetails.actualPriceAfterDiscount}</b></span>
                    </p>
                  </div>
                  <div className="d-flex flex-row-reverse p-3">
                    <p className="h5">Total: <sup>₹</sup>{cartPriceDetails && cartPriceDetails.totalPrice}</p>
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
      {viewAddressList && <AddressList addressList={addressList} handelSelectedAddress={handelSelectedAddress} setViewAddressList={setViewAddressList} viewAddressList={viewAddressList} redirect={"/?redirect=/cart"} />}
    </section>
  )
}

export default Cart