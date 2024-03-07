import { message } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nurseryCreateAsync } from '../../nurserySlice';

function SetNursery() {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const [nurseryData, setNurseryData] = useState({
        user: user._id,
        nurseryOwnerName: user.name,
        nurseryName: "",
        nurseryEmail: user.email,
        nurseryPhone: user.phone,
        pinCode: "",
        address: "",
        city: "",
        state: ""
    });

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setNurseryData({ ...nurseryData, [name]: value });
    }

    const handelPostData = async (e) => {
        e.preventDefault();

        for (let key in nurseryData) {
            if (nurseryData[key] === "") {
                message.error(key + " is required field!.")
                return;
            }
        }

        dispatch(nurseryCreateAsync(nurseryData));
    }

    return (
        <div className="container my-5 d-flex justify-content-center" >
            <div className="col-sm-12 col-md-9 border py-3 mt-5">
                <h3 className='h3 mb-3 text-center'>
                    Add Your Nursery
                </h3>
                <div className="row p-4">
                    <form method="POST" onSubmit={handelPostData}>
                        <div className="form-outline mb-4">
                            <input type="text" name='nurseryOwnerName' id="nurseryOwnerName" className="form-control input-disabled" placeholder='Full Name' onChange={handleInputs} value={nurseryData.nurseryOwnerName} disabled />
                        </div>
                        <div className="form-outline mb-4">
                            <input type="text" name='nurseryName' id="nurseryName" className="form-control" placeholder='Nursery Name' onChange={handleInputs} value={nurseryData.nurseryName} />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="email" name='nurseryEmail' id="nurseryEmail" className="form-control input-disabled" placeholder='Email' onChange={handleInputs} value={nurseryData.nurseryEmail} disabled />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="Number" name='nurseryPhone' id="nurseryPhone" className="form-control input-disabled" placeholder='Phone' onChange={handleInputs} value={nurseryData.nurseryPhone} disabled />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="text" name='address' id="address" className="form-control" placeholder='Nursery Address' onChange={handleInputs} value={nurseryData.address} />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="number" name='pinCode' id="pinCode" className="form-control" placeholder='Nursery Pin Code' onChange={handleInputs} value={nurseryData.pinCode} />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="text" name='city' id="city" className="form-control" placeholder='City' onChange={handleInputs} value={nurseryData.city} />
                        </div>

                        <div className="form-outline mb-4">
                            <input type="text" name='state' id="state" className="form-control" placeholder='State' onChange={handleInputs} value={nurseryData.state} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-4">List Your Nursery</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SetNursery