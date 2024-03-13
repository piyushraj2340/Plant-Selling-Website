import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
    name: 'address',
    initialState: [],
    reducers: {
        setAddress: (state, action) => {
            return action.payload;
        }
    }
});


export const { setAddress } = orderSlice.actions;
export default orderSlice.reducer; 