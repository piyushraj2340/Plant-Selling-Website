import React from 'react'
import Cart from '../features/cart/Components/Cart';
import { useSelector } from 'react-redux';
import EmptyCart from '../features/cart/Components/EmptyCart';

const CartPage = () => {
    document.title = "Cart Information";
    const cartLength = useSelector(state => state.cart.carts.length);
    return (
        <>
        {cartLength ? <Cart /> : <EmptyCart />}
        </>
    )
}

export default CartPage