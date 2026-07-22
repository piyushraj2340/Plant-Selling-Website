import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';

const initialState = {
    products: [],
    product: null,
    productPricing: null,
    pagination: {
        totalProducts: null,
        currentPage: null,
        totalPages: null,
        limit: null
    },
    productReviews: [],
    isLoading: false
}

export const getAllProductsAsync = createAsyncThunk('products/fetchAllProducts', async (query) => {
    let url = '/api/v2/products/plants?';
    if (query) {
        url += new URLSearchParams(query).toString();
    }
    const response = await handelDataFetch(url, 'GET');
    return response.data;
});

// TODO: check the rendering after deployment 
export const getProductAsync = createAsyncThunk('products/fetchProduct', async (_id) => {
    const response = await handelDataFetch(`/api/v2/products/plant/${_id}`, 'GET');
    return response.data;
});

export const getProductReviewsAsync = createAsyncThunk('products/fetchReviews', async (plantId) => {
    const response = await handelDataFetch(`/api/v2/products/plant/${plantId}/reviews`, 'GET');
    return response.data;
});

export const addProductReviewAsync = createAsyncThunk('products/addReview', async ({ plantId, rating, reviewText }) => {
    const response = await handelDataFetch(`/api/v2/products/plant/${plantId}/reviews`, 'POST', { rating, reviewText });
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
                state.pagination = action.payload.pagination;
            }).addCase(getAllProductsAsync.rejected, (state, action) => {
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
            }).addCase(getProductReviewsAsync.pending, (state) => {
                state.isLoading = true;
            }).addCase(getProductReviewsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productReviews = action.payload.result;
            }).addCase(getProductReviewsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            }).addCase(addProductReviewAsync.pending, (state) => {
                state.isLoading = true;
            }).addCase(addProductReviewAsync.fulfilled, (state) => {
                state.isLoading = false;
            }).addCase(addProductReviewAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
    }
});

// export const getAllProducts = (state) => state.products.products;
// export const getProduct = (state) => state.products.product;


export const { calculateProductPricing } = productsSlice.actions;
export default productsSlice.reducer;