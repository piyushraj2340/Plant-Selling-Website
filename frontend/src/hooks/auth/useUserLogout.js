import { useEffect, useMemo, useState } from 'react'
import useAuthData from './useAuthData';
import { useNavigate } from 'react-router-dom';

const useUserLogout = () => {
  const { auth, userLogout } = useAuthData();
  const isLoading = useMemo(() => auth.isLoading, [auth.isLoading]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      userLogout(); // Trigger logout side-effect (e.g., clear state, redirect, notify)
    }
  }, []);

  return { isLoading };
}

export default useUserLogout