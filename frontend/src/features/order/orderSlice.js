import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import handelDataFetch from "../../utils/handelDataFetch";
import { userLogoutAsync } from "../auth/authSlice";

const initialState = {
    orderHistory: [],
    totalData: null,
    orderDetails: null,
    error: null,
    isLoading: false,
}

export const getOrderHistoryAsync = createAsyncThunk('/order/history/get', async (data) => {
    const response = await handelDataFetch(`/api/v2/user/orders/?page=${data.page}&limit=${data.limit}&endDate=${data.endDate}&orderSearch=${data.orderSearch || ''}`, 'GET');
    return response.data;
});

export const createOrderHistoryAsync = createAsyncThunk('/order/history/create', async (data) => {
    const response = await handelDataFetch('/api/v2/user/orders', 'POST', data);
    return response.data;
});

export const updateOrderAfterConfirmPaymentAsync = createAsyncThunk('/order/history/confirm/payment', async (data) => {
    const response = await handelDataFetch('/api/v2/user/orders', 'PATCH', data.paymentInfo);
    return { result: response.data, navigate: data.navigate };
});

export const getOrderDetailsByIdAsync = createAsyncThunk('/order/details/get', async (id) => {
    const response = await handelDataFetch(`/api/v2/user/orders/${id}`, 'GET');
    return response.data;
});

export const getLastOrderAsync = createAsyncThunk('/get/last/order', async () => {
    const response = await handelDataFetch(`/api/v2/user/last/order`, 'GET');
    return response.data;
});

export const orderSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLogoutAsync.fulfilled, () => {
                //* CLEANUP: TASK
                //? LOGOUT_CLEANUP_TASK:: REMOVE ALL THE CART INFORMATION AFTER LOGOUT

                return initialState;

            }).addCase(getOrderHistoryAsync.pending, (state) => {
                //^ PENDING: GET_ORDER_HISTORY

                state.error = null;
                state.isLoading = true;
                state.totalData = null;

            }).addCase(getOrderHistoryAsync.fulfilled, (state, action) => {
                //* FULFILLED: GET_ORDER_HISTORY

                console.log(action.payload);

                state.error = null;
                state.isLoading = false;
                state.orderHistory = action.payload.result;
                state.totalData = action.payload.total;

            }).addCase(getOrderHistoryAsync.rejected, (state, action) => {
                //! REJECTED: GET_ORDER_HISTORY

                state.error = action.error;
                state.isLoading = false;
                state.totalData = null;

                message.error(action.error.message);

            }).addCase(createOrderHistoryAsync.pending, (state) => {
                //^ PENDING: Create_ORDER_HISTORY

                state.error = null;
                state.isLoading = true;

            }).addCase(createOrderHistoryAsync.fulfilled, (state, action) => {
                //* FULFILLED: Create_ORDER_HISTORY

                state.error = null;
                state.isLoading = false;
                state.orderHistory = action.payload.result;
                state.totalData = action.payload.total;

            }).addCase(createOrderHistoryAsync.rejected, (state, action) => {
                //! REJECTED: Create_ORDER_HISTORY

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);

            }).addCase(updateOrderAfterConfirmPaymentAsync.pending, (state) => {
                //^ PENDING: CONFIRM_ORDER_AFTER_PAYMENT_SUCCESSFUL

                state.error = null;
                state.isLoading = true;

            }).addCase(updateOrderAfterConfirmPaymentAsync.fulfilled, (state, action) => {
                //* FULFILLED: CONFIRM_ORDER_AFTER_PAYMENT_SUCCESSFUL

                state.error = null;
                state.isLoading = false;

                action.payload.navigate("/orders/history");

            }).addCase(updateOrderAfterConfirmPaymentAsync.rejected, (state, action) => {
                //! REJECTED: CONFIRM_ORDER_AFTER_PAYMENT_SUCCESSFUL

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);

            }).addCase(getOrderDetailsByIdAsync.pending, (state) => {
                //^ PENDING: GET_ORDER_DETAILS

                state.error = null;
                state.isLoading = true; 
                state.orderDetails = null; 

            }).addCase(getOrderDetailsByIdAsync.fulfilled, (state, action) => {
                //* FULFILLED: GET_ORDER_DETAILS

                state.error = null;
                state.isLoading = false;
                state.orderDetails = action.payload.result;

            }).addCase(getOrderDetailsByIdAsync.rejected, (state, action) => {
                //! REJECTED: GET_ORDER_DETAILS

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);
            }).addCase(getLastOrderAsync.pending, (state) => {
                //^ PENDING: GET_LAST_ORDER

                state.error = null;
                state.isLoading = true; 
                state.orderDetails = null; 

            }).addCase(getLastOrderAsync.fulfilled, (state, action) => {
                //* FULFILLED: GET_LAST_ORDER

                state.error = null;
                state.isLoading = false;
                state.orderHistory = action.payload.result;

            }).addCase(getLastOrderAsync.rejected, (state, action) => {
                //! REJECTED: GET_LAST_ORDER

                state.error = action.error;
                state.isLoading = false;

                message.error(action.error.message);
            })
    }
});


export default orderSlice.reducer; 