
import React from "react";
import "./GigCards.css";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest";

const GigCards = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId], 
    queryFn: async () => {
      try {
        const response = await newRequest.get(`/users/${item.userId}`);
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
    <Link to={`/gig/${item._id}`} className="giglink"> {/* Dynamically linking to gig based on id */}
      <div className="gigCard">
        <img src={item.cover} alt="" />
        <div className="info">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            "Something went wrong"
          ) : (
            <>
              <div className="user">
                <img src={data.img || "/img/noavatar.svg"} alt="" />
                <span>{data.username}</span>
              </div>
              <p>{item.desc}</p>
            </>
          )}
        </div>

        <div className="star">
          <svg width="14" height="14" viewBox="0 0 24 24" className="star-svg">
            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.335 24 12 19.846 4.665 24 6 15.268 0 9.423l8.332-1.268z" />
          </svg>
          <span>{!isNaN(item.totalStars/item.starNumber) && Math.round(item.totalStars/item.starNumber)}</span>
        </div>
        <hr />
        <div className="details">
          <img src="./img/heart.svg" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>RS. {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCards;
