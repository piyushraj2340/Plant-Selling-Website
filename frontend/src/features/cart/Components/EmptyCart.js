import React from 'react'

const EmptyCart = () => {
    const noDataFound = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";
    return (
        <section className='cart bg-section'>
            <div className='container py-5'>
                <div className="s-cart border rounded-3 bg-light p-3">
                    <div className="border-bottom p-2 pb-0">
                        <h3 className="h3 mb-0">Shopping Cart</h3>
                        <p className='text-muted small'><i>0 items in cart.</i></p>
                    </div>
                    <div className="s-cart-items row m-0 p-0">
                        <div className="m-0 p-0 col-md-8">
                            <div className='w-100'>
                                <img src={noDataFound} alt="Empty Cart" className='img-fluid' />
                            </div>
                        </div>
                        <div className="m-0 p-0 col-md-4 summary d-flex flex-column justify-content-between">
                            <div className="p-3">
                                <div className="row">
                                    <h4 className="h4 border-bottom p-3">Summary</h4>
                                </div>
                                <div className="row">
                                    <p className="d-flex justify-content-between">
                                        <small>0 items in cart.</small>
                                        <span><small className='small'>Subtotal ₹</small><b>0</b></span>
                                    </p>
                                    <div className="col-12 border-bottom pb-2">
                                        <p className="text-muted d-flex justify-content-between">
                                            <small>Subtotal : </small>
                                            <span>₹<b>0</b></span>
                                        </p>
                                    </div>
                                    <div className="d-flex flex-row-reverse p-3">
                                        <p className="h5">Total: <sup>₹</sup>0</p>
                                    </div>

                                </div>
                            </div>
                            <div className="row m-0 p-3">
                                <a href='/products' className="btn btn-lg btn-success">Explore Products</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EmptyCart