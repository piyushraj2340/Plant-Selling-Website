import React, { useState } from 'react';
import { Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { adminCreateCouponAsync, adminUpdateCouponAsync } from '../adminSlice';
import { getAllCategoriesAsync } from '../../category/categorySlice';
import { getAllProductsAsync } from '../../products/productsSlice';
import CouponTables from './CouponTables';

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
        subCategories: [], // now an array
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

        if (name === 'couponName') {
            value = value.toUpperCase();
        }

        setCoupon({ ...coupon, [name]: value });
    }

    // options
    const generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    const handleSubCategoriesChange = (val) => {
        setCoupon({ ...coupon, subCategories: val });
    }

    const handelUseAutoGenerateCoupons = (e) => {

        if (e.target.checked) {
            setOptions({ ...options, useAutoGenerateCoupons: true });
            setCoupon(prev => ({ ...prev, couponName: generateRandomCode() }));
        } else {
            setOptions({ ...options, useAutoGenerateCoupons: false });
            setCoupon(prev => ({ ...prev, couponName: '' }));
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

    const dispatch = useDispatch();

    const { couponsData } = useSelector(state => state.admin);
    const { categories } = useSelector(state => state.category);
    const { products } = useSelector(state => state.products);

    React.useEffect(() => {
        dispatch(getAllCategoriesAsync({ status: 'Active' }));
        dispatch(getAllProductsAsync());
    }, [dispatch]);

    const [isEditing, setIsEditing] = useState(false);
    const [editingCouponId, setEditingCouponId] = useState(null);

    const handelCreateNewCouponModelSave = async () => {
        if (isEditing) {
            dispatch(adminUpdateCouponAsync({ id: editingCouponId, data: coupon })).unwrap().then(() => {
                handelCreateNewCouponModelClose();
                resetCouponForm();
            }).catch((err) => {});
        } else {
            // Dispatch the action to create the coupon
            dispatch(adminCreateCouponAsync(coupon)).unwrap().then(() => {
                handelCreateNewCouponModelClose();
                resetCouponForm();
            }).catch((err) => {});
        }
    }

    const resetCouponForm = () => {
        setCoupon({
            couponName: '',
            description: '',
            numberOfCoupon: '',
            minAmount: '',
            discount: '',
            maxDiscountInCost: '',
            createdAt: '',
            categories: 'all',
            subCategories: [],
            redeemBefore: '',
            freeDelivery: false,
            singleCouponPerUser: false,
            newUser: false
        });
        setOptions({ ...options, useAutoGenerateCoupons: false, useUnlimitedCoupons: false, useFlatDiscount: false, createNewCouponModelEnabled: false });
        setIsEditing(false);
        setEditingCouponId(null);
    }

    const onEditCoupon = (id) => {
        const c = couponsData.coupons.find(coupon => coupon._id === id);
        if (c) {
            setCoupon({
                couponName: c.code,
                description: c.description,
                numberOfCoupon: c.usage?.maxUsageCount === null ? Infinity : (c.usage?.maxUsageCount || ''),
                minAmount: c.rules?.minOrderAmount || '',
                discount: c.discount?.value || '',
                maxDiscountInCost: c.discount?.maxDiscountAmount || '',
                createdAt: c.createdAt,
                categories: 'all',
                subCategories: '',
                redeemBefore: c.rules?.validUntil ? new Date(c.rules.validUntil).toISOString().slice(0, 16) : '',
                freeDelivery: c.rules?.freeDelivery || false,
                singleCouponPerUser: c.rules?.singleUsePerUser || false,
                newUser: c.rules?.isNewUserOnly || false
            });
            setIsEditing(true);
            setEditingCouponId(id);
            setOptions({ 
                ...options, 
                createNewCouponModelEnabled: true,
                useUnlimitedCoupons: c.usage?.maxUsageCount === null,
                useFlatDiscount: c.discount?.type === 'Flat'
            });
        }
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
            <CouponTables showTermsModalOpen={showTermsModalOpen} onEditCoupon={onEditCoupon} /> {/* Add Rating, Review into the component */}

            <Modal title="Terms and Conditions" open={options.termsModalVisible} onCancel={handleTermsModalClose} footer={null} >
                <ul>
                    {termsAndConditionsContents.map((content) => {
                        return <li>{content}</li>
                    })}
                </ul>
            </Modal>

            <Modal title={isEditing ? "Edit Coupon" : "Create New Coupon"} open={options.createNewCouponModelEnabled} onCancel={() => {handelCreateNewCouponModelClose(); resetCouponForm();}} onOk={handelCreateNewCouponModelSave} okText={isEditing ? "Save" : "Draft"} >
                <div className="row border py-3 rounded">
                    <div className="mb-1">
                        <div className="form-floating mb-1">
                            <input type="text" className="form-control" id="couponName" name='couponName' value={coupon.couponName} placeholder="Enter Coupon" onChange={handelFormInputs} disabled={options.useAutoGenerateCoupons} />
                            <label for="couponName">Coupon Name <small className='text-danger'>*</small></label>
                        </div>
                        <div className="form-check small ms-2 text-secondary">
                            <p className="small">
                                <input type="checkbox" className='form-check-input' id="autoGenerateCouponCheck" checked={options.useAutoGenerateCoupons} onChange={handelUseAutoGenerateCoupons} />
                                <label htmlFor="autoGenerateCouponCheck"> Auto Generate Coupon</label>
                            </p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="form-floating mb-1">
                            <textarea className="form-control" id="description" name='description' value={coupon.description} placeholder="Enter Description" onChange={handelFormInputs}></textarea>
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
                                <input type="checkbox" className='form-check-input' id="useUnlimitedCoupons" checked={options.useUnlimitedCoupons} onChange={handelUseUnlimitedCoupons} />
                                <label htmlFor="useUnlimitedCoupons"> Unlimited Coupons.</label>
                            </p>
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <div className="form-floating mb-1">
                            <input type="number" className="form-control" id="minAmount" name='minAmount' value={coupon.minAmount} placeholder="Enter minimum cost to applicable coupon." onChange={handelFormInputs} />
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
                                <input type="checkbox" className='form-check-input' id="useFlatDiscountCheck" checked={options.useFlatDiscount} onChange={handelFlatDiscount} />
                                <label htmlFor="useFlatDiscountCheck"> Use Flat Discount.</label>
                            </p>
                        </div>
                    </div>
                    <div className="mb-3 col-md-6">
                        <div className="form-floating mb-1">
                            <input type="number" className="form-control" id="maxDiscountInCost" name='maxDiscountInCost' value={coupon.maxDiscountInCost} placeholder="Enter Maximum discount in cost." onChange={handelFormInputs} />
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
                                <div className="mb-1">
                                    <label className="form-label" htmlFor="subCategories">Select Product Categories <small className='text-danger'>*</small></label>
                                    <br />
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Select Categories"
                                        onChange={handleSubCategoriesChange}
                                        value={coupon.subCategories}
                                        options={categories?.map(c => ({ label: c.name, value: c._id })) || []}
                                        showSearch
                                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    />
                                </div>
                            }

                            {coupon.categories === 'individual' &&
                                <div className="mb-1">
                                    <label className="form-label" htmlFor="subCategories">Search Individual Products <small className='text-danger'>*</small></label>
                                    <br />
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Search Individual Products"
                                        onChange={handleSubCategoriesChange}
                                        value={coupon.subCategories}
                                        options={products?.map(p => ({ label: p.plantName, value: p._id })) || []}
                                        showSearch
                                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    />
                                </div>
                            }
                            <div className="small ms-2 mt-1 text-secondary">
                                <p className='small'> <i className="fas fa-info-circle"></i> Multiple options can be selected.</p>
                            </div>
                        </div>
                    }

                    <div className={`mb-3 ${coupon.categories === 'all' ? 'col-md-6' : 'col-md-12'}`}>
                        <div className="form-floating mb-1">
                            <input type="datetime-local" className="form-control" id="redeemBefore" name='redeemBefore' value={coupon.redeemBefore} onChange={handelFormInputs} />
                            <label for="redeemBefore">Redeem Before <small className='text-danger'>*</small></label>
                        </div>
                        <div className="small ms-2 text-secondary">
                            <p className='small'> <i className="fas fa-info-circle"></i> Expire Date and Time for Coupon.</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <h6>Terms and Conditions.</h6>
                        <div className="form-check  ms-2 text-secondary">
                            <input type="checkbox" className='form-check-input' id="freeDelivery" name='freeDelivery' checked={coupon.freeDelivery} onChange={handelCheckFreeDelivery} />
                            <label htmlFor="freeDelivery"> Applicable for Free Delivery</label>
                        </div>
                        <div className="form-check  ms-2 text-secondary">
                            <input type="checkbox" className='form-check-input' id="singleCouponPerUser" name='singleCouponPerUser' checked={coupon.singleCouponPerUser} onChange={handelCheckSingleCouponPerUser} />
                            <label htmlFor="singleCouponPerUser"> Only single Coupon Per User.</label>
                        </div>
                        <div className="form-check  ms-2 text-secondary">
                            <input type="checkbox" className='form-check-input' id="newUser" name='newUser' checked={coupon.newUser} onChange={handelCheckNewUser} />
                            <label htmlFor="newUser"> Only for new User.</label>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Coupon