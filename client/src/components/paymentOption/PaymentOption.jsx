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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0AaztiWmGTUTLl0bJNvQE-HyOtqyWLY4I4g&s" alt="Stripe" />
          Pay with Stripe
        </button>
        <button className="payment-button esewa" onClick={handleEsewaPayment}>
          <img src="data:image/png;base64,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" alt="eSewa" />
          Pay with eSewa
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
