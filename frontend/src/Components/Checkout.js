import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Payment from './Payment'
import handelDataFetch from '../Controller/handelDataFetch';
import Animation from './Shared/Animation';

const Checkout = () => {
  


  const [clientKey, setClientKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);




  const handelGetClientKey = async () => {
    try {
      const result = await handelDataFetch({ path: "/api/v2/stripe/public/key", method: "GET" }, setShowAnimation);

      if (result) {
        setClientKey(result.result.stripeApiKey);
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handelClientSecretKey = async () => {
    try {
      const result = await handelDataFetch({ path: "/api/v2/payment/process", method: "POST", body: { amount: 200 } }, setShowAnimation);
      if (result.status) {
        setClientSecret(result.result.client_secret);
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    handelGetClientKey();
    handelClientSecretKey();
  }, []);
  
  return (
    <>
      {
        (clientKey && clientSecret) ?
        <Elements stripe={loadStripe(clientKey)} options={{
          clientSecret, 
          appearance: {
            theme: 'stripe',
            labels: 'floating',
          }}} >
          <Payment />
        </Elements>
        :

        <div>Payment Form not found!...</div>
      }
      {
        showAnimation && <Animation />
      }

    </>

  )
}

export default Checkout