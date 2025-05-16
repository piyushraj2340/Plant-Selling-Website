import { useDispatch, useSelector } from 'react-redux';

import { useCallback, useEffect, useMemo } from 'react';
import { userProfileAsync, userProfileChangePasswordAsync, userProfileChangeTwoFactorAuthenticationStatusAsync, userProfileDeleteAsync, userProfileImagesUpload, userProfileUpdateAsync } from '../features/user/userSlice';

const useUserData = () => {
  const userData = useSelector(state => state.user.data);
  const isLoading = useSelector(state => state.user.isLoading);
  const errorData = useSelector(state => state.user.error);
  const IsUserDataFetchedError = useSelector(state => state.user.IsUserDataFetchedError);

  const dispatch = useDispatch();

  const getUserData = useCallback(() => {
    if (userData === null && errorData === null) {
      dispatch(userProfileAsync());
    }
  }, [dispatch, userData]);

  // update-data....
  const updateUserData = useCallback((data) => {
    if (userData !== null) {
      dispatch(userProfileUpdateAsync(data));
    }
  }, [dispatch, userData]);

  // delete-data....
  const deleteUserData = useCallback(() => {
    if (userData !== null) {
      dispatch(userProfileDeleteAsync());
    }
  }, [dispatch, userData]);

  // change-password....
  const changeUserPassword = useCallback((data) => {
    if (userData !== null) {
      dispatch(userProfileChangePasswordAsync(data));
    }
  }, [dispatch, userData]);

  const enableDisableTwoFactorStatus = useCallback((data) => {
    if (userData !== null) {
      dispatch(userProfileChangeTwoFactorAuthenticationStatusAsync(data));
    }
  }, [dispatch, userData]);
  
  const avatarImageUpload = useCallback((data) => {
    if (userData !== null) {
      dispatch(userProfileImagesUpload(data));
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if(userData === null || !userData) {
      getUserData();
    }
  }, [getUserData]);

  return {isLoading, isError: !!errorData, errorData, userData, IsUserDataFetchedError, updateUserData, deleteUserData, changeUserPassword, enableDisableTwoFactorStatus, avatarImageUpload};
}

export default useUserData