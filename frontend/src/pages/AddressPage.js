import React, { useEffect } from 'react'
import Address from '../features/address/Components/Address'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useUserData from '../hooks/useUserData';

const AddressPage = () => {
  document.title = "Your Saved Address";

  const {userData:user} = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate("/login?redirect=/address");
    }
  }, [])

  return (
    user && <Address />
  )
}

export default AddressPage