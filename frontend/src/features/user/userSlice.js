import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';
import { userLoginAsync, userSignupAsync, userLogoutAsync } from '../auth/authSlice';
import { nurseryCreateAsync } from '../nursery/nurserySlice';

const initialState = {
    user: null,
    isLoading: false,
    error: null,
}

export const userProfileAsync = createAsyncThunk('/user/profile', async () => {
    const response = await handelDataFetch('/api/v2/user/profile', 'GET');
    return response.data;
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userProfileAsync.pending, (state) => {
                //^ PENDING: USER_PROFILE

                state.isLoading = true;
                state.error = null;

            }).addCase(userProfileAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_PROFILE

                state.isLoading = false;
                state.user = action.payload.result;
                state.error = null;

            }).addCase(userProfileAsync.rejected, (state, action) => {
                //! REJECTED: USER_PROFILE

                state.isLoading = false;
                state.user = null;
                state.error = action.error;

            }).addCase(userLoginAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGIN

                state.user = action.payload.result;
                state.error = null;

            }).addCase(userSignupAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_SIGN-UP

                state.user = action.payload.result;
                state.error = null;

            }).addCase(userLogoutAsync.fulfilled, (state) => {
                //* FULFILLED: USER_LOGOUT

                state.user = null;
                state.isLoading = false;
                state.error = null;
                
            }).addCase(nurseryCreateAsync.fulfilled, (state) => {
                //* FULFILLED: NURSERY_CREATE

                if(!state.user.role.includes("seller")) {
                    state.user.role.push("seller");
                }
                
                state.error = null;

            })
    }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;