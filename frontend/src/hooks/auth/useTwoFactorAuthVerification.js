import React, { useEffect, useMemo } from 'react'
import useAuthData from './useAuthData';

const useTwoFactorAuthVerification = (token) => {
    const { auth, validateTwoFactorAuthToken, validateTwoFactorAuth, resendOtpTwoFactorAuth } = useAuthData();

    const isLoading = useMemo(() => auth.isLoading, [auth.isLoading]);
    const errorData = useMemo(() => auth.error, [auth.error]);
    const isError = useMemo(() => !!errorData, [errorData]);
    const isOtpResendSuccessful = useMemo(() => auth.isOtpResendSuccessful, [auth.isOtpResendSuccessful]);
    const isOtpValidationDone = useMemo(() => auth.isOtpValidationDone, [auth.isOtpValidationDone]);
    const isValidTokenTwoFactor = useMemo(() => auth.isValidTokenTwoFactor, [auth.isValidTokenTwoFactor]);

    useEffect(() => {
        validateTwoFactorAuthToken(token);
    }, [])

    return { isLoading, isError, errorData, isOtpResendSuccessful, isOtpValidationDone, isValidTokenTwoFactor, validateTwoFactorAuthToken, validateTwoFactorAuth, resendOtpTwoFactorAuth }
}

export default useTwoFactorAuthVerification