import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import handelDataFetch from '../../utils/handelDataFetch';

const initialState = {
    saveForLaterItems: [],
    isLoading: false,
    error: null
}

export const fetchSaveForLaterAsync = createAsyncThunk('/saveForLater/fetch', async () => {
    const response = await handelDataFetch('/api/v2/user/saveForLater', 'GET');
    return response.data;
});

export const addToSaveForLaterAsync = createAsyncThunk('/saveForLater/add', async (cartId) => {
    const response = await handelDataFetch('/api/v2/user/saveForLater', 'POST', { cartId });
    return response.data; // contains the newly saved item
});

export const moveToCartAsync = createAsyncThunk('/saveForLater/moveToCart', async (saveForLaterId) => {
    const response = await handelDataFetch(`/api/v2/user/saveForLater/moveToCart/${saveForLaterId}`, 'POST');
    return response.data;
});

export const deleteSaveForLaterAsync = createAsyncThunk('/saveForLater/delete', async (saveForLaterId) => {
    const response = await handelDataFetch(`/api/v2/user/saveForLater/${saveForLaterId}`, 'DELETE');
    return response.data; // returns the deleted item
});

export const saveForLaterSlice = createSlice({
    name: 'saveForLater',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSaveForLaterAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSaveForLaterAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.saveForLaterItems = action.payload.data;
            })
            .addCase(fetchSaveForLaterAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            
            .addCase(addToSaveForLaterAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToSaveForLaterAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                // If it wasn't a duplicate it's returned in payload.data
                // Alternatively, we can just refetch. Here we just append if it exists.
                const existingIndex = state.saveForLaterItems.findIndex(item => item._id === action.payload.data._id);
                if (existingIndex === -1 && action.payload.data) {
                     state.saveForLaterItems.push(action.payload.data);
                }
            })
            .addCase(addToSaveForLaterAsync.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(moveToCartAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(moveToCartAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                // We will refetch save for later list or filter it out
                // the cartSlice should be notified to refetch cart items, we'll do this in the component.
            })
            .addCase(moveToCartAsync.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(deleteSaveForLaterAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSaveForLaterAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.saveForLaterItems = state.saveForLaterItems.filter(item => item._id !== action.payload.data._id);
            })
            .addCase(deleteSaveForLaterAsync.rejected, (state, action) => {
                state.isLoading = false;
            });
    }
});

export default saveForLaterSlice.reducer;
