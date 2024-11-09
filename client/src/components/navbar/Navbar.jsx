import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest.js";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser"); // Properly remove the user
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const BecomeFreelancer = async () => {
    try {
      const res = await newRequest.put(`/users/${currentUser._id}`,{isFreelancer:true});
      if (res.status === 200) {
        alert("You are now a freelancer");

        // Update the local storage with the new user data
        const updatedUser = { ...currentUser, isFreelancer: true };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser)); // Corrected key

        // Update state for re-render
        window.location.reload(); // Reload page to reflect changes
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link to="/" className="link">
            <span>SKILL-LINK</span>
          </Link>
        </div>
        <div className="links">
          <Link to="/" className="link">
            <span>Home</span>
          </Link>
          {!currentUser?.isFreelancer && (
            <Link to="#" className="link">
              <span onClick={BecomeFreelancer}>Become a Freelancer</span>
            </Link>
          )}
          {currentUser ? (
            <div
              onClick={() => {
                setOpen(!open);
              }}
              className="user"
            >
              <img src={currentUser.img || "/img/noavatar.svg"} alt="" />
              <span>{currentUser.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isFreelancer && (
                    <>
                      <Link to="/myGigs" className="link">
                        <span>Services</span>
                      </Link>
                      <Link to="/add" className="link">
                        <span>Add new Service</span>
                      </Link>
                    </>
                  )}
                  <Link to={"/profile/"+currentUser._id} className="link">
                    <span>Profile</span>
                  </Link>
                  <Link to="/orders" className="link">
                    <span>Orders</span>
                  </Link>
                  <Link to="/messages" className="link">
                    <span>Messages</span>
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    <span>Logout</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                <span>Sign in</span>
              </Link>
              <Link to="/register" className="link">
                <button className="join">Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link to="/gigs?cat=graphic&cat=design" className="link">
              Graphic & Design
            </Link>
            <Link to="/gigs?cat=video&cat=animation" className="link">
              Video & Animation
            </Link>
            <Link to="/gigs?cat=writing&cat=translation" className="link">
              Writing & Translation
            </Link>
            <Link to="/gigs?cat=AI services" className="link">
              AI Services
            </Link>
            <Link to="/gigs?cat=digital marketing" className="link">
              Digital Marketing
            </Link>
            <Link to="/gigs?cat=music&cat=audio" className="link">
              Music & Audio
            </Link>
            <Link to="/gigs?cat=programming&cat=tech" className="link">
              Programming & Tech
            </Link>
            <Link to="/gigs?cat=life style" className="link">
              Life Style
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
