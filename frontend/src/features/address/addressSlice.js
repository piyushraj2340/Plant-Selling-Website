import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handelDataFetch from "../../utils/handelDataFetch";
import { message } from "antd";
import { userLogoutAsync } from "../auth/authSlice";
import { errorState, fulfilledState, loadingState } from "./Utils/addressHelper";
import { AddOrUpdateObjectArraySet, deleteFromObjectArraySet } from "../../utils/ObjectArraySet ";

const initialState = {
    addressList: null,
    selectedAddress: null,
    error: null,
    isLoading: false,
    isRedirectAllowed: null,
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
    return response.data;
});

export const setDefaultAddressAsync = createAsyncThunk('/address/data/set/default', async (_id) => {
    const response = await handelDataFetch(`/api/v2/user/address/${_id}`, 'PATCH', { setAsDefault: true });
    return response.data;
});

export const updateAddressAsync = createAsyncThunk('/address/data/update', async (data) => {
    const response = await handelDataFetch(`/api/v2/user/address/${data._id}`, 'PATCH', data.address);
    return response.data;
});

export const getAddressByIdAsync = createAsyncThunk('/address/data/get', async (id) => {
    const response = await handelDataFetch(`/api/v2/user/address/${id}`, 'GET');
    return response.data;
});

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
        addressResetApiState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.isRedirectAllowed = null;
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

                loadingState(state);

            })
            .addCase(addressListDataFetchAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_DATA_FETCHING

                state.addressList = action.payload.result;

                fulfilledState(state, false);

            })
            .addCase(addressListDataFetchAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_DATA_FETCHING

                errorState(state, action);

                message.error(action.error.message);

            })


            .addCase(addressDeleteAsync.pending, (state) => {
                //^ PENDING: ADDRESS_DATA_DELETING

                loadingState(state);

            })
            .addCase(addressDeleteAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_DATA_DELETING

                //? STEPS TO DELETE DATA FROM ADDRESS_LIST:
                // const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result._id);
                // state.addressList.splice(addressIndex, 1);

                if(state.selectedAddress !== null && state.selectedAddress._id === action.payload.result._id) {
                    state.selectedAddress = null;
                }

                state.addressList = deleteFromObjectArraySet(state.addressList, action.payload.result._id);

                fulfilledState(state, false);
            })
            .addCase(addressDeleteAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_DATA_DELETING

                errorState(state, action);

                message.error(action.error.message);

            })


            .addCase(addNewAddressAsync.pending, (state) => {
                //^ PENDING: ADDRESS_ADD_NEW_DATA

                loadingState(state);

            })
            .addCase(addNewAddressAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_ADD_NEW_DATA

                //? STEPS TO ADD NEW DATA INTO ADDRESS_LIST:
                // if (state.addressList != null) {
                //     state.addressList.concat(action.payload.result);
                // } else {
                //     state.addressList = [action.payload.result.result];
                // }

                state.addressList = AddOrUpdateObjectArraySet(state.addressList, action.payload.result);

                fulfilledState(state, true); // redirect allowed 

                message.success(action.payload.message);

            })
            .addCase(addNewAddressAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_ADD_NEW_DATA

                errorState(state, action);

                message.error(action.error.message);

            })


            .addCase(setDefaultAddressAsync.pending, (state) => {
                //^ PENDING: ADDRESS_SET_DEFAULT_ADDRESS

                loadingState(state);

            })
            .addCase(setDefaultAddressAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_SET_DEFAULT_ADDRESS

                //? STEPS TO REPLACE THE OLD ADDRESS:
                if (state.addressList[0].setAsDefault) state.addressList[0].setAsDefault = false;

                // const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result._id);
                // state.addressList.splice(addressIndex, 1);
                // state.addressList.splice(0, 0, action.payload.result);

                state.addressList = deleteFromObjectArraySet(state.addressList, action.payload.result._id);
                state.addressList.splice(0, 0, action.payload.result);

                fulfilledState(state, false);

            })
            .addCase(setDefaultAddressAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_SET_DEFAULT_ADDRESS

                errorState(state, action);
                message.error(action.error.message);

            })


            .addCase(updateAddressAsync.pending, (state) => {
                //^ PENDING: ADDRESS_UPDATE_ADDRESS

                loadingState(state);

            })
            .addCase(updateAddressAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_UPDATE_ADDRESS


                //? STEPS TO REPLACE THE OLD ADDRESS:

                if (action.payload.result.setAsDefault) {
                    if (state.addressList[0].setAsDefault) state.addressList[0].setAsDefault = false;

                    // const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result.result._id);
                    // state.addressList.splice(addressIndex, 1);
                    // state.addressList.splice(0, 0, action.payload.result);

                    state.addressList = deleteFromObjectArraySet(state.addressList, action.payload.result._id);
                    state.addressList.splice(0, 0, action.payload.result);

                } else {
                    // const addressIndex = state.addressList.findIndex(address => address._id === action.payload.result._id);
                    // state.addressList.splice(addressIndex, 1, action.payload.result.result);

                    state.addressList = AddOrUpdateObjectArraySet(state.addressList, action.payload.result._id);
                }

                fulfilledState(state, true); // redirect allowed  

                message.success(action.payload.message);

            })
            .addCase(updateAddressAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_UPDATE_ADDRESS

                errorState(state, action);

                message.error(action.error.message);

            })


            .addCase(getAddressByIdAsync.pending, (state) => {
                //^ PENDING: ADDRESS_GET_BY_Id_ADDRESS

                loadingState(state);

            })
            .addCase(getAddressByIdAsync.fulfilled, (state, action) => {
                //* FULFILLED: ADDRESS_GET_BY_Id_ADDRESS


                //? STEPS TO REPLACE THE OLD ADDRESS:
                state.addressList = AddOrUpdateObjectArraySet(state.addressList, action.payload.result);


                fulfilledState(state, false);

            })
            .addCase(getAddressByIdAsync.rejected, (state, action) => {
                //! REJECTED: ADDRESS_GET_BY_Id_ADDRESS

                errorState(state, action);

                message.error(action.error.message);

            })
    }
});


export const { setSelectedAddress, addressResetApiState } = addressSlice.actions;
export default addressSlice.reducer; 