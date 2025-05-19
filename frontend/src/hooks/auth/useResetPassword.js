import React, { useEffect, useMemo } from 'react'
import useAuthData from './useAuthData';

const useResetPassword = (token) => {
    const { auth, validatePasswordResetToken, validatePasswordReset } = useAuthData();

    const isLoading = useMemo(() => auth.isLoading, [auth.isLoading]);
    const isValidTokenPassword = useMemo(() => auth.isValidTokenPassword, [auth.isValidTokenPassword]);
    const passwordChangeSuccessful = useMemo(() => auth.passwordChangeSuccessful, [auth.passwordChangeSuccessful]);

    useEffect(() => {
        validatePasswordResetToken(token);
    }, []);

    return {isLoading, isValidTokenPassword, passwordChangeSuccessful, validatePasswordResetToken, validatePasswordReset}
}

export default useResetPassword