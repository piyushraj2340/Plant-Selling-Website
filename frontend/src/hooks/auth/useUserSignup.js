import React, { useMemo } from 'react'
import useAuthData from './useAuthData';

const useUserSignup = () => {
    const { auth, userSignup } = useAuthData();

    const isLoading = useMemo(() => auth.isLoading, [auth.isLoading]);
    const errorData = useMemo(() => auth.error, [auth.error]);
    const isError = useMemo(() => !!errorData, [errorData]);
    const email = useMemo(() => auth.email, [auth.email]);
    const isUserVerificationNeeded = useMemo(() => auth.isUserVerificationNeeded, [auth.isUserVerificationNeeded]);


    return { isLoading, isError, errorData, email, isUserVerificationNeeded, userSignup };
}

export default useUserSignup