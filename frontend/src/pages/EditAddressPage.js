import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditAddress from '../features/address/Components/AddressForms/EditAddress';
import {  getAddressByIdAsync, addressResetApiState } from '../features/address/addressSlice';
import useUserData from '../hooks/useUserData';

const EditAddressPage = () => {
  document.title = "Update Your Address";

  const {userData:user} = useUserData();
  const address = useSelector(state => state.address.addressList);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/address/update/${id}`);
    }

    address ?? dispatch(getAddressByIdAsync(id));

    if(address && address?.length) {
      !(address.find(a => a._id === id)) && dispatch(getAddressByIdAsync(id));
    }

    return () => {
      dispatch(addressResetApiState());
    }
  }, []) 

  return (
    address && <EditAddress />
  )
}

export default EditAddressPage