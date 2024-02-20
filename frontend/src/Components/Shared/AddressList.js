import React from 'react'

function AddressList({ addressList, setSelectedAddress, setViewAddressList, viewAddressList }) {

    let list;
    if(addressList) {
        list = addressList.map((elem, index) => {
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
    


    return (
        <div className={"address-list-container-open p-4"}>
            <div className='container-address-list p-0'>
                <div className="p-3 d-flex justify-content-between border bg-dark">
                    <p className="m-2 h5 text-light">
                        <span>Choose Your Address</span>
                    </p>
                    <p className="m-2 h5 text-light close-window" onClick={() => setViewAddressList(!viewAddressList)}>
                        <i className="fas fa-times"></i>
                    </p>
                </div>
                <div className="p-3 address-list">
                    {list}
                </div>
            </div>
        </div>
    )
}

export default AddressList