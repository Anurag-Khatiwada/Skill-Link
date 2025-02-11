import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./MyGigs.css";
import newRequest from "../../utils/newRequest";

const MyGigs = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  // Fetch conversations
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: async () => {
      const response = await newRequest.get(`/services?userId=${currentUser._id}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/services/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch the conversations after a successful mutation
      queryClient.invalidateQueries(["myGigs"]);
    },
    onError: (err) => {
      console.error(
        "Error submitting review:",
        err?.response?.data || err.message
      );
      alert(err?.response?.data || "Error submitting review");
    },
  });

  const handleDelete =(id)=>{
    mutation.mutate(id);
  }

  return (
    <div className="myGigs">
      {isLoading?"Loading...":error?(error.response && error.response.status ===404 ? "No service found ": "something went wrong"):<div className="myGigscontainer">
        <div className="title">
          <h1>Services :</h1>
          <Link to="/add">
            <button>Add New Service</button>
          </Link>
        </div>
        <table>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Action</th>
          </tr>
          {data?.map((gig) => (
            <tr>
              <td>
                <img
                  src={gig.cover}
                  alt=""
                />
              </td>
              <td>{gig.title}</td>
              <td>Rs. {gig.price}</td>
              <td>{gig.sales}</td>
              <td>
                <div onClick={()=>handleDelete(gig._id)}>
                  <svg
                    class="deleteimg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                  </svg>
                </div>
              </td>
            </tr>
          ))}
        </table>
      </div>}
    </div>
  );
};

export default MyGigs;


// import React from "react";
// import { Link } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import "./MyGigs.css";
// import newRequest from "../../utils/newRequest";

// const MyGigs = () => {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const queryClient = useQueryClient();

//   // Fetch gigs
//   const { isLoading, error, data } = useQuery({
//     queryKey: ["myGigs"],
//     queryFn: async () => {
//       const response = await newRequest.get(`/services?userId=${currentUser._id}`);
//       return response.data;
//     },
//     refetchOnWindowFocus: false,
//   });

//   const mutation = useMutation({
//     mutationFn: (id) => {
//       return newRequest.delete(`/services/${id}`);
//     },
//     onSuccess: () => {
//       // Invalidate and refetch the gigs after a successful mutation
//       queryClient.invalidateQueries(["myGigs"]);
//     },
//     onError: (err) => {
//       console.error(
//         "Error submitting review:",
//         err?.response?.data || err.message
//       );
//       alert(err?.response?.data || "Error submitting review");
//     },
//   });

//   const handleDelete = (id) => {
//     mutation.mutate(id);
//   };

//   return (
//     <div className="myGigs">
//       {isLoading ? (
//         "Loading..."
//       ) : error ? (
//         "Something went wrong"
//       ) : (
//         <div className="myGigsContainer">
//           <div className="title">
//             <h1>Services</h1>
//             <Link to="/add">
//               <button>Add New Service</button>
//             </Link>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Title</th>
//                 <th>Price</th>
//                 <th>Sales</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data?.map((gig) => (
//                 <tr key={gig._id}>
//                   <td>
//                     <img src={gig.cover} alt="" />
//                   </td>
//                   <td>{gig.title}</td>
//                   <td>Rs. {gig.price}</td>
//                   <td>{gig.sales}</td>
//                   <td>
//                     <div onClick={() => handleDelete(gig._id)}>
//                       <svg
//                         className="deleteImg"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 448 512"
//                       >
//                         <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
//                       </svg>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyGigs;
