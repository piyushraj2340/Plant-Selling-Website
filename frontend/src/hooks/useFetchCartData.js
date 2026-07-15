import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useIsAuthCheck from './useIsAuthCheck';
import { addToCartAsync, cartDataDeleteAsync, cartDataFetchAsync, cartDataUpdateQuantityAsync } from '../features/cart/cartSlice';

const useFetchCartData = () => {
  const carts = useSelector(state => state.cart.carts);
  const userAuthCheck = useIsAuthCheck(); 
  const dispatch = useDispatch();

  
  const fetchCartData = useCallback(() => {
    if (userAuthCheck) {
      dispatch(cartDataFetchAsync());
    }
  }, [dispatch, userAuthCheck]); 


  const addToCart  = useCallback((data) => {
    if (userAuthCheck) {
      dispatch(addToCartAsync(data));
    }
  }, [dispatch]); 

  const removeFromCart  = useCallback((id) => {
    if (userAuthCheck) {
      dispatch(cartDataDeleteAsync(id));
    }
  }, [dispatch]); 

  const updateProductQuantity = useCallback(({cartId, quantity}) => {
    if(userAuthCheck) {
      dispatch(cartDataUpdateQuantityAsync({ cartId, quantity }));
    }
  }, [dispatch])


  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  return { carts, fetchCartData, addToCart, removeFromCart, updateProductQuantity }; 
}

export default useFetchCartData;
