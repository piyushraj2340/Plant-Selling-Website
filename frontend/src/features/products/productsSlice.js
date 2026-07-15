import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import handelDataFetch from '../../utils/handelDataFetch';

const initialState = {
    products: [],
    product: null,
    productPricing: null,
    totalProducts: null,
    productReviews: [],
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

export const searchProductsAsync = createAsyncThunk('products/search', async ({search, category}) => {
    const response = await handelDataFetch(`/api/v2/products/search/plants/?search=${search}&category=${(typeof category === 'string' && category.length > 0) ? category: 'all'}`, 'GET');
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
            }).addCase(searchProductsAsync.pending, (state) => {
                state.isLoading = true;
            }).addCase(searchProductsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.result;
            }).addCase(searchProductsAsync.rejected, (state, action) => {
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