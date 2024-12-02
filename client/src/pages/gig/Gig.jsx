import React, { useEffect, useState } from "react";
import "./Gig.css";
import { Slider } from "infinite-react-carousel";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

const Gig = () => {
  const { id } = useParams();
  const [isloggedin, setIsloggedin] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const navigate = useNavigate(); // Initialize useNavigate
  
  useEffect(()=>{
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser){
      setIsloggedin(true)
    }
  },[])

  // Function to handle navigation
  const handlePaymentNavigation = async (id) => {
      // Check if the user is logged in by checking localStorage directly
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        // If not logged in, navigate to login
        navigate(`/login`);
      } else {
        const res = await newRequest.get('/orders');
        const orderExists = res?.data?.some((order) => order.serviceId === id); // Check if the service is already ordered
    
        if (orderExists) {
          setOrdered(true);
          // If service is already ordered, show message and redirect to orders page after 5 seconds
          setTimeout(() => {
          navigate("/orders");
        }, 5000);
      }else{
        // If logged in, navigate to payment page
        navigate(`/pay/${id}`);
      }
    }
  };
  
  
  

  //Fetching services using React Query

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: async () => {
      try {
        const response = await newRequest.get(`/services/single/${id}`);
        console.log(response.data);
        return response.data; // Return the data from the response
      } catch (err) {
        console.error("Error Fetching Data:", err); // Log the error object itself
        throw new Error(err?.response?.data?.message || "Failed to fetch data"); // Error handling
      }
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  //Fetching users using React Query

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", data?.userId],
    queryFn: async () => {
      try {
        const response = await newRequest.get(`/users/${data?.userId}`);
        console.log(response.data);
        return response.data; // Return the data from the response
      } catch (err) {
        console.error("Error Fetching Data:", err); // Log the error object itself
        throw new Error(err?.response?.data?.message || "Failed to fetch data"); // Error handling
      }
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  const latestDelivery = new Date();
  latestDelivery.setDate(latestDelivery.getDate() - data?.deliveryTime || 0);

  return (  
    <>
    {
      ordered ? (
      <div>
        You have already bought this service. Redericting to Orders page please wait
      </div>
    ):(
    <div className="gig">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "something went wrong"
      ) : (
        <div className="gigContainer">
          <div className="left">
            <span className="breadcrumbs">
              SKILL-LINK {">"} {data?.title} {">"}
            </span>
            <h1>{data?.title || ""}</h1>
            {isLoadingUser ? (
              "Loading..."
            ) : errorUser ? (
              "something went wrong"
            ) : (
              <Link className="link" to={`/profile/${data?.userId}`}>
              <div className="user">
                <img
                  className="pp"
                  src={dataUser?.img || "/img/noavatar.svg"}
                  alt=""
                />
                <span>{dataUser?.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          class="star-svg"
                          key={i}
                        >
                          <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.335 24 12 19.846 4.665 24 6 15.268 0 9.423l8.332-1.268z" />
                        </svg>
                      ))}
                    <span>
                      {" "}
                      {Math.round(data.totalStars / data.starNumber)}
                    </span>
                  </div>
                )}
              </div>
              </Link>
            )}
            <Slider slidesToShow={1} arrowScroll={1} className="sliders">
              {Array.isArray(data?.images) && data?.images.length > 0 ? (
                data.images.map((img) => (
                  <img
                    key={img}
                    src={img || "/img/noavatar.svg"}
                    alt="gig image"
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </Slider>
            <h2>About This Service</h2>
            <p>{data?.desc}</p>
            {isLoadingUser ? (
              "Loading"
            ) : errorUser ? (
              "something went wrong"
            ) : (
              <div className="seller">
                <h2>About The Freelancer</h2>
                <div className="user">
                  <Link className="link" to={`/profile/${data?.userId}`} >
                  <img src={dataUser?.img || "/img/noavatar.svg"} alt="" />
                  </Link>
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              class="star-svg"
                              key={i}
                            >
                              <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.335 24 12 19.846 4.665 24 6 15.268 0 9.423l8.332-1.268z" />
                            </svg>
                          ))}
                        <span>
                          {" "}
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <div className="title">From:</div>
                      <div className="desc">{dataUser.country}</div>
                    </div>
                    <div className="item">
                      <div className="title">Member Since:</div>
                      <div className="desc">
                        {new Date(dataUser?.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long" }
                        ) || "Not available"}
                      </div>
                    </div>
                    <div className="item">
                      <div className="title">Avg. response Time:</div>
                      <div className="desc">4 hours</div>
                    </div>
                    <div className="item">
                      <div className="title">Last delivery:</div>
                      <div className="desc">
                        {latestDelivery.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="item">
                      <div className="title">Languages:</div>
                      <div className="desc">English</div>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data?.shortTitle}</h3>
              <h2>RS. {data?.price}</h2>
            </div>
            <p>{data?.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.svg" alt="" />
                <span>Delivery Time - {data?.deliveryTime} days</span>
              </div>
              {/* <div className="item">
              <img src="/img/recycle.svg" alt="" />
              <span>3 Revisions</span>
            </div> */}
            </div>
            <div className="features">
              {data?.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src="/img/check.svg" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button onClick={() => handlePaymentNavigation(id)}>Get It</button>{" "}
            {/* Use button for navigation */}
          </div>
        </div>
      )}
    </div>
  )}
  </>
  );
};

export default Gig;
