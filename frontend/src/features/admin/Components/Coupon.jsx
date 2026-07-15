import React, { useState } from 'react';
import { Modal } from 'antd';
import CouponTables from './CouponTables'

const Coupon = () => {

    const [termsAndConditionsContents, setTermsAndConditionsContents] = useState([]);


    const [coupon, setCoupon] = useState({
        couponName: '',
        description: '',
        numberOfCoupon: '',
        minAmount: '',
        discount: '',
        maxDiscountInCost: '',
        createdAt: '', // on submitting the button automatically handles in back-end.
        categories: 'all',
        subCategories: '', // need to check multiple from dropdown
        redeemBefore: '',
        freeDelivery: false,
        singleCouponPerUser: false,
        newUser: false
    })

    const [options, setOptions] = useState({
        termsModalVisible: false,
        createNewCouponModelEnabled: false,
        useAutoGenerateCoupons: false,
        useUnlimitedCoupons: false,
        useFlatDiscount: false,
    });

    let name;
    let value;

    const handelFormInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setCoupon({ ...coupon, [name]: value });
    }

    // options
    const handelUseAutoGenerateCoupons = (e) => {

        if (e.target.checked) {
            setOptions({ ...options, useAutoGenerateCoupons: true });
            setCoupon({ ...coupon, couponName: 'RANDOM' });
        } else {
            setOptions({ ...options, useAutoGenerateCoupons: false });
            setCoupon({ ...coupon, couponName: '' });
        }

    }

    const handelUseUnlimitedCoupons = (e) => {
        if (e.target.checked) {
            setOptions({ ...options, useUnlimitedCoupons: true });
            setCoupon({ ...coupon, numberOfCoupon: Infinity });
        } else {
            setOptions({ ...options, useUnlimitedCoupons: false });
            setCoupon({ ...coupon, numberOfCoupon: '' });
        }

    }

    const handelFlatDiscount = (e) => {
        if (e.target.checked) {
            setOptions({ ...options, useFlatDiscount: true });
            setCoupon({ ...coupon, discount: '' });
        } else {
            setOptions({ ...options, useFlatDiscount: false });
            setCoupon({ ...coupon, discount: '' });
        }

    }

    const handelCheckFreeDelivery = (e) => {
        if (e.target.checked) {
            setCoupon({ ...coupon, freeDelivery: true });
        } else {
            setCoupon({ ...coupon, freeDelivery: false });
        }
    }

    const handelCheckSingleCouponPerUser = (e) => {
        if (e.target.checked) {
            setCoupon({ ...coupon, singleCouponPerUser: true });
        } else {
            setCoupon({ ...coupon, singleCouponPerUser: false });
        }
    }

    const handelCheckNewUser = (e) => {
        if (e.target.checked) {
            setCoupon({ ...coupon, newUser: true });
        } else {
            setCoupon({ ...coupon, newUser: false });
        }
    }


    const showTermsModalOpen = (content) => {
        setTermsAndConditionsContents(content);
        setOptions({ ...options, termsModalVisible: true })
    };

    const handelCreateNewCouponModelSave = async () => {

    }

    const handelCreateNewCouponModelOpen = () => {
        setOptions({ ...options, createNewCouponModelEnabled: true });
    }

    const handelCreateNewCouponModelClose = () => {
        setOptions({ ...options, createNewCouponModelEnabled: false });
    }

    const handleTermsModalClose = () => {
        setOptions({ ...options, termsModalVisible: false });
    };

    return (
        <div className="row g-2 my-2 bg-white border rounded">
            <div className="header d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start p-2 ps-md-4 w-100">
                <div className="head">
                    <h5 className='h5 fw-bolder'>All Coupons </h5>
                </div>
                <div className="tools me-2">
                    <button className="btn btn-success" onClick={handelCreateNewCouponModelOpen}>Create New Coupon</button>
                </div>
            </div>
            <CouponTables showTermsModalOpen={showTermsModalOpen} /> {/* Add Rating, Review into the component */}

            <Modal title="Terms and Conditions" open={options.termsModalVisible} onCancel={handleTermsModalClose} footer={null} >
                <ul>
                    {termsAndConditionsContents.map((content) => {
                        return <li>{content}</li>
                    })}
                </ul>
            </Modal>

            <Modal title="Create New Coupon" open={options.createNewCouponModelEnabled} onCancel={handelCreateNewCouponModelClose} onOk={handelCreateNewCouponModelSave} okText="Draft" >
                <div className="row border py-3 rounded">
                    <div className="mb-1">
                        <div className="form-floating mb-1">
                            <input type="text" className="form-control" id="couponName" name='couponName' value={coupon.couponName} placeholder="Enter Coupon" onChange={handelFormInputs} disabled={options.useAutoGenerateCoupons} />
                            <label for="couponName">Coupon Name <small className='text-danger'>*</small></label>
                        </div>
                        <div className="form-check small ms-2 text-secondary">
                            <p className="small">
                                <input type="checkbox" className='form-check-input' id="autoGenerateCouponCheck" onChange={handelUseAutoGenerateCoupons} />
                                <label htmlFor="autoGenerateCouponCheck"> Auto Generate Coupon</label>
                            </p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="form-floating mb-1">
                            <textarea className="form-control" id="description" name='description' placeholder="Enter Description" onChange={handelFormInputs}></textarea>
                            <label for="description">Description <small className='text-danger'>*</small></label>
                        </div>
                        <div className="small ms-2 text-secondary">
                            <p className='small'> <i className="fas fa-info-circle"></i> Enter the details about the your Coupon.</p>
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <div className="form-floating mb-1">
                            <input type={coupon.numberOfCoupon === Infinity ? "text" : "number"} className="form-control" id="numberOfCoupon" name='numberOfCoupon' value={coupon.numberOfCoupon} placeholder="Enter Maximum discount in cost." onChange={handelFormInputs} disabled={options.useUnlimitedCoupons} />
                            <label for="numberOfCoupon">Number of Coupon <small className='text-danger'>*</small></label>
                        </div>
                        <div className="form-check small ms-2 text-secondary">
                            <p className="small">
                                <input type="checkbox" className='form-check-input' id="useUnlimitedCoupons" onChange={handelUseUnlimitedCoupons} />
                                <label htmlFor="useUnlimitedCoupons"> Unlimited Coupons.</label>
                            </p>
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <div className="form-floating mb-1">
                            <input type="number" className="form-control" id="minAmount" name='minAmount' placeholder="Enter minimum cost to applicable coupon." onChange={handelFormInputs} />
                            <label for="minAmount">Minimum Cost <small className='text-danger'>*</small></label>
                        </div>
                        <div className="small ms-2 text-secondary">
                            <p className='small'> <i className="fas fa-info-circle"></i> Minimum amount to applicable a coupon.</p>
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <div className="form-floating mb-1">
                            <input type="number" className="form-control" id="discount" name='discount' value={coupon.discount} placeholder="Enter discount in %." onChange={handelFormInputs} disabled={options.useFlatDiscount} />
                            <label for="discount">Discount (%) <small className='text-danger'>*</small></label>
                        </div>
                        <div className="form-check small ms-2 text-secondary">
                            <p className="small">
                                <input type="checkbox" className='form-check-input' id="useFlatDiscountCheck" onChange={handelFlatDiscount} />
                                <label htmlFor="useFlatDiscountCheck"> Use Flat Discount.</label>
                            </p>
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <div className="form-floating mb-1">
                            <input type="number" className="form-control" id="maxDiscountInCost" name='maxDiscountInCost' placeholder="Enter Maximum discount in cost." onChange={handelFormInputs} />
                            <label for="maxDiscountInCost">Maximum Discount in Cost <small className='text-danger'>*</small></label>
                        </div>
                        <div className="small ms-2 text-secondary">
                            <p className='small'> <i className="fas fa-info-circle"></i>{options.useFlatDiscount ? ` Get Flat Discount of ₹${coupon.maxDiscountInCost}` : ` Get ${coupon.discount}% Discount upto ₹${coupon.maxDiscountInCost}.`}</p>
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <div className="form-floating mb-1">
                            <select type="datetime-local" className="form-control" id="categories" name='categories' onChange={handelFormInputs}>
                                <option value="all">All Products</option>
                                <option value="categories">Products By categories</option>
                                <option value="individual">Individual Products</option>
                            </select>
                            <label for="categories">Select Products Type <small className='text-danger'>*</small></label>
                        </div>
                        <div className="small ms-2 text-secondary">
                            <p className='small'> <i className="fas fa-info-circle"></i> Option for which coupon are valid.</p>
                        </div>
                    </div>


                    {coupon.categories !== 'all' &&

                        <div className="mb-3 col-md-6">
                            {coupon.categories === 'categories' &&
                                <div className="form-floating mb-1">
                                    <select type="datetime-local" className="form-control" id="subCategories" name='subCategories' onChange={handelFormInputs}>
                                        <option value="plants">Plants</option>
                                        <option value="indore">Indore Plants</option>
                                        <option value="medical">medical</option>
                                    </select>
                                    <label for="subCategories">Select Product Categories <small className='text-danger'>*</small></label>
                                </div>
                            }

                            {coupon.categories === 'individual' &&
                                <div className="form-floating mb-1">
                                    <input type="search" className="form-control" id="subCategories" name='subCategories' placeholder='Search Individual Products' onChange={handelFormInputs} />
                                    <label for="subCategories">Search Individual Products </label>
                                </div>
                            }
                            <div className="small ms-2 text-secondary">
                                <p className='small'> <i className="fas fa-info-circle"></i> Sub-option for which coupon are valid.</p>
                            </div>
                        </div>

                    }

                    <div className={`mb-3 ${coupon.categories === 'all' ? 'col-md-6' : 'col-md-12'}`}>
                        <div className="form-floating mb-1">
                            <input type="datetime-local" className="form-control" id="redeemBefore" name='redeemBefore' onChange={handelFormInputs} />
                            <label for="redeemBefore">Redeem Before <small className='text-danger'>*</small></label>
                        </div>
                        <div className="small ms-2 text-secondary">
                            <p className='small'> <i className="fas fa-info-circle"></i> Expire Date and Time for Coupon.</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <h6>Terms and Conditions.</h6>
                        <div className="form-check  ms-2 text-secondary">
                            <input type="checkbox" className='form-check-input' id="freeDelivery" name='freeDelivery' onChange={handelCheckFreeDelivery} />
                            <label htmlFor="freeDelivery"> Applicable for Free Delivery</label>
                        </div>
                        <div className="form-check  ms-2 text-secondary">
                            <input type="checkbox" className='form-check-input' id="singleCouponPerUser" name='singleCouponPerUser' onChange={handelCheckSingleCouponPerUser} />
                            <label htmlFor="singleCouponPerUser"> Only single Coupon Per User.</label>
                        </div>
                        <div className="form-check  ms-2 text-secondary">
                            <input type="checkbox" className='form-check-input' id="newUser" name='newUser' onChange={handelCheckNewUser} />
                            <label htmlFor="newUser"> Only for new User.</label>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Coupon