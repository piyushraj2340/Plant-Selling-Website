import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';
import { userLoginAsync, userSignupAsync, userLogoutAsync } from '../auth/authSlice';
import { nurseryCreateAsync } from '../nursery/nurserySlice';
import { handelImageUploadProfileAvatar } from './userAPI';
import { message } from 'antd';
import localStorageUtil from '../../utils/localStorage';

const initialState = {
    user: null,
    isLoading: false,
    error: null,
}

// GET User Profile....
export const userProfileAsync = createAsyncThunk('/user/profile/get', async () => {
    const response = await handelDataFetch('/api/v2/user/profile', 'GET');
    return response.data;
})

// Update User Profile
export const userProfileUpdateAsync = createAsyncThunk('/user/profile/update', async (data) => {
    const response = await handelDataFetch('/api/v2/user/profile', 'PATCH', data);
    return response.data;
})

// Delete User Profile
export const userProfileDeleteAsync = createAsyncThunk('/user/profile/delete', async () => {
    const response = await handelDataFetch('/api/v2/user/profile', 'DELETE');
    return response.data;
})

// change user password
export const userProfileChangePasswordAsync = createAsyncThunk('/user/profile/changePassword', async (data) => {
    const response = await handelDataFetch('/api/v2/user/profile/changePassword', 'POST', data);
    return response.data;
})

// change status of two-factor authentication
export const userProfileChangeTwoFactorAuthenticationStatusAsync = createAsyncThunk('/user/profile/two-factor/update', async (data) => {
    const response = await handelDataFetch('/api/v2/user/profile/two-factor/update', 'POST', data);
    return response.data;
})

export const userProfileImagesUpload = createAsyncThunk('/user/images/profile/upload', async (image) => {
    const response = await handelImageUploadProfileAvatar(image);
    return response.data;
});


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

            }).addCase(userProfileUpdateAsync.pending, (state) => {
                //^ PENDING: USER_PROFILE

                state.isLoading = true;
                state.error = null;

               

            }).addCase(userProfileUpdateAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_PROFILE

                state.isLoading = false;
                state.user = action.payload.result;
                state.error = null;

            }).addCase(userProfileUpdateAsync.rejected, (state, action) => {
                //! REJECTED: USER_PROFILE

                state.isLoading = false;
                state.user = null;
                state.error = action.error;

            })
            .addCase(userProfileDeleteAsync.pending, (state) => {
                //^ PENDING: USER_PROFILE

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait your profile data is deleting...");

            }).addCase(userProfileDeleteAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_PROFILE

                state.isLoading = false;
                state.user = null;
                state.error = null;

                localStorageUtil.removeData("accessToken");
                localStorageUtil.removeData("refreshToken");
                localStorageUtil.removeData("orderToken");

                message.success(action.payload.message || "User Profile deleted successfully");

            }).addCase(userProfileDeleteAsync.rejected, (state, action) => {
                //! REJECTED: USER_PROFILE

                state.isLoading = false;
                state.user = null;
                state.error = action.error;

                message.error(action.error.message || "Error: while deleting user data...");

            })
            .addCase(userProfileChangePasswordAsync.pending, (state) => {
                //^ PENDING: USER_PROFILE

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait, while your password is changing...");

            }).addCase(userProfileChangePasswordAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_PROFILE

                state.isLoading = false;
                state.user = action.payload.result;
                state.error = null;

                message.success(action.payload.message || "Password changed successfully");

            }).addCase(userProfileChangePasswordAsync.rejected, (state, action) => {
                //! REJECTED: USER_PROFILE

                state.isLoading = false;
                state.user = null;
                state.error = action.error;

                message.error(action.error.message || "Error: while changing password!");

            })
            .addCase(userProfileChangeTwoFactorAuthenticationStatusAsync.pending, (state) => {
                //^ PENDING: USER_PROFILE

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait, while we are updating status for two-factor authentication");

            }).addCase(userProfileChangeTwoFactorAuthenticationStatusAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_PROFILE

                state.isLoading = false;
                state.user = action.payload.result;
                state.error = null;

                message.success(action.payload.message || "Two-factor authentication status changed successfully");

            }).addCase(userProfileChangeTwoFactorAuthenticationStatusAsync.rejected, (state, action) => {
                //! REJECTED: USER_PROFILE

                state.isLoading = false;
                state.user = null;
                state.error = action.error;

                message.error(action.error.message || "Error: while changing status of two-factor authentication!");

            })
            .addCase(userProfileImagesUpload.pending, (state) => {
                //^ PENDING: USER_AVATAR_IMAGES_UPLOAD

                state.isLoading = true;
                state.error = null;

                message.loading("Please wait we are uploading images...");

            }).addCase(userProfileImagesUpload.fulfilled, (state, action) => {
                //* FULFILLED: USER_AVATAR_IMAGES_UPLOAD

                // TODO: make only the changes of the images not all the data

                state.isLoading = false;
                state.user = action.payload.result;
                state.error = null;

                message.success(action.payload.message);

            }).addCase(userProfileImagesUpload.rejected, (state, action) => {
                //! REJECTED: USER_AVATAR_IMAGES_UPLOAD

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);
            }).addCase(userLoginAsync.fulfilled, (state, action) => {
                //* FULFILLED: USER_LOGIN

                state.user = action.payload.result;
                state.error = null;

            }).addCase(userLogoutAsync.fulfilled, (state) => {
                //* FULFILLED: USER_LOGOUT

                state.user = null;
                state.isLoading = false;
                state.error = null;

            }).addCase(nurseryCreateAsync.fulfilled, (state) => {
                //* FULFILLED: NURSERY_CREATE

                if (!state.user.role.includes("seller")) {
                    state.user.role.push("seller");
                }

                state.error = null;

            })
    }
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;