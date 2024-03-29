import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handelDataFetch from "../../utils/handelDataFetch";
import { message } from "antd";
import { userLogoutAsync } from "../auth/authSlice";

const initialState = {
    addressList: [],
    selectedAddress: null,
    addressesLength: 0,
    error: null,
    isLoading: false,
}

export const addressListDataFetchAsync = createAsyncThunk('/address/data/fetch', async () => {
    const response = await handelDataFetch('/api/v2/user/address', 'GET');
    return response.data;
});

export const addressDeleteAsync = createAsyncThunk('/address/data/delete', async (_id) => {
    const response = await handelDataFetch(`/api/v2/user/address/${_id}`, 'DELETE');
    return response.data;
});

export const addNewAddressAsync = createAsyncThunk('/address/data/add', async (data) => {
    const response = await handelDataFetch('/api/v2/user/address/', 'POST', data.address);
    return { result: response.data, redirect: data.redirect, navigate: data.navigate };
});

export const setDefaultAddressAsync = createAsyncThunk('/address/data/set/default', async (_id) => {
    const response = await handelDataFetch(`/api/v2/user/address/${_id}`, 'PATCH', { setAsDefault: true });
    return response.data;
});

export const updateAddressAsync = createAsyncThunk('/address/data/update', async (data) => {
    const response = await handelDataFetch(`/api/v2/user/address/${data._id}`, 'PATCH', data.address);
    return { result: response.data, redirect: data.redirect, navigate: data.navigate };
});

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogoutAsync.fulfilled, () => {
                //* CLEANUP: TASK
                //? LOGOUT_CLEANUP_TASK:: REMOVE ALL THE CART INFORMATION AFTER LOGOUT

                return initialState;

            })
            .addCase(addressListDataFetchAsync.pending, (state) => {
                //^ PENDING: ADDRESS_DATA_FETCHING

                state.isLoading = true;
                state.error = null;

            }).addCase(addressListDataFetchAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_DATA_FETCHING

                state.isLoading = false;
                state.addressList = action.payload.result;
                state.addressesLength = action.payload.result.length;
                state.error = null;

            }).addCase(addressListDataFetchAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_DATA_FETCHING

                state.isLoading = false;
                state.error = action.error;

            }).addCase(addressDeleteAsync.pending, (state) => {
                //^ PENDING: ADDRESS_DATA_DELETING

                state.isLoading = true;
                state.error = null;

            }).addCase(addressDeleteAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_DATA_DELETING

                state.isLoading = false;

                //? STEPS TO DELETE DATA FROM ADDRESS_LIST:
                const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result._id);
                state.addressList.splice(addressIndex, 1);
                state.addressesLength = state.addressList.length;

                state.error = null;

            }).addCase(addressDeleteAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_DATA_DELETING

                state.isLoading = false;
                state.error = action.error;

            }).addCase(addNewAddressAsync.pending, (state) => {
                //^ PENDING: ADDRESS_ADD_NEW_DATA

                state.isLoading = true;
                state.error = null;

            }).addCase(addNewAddressAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_ADD_NEW_DATA

                state.isLoading = false;

                //? STEPS TO ADD NEW DATA INTO ADDRESS_LIST:
                state.addressList.concat(action.payload.result.result);
                state.addressesLength = state.addressList.length;

                message.success(action.payload.result.message);

                action.payload.navigate(action.payload.redirect);

                state.error = null;

            }).addCase(addNewAddressAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_ADD_NEW_DATA

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            }).addCase(setDefaultAddressAsync.pending, (state) => {
                //^ PENDING: ADDRESS_SET_DEFAULT_ADDRESS

                state.isLoading = true;
                state.error = null;

            }).addCase(setDefaultAddressAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_SET_DEFAULT_ADDRESS

                state.isLoading = false;

                //? STEPS TO REPLACE THE OLD ADDRESS:
                if (state.addressList[0].setAsDefault) state.addressList[0].setAsDefault = false;

                const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result._id);
                state.addressList.splice(addressIndex, 1);
                state.addressList.splice(0, 0, action.payload.result);

                state.error = null;

            }).addCase(setDefaultAddressAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_SET_DEFAULT_ADDRESS

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            }).addCase(updateAddressAsync.pending, (state) => {
                //^ PENDING: ADDRESS_UPDATE_ADDRESS

                state.isLoading = true;
                state.error = null;

            }).addCase(updateAddressAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_UPDATE_ADDRESS

                state.isLoading = false;

                //? STEPS TO REPLACE THE OLD ADDRESS:

                if (action.payload.result.result.setAsDefault) {
                    if (state.addressList[0].setAsDefault) state.addressList[0].setAsDefault = false;

                    const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result.result._id);
                    state.addressList.splice(addressIndex, 1);
                    state.addressList.splice(0, 0, action.payload.result);

                } else {
                    const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result._id);
                    state.addressList.splice(addressIndex, 1, action.payload.result.result);
                }

                message.success(action.payload.result.message);

                action.payload.navigate(action.payload.redirect);

                state.error = null;

            }).addCase(updateAddressAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_UPDATE_ADDRESS

                state.isLoading = false;
                state.error = action.error;

                message.error(action.error.message);

            })
    }
});


export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer; 