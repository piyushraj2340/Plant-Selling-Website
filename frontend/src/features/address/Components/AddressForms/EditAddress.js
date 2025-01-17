import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addressResetApiState, updateAddressAsync } from '../../addressSlice';
import BreadCrumb from '../../../common/BreadCrumb';



function EditAddress() {
    const { id } = useParams();

    const address = useSelector(state => state.address.addressList);
    const isRedirectAllowed = useSelector(state => state.address.isRedirectAllowed);


    const dispatch = useDispatch();

    const filterCurrentAddress = address.find(address => address?._id === id);

    // storing the data 
    const [addressData, setAddressData] = useState({
        user: filterCurrentAddress?.user,
        name: filterCurrentAddress?.name,
        phone: filterCurrentAddress?.phone,
        pinCode: filterCurrentAddress?.pinCode,
        address: filterCurrentAddress?.address,
        landmark: filterCurrentAddress?.landmark,
        city: filterCurrentAddress?.city,
        state: filterCurrentAddress?.state,
        setAsDefault: filterCurrentAddress?.setAsDefault
    });

    // validating the input fields and have there error messages associated with them
    const [errorMessage, setErrorMessage] = useState({
        name: {
            status: false,
            message: "",
            target: ""
        },
        phone: {
            status: false,
            message: "",
            target: ""
        },
        pinCode: {
            status: false,
            message: "",
            target: ""
        },
        address: {
            status: false,
            message: "",
            target: ""
        },
        landmark: {
            status: false,
            message: "",
            target: ""
        },
        city: {
            status: false,
            message: "",
            target: ""
        },
        state: {
            status: false,
            message: "",
            target: ""
        },
    });


    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (isRedirectAllowed) {
            const queryParams = new URLSearchParams(location.search);
            const redirect = queryParams.get("redirect");

            if (redirect) {
                navigate(redirect);
            } else {
                navigate("/address");
            }
        }

        return () => { dispatch(addressResetApiState()) }

    }, [isRedirectAllowed]);

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        if (name === "setAsDefault") {
            setAddressData({ ...addressData, [name]: e.target.checked });
        } else {
            if (value === "") {
                setErrorMessage({ ...errorMessage, [name]: { status: true, message: `${name} is required.`, target: e.target } });
            } else if ((name === "name") && (value.length < 3 || value.length >= 30)) {
                setErrorMessage({ ...errorMessage, ["name"]: { status: true, message: `The length of the Name is greater than 3 and less than 30.`, target: e.target } });
            } else if ((name === "phone") && (Number(value).toString().length !== 10)) {
                setErrorMessage({ ...errorMessage, ["phone"]: { status: true, message: `Length of the mobile must be 10.`, target: e.target } });
            } else if ((name === "pinCode") && (value.length !== 6)) {
                setErrorMessage({ ...errorMessage, ["pinCode"]: { status: true, message: `Length of the Pin Code must be 6.`, target: e.target } });
            } else {
                setErrorMessage({ ...errorMessage, [name]: { status: false, message: "", target: "" } });
            }

            setAddressData({ ...addressData, [name]: value });
        }
    }

    const handlePostData = async (e) => {
        e.preventDefault();

        for (const key in errorMessage) {
            if (errorMessage[key].status) {
                errorMessage[key].target.focus();
                return;
            }
        }

        for (const key in addressData) {
            if (key === "landmark" || key === "setAsDefault") continue;

            if (!addressData[key]) {
                message.error(key + " is required field!");
                return;
            }
        }

        const data = {
            _id: filterCurrentAddress._id,
            address: addressData,
        }

        dispatch(updateAddressAsync(data));
    }

    const breadCrumbItems = useMemo(() => [
        {
            path: './',
            title: 'Home',
        },
        {
            path: '../profile',
            title: 'Profile'
        },
        {
            path: '../address',
            title: 'Address'
        },
        {
            title: 'Update Address'
        }
    ], []);

    return (
        <div className="container my-md-5 d-flex flex-column align-items-center justify-content-center" >
            <div className='row justify-content-center'>
                <div className='col-sm-12 col-md-9 mt-3 mt-md-5'>
                    <BreadCrumb items={breadCrumbItems} />
                </div>
                <div className="col-sm-12 col-md-9 border py-3 shadow rounded bg-section">
                    <h3 className='h3 ms-4 my-3'>
                        Edit Your Shipping Address
                    </h3>
                    <div className="row p-4">
                        <form method="POST">
                            <div className="form-outline mb-4">
                                <label htmlFor="name" className='form-label'>Full Name: <span className="text-danger small">*</span></label>
                                <input type="text" name='name' id="name" className="form-control" placeholder='Enter Full Name' onChange={handleInputs} value={addressData.name} />
                                {errorMessage.name.status &&
                                    <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.name.message}</p>
                                }
                            </div>
                            <div className="form-outline mb-4">
                                <label htmlFor="phone" className="form-label">Mobile Number: <span className="text-danger small">*</span></label>
                                <input type="number" name='phone' id="phone" className="form-control" placeholder='Enter Mobile Number' onChange={handleInputs} maxLength={10} value={addressData.phone} />
                                {errorMessage.phone.status &&
                                    <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.phone.message}</p>
                                }
                            </div>
                            <div className="form-outline mb-4">
                                <label htmlFor="address" className="form-label">Address: <span className="text-danger small">*</span></label>
                                <textarea className="form-control" rows="5" id="address" name="address" placeholder='Enter Address' onChange={handleInputs} value={addressData.address}></textarea>
                                {errorMessage.address.status &&
                                    <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.address.message}</p>
                                }
                            </div>
                            <div className="d-md-flex justify-content-between mb-md-4">
                                <div className="form-outline col-md-6 mb-4 mb-md-0 pe-md-2">
                                    <label htmlFor="landmark" className="form-label">Landmark (Optional): </label>
                                    <input type="text" name='landmark' id="landmark" className="form-control" placeholder='Enter Landmark (optional)' onChange={handleInputs} value={addressData.landmark} />
                                </div>
                                <div className="form-outline col-md-6 mb-4 mb-md-0 ps-md-2">
                                    <label htmlFor="pinCode" className="form-label">Pin Code: <span className="text-danger small">*</span></label>
                                    <input type="number" name='pinCode' id="pinCode" className="form-control" placeholder='Enter Pin Code' onChange={handleInputs} maxLength={6} value={addressData.pinCode} />
                                    {errorMessage.pinCode.status &&
                                        <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.pinCode.message}</p>
                                    }
                                </div>
                            </div>
                            <div className="d-md-flex justify-content-between mb-md-4">
                                <div className="form-outline col-md-6 mb-4 mb-md-0 pe-md-2">
                                    <label htmlFor="city" className="form-label">City: <span className="text-danger small">*</span></label>
                                    <input type="text" name='city' id="city" className="form-control" placeholder='Enter City' onChange={handleInputs} value={addressData.city} />
                                    {errorMessage.city.status &&
                                        <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.city.message}</p>
                                    }
                                </div>
                                <div className="form-outline col-md-6 mb-4 mb-md-0 ps-md-2">
                                    <label htmlFor="state" className="form-label">State: <span className="text-danger small">*</span></label>
                                    <input type="text" name='state' id="state" className="form-control" placeholder='Enter State' onChange={handleInputs} value={addressData.state} />
                                    {errorMessage.state.status &&
                                        <p className="text-danger small m-1 mt-2"><i className="fas fa-info-circle"></i> {errorMessage.state.message}</p>
                                    }
                                </div>
                            </div>
                            <div className="form-outline mb-5">
                                <label className='form-check-label' htmlFor="setAsDefault">
                                    <input type="checkbox" className='form-check-input' name='setAsDefault' id="setAsDefault" onChange={handleInputs} checked={addressData.setAsDefault} /> Set As Default
                                </label>
                            </div>

                            <button onClick={handlePostData} type="submit" className="btn btn-primary btn-block mb-2"><i className="fas fa-edit"></i> Your Address</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(EditAddress)