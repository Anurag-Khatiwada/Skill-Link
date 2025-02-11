import React, { useState } from "react";
import "./Message.css";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest.js";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  // Fetch message
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await newRequest.get(`/messages/${id}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  // const {
  //   isLoading: isLoadingUser,
  //   error: errorUser,
  //   data: dataUser,
  // } = useQuery({
  //   queryKey: ["user", data?.userId],
  //   queryFn: async () => {
  //     try {
  //       const response = await newRequest.get(`/users/${data.userId}`);
  //       console.log(response.data);
  //       return response.data; // Return the data from the response
  //     } catch (err) {
  //       console.error("Error Fetching Data:", err); // Log the error object itself
  //       throw new Error(err?.response?.data?.message || "Failed to fetch data"); // Error handling
  //     }
  //   },
  //   refetchOnWindowFocus: false, // Prevent refetch on window focus
  // });

  // Mutation for creating messages
  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      // Invalidate and refetch the conversations after a successful mutation
      queryClient.invalidateQueries(["messages"]);
    },
    onError: (err) => {
      console.error(
        "Error submitting message:",
        err?.response?.data || err.message
      );
      alert(err?.response?.data || "Error submitting message");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id.toString(),
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="messageContainer">
        <span className="breadcrumbs">
          <Link className="link" to="/messages">
            MESSAGES
          </Link>{" "}
          {">Anurag>"}
        </span>
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Something went wrong"
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div
                className={
                  m.userId === currentUser._id ? "item mySelf" : "item"
                }
                key={m._id}
              >
                {/* If the message is from the other user, display the sender's profile image */}
                {m.userId !== currentUser._id && (
                  <img
                    src={m.receiverImg || "/img/noavatar.svg"}
                    alt=""
                    className="profile-img"
                  />
                )}



                {/* If the message is from the current user, display the receiver's profile image */}
                {m.userId === currentUser._id && (
                  <img
                    src={m.senderImg || "/img/noavatar.svg"}
                    alt=""
                    className="profile-img"
                  />
                )}
                                {/* Display the message text */}
                                <p
                  className={
                    m.userId === currentUser._id
                      ? "message-text myMessage"
                      : "message-text"
                  }
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        )}
        <hr />

      </div>
      <form onSubmit={handleSubmit} className="write">
          <textarea placeholder="Write your message" id=""></textarea>
          <button type="submit">Send</button>
        </form>
    </div>
  );
};

export default Message;
