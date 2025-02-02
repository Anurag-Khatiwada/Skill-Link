import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = ({ message, isLoading, isPaymentSuccess, isOrdered }) => {

  return (
    <div className="not-found-container">
      <div className="not-found-box">
        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : isPaymentSuccess ? (
          <p className="payment-text">
            Payment successful. You are being redirected to the orders page. Please do not close the page.
          </p>
        ) : ( isOrdered ? (
          <p className="payment-text">This service has already been ordered. You are being redirected to the orders page.Please do not close the page. Redirecting...</p>
        ):
          <>
            <h1 className="not-found-title">404</h1>
            <p className="not-found-subtitle">{message.main}</p>
            <p className="not-found-description">{message.sub}</p>
            <a href="/" className="not-found-button">Return Home</a>
          </>
        )}
      </div>
    </div>
  );
};

export default NotFound;
