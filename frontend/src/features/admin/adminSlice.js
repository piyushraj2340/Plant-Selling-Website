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
        data: [],
        total: 0
    },
    ordersBarChartData: [],
    ordersPieChartData: { labels: [], data: [] },
    users: [],
    usersTotal: 0,
    nurseriesList: [],
    productsData: {
        plants: [],
        total: 0
    },
    plantsLineChartData: [],
    plantsPolarChartData: [],
    reviewsData: {
        reviews: [],
        total: 0
    },
    reviewsLineChartData: [],
    reviewsPieChartData: { labels: [], data: [] },
    incomeData: {
        orders: [],
        total: 0
    },
    incomeBarChartData: [],
    incomePieChartData: { labels: [], data: [] },
    couponsData: {
        coupons: [],
        total: 0
    },
    contactsData: {
        contacts: [],
        total: 0
    },
    isLoading: false,
    error: null,
};

export const adminStatsAsync = createAsyncThunk('/admin/stats', async (filter = 'Monthly') => {
    const response = await handelDataFetch(`/api/v2/admin/stats?filter=${filter}`, 'GET');
    return response.data;
});

export const adminOrdersAsync = createAsyncThunk('/admin/orders', async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await handelDataFetch(`/api/v2/admin/orders?${queryStr}`, 'GET');
    return response.data;
});

export const adminOrdersBarChartAsync = createAsyncThunk('/admin/ordersBarChart', async (year) => {
    const response = await handelDataFetch(`/api/v2/admin/orders/charts/bar?year=${year}`, 'GET');
    return response.data;
});

export const adminOrdersPieChartAsync = createAsyncThunk('/admin/ordersPieChart', async (year) => {
    const url = year ? `/api/v2/admin/orders/charts/pie?year=${year}` : `/api/v2/admin/orders/charts/pie`;
    const response = await handelDataFetch(url, 'GET');
    return response.data;
});

export const adminIncomeAsync = createAsyncThunk('/admin/income', async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await handelDataFetch(`/api/v2/admin/income?${queryStr}`, 'GET');
    return response.data;
});

export const adminIncomeBarChartAsync = createAsyncThunk('/admin/incomeBarChart', async (year) => {
    const url = year ? `/api/v2/admin/income/charts/bar?year=${year}` : `/api/v2/admin/income/charts/bar`;
    const response = await handelDataFetch(url, 'GET');
    return response.data;
});

export const adminIncomePieChartAsync = createAsyncThunk('/admin/incomePieChart', async (year) => {
    const url = year ? `/api/v2/admin/income/charts/pie?year=${year}` : `/api/v2/admin/income/charts/pie`;
    const response = await handelDataFetch(url, 'GET');
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

export const adminUsersAsync = createAsyncThunk('/admin/users', async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await handelDataFetch(`/api/v2/admin/users?${queryStr}`, 'GET');
    return response.data;
});

export const adminDeleteUserAsync = createAsyncThunk('/admin/users/delete', async (id) => {
    const response = await handelDataFetch(`/api/v2/admin/users/${id}`, 'DELETE');
    return response.data;
});

export const adminBulkDeleteUsersAsync = createAsyncThunk('/admin/users/bulkDelete', async (ids) => {
    const response = await handelDataFetch(`/api/v2/admin/users/bulk-delete`, 'POST', { ids });
    return response.data;
});

export const adminUpdateUserRoleAsync = createAsyncThunk('/admin/users/role', async ({ id, role }) => {
    const response = await handelDataFetch(`/api/v2/admin/users/${id}/role`, 'PATCH', { role });
    return response.data;
});

export const adminUpdateUserPasswordAsync = createAsyncThunk('/admin/users/password', async ({ id, password }) => {
    const response = await handelDataFetch(`/api/v2/admin/users/${id}/password`, 'PATCH', { password });
    return response.data;
});

export const adminToggleBlockUserAsync = createAsyncThunk('/admin/users/block', async (id) => {
    const response = await handelDataFetch(`/api/v2/admin/users/${id}/block`, 'PATCH');
    return response.data;
});

export const adminToggleVerifyUserAsync = createAsyncThunk('/admin/users/verify', async (id) => {
    const response = await handelDataFetch(`/api/v2/admin/users/${id}/verify`, 'PATCH');
    return response.data;
});

export const adminProductsAsync = createAsyncThunk('/admin/products', async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await handelDataFetch(`/api/v2/admin/plants?${queryStr}`, 'GET');
    return response.data;
});

export const adminPlantsLineChartAsync = createAsyncThunk('/admin/plantsLineChart', async (year) => {
    const response = await handelDataFetch(`/api/v2/admin/plants/charts/line?year=${year}`, 'GET');
    return response.data;
});

export const adminPlantsPolarChartAsync = createAsyncThunk('/admin/plantsPolarChart', async () => {
    const response = await handelDataFetch(`/api/v2/admin/plants/charts/polar`, 'GET');
    return response.data;
});

export const adminUpdatePlantStatusAsync = createAsyncThunk('/admin/updatePlantStatus', async ({ id, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/plants/${id}/status`, 'PATCH', { status });
    return response.data;
});

export const adminAddPlantAsync = createAsyncThunk('/admin/addPlant', async (data) => {
    const response = await handelDataFetch(`/api/v2/admin/plants`, 'POST', data);
    return response.data;
});

export const adminUpdatePlantAsync = createAsyncThunk('/admin/updatePlant', async ({ id, data }) => {
    const response = await handelDataFetch(`/api/v2/admin/plants/${id}`, 'PUT', data);
    return response.data;
});

export const adminBulkUpdatePlantStatusAsync = createAsyncThunk('/admin/bulkUpdatePlantStatus', async ({ ids, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/plants/bulk-status`, 'PATCH', { ids, status });
    return { ...response.data, ids, status };
});

export const adminNurseriesAsync = createAsyncThunk('/admin/nurseries', async () => {
    const response = await handelDataFetch(`/api/v2/admin/nurseries`, 'GET');
    return response.data;
});

export const adminImpersonateAsync = createAsyncThunk('/admin/impersonate', async (data) => {
    const response = await handelDataFetch(`/api/v2/admin/impersonate`, 'POST', data);
    return response.data;
});

export const adminReviewsAsync = createAsyncThunk('/admin/reviews', async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await handelDataFetch(`/api/v2/admin/reviews?${queryStr}`, 'GET');
    return response.data;
});

export const adminReviewsLineChartAsync = createAsyncThunk('/admin/reviewsLineChart', async (year) => {
    const response = await handelDataFetch(`/api/v2/admin/reviews/charts/line?year=${year}`, 'GET');
    return response.data;
});

export const adminReviewsPieChartAsync = createAsyncThunk('/admin/reviewsPieChart', async (year) => {
    const url = year ? `/api/v2/admin/reviews/charts/pie?year=${year}` : `/api/v2/admin/reviews/charts/pie`;
    const response = await handelDataFetch(url, 'GET');
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

export const adminCouponsAsync = createAsyncThunk('/admin/coupons', async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await handelDataFetch(`/api/v2/admin/coupons?${queryStr}`, 'GET');
    return response.data;
});

export const adminUpdateCouponStatusAsync = createAsyncThunk('/admin/updateCouponStatus', async ({ id, status }) => {
    const response = await handelDataFetch(`/api/v2/admin/coupons/${id}/status`, 'PATCH', { status });
    return response.data;
});

export const adminUpdateCouponAsync = createAsyncThunk('/admin/updateCoupon', async ({ id, data }) => {
    const response = await handelDataFetch(`/api/v2/admin/coupons/${id}`, 'PUT', data);
    return response.data;
});

export const adminDeleteCouponAsync = createAsyncThunk('/admin/deleteCoupon', async (id) => {
    const response = await handelDataFetch(`/api/v2/admin/coupons/${id}`, 'DELETE');
    return response.data;
});

export const adminGetContactsAsync = createAsyncThunk('/admin/getContacts', async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    const response = await handelDataFetch(`/api/v2/admin/contact-us?${queryStr}`, 'GET');
    return response.data;
});

export const adminReplyToContactAsync = createAsyncThunk('/admin/replyToContact', async ({ id, replyMessage }) => {
    const response = await handelDataFetch(`/api/v2/admin/contact-us/${id}/reply`, 'POST', { replyMessage });
    return response.data;
});

export const adminDeleteContactAsync = createAsyncThunk('/admin/deleteContact', async (id) => {
    const response = await handelDataFetch(`/api/v2/admin/contact-us/${id}`, 'DELETE');
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
                        data: action.payload.orders,
                        total: action.payload.total || 0
                    };
                }
                state.error = null;
            })
            .addCase(adminOrdersAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // ORDERS BAR CHART
            .addCase(adminOrdersBarChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminOrdersBarChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.ordersBarChartData = action.payload.barData;
                }
                state.error = null;
            })
            .addCase(adminOrdersBarChartAsync.rejected, (state, action) => {
                state.error = action.error;
            })
            // ORDERS PIE CHART
            .addCase(adminOrdersPieChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminOrdersPieChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.ordersPieChartData = {
                        labels: action.payload.pieLabels,
                        data: action.payload.pieData
                    };
                }
                state.error = null;
            })
            .addCase(adminOrdersPieChartAsync.rejected, (state, action) => {
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
                        orders: action.payload.orders,
                        total: action.payload.total || 0
                    };
                }
                state.error = null;
            })
            .addCase(adminIncomeAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // INCOME BAR CHART
            .addCase(adminIncomeBarChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminIncomeBarChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.incomeBarChartData = action.payload.barData;
                }
                state.error = null;
            })
            .addCase(adminIncomeBarChartAsync.rejected, (state, action) => {
                state.error = action.error;
            })
            // INCOME PIE CHART
            .addCase(adminIncomePieChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminIncomePieChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.incomePieChartData = {
                        labels: action.payload.pieLabels,
                        data: action.payload.pieData
                    };
                }
                state.error = null;
            })
            .addCase(adminIncomePieChartAsync.rejected, (state, action) => {
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
                        state.ordersData.data[orderIndex].orderStatus = {
                            status,
                            message: statusMessage || `${status} status updated`,
                            statusAt: new Date().toISOString()
                        };
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
                            state.ordersData.data[orderIndex].orderStatus = {
                                status,
                                message: statusMessage || `${status} status updated`,
                                statusAt: new Date().toISOString()
                            };
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
                    state.usersTotal = action.payload.total || 0;
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
                        plants: action.payload.plants,
                        total: action.payload.total || 0
                    };
                }
                state.error = null;
            })
            .addCase(adminProductsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // PLANTS LINE CHART
            .addCase(adminPlantsLineChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminPlantsLineChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.plantsLineChartData = action.payload.lineData;
                }
                state.error = null;
            })
            .addCase(adminPlantsLineChartAsync.rejected, (state, action) => {
                state.error = action.error;
            })
            // PLANTS POLAR CHART
            .addCase(adminPlantsPolarChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminPlantsPolarChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.plantsPolarChartData = action.payload.polarData;
                }
                state.error = null;
            })
            .addCase(adminPlantsPolarChartAsync.rejected, (state, action) => {
                state.error = action.error;
            })
            // Update individual plant status
            .addCase(adminUpdatePlantStatusAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminUpdatePlantStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.productsData.plants.findIndex(p => p._id === action.payload.plant._id);
                if (index !== -1) {
                    state.productsData.plants[index] = action.payload.plant;
                }
            })
            .addCase(adminUpdatePlantStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.error.message || "Failed to update plant status");
            })
            // Update complete plant data
            .addCase(adminUpdatePlantAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminUpdatePlantAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.productsData.plants.findIndex(p => p._id === action.payload.plant._id);
                if (index !== -1) {
                    state.productsData.plants[index] = action.payload.plant;
                }
            })
            .addCase(adminUpdatePlantAsync.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.error.message || "Failed to update plant");
            })
            // Add new plant
            .addCase(adminAddPlantAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminAddPlantAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productsData.plants.unshift(action.payload.plant);
                state.productsData.total += 1;
            })
            .addCase(adminAddPlantAsync.rejected, (state, action) => {
                state.isLoading = false;
                message.error(action.error.message || "Failed to add plant");
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
                        reviews: action.payload.reviews,
                        total: action.payload.total || 0
                    };
                }
                state.error = null;
            })
            .addCase(adminReviewsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            // REVIEWS LINE CHART
            .addCase(adminReviewsLineChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminReviewsLineChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.reviewsLineChartData = action.payload.lineData;
                }
                state.error = null;
            })
            .addCase(adminReviewsLineChartAsync.rejected, (state, action) => {
                state.error = action.error;
            })
            // REVIEWS PIE CHART
            .addCase(adminReviewsPieChartAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(adminReviewsPieChartAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.reviewsPieChartData = {
                        labels: action.payload.pieLabels,
                        data: action.payload.pieData
                    };
                }
                state.error = null;
            })
            .addCase(adminReviewsPieChartAsync.rejected, (state, action) => {
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
                    state.couponsData = {
                        coupons: action.payload.coupons,
                        total: action.payload.total || 0
                    };
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
            })
            // UPDATE COUPON
            .addCase(adminUpdateCouponAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUpdateCouponAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status && action.payload.coupon) {
                    const index = state.couponsData.coupons.findIndex(c => c._id === action.payload.coupon._id);
                    if (index !== -1) {
                        state.couponsData.coupons[index] = action.payload.coupon;
                        message.success("Coupon updated successfully!");
                    }
                }
            })
            .addCase(adminUpdateCouponAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to update coupon");
            })
            // DELETE COUPON
            .addCase(adminDeleteCouponAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminDeleteCouponAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    state.couponsData.coupons = state.couponsData.coupons.filter(c => c._id !== action.payload.id);
                    message.success("Coupon deleted successfully!");
                }
            })
            .addCase(adminDeleteCouponAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to delete coupon");
            })
            // CONTACTS
            .addCase(adminGetContactsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminGetContactsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    state.contactsData = {
                        contacts: action.payload.contacts,
                        total: action.payload.total || 0
                    };
                }
            })
            .addCase(adminGetContactsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
            })
            .addCase(adminReplyToContactAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminReplyToContactAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status && action.payload.contact) {
                    const index = state.contactsData.contacts.findIndex(c => c._id === action.payload.contact._id);
                    if (index !== -1) {
                        state.contactsData.contacts[index] = action.payload.contact;
                    }
                    message.success("Reply sent successfully!");
                }
            })
            .addCase(adminReplyToContactAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to send reply");
            })
            // SINGLE DELETE
            .addCase(adminDeleteUserAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminDeleteUserAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    state.users = state.users.filter(u => u._id !== action.payload.id);
                    message.success("User deleted successfully!");
                }
            })
            .addCase(adminDeleteUserAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to delete user");
            })
            // BULK DELETE
            .addCase(adminBulkDeleteUsersAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminBulkDeleteUsersAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    state.users = state.users.filter(u => !action.payload.ids.includes(u._id));
                    message.success(action.payload.message);
                }
            })
            .addCase(adminBulkDeleteUsersAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to bulk delete users");
            })
            // UPDATE ROLE
            .addCase(adminUpdateUserRoleAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUpdateUserRoleAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    const index = state.users.findIndex(u => u._id === action.payload.user._id);
                    if (index !== -1) {
                        state.users[index] = action.payload.user;
                    }
                    message.success(action.payload.message);
                }
            })
            .addCase(adminUpdateUserRoleAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to update role");
            })
            // UPDATE PASSWORD
            .addCase(adminUpdateUserPasswordAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminUpdateUserPasswordAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    message.success(action.payload.message);
                }
            })
            .addCase(adminUpdateUserPasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to update password");
            })
            // TOGGLE BLOCK
            .addCase(adminToggleBlockUserAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminToggleBlockUserAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    const index = state.users.findIndex(u => u._id === action.payload.user._id);
                    if (index !== -1) {
                        state.users[index] = action.payload.user;
                    }
                    message.success(action.payload.message);
                }
            })
            .addCase(adminToggleBlockUserAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to toggle block status");
            })
            // TOGGLE VERIFY
            .addCase(adminToggleVerifyUserAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminToggleVerifyUserAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    const index = state.users.findIndex(u => u._id === action.payload.user._id);
                    if (index !== -1) {
                        state.users[index] = action.payload.user;
                    }
                    message.success(action.payload.message);
                }
            })
            .addCase(adminToggleVerifyUserAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to toggle verify status");
            })
            .addCase(adminDeleteContactAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(adminDeleteContactAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.status) {
                    state.contactsData.contacts = state.contactsData.contacts.filter(c => c._id !== action.payload.id);
                    message.success("Contact message deleted!");
                }
            })
            .addCase(adminDeleteContactAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
                message.error(action.error.message || "Failed to delete contact message");
            });
    }
});

export default adminSlice.reducer;
