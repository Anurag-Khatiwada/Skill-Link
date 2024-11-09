
import React, {useState, useEffect} from "react";
import "./Reviews.css";
import Review from "../review/Review";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Reviews = ({ gigId }) => {
  let serviceId = gigId;
  const queryClient = useQueryClient();
  const [canReview, setCanReview] = useState(false)

  // Fetching reviews using React Query
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews", gigId], // Include gigId in the query key
    queryFn: async () => {
      try {
        const response = await newRequest.get(`/reviews/${gigId}`);
        return response.data;
      } catch (err) {
        console.error("Error Fetching Data:", err);
        throw new Error(err?.response?.data?.message || "Failed to fetch data");
      }
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  // Mutation for submitting a new review
  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      // Invalidate and refetch the reviews after a successful post
      queryClient.invalidateQueries(["reviews", gigId]);
    },
    onError: (err) => {
      // Handle any error that occurs during the mutation
      console.error(
        "Error submitting review:",
        err?.response?.data || err.message
      );
      alert(err?.response?.data || "Error submitting review");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Fix the typo here

    const desc = e.target[0].value;
    const star = e.target[1].value;

    // Ensure the review has valid input before submitting
    if (!desc || !star) {
      alert("Please fill out both the description and star rating.");
      return;
    }

    // Submit the review using the mutation
    mutation.mutate({ serviceId, desc, star });
  };
    // Fetch order completion status when component mounts

  useEffect(()=>{
    const checkOrderCompletion = async ()=>{
      try{

        const res = await newRequest.get(`/orders/checkCompleted/${gigId}`)
        console.log(res.data.canReview )
        setCanReview(res.data.canReview)
      }catch(err){
        console.log("failed to check error")
      }
    }
    checkOrderCompletion();
  },[gigId])
  console.log(canReview);

  return (
    <>
      <div className="reviews">
        <h2>Reviews</h2>
        <hr />
        {isLoading
          ? "Loading..."
          : error
          ? "Something went wrong"
          : Array.isArray(data) && data.length > 0
          ? data.map((review) => <Review key={review._id} review={review} />)
          : "No reviews yet."}
      </div>
      {canReview && <div className="add">
        <h3>Add a review</h3>
        <form className="addForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="Write your opinion" required />
          <select className="select" name="rating" id="rating" required>
            <option value="">Select Rating</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>}
    </>
  );
};

export default Reviews;
