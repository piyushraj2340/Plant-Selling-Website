import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { addressDeleteAsync, addressListDataFetchAsync, setDefaultAddressAsync } from '../addressSlice';

function Address() {
  const addressList = useSelector(state => state.address.addressList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addressListDataFetchAsync());
  }, [])

  const deleteAddress = async (_id) => {
    dispatch(addressDeleteAsync(_id));
  }

  const addressSetAsDefault = async (_id) => {
      dispatch(setDefaultAddressAsync(_id));
  }

  let list = addressList.map((elem, index) => {
    return (
      <div key={index} className="col-sm-12 col-md-6 col-lg-4 my-2">
        <div className='border border-2 border-primary rounded address-list address-default'>
          {
            elem.setAsDefault &&
            <div className="address-default-heading w-100 p-2 border-bottom">
              <p className="m-1"><span className="text-primary font-italic me-1 h6">Default Address</span></p>
            </div>
          }
          <div className="w-100 p-2 p-md-3">
            <div className="row">
              <address className='m-0'>
                <p className='m-0 h5'>{elem.name}</p>
                <p className='m-0'>{elem.address}</p>
                <p className='m-0'>{elem.city} {elem.state} {elem.pinCode}</p>
                <p className='m-0'>Mobile No: {elem.phone}</p>
              </address>
            </div>
          </div>
          <div className="address-default-footer w-100 border-top p-2">
            <div className="d-flex justify-content-between">
              <Link className="btn btn-sm p-1 p-md-2 btn-secondary link-underline-hover" to={`/address/update/${elem._id}`}><i className="fas fa-pen"></i> Edit</Link>
              {!elem.setAsDefault &&
                <button onClick={() => addressSetAsDefault(elem._id)} className='btn btn-sm p-1 p-md-2 btn-primary link-underline-hover'><i className="fas fa-thumbtack"></i> Set As Default</button>
              }
              <button onClick={() => deleteAddress(elem._id)} className='btn btn-sm p-1 p-md-2 btn-danger link-underline-hover'><i className="fas fa-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <section className='bg-section address p-md-3'>
      <div className="container p-md-2">
        <div className="row p-3 p-md-0">
          <h4 className='h4 border-bottom pb-2'>Your Saved Address</h4>
        </div>
        <div className="row address-container">
          <div className="col-sm-12 col-md-6 col-lg-4 address-list address-add my-2">
            <div className="address-add-btn w-100">
              <Link to={'/address/new'} className='btn btn-secondary border'><i className="fas fa-plus"></i> <span>Add New Address</span></Link>
            </div>
          </div>
          {list}
        </div>
      </div>
    </section>

  )
}

export default Address;