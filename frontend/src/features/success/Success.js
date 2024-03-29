import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateOrderAfterConfirmPaymentAsync } from '../order/orderSlice';

const Success = () => {
    document.title = "Payment successful";

    const [payment, client, status] = window.location.search && window.location.search.split("&");

    const dispatch = useDispatch();

    const navigate = useNavigate();


    

    //TODO: move to utils folder of successPaymentPage
    function handelUpdateOrderAfterConfirmPayment() {
        if (!payment || !client || !status) {
            navigate('/');
            return;
        }

        const [paymentKey, paymentValue] = payment.split("=");
        const [statusKey, statusValue] = status.split("=");

        const data = {
            paymentInfo: {
                paymentId: paymentKey === "?payment_intent" ? paymentValue : null,
                status: statusKey === "redirect_status" ? statusValue : null,
            },
            navigate
        }

        dispatch(updateOrderAfterConfirmPaymentAsync(data))
    }

    useEffect(() => {
        handelUpdateOrderAfterConfirmPayment();
    }, []);

    return (
        <div className='bg-dark row d-flex justify-content-center align-content-center m-0' style={{ width: "100%", minHeight: "100vh", position: "fixed", top: "0", left: "0", zIndex: 1 }}>
            <div className="alert alert-success col-md-4" style={{ height: "100%" }}>
                <strong>✔ Order Done!</strong> through online Payments.
            </div>
        </div>
    )
}

export default Success