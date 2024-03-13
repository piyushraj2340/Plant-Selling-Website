import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';
import { message } from 'antd';

const initialState = {
    userAuthCheck: false,
    isLoading: false,
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

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userAuthCheckAsync.pending, (state) => {
                //^ PENDING: USER_AUTH_CHECK 

                state.isLoading = true;
                state.error = null;
                state.userAuthCheck = false;

            }).addCase(userAuthCheckAsync.fulfilled, (state) => {
                //* FULFILLED: USER_AUTH_CHECK 

                state.isLoading = false;
                state.error = null;
                state.userAuthCheck = true;

            }).addCase(userAuthCheckAsync.rejected, (state, action) => {
                //! REJECTED: USER_AUTH_CHECK 

                state.isLoading = false;
                state.error = action.error;
                state.userAuthCheck = false;

            })
            .addCase(userLoginAsync.pending, (state) => {
                //^ PENDING: USER_LOGIN

                state.isLoading = true;
                state.error = null;
                state.userAuthCheck = false;

            }).addCase(userLoginAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGIN

                state.isLoading = false;
                state.error = null;
                state.userAuthCheck = true;

                message.success(action.payload.message)

            }).addCase(userLoginAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGIN

                state.isLoading = false;
                state.error = action.error;
                state.userAuthCheck = false;

                message.error(action.error.message);

            }).addCase(userSignupAsync.pending, (state) => {
                //^ PENDING: USER_SIGN-UP

                state.isLoading = true;
                state.error = null;
                state.userAuthCheck = false;


            }).addCase(userSignupAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_SIGN-UP

                state.isLoading = false;
                state.error = null;
                state.userAuthCheck = true;

                message.success(action.payload.message);

            }).addCase(userSignupAsync.rejected, (state, action) => {
                //! REJECTED: USER_SIGN-UP

                state.isLoading = false;
                state.error = action.error;
                state.userAuthCheck = false;

                message.error(action.error.message);

            })
            .addCase(userLogoutAsync.pending, (state) => {
                //^ PENDING: USER_LOGOUT

                state.isLoading = true;
                state.error = null;
                state.userAuthCheck = false;


            }).addCase(userLogoutAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGOUT

                state.isLoading = false;
                state.error = null;
                state.userAuthCheck = false;

                message.success(action.payload.message);

            }).addCase(userLogoutAsync.rejected, (state, action) => {
                //! REJECTED: USER_LOGOUT

                state.isLoading = false;
                state.error = action.error;
                state.userAuthCheck = false;

                message.error(action.error.message);

            })
    }
});

// export const {  } = authSlice.actions;
export default authSlice.reducer;