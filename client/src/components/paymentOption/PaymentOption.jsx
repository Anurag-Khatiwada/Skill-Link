// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./PaymentOption.css";
// import newRequest from "../../utils/newRequest";
// import { v4 as uuidv4 } from 'uuid';

// const PaymentOptions = ({ id }) => {
//   const navigate = useNavigate();

//   const handleStripePayment = () => {
//     console.log("Proceeding with Stripe payment");
//     // If logged in, navigate to payment page
//     navigate(`/pay/${id}`);
//   };

//   const handleEsewaPayment = async () => {
//     console.log("Proceeding with eSewa payment");

//     try {
//       // Add eSewa payment logic here
//       const response = await newRequest.post(`/orders/initiate-payment/${id}`);
//       console.log(response.data);

//       if (response.status === 200) {
//         const formData = response.data.formData;

//         // Create form for eSewa payment
//         const form = document.createElement("form");
//         form.setAttribute("method", "POST");
//         form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

//         // Add hidden inputs for form data
//         for (const key in formData) {
//           const input = document.createElement("input");
//           input.type = "hidden";
//           input.name = key;
//           input.value = formData[key];
//           form.appendChild(input);
//         }

//         // Append the form to the body and submit it
//         document.body.appendChild(form);
//         form.submit();
//       } else {
//         console.error("eSewa Payment Initialization Failed");
//       }
//     } catch (err) {
//       console.error("Error during eSewa payment initiation:", err);
//     }
//   };

//   return (
//     <div className="payment-options">
//       <h2>Choose Payment Method</h2>
//       <div className="payment-buttons">
//         <button className="payment-button stripe" onClick={handleStripePayment}>
//           <img src="https://www.stickpng.com/img/tech-companies/stripe-payment-logo" alt="Stripe" />
//           Pay with Stripe
//         </button>
//         <button className="payment-button esewa" onClick={handleEsewaPayment}>
//           <img src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Esewa_logo.webp" alt="eSewa" />
//           Pay with eSewa
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentOptions;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentOption.css";
import newRequest from "../../utils/newRequest";
import { v4 as uuidv4 } from 'uuid';

const PaymentOptions = ({ id }) => {
  const navigate = useNavigate();

  const handleStripePayment = () => {
    console.log("Proceeding with Stripe payment");
    navigate(`/pay/${id}`);
  };

  const handleEsewaPayment = async () => {
    console.log("Proceeding with eSewa payment");

    try {
      // Send request to the backend to initiate eSewa payment
      const response = await newRequest.post(`/orders/initiate-payment/${id}`);
      console.log(response.data);

      if (response.status === 200) {
        const formData = response.data.formData;

        // Create the form for eSewa payment
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

        // Add hidden inputs for form data
        Object.keys(formData).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = formData[key];
          form.appendChild(input);
        });

        // Append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
      } else {
        console.error("eSewa Payment Initialization Failed");
      }
    } catch (err) {
      console.error("Error during eSewa payment initiation:", err);
    }
  };

  return (
    <div className="payment-options">
      <h2>Choose Payment Method</h2>
      <div className="payment-buttons">
        <button className="payment-button stripe" onClick={handleStripePayment}>
          <img src="https://www.stickpng.com/img/tech-companies/stripe-payment-logo" alt="Stripe" />
          Pay with Stripe
        </button>
        <button className="payment-button esewa" onClick={handleEsewaPayment}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Esewa_logo.webp" alt="eSewa" />
          Pay with eSewa
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
