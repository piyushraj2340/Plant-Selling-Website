import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';

const initialState = {
    categories: [],
    isLoading: false,
    error: null
}

export const getAllCategoriesAsync = createAsyncThunk('category/fetchAllCategories', async (args, { rejectWithValue }) => {
    try {
        const response = await handelDataFetch('/api/v2/categories', 'GET');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createCategoryAsync = createAsyncThunk('category/createCategory', async (data, { rejectWithValue }) => {
    try {
        const response = await handelDataFetch('/api/v2/categories', 'POST', data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateCategoryAsync = createAsyncThunk('category/updateCategory', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await handelDataFetch(\/api/v2/categories/\\, 'PUT', data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteCategoryAsync = createAsyncThunk('category/deleteCategory', async (id, { rejectWithValue }) => {
    try {
        const response = await handelDataFetch(\/api/v2/categories/\\, 'DELETE');
        return { id, ...response.data };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategoriesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(getAllCategoriesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Something went wrong';
            });
    }
});

export default categorySlice.reducer;
