import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handelDataFetch from "../../utils/handelDataFetch";
import { message } from "antd";
import { getProductAsync } from "../products/productsSlice";
import { userLogoutAsync } from "../auth/authSlice";

const initialState = {
    shipping: null,
    carts: [],
    pricing: null,
    error: null,
    isSessionError: null,
    isLoading: false,
}

export const initCheckoutProcessAsync = createAsyncThunk('/checkout/init', async (data) => {
    const response = await handelDataFetch('/api/v2/checkout', 'POST', data.data);
    return { result: response.data, data: data.data, navigate: data.navigate, redirect: data.data.shippingInfo ? "/checkout/confirm" : "/checkout/shipping" };
});

export const getValidateCheckoutAsync = createAsyncThunk('/checkout/validate', async () => {
    const response = await handelDataFetch('/api/v2/checkout', 'GET');
    return response.data;
});


export const getConfirmOrderDataAsync = createAsyncThunk('/checkout/confirm/get', async () => {
    const response = await handelDataFetch('/api/v2/checkout/confirm', 'GET');
    return response.data;
});

export const getSelectedShippingAsync = createAsyncThunk('/checkout/shipping/get', async () => {
    const response = await handelDataFetch('/api/v2/checkout/shipping', 'GET');
    return response.data;
});

export const updateSelectedShippingAsync = createAsyncThunk('/checkout/shipping/update', async (data) => {
    const response = await handelDataFetch('/api/v2/checkout/shipping', 'POST', data.address);
    return { result: response.data, data: data.address, navigate: data.navigate };
});

export const checkoutSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        clearIsSessionError: (state) => {
            state.isSessionError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogoutAsync.fulfilled, () => {
                //* CLEANUP: TASK
                //? LOGOUT_CLEANUP_TASK:: REMOVE ALL THE CART INFORMATION AFTER LOGOUT

                return initialState;

            })
            .addCase(getProductAsync.fulfilled, (state) => {
                state.isSessionError = null;
            })
            .addCase(initCheckoutProcessAsync.pending, (state) => {
                //^ PENDING: INIT_CHECKOUT_PROCESS

                state.error = null;
                state.isLoading = true;

            }).addCase(initCheckoutProcessAsync.fulfilled, (state, action) => {
                //* FULFILLED: INIT_CHECKOUT_PROCESS

                state.error = null;
                state.isLoading = false;

                state.shipping = action.payload.data.shippingInfo;
                action.payload.navigate(action.payload.redirect);

            }).addCase(initCheckoutProcessAsync.rejected, (state, action) => {
                //! REJECTED: INIT_CHECKOUT_PROCESS

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);

            })

            .addCase(getValidateCheckoutAsync.pending, (state) => {
                //^ PENDING: GET_VALIDATE_CHECKOUT_PROCESS

                state.error = null;
                state.isLoading = true;
                state.isSessionError = null;

            }).addCase(getValidateCheckoutAsync.fulfilled, (state, action) => {
                //* FULFILLED: GET_VALIDATE_CHECKOUT_PROCESS

                state.error = null;
                state.isLoading = false;
                state.isSessionError = null;
                // console.log(action.payload); //TODO: NEED TO IMPLEMENT THIS 

            }).addCase(getValidateCheckoutAsync.rejected, (state, action) => {
                //! REJECTED: GET_VALIDATE_CHECKOUT_PROCESS

                state.error = action.error;
                state.isLoading = false;
                state.isSessionError = action.error;


            })

            .addCase(getSelectedShippingAsync.pending, (state) => {
                //^ PENDING: GET_SELECTED_SHIPPING_ASYNC

                state.error = null;
                state.isLoading = true;

            }).addCase(getSelectedShippingAsync.fulfilled, (state, action) => {
                //* FULFILLED: GET_SELECTED_SHIPPING_ASYNC

                state.error = null;
                state.isLoading = false;

                state.shipping = action.payload.result;

            }).addCase(getSelectedShippingAsync.rejected, (state, action) => {
                //! REJECTED: GET_SELECTED_SHIPPING_ASYNC

                state.error = action.error;
                state.isLoading = false;

            })

            .addCase(getConfirmOrderDataAsync.pending, (state) => {
                //^ PENDING: GET_SHIPPING_DATA_ASYNC

                state.error = null;
                state.isLoading = true;

            }).addCase(getConfirmOrderDataAsync.fulfilled, (state, action) => {
                //* FULFILLED: GET_SHIPPING_DATA_ASYNC

                state.error = null;
                state.isLoading = false;

                state.carts = action.payload.result.cartOrProducts;
                state.shipping = action.payload.result.address;
                state.pricing = action.payload.result.pricing;

            }).addCase(getConfirmOrderDataAsync.rejected, (state, action) => {
                //! REJECTED: GET_SHIPPING_DATA_ASYNC

                state.error = action.error;
                state.isLoading = false;

            })

            .addCase(updateSelectedShippingAsync.pending, (state) => {
                //^ PENDING: UPDATE_SELECTED_SHIPPING_ASYNC


                state.error = null;
                state.isLoading = true;

            }).addCase(updateSelectedShippingAsync.fulfilled, (state, action) => {
                //* FULFILLED: UPDATE_SELECTED_SHIPPING_ASYNC

                state.error = null;
                state.isLoading = false;
                state.shipping = action.payload.data;


                action.payload.navigate("/checkout/confirm");


            }).addCase(updateSelectedShippingAsync.rejected, (state, action) => {
                //! REJECTED: UPDATE_SELECTED_SHIPPING_ASYNC

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);

            })
    }
});


export const { clearIsSessionError } = checkoutSlice.actions;
export default checkoutSlice.reducer; 