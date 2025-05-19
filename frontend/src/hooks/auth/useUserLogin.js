import React, { useMemo } from 'react'
import useAuthData from './useAuthData';

const useUserLogin = () => {
    const { auth, userLogin } = useAuthData();

    const isLoading = useMemo(() => auth.isLoading, [auth.isLoading]);
    const errorData = useMemo(() => auth.error, [auth.error]);
    const isError = useMemo(() => !!errorData, [errorData]);
    const email = useMemo(() => auth.email, [auth.email]);
    const isUserVerificationNeeded = useMemo(() => auth.isUserVerificationNeeded, [auth.isUserVerificationNeeded]);
    const isUserTwoFactorAuthNeeded = useMemo(() => auth.isUserTwoFactorAuthNeeded, [auth.isUserTwoFactorAuthNeeded]);
    const twoFactorAuthNeededToken = useMemo(() => auth.twoFactorAuthNeededToken, [auth.twoFactorAuthNeededToken]);

    return {isLoading, isError, errorData, isUserVerificationNeeded,isUserTwoFactorAuthNeeded, twoFactorAuthNeededToken, email,  userLogin};
}

export default useUserLogin