import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';
import { message } from 'antd';
import { loadingRestAuthStore, trueAuthCheckResetAuthStore, resetToDefaultAuthStore, userAccountVerificationAuthStore, validateVerificationTokenAuthStore, validatePasswordResetTokenAuthStore, validatePasswordResetAuthStore } from './Components/utils/authHelper';
import localStorageUtil from '../../utils/localStorage';

const initialState = {
    isLoading: false,
    error: null,
    isUserVerificationNeeded: null,
    email: '',
    isValidToken: null,
    verificationCompleted: null,
    isValidTokenPassword: null,
    passwordChangeSuccessful: null,
    isUserTwoFactorAuthNeeded: null,
    twoFactorAuthNeededToken: null,
    isValidTokenTwoFactor: null,
    isOtpValidationDone: null,
    isOtpResendSuccessful: null,
}

export const userLoginAsync = createAsyncThunk('/auth/loginUser', async (body) => {
    const response = await handelDataFetch('/api/v2/auth/sign-in', 'POST', body);
    return response.data;
});

export const userSignupAsync = createAsyncThunk('/auth/signupUser', async (body) => {
    const response = await handelDataFetch('/api/v2/auth/sign-up', 'POST', body);
    return response.data;
})

export const userLogoutAsync = createAsyncThunk('/auth/logoutUser', async () => {
    const response = await handelDataFetch('/api/v2/auth/logout', 'GET');
    return response.data;
})

export const userAccountVerificationAsync = createAsyncThunk('/auth/userAccountVerification', async (body) => {
    const response = await handelDataFetch(`/api/v2/user/verification/${body.token}`, 'POST', body);
    return response.data;
})

export const validateVerificationTokenAsync = createAsyncThunk('/auth/validateVerificationToken', async (token) => {
    const response = await handelDataFetch(`/api/v2/user/validateVerificationToken/${token}`, 'POST');
    return response.data;
})

export const validatePasswordResetTokenAsync = createAsyncThunk('/auth/validatePasswordResetToken', async (token) => {
    const response = await handelDataFetch(`/api/v2/user/validatePasswordResetToken/${token}`, 'POST');
    return response.data;
})


export const validatePasswordResetAsync = createAsyncThunk('/auth/validatePasswordReset', async (body) => {
    const response = await handelDataFetch(`/api/v2/user/resetPassword/${body.token}`, 'POST', body.data);
    return response.data;
})

export const validateTwoFactorAuthTokenAsync = createAsyncThunk('/auth/validateTwoFactorAuthToken', async (token) => {
    const response = await handelDataFetch(`/api/v2/auth/validateOtp/${token}`, 'GET');
    return response.data;
})


export const validateTwoFactorAuthAsync = createAsyncThunk('/auth/validateTwoFactorAuth', async (data) => {
    const response = await handelDataFetch(`/api/v2/auth/validateOtp/${data.token}`, 'POST', {otp: data.otp});
    return response.data;
})

export const resendOtpTwoFactorAuthAsync = createAsyncThunk('/auth/resendOtpTwoFactorAuth', async (token) => {
    const response = await handelDataFetch(`/api/v2/auth/resendOtp/${token}`, 'POST');
    return response.data;
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetState: (state) => {
            resetToDefaultAuthStore(state);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLoginAsync.pending, (state) => {
                //^ PENDING: USER_LOGIN

                loadingRestAuthStore(state);

            }).addCase(userLoginAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGIN
                resetToDefaultAuthStore(state);
                trueAuthCheckResetAuthStore(state);

                if(action.payload.code) {

                    if (action.payload.code === 'VerifyUser') {
                        state.isUserVerificationNeeded = true;
                        state.email = action.meta.arg.email;
                    } else if(action.payload.code === 'TwoFactorAuth') {
                        state.isUserTwoFactorAuthNeeded = true;
                        state.twoFactorAuthNeededToken = action.payload.token;
                    }

                    message.error(action.payload.message || "You need to verify your account first.");

                    return;
                }
                

  
                localStorageUtil.setData("accessToken", action.payload.token.accessToken);
                localStorageUtil.setData("refreshToken", action.payload.token.refreshToken);

                message.success(action.payload.message)

            }).addCase(userLoginAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGIN

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);

            }).addCase(userSignupAsync.pending, (state) => {
                //^ PENDING: USER_SIGN-UP

                state.isLoading = true;
                state.error = null;

            }).addCase(userSignupAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_SIGN-UP

                resetToDefaultAuthStore(state);

                state.isUserVerificationNeeded = true;
                state.email = action.payload.result.email;

                message.success(action.payload.message);

            }).addCase(userSignupAsync.rejected, (state, action) => {
                //! REJECTED: USER_SIGN-UP

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);

            })
            .addCase(userLogoutAsync.pending, (state) => {
                //^ PENDING: USER_LOGOUT

                state.isLoading = true;
                state.error = null;


            }).addCase(userLogoutAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGOUT

                state.isLoading = false;
                state.error = null;
                
                localStorageUtil.removeData("refreshToken");
                localStorageUtil.removeData("accessToken");
                localStorageUtil.removeData("orderToken");

                message.success(action.payload.message);

            }).addCase(userLogoutAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGOUT

                state.isLoading  = false;
                state.error = action.error.message;

                message.error(action.error.message);

            })
            .addCase(userAccountVerificationAsync.pending, (state) => {
                //^ PENDING: USER_LOGOUT

                loadingRestAuthStore(state);


            }).addCase(userAccountVerificationAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGOUT

                userAccountVerificationAuthStore(state);

                message.success(action.payload.message);

            }).addCase(userAccountVerificationAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGOUT

                resetToDefaultAuthStore(state);

                state.verificationCompleted = false;

                message.error(action.error.message);

            })
            .addCase(validateVerificationTokenAsync.pending, (state) => {
                //^ PENDING: USER_LOGOUT

                loadingRestAuthStore(state);


            }).addCase(validateVerificationTokenAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGOUT

                validateVerificationTokenAuthStore(state);

            }).addCase(validateVerificationTokenAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGOUT

                resetToDefaultAuthStore(state);

                state.isValidToken = false;

                message.error(action.error.message);

            })
            .addCase(validatePasswordResetTokenAsync.pending, (state) => {
                //^ PENDING: USER_LOGOUT

                loadingRestAuthStore(state);


            }).addCase(validatePasswordResetTokenAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGOUT

                validatePasswordResetTokenAuthStore(state);

            }).addCase(validatePasswordResetTokenAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGOUT

                resetToDefaultAuthStore(state);

                state.isValidTokenPassword = false;

                message.error(action.error.message);

            })
            .addCase(validatePasswordResetAsync.pending, (state) => {
                //^ PENDING: PASSWORD_RESET

                loadingRestAuthStore(state);


            }).addCase(validatePasswordResetAsync.fulfilled, (state, action) => {
                //* FULFILLED: PASSWORD_RESET

                validatePasswordResetAuthStore(state);

            }).addCase(validatePasswordResetAsync.rejected, (state, action) => {
                //! REJECTED: PASSWORD_RESET

                resetToDefaultAuthStore(state);

                state.passwordChangeSuccessful = false;

                message.error(action.error.message);

            })
            .addCase(validateTwoFactorAuthTokenAsync.pending, (state) => {
                //^ PENDING: TWO_FACTOR_AUTH_TOKEN

                loadingRestAuthStore(state);


            }).addCase(validateTwoFactorAuthTokenAsync.fulfilled, (state, action) => {
                //* FULFILLED: TWO_FACTOR_AUTH_TOKEN

                resetToDefaultAuthStore(state);
                state.isValidTokenTwoFactor = true;

            }).addCase(validateTwoFactorAuthTokenAsync.rejected, (state, action) => {
                //! REJECTED: TWO_FACTOR_AUTH_TOKEN

                resetToDefaultAuthStore(state);

                state.isValidTokenTwoFactor = false;
                state.twoFactorAuthNeededToken = null;
                state.isUserTwoFactorAuthNeeded = null;


                message.error(action.error.message || "Your OTP Session is expired!.");

            })
            .addCase(validateTwoFactorAuthAsync.pending, (state) => {
                //^ PENDING: VALIDATE_TWO_FACTOR_AUTH

                loadingRestAuthStore(state);
            }).addCase(validateTwoFactorAuthAsync.fulfilled, (state, action) => {
                //* FULFILLED: VALIDATE_TWO_FACTOR_AUTH

                trueAuthCheckResetAuthStore(state);
                state.isOtpValidationDone = true;

                localStorageUtil.setData("accessToken", action.payload.token.accessToken);
                localStorageUtil.setData("refreshToken", action.payload.token.refreshToken);
                
                message.success(action.payload.message);

            }).addCase(validateTwoFactorAuthAsync.rejected, (state, action) => {
                //! REJECTED: VALIDATE_TWO_FACTOR_AUTH

                resetToDefaultAuthStore(state);

                state.isValidTokenTwoFactor = null;
                state.twoFactorAuthNeededToken = null;
                state.isUserTwoFactorAuthNeeded = null;

                state.isOtpValidationDone = false;

                message.error(action.error.message || "Your OTP is invalid.");

            })
            
            .addCase(resendOtpTwoFactorAuthAsync.pending, (state) => {
                //^ PENDING: VALIDATE_TWO_FACTOR_AUTH

                loadingRestAuthStore(state);
            }).addCase(resendOtpTwoFactorAuthAsync.fulfilled, (state, action) => {
                //* FULFILLED: VALIDATE_TWO_FACTOR_AUTH

                trueAuthCheckResetAuthStore(state);

                state.isValidTokenTwoFactor = true;
                state.isOtpResendSuccessful = true;
                
                message.success(action.payload.message);

            }).addCase(resendOtpTwoFactorAuthAsync.rejected, (state, action) => {
                //! REJECTED: VALIDATE_TWO_FACTOR_AUTH

                resetToDefaultAuthStore(state);

                state.isValidTokenTwoFactor = false;
                state.twoFactorAuthNeededToken = null;
                state.isUserTwoFactorAuthNeeded = false;
                state.isOtpResendSuccessful = false;

                state.isOtpValidationDone = false;

                message.error(action.error.message || "Your OTP is invalid.");

            })
    }
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;