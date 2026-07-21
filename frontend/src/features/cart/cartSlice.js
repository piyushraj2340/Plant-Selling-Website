import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import handelDataFetch from '../../utils/handelDataFetch';
import { userLogoutAsync } from '../auth/authSlice';
import { updateOrderAfterConfirmPaymentAsync } from '../order/orderSlice';

const initialState = {
    carts: [],
    selectedCart: null,
    cartPriceDetails: null,
    cartLength: 0,
    appliedCoupon: null,
    priceWarnings: [],
    applicableCoupons: [],
    error: null,
    isLoading: false
}

export const addToCartAsync = createAsyncThunk('/cart/details/add', async (data) => {
    const response = await handelDataFetch('/api/v2/user/carts', 'POST', data);
    return response.data;
});


export const cartDataFetchAsync = createAsyncThunk('/cart/details/fetch', async () => {
    const response = await handelDataFetch('/api/v2/user/carts', 'GET');
    return response.data;
});

export const cartDataDeleteAsync = createAsyncThunk('/cart/details/delete', async (cartId) => {
    const response = await handelDataFetch(`/api/v2/user/carts/${cartId}`, 'DELETE');
    return response.data;
});

export const cartDataUpdateQuantityAsync = createAsyncThunk('/cart/details/update', async ({ cartId, quantity }) => {
    console.log(cartId);
    const response = await handelDataFetch(`/api/v2/user/carts/${cartId}`, 'PATCH', { quantity });
    return response.data;
});

export const cartApplyCouponAsync = createAsyncThunk('/cart/coupons/apply', async (couponCode) => {
    const response = await handelDataFetch(`/api/v2/user/coupons/apply`, 'POST', { couponCode });
    return response.data;
});

export const cartGetApplicableCouponsAsync = createAsyncThunk('/cart/coupons/applicable', async () => {
    const response = await handelDataFetch(`/api/v2/user/coupons/applicable`, 'GET');
    return response.data;
});

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setSelectedCart: (state, action) => {
            state.selectedCart = action.payload;
        },
        removeCoupon: (state) => {
            state.appliedCoupon = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogoutAsync.fulfilled, () => {
                //* CLEANUP: TASK
                //? LOGOUT_CLEANUP_TASK:: REMOVE ALL THE CART INFORMATION AFTER LOGOUT

                return initialState;

            })
            .addCase(updateOrderAfterConfirmPaymentAsync.fulfilled, (state, action) => {
                //* CLEANUP: TASK
                //? CART_CLEANUP_TASK:: REMOVE THE CART INFORMATION AFTER SUCCEEDED PAYMENT

                state.carts = [];
                state.cartLength = 0;
                state.cartPriceDetails = {
                    totalPriceWithoutDiscount: 0,
                    totalDiscount: 0,
                    deliveryFee: 0,
                    finalPrice: 0
                };

            })
            .addCase(addToCartAsync.pending, (state) => {
                state.error = null;
                state.isLoading = true;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.error = null;
                state.isLoading = false;
                state.carts = action.payload.result;
                if (action.payload.cart) {
                    if (action.payload.cart.pricing) state.cartPriceDetails = action.payload.cart.pricing;
                    if (action.payload.cart.couponApplied) {
                        state.appliedCoupon = { 
                            ...action.payload.cart.couponApplied, 
                            discountAmount: action.payload.cart.pricing.couponDiscountAmount 
                        };
                    } else if (action.payload.cart.couponApplied === null) {
                        state.appliedCoupon = null;
                    }
                    if (action.payload.cart.priceWarnings) state.priceWarnings = action.payload.cart.priceWarnings;
                }
                state.cartLength = state.carts.length;
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartDataFetchAsync.pending, (state) => {
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartDataFetchAsync.fulfilled, (state, action) => {
                state.error = null;
                state.isLoading = false;
                state.carts = action.payload.result;
                if (action.payload.cart) {
                    if (action.payload.cart.pricing) state.cartPriceDetails = action.payload.cart.pricing;
                    if (action.payload.cart.couponApplied) {
                        state.appliedCoupon = { 
                            ...action.payload.cart.couponApplied, 
                            discountAmount: action.payload.cart.pricing.couponDiscountAmount 
                        };
                    } else if (action.payload.cart.couponApplied === null) {
                        state.appliedCoupon = null;
                    }
                    if (action.payload.cart.priceWarnings) state.priceWarnings = action.payload.cart.priceWarnings;
                }
                state.cartLength = state.carts.length;
            })
            .addCase(cartDataFetchAsync.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartDataDeleteAsync.pending, (state) => {
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartDataDeleteAsync.fulfilled, (state, action) => {
                state.error = null;
                state.isLoading = false;
                state.carts = action.payload.result;
                if (action.payload.cart) {
                    if (action.payload.cart.pricing) state.cartPriceDetails = action.payload.cart.pricing;
                    if (action.payload.cart.couponApplied) {
                        state.appliedCoupon = { 
                            ...action.payload.cart.couponApplied, 
                            discountAmount: action.payload.cart.pricing.couponDiscountAmount 
                        };
                    } else if (action.payload.cart.couponApplied === null) {
                        state.appliedCoupon = null;
                    }
                    if (action.payload.cart.priceWarnings) state.priceWarnings = action.payload.cart.priceWarnings;
                }
                state.cartLength = state.carts.length;
            })
            .addCase(cartDataDeleteAsync.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartDataUpdateQuantityAsync.pending, (state) => {
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartDataUpdateQuantityAsync.fulfilled, (state, action) => {
                state.error = null;
                state.isLoading = false;
                state.carts = action.payload.result;
                if (action.payload.cart) {
                    if (action.payload.cart.pricing) state.cartPriceDetails = action.payload.cart.pricing;
                    if (action.payload.cart.couponApplied) {
                        state.appliedCoupon = { 
                            ...action.payload.cart.couponApplied, 
                            discountAmount: action.payload.cart.pricing.couponDiscountAmount 
                        };
                    } else if (action.payload.cart.couponApplied === null) {
                        state.appliedCoupon = null;
                    }
                    if (action.payload.cart.priceWarnings) state.priceWarnings = action.payload.cart.priceWarnings;
                }
                state.cartLength = state.carts.length;
            })
            .addCase(cartDataUpdateQuantityAsync.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartApplyCouponAsync.pending, (state) => {
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartApplyCouponAsync.fulfilled, (state, action) => {
                state.error = null;
                state.isLoading = false;
                if (action.payload.status) {
                    if (action.payload.cart) {
                        if (action.payload.cart.pricing) state.cartPriceDetails = action.payload.cart.pricing;
                        if (action.payload.cart.couponApplied) {
                            state.appliedCoupon = { 
                                ...action.payload.cart.couponApplied, 
                                discountAmount: action.payload.cart.pricing.couponDiscountAmount 
                            };
                        } else if (action.payload.cart.couponApplied === null) {
                            state.appliedCoupon = null;
                        }
                        if (action.payload.cart.priceWarnings) state.priceWarnings = action.payload.cart.priceWarnings;
                    }
                }
            })
            .addCase(cartApplyCouponAsync.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartGetApplicableCouponsAsync.pending, (state) => {
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartGetApplicableCouponsAsync.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.applicableCoupons = action.payload.coupons;
                }
                state.error = null;
                state.isLoading = false;
            })
            .addCase(cartGetApplicableCouponsAsync.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            });
    }
});

export const { setSelectedCart, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;