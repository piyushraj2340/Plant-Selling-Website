import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Animation from './Shared/Animation';
import handelDataFetch from '../Controller/handelDataFetch';

function AddNursery() {
    document.title = "Update Your Nursery Data.";

    const [nursery, setNursery] = useState({
        user: "",
        nursery: "",
        nurseryOwnerName: "",
        nurseryName: "",
        nurseryEmail: "",
        nurseryPhone: "",
        pinCode: "",
        address: "",
        city: "",
        state: ""
    });

    const [showAnimation, setShowAnimation] = useState(false);

    const { id } = useParams();

    const navigate = useNavigate();

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;

        setNursery({ ...nursery, [name]: value });
    }

    const handelNurseryData = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/nursery/profile", method: "GET" }, setShowAnimation);

            if (result.status) {
                setNursery(result.result);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    }

    useEffect(() => {
        handelNurseryData();
    }, []);


    const updateData = async (e) => {
        try {
            e.preventDefault();

            const result = await handelDataFetch({path: `/api/v2/nursery/profile/${id}`, method: "PATCH", body: nursery}, setShowAnimation);

            if (result.status) {
                navigate('/nursery');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <div className="container my-5 d-flex justify-content-center" >
                <div className="col-sm-12 col-md-9 border py-3 mt-5">
                    <h3 className='h3 mb-3 text-center'>
                        Edit Your Nursery
                    </h3>
                    <div className="row p-4">
                        <form method="POST">
                            <div className="form-outline mb-4">
                                <input type="text" name='nurseryOwnerName' id="nurseryOwnerName" className="form-control input-disabled" placeholder='Full Name' onChange={handleInputs} value={nursery.nurseryOwnerName} disabled />
                            </div>
                            <div className="form-outline mb-4">
                                <input type="text" name='nurseryName' id="nurseryName" className="form-control" placeholder='Nursery Name' onChange={handleInputs} value={nursery.nurseryName} />
                            </div>

                            <div className="form-outline mb-4">
                                <input type="email" name='nurseryEmail' id="nurseryEmail" className="form-control input-disabled" placeholder='Email' onChange={handleInputs} value={nursery.nurseryEmail} disabled />
                            </div>

                            <div className="form-outline mb-4">
                                <input type="Number" name='nurseryPhone' id="nurseryPhone" className="form-control input-disabled" placeholder='Phone' onChange={handleInputs} value={nursery.nurseryPhone} disabled />
                            </div>

                            <div className="form-outline mb-4">
                                <input type="text" name='address' id="address" className="form-control" placeholder='Nursery Address' onChange={handleInputs} value={nursery.address} />
                            </div>

                            <div className="form-outline mb-4">
                                <input type="number" name='pinCode' id="pinCode" className="form-control" placeholder='Nursery Pin Code' onChange={handleInputs} value={nursery.pinCode} />
                            </div>

                            <div className="form-outline mb-4">
                                <input type="text" name='city' id="city" className="form-control" placeholder='City' onChange={handleInputs} value={nursery.city} />
                            </div>

                            <div className="form-outline mb-4">
                                <input type="text" name='state' id="state" className="form-control" placeholder='State' onChange={handleInputs} value={nursery.state} />
                            </div>

                            <button onClick={updateData} type="submit" className="btn btn-primary btn-block mb-4">Update Your Nursery</button>
                        </form>
                    </div>
                </div>
            </div>

            {showAnimation && <Animation />}
        </>

    )
}

export default AddNursery