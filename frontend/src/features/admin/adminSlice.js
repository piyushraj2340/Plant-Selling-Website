import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handelDataFetch from "../../utils/handelDataFetch";
import { userLogoutAsync } from "../auth/authSlice";
import { message } from "antd";

const initialState = {
    stats: {
        totalUsers: 0,
        totalNurseries: 0,
        totalPlants: 0,
        totalOrders: 0,
        totalRevenue: 0,
        barData: { labels: [], data: [] },
        doughnutData: { labels: [], data: [] }
    },
    ordersData: {
        stats: { barChart: [], pieChart: { labels: [], data: [] } },
        data: []
    },
    users: [],
    productsData: {
        stats: { lineChart: [], polarChart: [] },
        plants: []
    },
    reviews: [],
    isLoading: false,
    error: null,
};

export const adminStatsAsync = createAsyncThunk('/admin/stats', async (filter = 'Monthly') => {
    const response = await handelDataFetch(`/api/v2/admin/stats?filter=${filter}`, 'GET');
    return response.data;
});

export const adminOrdersAsync = createAsyncThunk('/admin/orders', async ({ year = '', search = '', filter = '' } = {}) => {
    const response = await handelDataFetch(`/api/v2/admin/orders?year=${year}&search=${search}&filter=${filter}`, 'GET');
    return response.data;
});

export const adminUsersAsync = createAsyncThunk('/admin/users', async () => {
    const response = await handelDataFetch(`/api/v2/admin/users`, 'GET');
    return response.data;
});

export const adminProductsAsync = createAsyncThunk('/admin/products', async ({ year = '', search = '', filter = '' } = {}) => {
    const response = await handelDataFetch(`/api/v2/admin/plants?year=${year}&search=${search}&filter=${filter}`, 'GET');
    return response.data;
});

export const adminImpersonateAsync = createAsyncThunk('/admin/impersonate', async (data) => {
    const response = await handelDataFetch(`/api/v2/admin/impersonate`, 'POST', data);
    return response.data;
});

export const adminReviewsAsync = createAsyncThunk('/admin/reviews', async () => {
    const response = await handelDataFetch(`/api/v2/admin/reviews`, 'GET');
    return response.data;
});

export const adminUpdateReviewStatusAsync = createAsyncThunk('/admin/updateReviewStatus', async ({ id, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/reviews/${id}/status`, 'PATCH', { status });
    return response.data;
});

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLogoutAsync.fulfilled, () => {
                return initialState;
            })
            // STATS
            .addCase(adminStatsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminStatsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.status) {
                    state.stats = action.payload.stats;
                }
                state.error = null;
            })
            .addCase(adminStatsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // ORDERS
            .addCase(adminOrdersAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminOrdersAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.status) {
                    state.ordersData = {
                        stats: action.payload.stats,
                        data: action.payload.orders
                    };
                }
                state.error = null;
            })
            .addCase(adminOrdersAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // USERS
            .addCase(adminUsersAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUsersAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.status) {
                    state.users = action.payload.users;
                }
                state.error = null;
            })
            .addCase(adminUsersAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // IMPERSONATE
            .addCase(adminImpersonateAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                message.loading({ content: 'Initiating impersonation...', key: 'impersonate' });
            })
            .addCase(adminImpersonateAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                message.success({ content: action.payload.message || 'Impersonation successful!', key: 'impersonate' });
                // We handle token injection in the component
            })
            .addCase(adminImpersonateAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error({ content: action.error.message || 'Impersonation failed!', key: 'impersonate' });
            })
            // PRODUCTS
            .addCase(adminProductsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminProductsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.status) {
                    state.productsData = {
                        stats: action.payload.stats,
                        plants: action.payload.plants
                    };
                }
                state.error = null;
            })
            .addCase(adminProductsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // REVIEWS
            .addCase(adminReviewsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminReviewsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.status) {
                    state.reviews = action.payload.reviews;
                }
                state.error = null;
            })
            .addCase(adminReviewsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            .addCase(adminUpdateReviewStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUpdateReviewStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // Update the specific review in the state
                if (action.payload.status && action.payload.review) {
                    const index = state.reviews.findIndex(r => r._id === action.payload.review._id);
                    if (index !== -1) {
                        state.reviews[index].status = action.payload.review.status;
                    }
                }
            })
            .addCase(adminUpdateReviewStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            });
    }
});

export default adminSlice.reducer;
