import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest.js";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate()
  const userRef = useRef(null); // Reference to the user div


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

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside the userRef element
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);




  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser"); // Properly remove the user
      navigate("/");
      window.location.reload();

    } catch (err) {
      console.log(err);
    }
  };

  const BecomeFreelancer = async () => {
    try {
      const res = await newRequest.put(`/users/${currentUser._id}`, {
        isFreelancer: true,
      });
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
        <div className={active || pathname !== "/" ? "logo_active" : "logo"}>
          <Link to="/" className="link">
            <span>SKILL-LINKS</span>
            {/* <img className="logoImg" src="../../public/img/SKILL-LINKS.png" alt="logo" /> */}
          </Link>
        </div>
        <div className="links">
          <Link to="/" className="link">
            <span className={active || pathname !== "/" ? "span_active" : "span"}>Home</span>
          </Link>
          {currentUser&&!currentUser?.isFreelancer && (
            <Link to="#" className="link">
              <span className={active || pathname !== "/" ? "span_active" : "span"} onClick={BecomeFreelancer}>Become a Freelancer</span>
            </Link>
          )}
          {currentUser ? (
            <div
            ref={userRef} // Reference for click detection
            onClick={(e) => {
              e.stopPropagation(); // Prevent closing when clicking inside
              setOpen((prev) => !prev);
            }}
            className="user"
          >
              <img src={currentUser.img || "/img/noavatar.svg"} alt="" />
              <span className={active || pathname !== "/" ? "span_active" : "span"}>{currentUser.username}</span>
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
                  <Link to={"/profile/" + currentUser._id} className="link">
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
                <span className={active || pathname !== "/" ? "span_active" : "span"}>Sign in</span>
              </Link>
              <Link to="/register" className="link">
                <button className={active || pathname !== "/" ? "join join_active" : "join"}>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr className="navbarHr"/>
          <div className="menu">
            <Link
              to={`/gigs?cat=${encodeURIComponent("Graphic Design")}`}
              className="link"
            >
              Graphic Design
            </Link>
            <Link
              to={`/gigs?cat=${encodeURIComponent("Video & Animation")}`}
              className="link"
            >
              Video & Animation
            </Link>
            <Link
              to={`/gigs?cat=${encodeURIComponent("writing & translation")}`}
              className="link"
            >
              Writing & Translation
            </Link>
            <Link
              to={`/gigs?cat=${encodeURIComponent("AI services")}`}
              className="link"
            >
              AI Services
            </Link>
            <Link
              to={`/gigs?cat=${encodeURIComponent("digital marketing")}`}
              className="link"
            >
              Digital Marketing
            </Link>
            <Link
              to={`/gigs?cat=${encodeURIComponent("music & audio")}`}
              className="link"
            >
              Music & Audio
            </Link>
            <Link
              to={`/gigs?cat=${encodeURIComponent("programming & tech")}`}
              className="link"
            >
              Programming & Tech
            </Link>
            <Link
              to={`/gigs?cat=${encodeURIComponent("logo design")}`}
              className="link"
            >
              Logo Design
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
