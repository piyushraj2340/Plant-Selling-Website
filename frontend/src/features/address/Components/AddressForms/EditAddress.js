import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateAddressAsync } from '../../addressSlice';



function EditAddress() {
    const { id } = useParams();

    const address = useSelector(state => state.address.addressList);
    const dispatch = useDispatch();

    const filterCurrentAddress = address.filter(address => address._id === id)[0];

    console.log(filterCurrentAddress);

    // storing the data 
    const [addressData, setAddressData] = useState({
        user: filterCurrentAddress && filterCurrentAddress.user,
        name: filterCurrentAddress && filterCurrentAddress.name,
        phone: filterCurrentAddress && filterCurrentAddress.phone,
        pinCode: filterCurrentAddress && filterCurrentAddress.pinCode,
        address: filterCurrentAddress && filterCurrentAddress.address,
        landmark: filterCurrentAddress && filterCurrentAddress.landmark,
        city: filterCurrentAddress && filterCurrentAddress.city,
        state: filterCurrentAddress && filterCurrentAddress.state,
        setAsDefault: filterCurrentAddress && filterCurrentAddress.setAsDefault
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
        const [redirect, to] = window.location.search && window.location.search.split("=");

        const data = {
            _id: filterCurrentAddress._id,
            address: addressData,
            redirect: redirect === "?redirect" ? to : "/address",
            navigate
        }

        dispatch(updateAddressAsync(data));
    }

    return (
        <div className="container my-5 d-flex justify-content-center" >
            <div className="col-sm-12 col-md-9 mt-5 border py-3">
                <h3 className='h3 mb-3 text-center'>
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
    )
}

export default EditAddress