import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import handelDataFetch from '../../utils/handelDataFetch';
import { userLogoutAsync } from '../auth/authSlice';
import { updateOrderAfterConfirmPaymentAsync } from '../order/orderSlice';

const initialState = {
    carts: [],
    selectedCart: null,
    cartPriceDetails: null,
    cartLength: 0,
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

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartPricing: (state, action) => {
            const products = action.payload;

            const totalPriceWithoutDiscount = (products.reduce((total, curObj) => total + (curObj.pricing.priceWithoutDiscount * curObj.quantity), 0).toFixed(2));
            const actualPriceAfterDiscount = (products.reduce((total, curObj) => total + (curObj.pricing.priceAfterDiscount * curObj.quantity), 0)).toFixed(2);
            const discountPrice = (products.reduce((total, curObj) => total + (curObj.pricing.discountPrice * curObj.quantity), 0)).toFixed(2);
            const deliveryPrice = (actualPriceAfterDiscount < 500 ? 90 : 0).toFixed(2)

            const pricing = {
                totalPriceWithoutDiscount,
                actualPriceAfterDiscount,
                discountPrice,
                deliveryPrice, // calculate the delivery price dynamic
                totalPrice: (Number(actualPriceAfterDiscount) + Number(deliveryPrice)).toFixed(2)
            }

            state.cartPriceDetails = pricing;
        },
        setSelectedCart: (state, action) => {
            state.selectedCart = action.payload;
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

                action.payload.result.result.orderItems.forEach(items => {
                    const index = state.carts.findIndex(cart => cart.plant._id === items.plant);

                    state.carts.splice(index, 1);
                    state.cartLength = state.carts.length;
                })

            })
            .addCase(addToCartAsync.pending, (state) => {
                //^ FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = true;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                //* FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = false;
                state.carts.push(action.payload.result);
                state.cartLength = state.carts.length;
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                //! FETCH_CART_DETAILS
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartDataFetchAsync.pending, (state) => {
                //^ FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartDataFetchAsync.fulfilled, (state, action) => {
                //* FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = false;
                state.carts = action.payload.result;
                state.cartLength = state.carts.length;
            })
            .addCase(cartDataFetchAsync.rejected, (state, action) => {
                //! FETCH_CART_DETAILS
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartDataDeleteAsync.pending, (state) => {
                //^ FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartDataDeleteAsync.fulfilled, (state, action) => {
                //* FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = false;

                const deleteCartIndex = state.carts.findIndex(cart => cart._id === action.payload.result._id);
                state.carts.splice(deleteCartIndex, 1);

                state.cartLength = state.carts.length;
            })
            .addCase(cartDataDeleteAsync.rejected, (state, action) => {
                //! FETCH_CART_DETAILS
                state.error = action.error;
                state.isLoading = false;
            })
            .addCase(cartDataUpdateQuantityAsync.pending, (state) => {
                //^ FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = true;
            })
            .addCase(cartDataUpdateQuantityAsync.fulfilled, (state, action) => {
                //* FETCH_CART_DETAILS
                state.error = null;
                state.isLoading = false;

                const deleteCartIndex = state.carts.findIndex(cart => cart._id === action.payload.result._id);
                state.carts.splice(deleteCartIndex, 1, action.payload.result);
            })
            .addCase(cartDataUpdateQuantityAsync.rejected, (state, action) => {
                //! FETCH_CART_DETAILS
                state.error = action.error;
                state.isLoading = false;
            })
    }
});

export const { setCartPricing, setSelectedCart } = cartSlice.actions;
export default cartSlice.reducer;