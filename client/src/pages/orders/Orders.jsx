import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Orders.css";
import newRequest from "../../utils/newRequest";
const Orders = () => {
  const [orderStatus, setOrderStatus] = useState("Received");
  const [setStatus, setSetStatus] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();
  // Fetching orders using React Query
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"], // Include search in the query key
    queryFn: async () => {
      try {
        const response = await newRequest.get(`/orders`);
        console.log("API Response:", response.data); // Log the response

        return response.data; // Return the data from the response
      } catch (err) {
        console.error("Error Response:", err.response); // Log the full error response for debugging
        throw new Error(err.response?.data?.message || "Failed to fetch data"); // Error handling
      }
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });
  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  const handleContact = async (order) => {
    const freelancerId = order.freelancerId;
    const buyerId = order.buyerId;
    const id = freelancerId + buyerId;

    console.log(
      "Buyer ID:",
      buyerId,
      "freelancer ID:",
      freelancerId,
      "Current User:",
      currentUser
    );

    try {
      // Check if conversation already exists
      const res = await newRequest.get(`/conversations/single/${id}`);
      console.log("Existing conversation found:", res.data);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        // If conversation doesn't exist, create a new one
        try {
          const res = await newRequest.post(`/conversations`, {
            to: currentUser.isFreelancer ? buyerId : freelancerId,
          });
          console.log("New conversation created:", res.data);
          navigate(`/message/${res.data.id}`);
        } catch (createError) {
          console.error("Error creating conversation:", createError);
        }
      } else {
        console.error("Error fetching conversation:", err);
      }
    }
  };
  const handleStatusChange = (e) => {
    e.preventDefault();
    setOrderStatus(e.target.value);
  };
  console.log(orderStatus);
  const handleStatusUpdate = async (orderId) => {
    if(orderStatus==="Cancelled"){
      try {
        const res = await newRequest.put(`/orders/cancelOrder/${orderId}`);
        console.log(res);
        alert(res.data.message);
    } catch (err) {
        console.error(err);
        alert("Failed to cancel the order. Please try again.");
    }
    }
    const res = await newRequest.put(`/orders/updateOrder/${orderId}`, {
      orderStatus,
    });
    window.location.reload();
    console.log(res);
  };
  const handelSetStatus = () => {
    setSetStatus(true);
  };
  return (
    <div className="orders">
      <div className="orderscontainer">
        <div className="title">
          {currentUser?.isFreelancer ? (
            <h1>Orders Received:</h1>
          ) : (
            <h1>Orders:</h1>
          )}
        </div>
        <table>
          <tr>
            {currentUser.isFreelancer && (
              <>
                <th>Buyer</th>
              </>
            )}
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Contact</th>
            <th>Order Status</th>
          </tr>
          {data?.length > 0 ? (
            data.map((order) => (
              <tr key={order.id}>
                {currentUser.isFreelancer && (
                  <>
                    <th>{order?.buyerUsername}</th>
                  </>
                )}
                <td>
                  <img src={order?.img} alt="" />
                </td>
                <td>{order?.title}</td>
                <td>{order?.price}</td>

                <td>
                  <div onClick={() => handleContact(order)}>
                    <svg
                      className="messageimg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z" />
                    </svg>
                  </div>
                </td>
                <td
                  className={
                    order.orderStatus === "Received"?"yellow"
                      : order.orderStatus === "Accepted"? "yellow"
                      : order.orderStatus === "On Progress"
                      ? "blue"
                      : order.orderStatus === "Cancelled"
                      ? "red"
                      : "green"
                  }
                >
                  {order?.orderStatus}
                   
                    <>
                      {!setStatus && order.orderStatus !== "Cancelled" &&
                        order.orderStatus !== "Completed" && order.orderStatus !== "Approved" && <button
                        onClick={handelSetStatus}
                        className="openSetStatus"
                      >
                        Set Status
                      </button>
                      }
                      {setStatus &&
                      order.orderStatus !== "Completed" &&
                        order.orderStatus !== "Cancelled" &&
                         (
                          <>
                            <select
                              className="orderStatusSelect"
                              value={orderStatus}
                              onChange={handleStatusChange}
                            >
                              {
                                currentUser.isFreelancer &&(
                                  <>
                              <option value="Received">Received</option>
                              <option value="Accepted">Accepted</option>
                              <option value="On Progress">On Progress</option>
                              <option value="Completed">Completed</option>
                              </>
                            )}
                              <option value="Cancelled">Cancelled</option>
                              {
                                !currentUser.isFreelancer && <option value="Approved">Approved</option>

                              }
                            </select>
                            <button
                              onClick={() => handleStatusUpdate(order._id)}
                              className="orderStatusButton"
                            >
                              Set
                            </button>
                          </>
                        )}
                    </>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No orders available</td>
            </tr>
          )}
        </table>
      </div>
    </div>
  );
};

export default Orders;
