import React from 'react'

function AddressList({ addressList, setSelectedAddress, setViewAddressList, viewAddressList }) {

    return (
        <div className="address-list-container-open p-2 p-md-4 position-fixed d-flex justify-content-center align-items-center">
            <div className='container-address-list col-12 col-sm-8 col-md-6 col-lg-4 bg-light rounded'>
                <div className="p-3 d-flex justify-content-between bg-dark">
                    <p className="m-2 h5 text-light">
                        <span>Choose Your Address</span>
                    </p>
                    <p className="m-2 h5 text-light close-window" onClick={() => setViewAddressList(!viewAddressList)}>
                        <i className="fas fa-times"></i>
                    </p>
                </div>
               <div className="p-3 address-list">
                     <p>Select a delivery location to see product availability and delivery options</p>
                    {
                        addressList &&

                        addressList.map((elem, index) => {
                            return (
                                <div key={index} onClick={() => setSelectedAddress(elem._id)} className='m-3 p-3 border rounded select-address'>
                                    <p className='m-0 h6'>{elem.name}</p>
                                    <p className='m-0'>{elem.address}</p>
                                    <p className='m-0'>{elem.city} {elem.state} {elem.pinCode}</p>
                                    <p className='m-0'>Mobile No: {elem.phone}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default AddressList