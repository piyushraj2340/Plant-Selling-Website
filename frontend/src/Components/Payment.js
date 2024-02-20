import React, { useEffect, useRef, useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import handelDataFetch from '../Controller/handelDataFetch';
import Animation from './Shared/Animation';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();

  const payBtn = useRef(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {

  })

  const handleSubmit = async (event) => {
    payBtn.current.disabled = true;

    try {
      event.preventDefault();

      const data = await handelDataFetch({ path: "/api/v2/payment/process", method: "POST", body: { amount: 2342.34 } }, setShowAnimation)

      if (!stripe || !elements) {
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:3000/success',
        },
      });


      if (error) {
        payBtn.current.disabled = false;
        setErrorMessage(error.message);
      } else {
        alert("Payment done successfully.")
      }

    } catch (error) {
      console.log(error);
      payBtn.current.disabled = false;
    }
  };



  return (

    <section className='card bg-section'>
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center">
          <div className="col col-md-9 col-lg-6 bg-light p-2 p-3 rounded">
            <h4 className='h4 text-center'>Card Information</h4>
            {errorMessage && <div className='text-center mt-2 p-2 text-danger'>{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
              <PaymentElement options={{
                layout: {
                  type: 'accordion',
                  defaultCollapsed: false
                },
              }} />
              <button ref={payBtn} type="submit" disabled={!stripe || !elements} className='btn btn-primary w-100 mt-2'>
                Pay - 9099.93
              </button>
            </form>
          </div>
        </div>
      </div>
      {
        showAnimation && <Animation />
      }
    </section>

  )
}

export default Payment