import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import NotFound from '../../components/notFound/NotFound';

const PaymentSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const transaction_uuid = params.get("transaction_uuid");
  const signature = params.get("signature");

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const response = await newRequest.post("/orders/success", {
          transaction_uuid,
          signature,
        });

        if (response.status === 200 && response.data.redirect) {
          setTimeout(() => {
            navigate("/orders");
          }, 5000);
        } else {
          setError("Error: " + (response.data.message || "Payment confirmation failed"));
        }
      } catch (err) {
        console.error("Error in payment confirmation", err);
        setError("Error processing the payment. Please try again later.");
      } finally {
        setIsRedirecting(true);
      }
    };

    if (transaction_uuid && signature) {
      makeRequest();
    }
  }, [transaction_uuid, signature, navigate]);

  return (
    <div>
      {isRedirecting ? (
        error ? (
          <p>{error}</p>
        ) : (
          <NotFound isPaymentSuccess={true}/>
        )
      ) : (
        <p>Processing payment confirmation...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
