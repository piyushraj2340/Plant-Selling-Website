import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddressAsync, addressDeleteAsync, addressListDataFetchAsync, getAddressByIdAsync, setDefaultAddressAsync, updateAddressAsync } from '../features/address/addressSlice';
import useUserData from './useUserData';

const useAddress = () => {
  const { userData: user } = useUserData();
  const addressList = useSelector(state => state.address.addressList);
  const lastFetched = useSelector(state => state.address.lastFetched);
  const isLoading = useSelector(state => state.address.isLoading);
  const errorData = useSelector(state => state.address.error);

  console.log("Address List:", addressList);
  console.log("Last Fetched:", lastFetched);
  console.log("Is Loading:", isLoading);
  console.log("Error Data:", errorData);

  const dispatch = useDispatch();

  const getAddressList = useCallback(() => {
    if (user && (lastFetched === null || Date.now() - lastFetched > 60000) && !isLoading) {
      dispatch(addressListDataFetchAsync());
    }
  }, [dispatch, user]);

  const deleteAddress = useCallback((id) => {
    if (user) {
      dispatch(addressDeleteAsync(id));
    }
  }, [dispatch, user, addressList]);

  const addNewAddress = useCallback((data) => {
    if (user) {
      dispatch(addNewAddressAsync(data));
    }
  }, [dispatch, user, addressList]);

  const updateAddress = useCallback((data) => {
    if (user) {
      dispatch(updateAddressAsync(data));
    }
  }, [dispatch, user, addressList]);

  const setDefaultAddress = useCallback((id) => {
    if (user) {
      dispatch(setDefaultAddressAsync(id));
    }
  }, [dispatch, user, addressList]);

  const getAddressById = useCallback((id) => {
    if (user) {
      dispatch(getAddressByIdAsync(id));
    }
  }, [dispatch, user, addressList]);

  useEffect(() => {
    getAddressList();
  }, [dispatch, user]);


  console.log("number of time re-renders....");
  

  return {
    isLoading,
    isError: !!errorData,
    errorData,
    addressList,
    getAddressList,
    deleteAddress,
    addNewAddress,
    updateAddress,
    setDefaultAddress,
    getAddressById
  };
}

export default useAddress