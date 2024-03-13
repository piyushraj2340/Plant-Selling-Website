import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Payment from './Payment'
import { useNavigate } from 'react-router-dom';
import { Steps, message } from 'antd';
import handelDataFetchCheckout from '../checkoutAPI';


const Checkout = () => {
  const [clientKey, setClientKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const activeStep = 2;

  const navigate = useNavigate();

  const stepsOptions = [
    {
      title: 'Shipping Details',
      icon: <span className='fas fa-shipping-fast'></span>,
      disabled: true,
    },
    {
      title: 'Confirm Order',
      icon: <span className='	fas fa-check-square'></span>,
      disabled: true
    },
    {
      title: 'Payment',
      icon: <span className='fas fa-university'></span>,
    },];




  const handelGetClientKey = async () => {
    try {
      const result = await handelDataFetchCheckout("/api/v2/checkout/stripe/public/key",  "GET" );

      if (result) {
        setClientKey(result.result.stripeApiKey);
      } else {
        message.error("Invalid Payment Session!.")
        throw new Error(result.message)
      }
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  }

  const handelClientSecretKey = async () => {
    try {
      const result = await handelDataFetchCheckout("/api/v2/checkout/payments",  "POST", { amount });
      if (result.status) {
        setClientSecret(result.result.client_secret);
        setAmount(result.result.amount);
      } else {
        message.error("Invalid Payment Session!.")
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  }


  useEffect(() => {
    handelGetClientKey();
    handelClientSecretKey();
  }, []);

  return (
    <section className='position-fixed w-100 h-100 top-0 section-checkout p-1'>

      <div className='container bg-section h-100 py-4'>
        <div className='py-2 py-md-4 border-bottom px-2 px-md-4'>
          <Steps items={stepsOptions} current={activeStep} />
        </div>

        {
          (clientKey && clientSecret) ?
            <Elements stripe={loadStripe(clientKey)} options={{
              clientSecret,
              appearance: {
                theme: 'night',
                labels: 'floating',
              },
              loader: "always"
            }} >
              <Payment amount={amount} />

            </Elements>
            :

            // loading animation while waiting to Loading the payment Element.
            <div className='d-flex h-50 justify-content-center align-items-center'>
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
        }
      </div>
    </section>
  )
}

export default Checkout