import React, { useEffect } from 'react'
import Address from '../features/address/Components/Address'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddressPage = () => {
  document.title = "Your Saved Address";

  const user = useSelector(state => state.user.user);
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