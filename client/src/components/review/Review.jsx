import React from "react";
import "./Review.css";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Review = ({ review }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user", review.userId], 
    queryFn: async () => {
      try {
        const response = await newRequest.get(`/users/${review.userId}`);
        return response.data; // Return the data from the response
      } catch (err) {
        console.error('Error Response:', err.response);
        console.log(err) // Log the full error response for debugging
        throw new Error(err.response?.data?.message || 'Failed to fetch data'); // Error handling
      }
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });
  return (
    <div className="review">
      {isLoading ? "Loading..." : (error? ("something went wrong"):(<div className="user">
        <img
          className="pp"
          src={data?.img || "/img/noavatar.svg"}
          alt=""
        />
        <div className="info">
          <span>{data?.username}</span>
          <div className="country">
            <span>From: {data?.country }</span>
          </div>
        </div>
      </div>))}
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((item, i) => (
            <svg width="14" height="14" viewBox="0 0 24 24" class="star-svg"  key={i}>
              <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.335 24 12 19.846 4.665 24 6 15.268 0 9.423l8.332-1.268z" />
            </svg>
          ))}
        <span>{review?.star}</span>
      </div>
      <p>{review?.desc}</p>
      <div className="helpful">
        <span>Helpful?</span>
        <span>
          <img src="/img/like.svg" alt="" />
          yes
        </span>
        <span>
          <img src="/img/dislike.svg" alt="" /> NO
        </span>
      </div>
    </div>
  );
};

export default Review;
