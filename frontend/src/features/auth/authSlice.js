import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';
import { message } from 'antd';
import { loadingRestAuthStore, trueAuthCheckResetAuthStore, resetToDefaultAuthStore, userAccountVerificationAuthStore, validateVerificationTokenAuthStore, validatePasswordResetTokenAuthStore, validatePasswordResetAuthStore } from './Components/utils/authHelper';

const initialState = {
    userAuthCheck: null,
    isUserVerificationNeeded: null,
    email: '',
    isValidToken: null,
    verificationCompleted: null,
    isValidTokenPassword: null,
    passwordChangeSuccessful: null,
    isLoading: null,
    error: null,
}

export const userAuthCheckAsync = createAsyncThunk('/auth/authCheck', async () => {
    const response = await handelDataFetch('/api/v2/auth/checkUser', 'GET');
    return response.data;
})

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
    console.log(body);

    const response = await handelDataFetch(`/api/v2/user/resetPassword/${body.token}`, 'POST', body.data);
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
            .addCase(userAuthCheckAsync.pending, (state) => {
                //^ PENDING: USER_AUTH_CHECK 

                loadingRestAuthStore(state);

            }).addCase(userAuthCheckAsync.fulfilled, (state) => {
                //* FULFILLED: USER_AUTH_CHECK 

                trueAuthCheckResetAuthStore(state);

            }).addCase(userAuthCheckAsync.rejected, (state, action) => {
                //! REJECTED: USER_AUTH_CHECK 

                resetToDefaultAuthStore(state);
            })
            .addCase(userLoginAsync.pending, (state) => {
                //^ PENDING: USER_LOGIN

                loadingRestAuthStore(state);

            }).addCase(userLoginAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGIN

                trueAuthCheckResetAuthStore(state);

                message.success(action.payload.message)

            }).addCase(userLoginAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGIN

                resetToDefaultAuthStore(state);

                if (action.error.message === 'You need to verify your account') {
                    state.isUserVerificationNeeded = true;
                    state.email = action.meta.arg.email;
                }

                message.error(action.error.message);

            }).addCase(userSignupAsync.pending, (state) => {
                //^ PENDING: USER_SIGN-UP

                loadingRestAuthStore(state);

            }).addCase(userSignupAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_SIGN-UP

                resetToDefaultAuthStore(state);

                state.isUserVerificationNeeded = true;
                state.email = action.payload.result.email;

                message.success(action.payload.message);

            }).addCase(userSignupAsync.rejected, (state, action) => {
                //! REJECTED: USER_SIGN-UP

                resetToDefaultAuthStore(state);

                message.error(action.error.message);

            })
            .addCase(userLogoutAsync.pending, (state) => {
                //^ PENDING: USER_LOGOUT

                loadingRestAuthStore(state);


            }).addCase(userLogoutAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGOUT

                resetToDefaultAuthStore(state);

                message.success(action.payload.message);

            }).addCase(userLogoutAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGOUT

                resetToDefaultAuthStore(state);

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
                //^ PENDING: USER_LOGOUT

                loadingRestAuthStore(state);


            }).addCase(validatePasswordResetAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGOUT

                validatePasswordResetAuthStore(state);

            }).addCase(validatePasswordResetAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGOUT

                resetToDefaultAuthStore(state);

                state.passwordChangeSuccessful = false;

                message.error(action.error.message);

            })
    }
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;