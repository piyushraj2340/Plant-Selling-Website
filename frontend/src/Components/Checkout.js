import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Payment from './Payment'
import handelDataFetch from '../Controller/handelDataFetch';
import Animation from './Shared/Animation';
import { useNavigate } from 'react-router-dom';
import { Steps } from 'antd';



const Checkout = () => {

  const [clientKey, setClientKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeStep, setActiveStep] = useState(2);

  const navigate = useNavigate();

  const handelChangeActiveStep = (step) => {
    if(step > activeStep) return;
    
    switch (step) {
      case 0: navigate('/checkout/shipping');
        break;
      case 1: navigate('/checkout/confirm');
        break;
      case 2: navigate('/checkout/payment');
        break;
      default: navigate('/');
    }
  }

  const stepsOptions = [
    {
      title: 'Shipping Details',
      icon: <span className='fas fa-shipping-fast'></span>,
    },
    {
      title: 'Confirm Order',
      icon: <span className='	fas fa-check-square'></span>,
    },
    {
      title: 'Payment',
      icon: <span className='fas fa-university'></span>,
    },];




  const handelGetClientKey = async () => {
    try {
      const result = await handelDataFetch({ path: "/api/v2/checkout/stripe/public/key", method: "GET" }, setShowAnimation);

      if (result) {
        setClientKey(result.result.stripeApiKey);
      } else {
        navigate('/login');
        throw new Error(result.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handelClientSecretKey = async () => {
    try {
      const result = await handelDataFetch({ path: "/api/v2/checkout/payments", method: "POST", body: { amount: 200 } }, setShowAnimation);
      if (result.status) {
        setClientSecret(result.result.client_secret);
        setAmount(result.result.amount);
      } else {
        navigate('/login');
        throw new Error(result.message)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    // handelGetClientKey();
    // handelClientSecretKey();
  }, []);

  return (
    <section className='position-fixed w-100 h-100 top-0 section-checkout p-1'>

      <div className='container bg-section h-100 py-4'>
        <div className='py-2 py-md-4 border-bottom px-2 px-md-4'>
          <Steps items={stepsOptions} current={activeStep} onChange={handelChangeActiveStep} />
        </div>
      </div>



      {/* {
        (clientKey && clientSecret) ?
        <Elements stripe={loadStripe(clientKey)} options={{
          clientSecret, 
          appearance: {
            theme: 'stripe',
            labels: 'floating',
          }}} >
          <Payment amount={amount}/>
        </Elements>
        :

        <div>Payment Form not found!...</div>
      } */}
      {
        showAnimation && <Animation />
      }

    </section>
  )
}

export default Checkout