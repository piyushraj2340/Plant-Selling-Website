import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditAddress from '../features/address/Components/AddressForms/EditAddress';
import { addressListDataFetchAsync } from '../features/address/addressSlice';

const EditAddressPage = () => {
  document.title = "Update Your Address";

  const user = useSelector(state => state.user.user);
  const address = useSelector(state => state.address.addressList);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/address/update/${id}`);
      return;
    }

    !address.length && dispatch(addressListDataFetchAsync());
  }, [])

  return (
    address.length && <EditAddress />
  )
}

export default EditAddressPage