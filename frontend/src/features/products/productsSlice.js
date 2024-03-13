import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';

const initialState = {
    products: [],
    product: null,
    productPricing: null,
    totalProducts: null,
    isLoading: false
}

export const getAllProductsAsync = createAsyncThunk('products/fetchAllProducts', async () => {
    const response = await handelDataFetch('/api/v2/products/plants', 'GET');
    return response.data;
});

// TODO: check the rendering after deployment 
export const getProductsByCategoryAsync = createAsyncThunk('products/fetchProductsByCategory', async (category) => {
    const response = await handelDataFetch(`/api/v2/products/plantsByCategory/${category}`, 'GET');
    return response.data;
})

// TODO: check the rendering after deployment 
export const getProductAsync = createAsyncThunk('products/fetchProduct', async (_id) => {
    const response = await handelDataFetch(`/api/v2/products/plant/${_id}`, 'GET');
    return response.data;
});

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        calculateProductPricing: (state, action) => {
            state.productPricing = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProductsAsync.pending, (state) => {
                state.isLoading = true;
            }).addCase(getAllProductsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.result;
            }).addCase(getAllProductsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            }).addCase(getProductsByCategoryAsync.pending, (state) => {
                state.isLoading = true;
            }).addCase(getProductsByCategoryAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.result;
            }).addCase(getProductsByCategoryAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            }).addCase(getProductAsync.pending, (state) => {
                state.isLoading = true;
            }).addCase(getProductAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.product = action.payload.result;
            }).addCase(getProductAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
    }
});

// export const getAllProducts = (state) => state.products.products;
// export const getProduct = (state) => state.products.product;


export const { calculateProductPricing } = productsSlice.actions;
export default productsSlice.reducer;