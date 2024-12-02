// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Register.css";
// import upload from "../../utils/upload.js";
// import newRequest from "../../utils/newRequest.js";

// const Register = () => {
//   const [close, setClose] = useState(false); // Password visibility toggle
//   const [type, setType] = useState("password"); // Password field type
//   const [file, setFile] = useState(null); // File for profile picture

//   const navigate = useNavigate();

//   const handleClose = (e) => {
//     e.preventDefault();
//     setClose(!close);
//     if (close) {
//       setType("password");
//     } else {
//       setType("text");
//     }
//   };

//   const [user, setUser] = useState({
//     username: "",
//     email: "",
//     password: "",
//     img: "",
//     country: "",
//     isSeller: false,
//     desc: "",
//     phone: ""
//   });

//   const handleChange = (e) => {
//     setUser((prev) => {
//       return { ...prev, [e.target.name]: e.target.value }; // Store value as a string
//     });
//   };

//   const handleCheckBox = (e) => {
//     setUser((prev) => {
//       return { ...prev, isSeller: e.target.checked };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const url = await upload(file); // Assuming upload() uploads the file and returns a URL
//     try {
//       const res = await newRequest.post("/auth/register", {
//         ...user,
//         img: url,
//       });
//       console.log(res.data)
//       localStorage.setItem("currentUser", JSON.stringify(res.data))
//        navigate("/");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="register">
//       <form onSubmit={handleSubmit}>
//         <div className="left">
//           <h1>Create New Account</h1>
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             placeholder="Username"
//             name="username"
//             onChange={handleChange}
//           />
//           <label htmlFor="email">Email</label>
//           <input
//             type="email" // Corrected the type
//             placeholder="Email"
//             name="email"
//             onChange={handleChange}
//           />
//           <label htmlFor="password">Password</label>
//           <div className="inputpass">
//             <input
//               onChange={handleChange}
//               type={type}
//               name="password"
//               placeholder="password"
//             />
//             <button onClick={handleClose} className="eyeopen">
//               {!close && <img src="/public/img/eyeopen.svg" alt="show password" />}
//               {close && <img src="/public/img/eyeclose.svg" alt="hide password" />}
//             </button>
//           </div>
//           <label htmlFor="profilePicture">Profile Picture</label>
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           <label htmlFor="country">Country</label>
//           <input
//             type="text"
//             placeholder="Country"
//             name="country"
//             onChange={handleChange}
//           />
//           <button className="submit" type="submit">
//             Register
//           </button>
//         </div>
//         <div className="right">
//           <h1>Become a Freelancer</h1>
//           <div className="toggle">
//             <label htmlFor="" className="label">
//               Activate Freelancing Account
//             </label>
//             <label htmlFor="" className="switch">
//               <input type="checkbox" onChange={handleCheckBox} />
//               <span className="slider round"></span>
//             </label>
//           </div>
//           <label htmlFor="phone">Phone Number</label>
//           <input
//             type="text"
//             placeholder="Phone number"
//             name="phone"
//             onChange={handleChange}
//           />
//           <label htmlFor="desc">Description</label>
//           <textarea
//             name="desc"
//             cols="30"
//             rows="10"
//             onChange={handleChange}
//           ></textarea>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import upload from "../../utils/upload.js";
import newRequest from "../../utils/newRequest.js";

const Register = () => {
  const [close, setClose] = useState(false); // Password visibility toggle
  const [type, setType] = useState("password"); // Password field type
  const [file, setFile] = useState(null); // File for profile picture

  const navigate = useNavigate();

  const handleClose = (e) => {
    e.preventDefault();
    setClose(!close);
    if (close) {
      setType("password");
    } else {
      setType("text");
    }
  };

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isFreelancer: false,
    desc: "",
    phone: ""
  });

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value }; // Store value as a string
    });
  };

  const handleCheckBox = (e) => {
    setUser((prev) => {
      return { ...prev, isFreelancer: e.target.checked }; // Updating isSeller correctly
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = await upload(file); // Assuming upload() uploads the file and returns a URL
    try {
      const res = await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create New Account</h1>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email" // Corrected the type
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <div className="inputpass">
            <input
              onChange={handleChange}
              type={type}
              name="password"
              placeholder="password"
            />
            <button onClick={handleClose} className="eyeopen">
              {!close && <img src="/public/img/eyeopen.svg" alt="show password" />}
              {close && <img src="/public/img/eyeclose.svg" alt="hide password" />}
            </button>
          </div>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="country">Country</label>
          <input
            type="text"
            placeholder="Country"
            name="country"
            onChange={handleChange}
          />
          <button className="submit" type="submit">
            Register
          </button>
          <p className="signin">
          Already have an account?{" "}
          <Link className='link' to="/login">
            Sign In
          </Link>
        </p>
        </div>
        <div className="right">
          <h1>Become a Freelancer</h1>
          <div className="toggle">
            <label htmlFor="" className="label">
              Activate Freelancing Account
            </label>
            <label htmlFor="" className="switch">
              <input type="checkbox" onChange={handleCheckBox} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            placeholder="Phone number"
            name="phone"
            onChange={handleChange}
          />
          <label htmlFor="desc">Description</label>
          <textarea
            name="desc"
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Register;
