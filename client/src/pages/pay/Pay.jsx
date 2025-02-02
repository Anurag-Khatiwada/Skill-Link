
  // // import React, { useEffect, useState,  useRef} from "react";
  // // import "./Pay.css";
  // // import { loadStripe } from "@stripe/stripe-js";
  // // import { Elements } from "@stripe/react-stripe-js";
  // // import newRequest from "../../utils/newRequest";
  // // import { useParams } from "react-router-dom";
  // // import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

  // // const stripePromise = loadStripe(
  // //   "pk_test_51Q7wUUGkmIVfyuo1vdj9f4UB9Ruu5Ba2Vfm5ZwrR0HHE4uu0GdH85WkrHdpL86Jpww1S80i3amRW1A2MSZp4jvr900DDuxirYU"
  // // );

  // // const Pay = () => {
  // //   const [clientSecret, setClientSecret] = useState("");

  // //   const { id } = useParams();

  // //   // useEffect(() => {
  // //   //   const makeRequest = async () => {
  // //   //     try {
  // //   //       const res = await newRequest.post(
  // //   //         `/orders/create-payment-intent/${id}`
  // //   //       );
  // //   //       setClientSecret(res.data.clientSecret);
  // //   //     } catch (err) {
  // //   //       console.log(err);
  // //   //     }
  // //   //   };
  // //   //   makeRequest();
  // //   // },[]);

  // //   // useEffect(() => {
  // //   //   let didCancel = false; // Flag to check if the component has unmounted
  // //   //   const makeRequest = async () => {
  // //   //     if (!didCancel) {
  // //   //       try {
  // //   //         const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
  // //   //         setClientSecret(res.data.clientSecret);
  // //   //       } catch (err) {
  // //   //         console.log(err);
  // //   //       }
  // //   //     }
  // //   //   };
  // //   //   makeRequest();
  // //   //   return () => {
  // //   //     didCancel = true; // Prevents request when component unmounts
  // //   //   };
  // //   // }, [id]); // Pass `id` to dependency array if necessary

  // // useEffect(() => {
  // //   let timeoutId = setTimeout(async () => {
  // //     try {
  // //       const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
  // //       setClientSecret(res.data.clientSecret);
  // //     } catch (err) {
  // //       console.log(err);
  // //     }
  // //   }, 500); // Delay request for 500ms to debounce multiple triggers

  // //   return () => clearTimeout(timeoutId); // Clear timeout on unmount or re-render
  // // }, [id]);
  // // ;

    
    

  // //   const appearance = {
  // //     theme: 'stripe',
  // //   };
  // //   const options = {
  // //     clientSecret,
  // //     appearance,
  // //   };

  // //   return <div className="pay">
  // //     {clientSecret && (
  // //         <Elements className='element' options={options} stripe={stripePromise}>
  // //           <CheckoutForm />
  // //         </Elements>
  // //       )}
  // //   </div>;
  // // };

  // // export default Pay;


  // import React, { useEffect, useState } from "react";
  // import "./Pay.css";
  // import { loadStripe } from "@stripe/stripe-js";
  // import { Elements } from "@stripe/react-stripe-js";
  // import newRequest from "../../utils/newRequest";
  // import { useParams } from "react-router-dom";
  // import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

  // const stripePromise = loadStripe("pk_test_51Q7wUUGkmIVfyuo1vdj9f4UB9Ruu5Ba2Vfm5ZwrR0HHE4uu0GdH85WkrHdpL86Jpww1S80i3amRW1A2MSZp4jvr900DDuxirYU");

  // const Pay = () => {
  //   const [clientSecret, setClientSecret] = useState("");
  //   const { id } = useParams();

  //   useEffect(() => {
  //     const makeRequest = async () => {
  //       try {
  //         const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
  //         if (res.status === 200) {
  //           setClientSecret(res.data.clientSecret);
  //         } else {
  //           console.error("Failed to fetch payment intent");
  //         }
  //       } catch (err) {
  //         console.error("Error fetching clientSecret:", err);
  //       }
  //     };
  //     makeRequest();
  //   }, [id]);

  //   const appearance = {
  //     theme: "stripe",
  //   };

  //   const options = {
  //     clientSecret,
  //     appearance,
  //   };

  //   return (
  //     <div className="pay">
  //       {clientSecret ? (
  //         <Elements className="element" options={options} stripe={stripePromise}>
  //           <CheckoutForm />
  //         </Elements>
  //       ) : (
  //         <p>Loading payment options...</p>
  //       )}
  //     </div>
  //   );
  // };

  // export default Pay;


  import React, { useEffect, useState, useCallback } from "react";
  import "./Pay.css";
  import { loadStripe } from "@stripe/stripe-js";
  import { Elements } from "@stripe/react-stripe-js";
  import newRequest from "../../utils/newRequest";
  import { useParams } from "react-router-dom";
  import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
  
  const stripePromise = loadStripe("pk_test_51Q7wUUGkmIVfyuo1vdj9f4UB9Ruu5Ba2Vfm5ZwrR0HHE4uu0GdH85WkrHdpL86Jpww1S80i3amRW1A2MSZp4jvr900DDuxirYU");
  
  const Pay = () => {
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
  
    const makeRequest = useCallback(async () => {
      if (clientSecret) return; // Prevent multiple requests if we already have a client secret
  
      setIsLoading(true);
      try {
        const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
        if (res.status === 200 && res.data.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          setError("Failed to fetch payment intent. Server response was unexpected.");
          console.error("Unexpected server response:", res);
        }
      } catch (err) {
        setError(`Error fetching clientSecret: ${err.message}`);
        console.error("Error details:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        } else if (err.request) {
          console.error("No response received. Request details:", err.request);
        }
      } finally {
        setIsLoading(false);
      }
    }, [id, clientSecret]);
  
    useEffect(() => {
      makeRequest();
    }, [makeRequest]);
  
    const appearance = {
      theme: "stripe",
    };
  
    const options = {
      clientSecret,
      appearance,
    };
  
    if (error) {
      return <div className="pay error">{error}</div>;
    }
  
    if (isLoading) {
      return <div className="pay loading">Loading payment options...</div>;
    }
  
    return (
      <div className="pay">
        {clientSecret && (
          <Elements className="element" options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    );
  };
  
  export default Pay;