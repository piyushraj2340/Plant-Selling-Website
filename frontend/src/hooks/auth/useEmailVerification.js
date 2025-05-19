import React, { useEffect, useMemo } from 'react'
import useAuthData from './useAuthData';

const useEmailVerification = (token) => {
    const { auth, userAccountVerification, validateVerificationToken } = useAuthData();



    const isLoading = useMemo(() => auth.isLoading, [auth.isLoading]);
    const verificationCompleted = useMemo(() => auth.verificationCompleted, [auth.verificationCompleted]);
    const isValidToken = useMemo(() => auth.isValidToken, [auth.isValidToken]);

    useEffect(() => {
        validateVerificationToken(token);
    }, []);


    return {isLoading, verificationCompleted, isValidToken, userAccountVerification}
}

export default useEmailVerification