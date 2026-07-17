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
    reviewsData: {
        stats: { lineChart: [], pieChart: { labels: [], data: [] } },
        reviews: []
    },
    incomeData: {
        stats: { barChart: [], pieChart: { labels: [], data: [] } },
        orders: []
    },
    couponsData: {
        coupons: [],
    },
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

export const adminIncomeAsync = createAsyncThunk('/admin/income', async ({ year = '', search = '', filter = '' } = {}) => {
    const response = await handelDataFetch(`/api/v2/admin/income?year=${year}&search=${search}&filter=${filter}`, 'GET');
    return response.data;
});

export const adminUpdateOrderItemStatusAsync = createAsyncThunk('/admin/updateOrderItemStatus', async ({ orderId, itemId, status, message }) => {
    const response = await handelDataFetch(`/api/v2/admin/orders/${orderId}/items/${itemId}/status`, 'PATCH', { status, message });
    return { ...response.data, orderId, itemId, status, statusMessage: message };
});

export const adminBulkUpdateOrderItemStatusAsync = createAsyncThunk('/admin/bulkUpdateOrderItemStatus', async ({ keys, status, message }) => {
    const response = await handelDataFetch(`/api/v2/admin/orders/bulk-status`, 'PATCH', { keys, status, message });
    return { ...response.data, keys, status, statusMessage: message };
});

export const adminUsersAsync = createAsyncThunk('/admin/users', async () => {
    const response = await handelDataFetch(`/api/v2/admin/users`, 'GET');
    return response.data;
});

export const adminProductsAsync = createAsyncThunk('/admin/products', async ({ year = '', search = '', filter = '' } = {}) => {
    const response = await handelDataFetch(`/api/v2/admin/plants?year=${year}&search=${search}&filter=${filter}`, 'GET');
    return response.data;
});

export const adminUpdatePlantStatusAsync = createAsyncThunk('/admin/updatePlantStatus', async ({ id, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/plants/${id}/status`, 'PATCH', { status });
    return response.data;
});

export const adminBulkUpdatePlantStatusAsync = createAsyncThunk('/admin/bulkUpdatePlantStatus', async ({ ids, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/plants/bulk-status`, 'PATCH', { ids, status });
    return { ...response.data, ids, status };
});

export const adminImpersonateAsync = createAsyncThunk('/admin/impersonate', async (data) => {
    const response = await handelDataFetch(`/api/v2/admin/impersonate`, 'POST', data);
    return response.data;
});

export const adminReviewsAsync = createAsyncThunk('/admin/reviews', async ({ year = '', search = '', filter = '' } = {}) => {
    const response = await handelDataFetch(`/api/v2/admin/reviews?year=${year}&search=${search}&filter=${filter}`, 'GET');
    return response.data;
});

export const adminUpdateReviewStatusAsync = createAsyncThunk('/admin/updateReviewStatus', async ({ id, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/reviews/${id}/status`, 'PATCH', { status });
    return response.data;
});

export const adminBulkUpdateReviewStatusAsync = createAsyncThunk('/admin/bulkUpdateReviewStatus', async ({ ids, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/reviews/bulk-status`, 'PATCH', { ids, status });
    return { ...response.data, ids, status };
});

export const adminCreateCouponAsync = createAsyncThunk('/admin/createCoupon', async (data) => {
    const response = await handelDataFetch(`/api/v2/admin/coupons`, 'POST', data);
    return response.data;
});

export const adminCouponsAsync = createAsyncThunk('/admin/coupons', async () => {
    const response = await handelDataFetch(`/api/v2/admin/coupons`, 'GET');
    return response.data;
});

export const adminUpdateCouponStatusAsync = createAsyncThunk('/admin/updateCouponStatus', async ({ id, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/coupons/${id}/status`, 'PATCH', { status });
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
            // INCOME
            .addCase(adminIncomeAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminIncomeAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.status) {
                    state.incomeData = {
                        stats: action.payload.stats,
                        orders: action.payload.orders
                    };
                }
                state.error = null;
            })
            .addCase(adminIncomeAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // UPDATE ORDER ITEM STATUS
            .addCase(adminUpdateOrderItemStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUpdateOrderItemStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    const { orderId, itemId, status, statusMessage } = action.payload;
                    const orderIndex = state.ordersData.data.findIndex(o => o._id === orderId);
                    if (orderIndex !== -1) {
                        const itemIndex = state.ordersData.data[orderIndex].orderItems.findIndex(i => i._id === itemId);
                        if (itemIndex !== -1) {
                            state.ordersData.data[orderIndex].orderItems[itemIndex].orderStatus = {
                                status,
                                message: statusMessage || `${status} status updated`,
                                statusAt: new Date().toISOString()
                            };
                        }
                    }
                }
            })
            .addCase(adminUpdateOrderItemStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // BULK UPDATE ORDER ITEMS STATUS
            .addCase(adminBulkUpdateOrderItemStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminBulkUpdateOrderItemStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    const { keys, status, statusMessage } = action.payload;
                    keys.forEach(key => {
                        const [orderId, itemId] = key.split('-');
                        const orderIndex = state.ordersData.data.findIndex(o => o._id === orderId);
                        if (orderIndex !== -1) {
                            const itemIndex = state.ordersData.data[orderIndex].orderItems.findIndex(i => i._id === itemId);
                            if (itemIndex !== -1) {
                                state.ordersData.data[orderIndex].orderItems[itemIndex].orderStatus = {
                                    status,
                                    message: statusMessage || `${status} status updated`,
                                    statusAt: new Date().toISOString()
                                };
                            }
                        }
                    });
                }
            })
            .addCase(adminBulkUpdateOrderItemStatusAsync.rejected, (state, action) => {
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
            // UPDATE PLANT STATUS
            .addCase(adminUpdatePlantStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUpdatePlantStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status && action.payload.plant) {
                    const index = state.productsData.plants.findIndex(p => p._id === action.payload.plant._id);
                    if (index !== -1) {
                        state.productsData.plants[index].status = action.payload.plant.status;
                    }
                }
            })
            .addCase(adminUpdatePlantStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // BULK UPDATE PLANT STATUS
            .addCase(adminBulkUpdatePlantStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminBulkUpdatePlantStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    const { ids, status } = action.payload;
                    state.productsData.plants.forEach(p => {
                        if (ids.includes(p._id)) {
                            p.status = status;
                        }
                    });
                }
            })
            .addCase(adminBulkUpdatePlantStatusAsync.rejected, (state, action) => {
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
                    state.reviewsData = {
                        stats: action.payload.stats,
                        reviews: action.payload.reviews
                    };
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
                    const index = state.reviewsData.reviews.findIndex(r => r._id === action.payload.review._id);
                    if (index !== -1) {
                        state.reviewsData.reviews[index].status = action.payload.review.status;
                    }
                }
            })
            .addCase(adminUpdateReviewStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // BULK UPDATE REVIEWS STATUS
            .addCase(adminBulkUpdateReviewStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminBulkUpdateReviewStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    const { ids, status } = action.payload;
                    state.reviewsData.reviews.forEach(r => {
                        if (ids.includes(r._id)) {
                            r.status = status;
                        }
                    });
                }
            })
            .addCase(adminBulkUpdateReviewStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // GET COUPONS
            .addCase(adminCouponsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminCouponsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    state.couponsData.coupons = action.payload.coupons;
                }
            })
            .addCase(adminCouponsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // CREATE COUPON
            .addCase(adminCreateCouponAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminCreateCouponAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status && action.payload.coupon) {
                    state.couponsData.coupons.unshift(action.payload.coupon);
                    message.success("Coupon created successfully!");
                }
            })
            .addCase(adminCreateCouponAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to create coupon");
            })
            // UPDATE COUPON STATUS
            .addCase(adminUpdateCouponStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUpdateCouponStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status && action.payload.coupon) {
                    const index = state.couponsData.coupons.findIndex(c => c._id === action.payload.coupon._id);
                    if (index !== -1) {
                        state.couponsData.coupons[index].status = action.payload.coupon.status;
                        message.success("Coupon status updated!");
                    }
                }
            })
            .addCase(adminUpdateCouponStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error("Failed to update coupon status");
            });
    }
});

export default adminSlice.reducer;
