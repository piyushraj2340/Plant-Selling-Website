import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import handelDataFetch from "../../utils/handelDataFetch";

const initialState = {
    orderHistory: [],
    error: null,
    isLoading: false,
}

export const getOrderHistoryAsync = createAsyncThunk('/order/history/get', async () => {
    const response = await handelDataFetch('/api/v2/user/orders', 'GET');
    return response.data;
});

export const createOrderHistoryAsync = createAsyncThunk('/order/history/create', async (data) => {
    const response = await handelDataFetch('/api/v2/user/orders', 'POST', data);
    return response.data;
});

export const updateOrderAfterConfirmPaymentAsync = createAsyncThunk('/order/history/confirm/payment', async (data) => {
    const response = await handelDataFetch('/api/v2/user/orders', 'PATCH', data.paymentInfo);
    return {result: response.data, navigate: data.navigate};
});

export const orderSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getOrderHistoryAsync.pending, (state) => {
            //^ PENDING: GET_ORDER_HISTORY

            state.error = null;
            state.isLoading = true;

        }).addCase(getOrderHistoryAsync.fulfilled, (state, action) => {
            //* FULFILLED: GET_ORDER_HISTORY

            state.error = null;
            state.isLoading = false;
            state.orderHistory = action.payload.result;

        }).addCase(getOrderHistoryAsync.rejected, (state, action) => {
            //! REJECTED: GET_ORDER_HISTORY

            state.error = action.error;
            state.isLoading = false;

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

        }).addCase(createOrderHistoryAsync.rejected, (state, action) => {
            //! REJECTED: Create_ORDER_HISTORY

            state.error = action.error;
            state.isLoading = false;

            message.error(action.error.message);

        }).addCase(updateOrderAfterConfirmPaymentAsync.pending, (state) => {
            //^ PENDING: Create_ORDER_HISTORY

            state.error = null;
            state.isLoading = true;

        }).addCase(updateOrderAfterConfirmPaymentAsync.fulfilled, (state, action) => {
            //* FULFILLED: Create_ORDER_HISTORY

            state.error = null;
            state.isLoading = false;
            
            action.payload.navigate("/orders/history");

        }).addCase(updateOrderAfterConfirmPaymentAsync.rejected, (state, action) => {
            //! REJECTED: Create_ORDER_HISTORY

            state.error = action.error;
            state.isLoading = false;

            message.error(action.error.message);

        })
    }
});


export default orderSlice.reducer; 