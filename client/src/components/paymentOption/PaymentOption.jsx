import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentOption.css";

const PaymentOptions = ({ id }) => {
  const navigate = useNavigate();

  const handleStripePayment = () => {
    console.log("Proceeding with Stripe payment");
    // If logged in, navigate to payment page
    navigate(`/pay/${id}`);
  };

  const handleEsewaPayment = () => {
    console.log("Proceeding with eSewa payment");
    // Add eSewa payment logic here
  };

  return (
    <div className="payment-options">
      <h2>Choose Payment Method</h2>
      <div className="payment-buttons">
        <button className="payment-button stripe" onClick={handleStripePayment}>
          <img src="/stripe-logo.svg" alt="Stripe" />
          Pay with Stripe
        </button>
        <button className="payment-button esewa" onClick={handleEsewaPayment}>
          <img src="/esewa-logo.svg" alt="eSewa" />
          Pay with eSewa
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
