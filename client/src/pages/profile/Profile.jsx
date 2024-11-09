

import React, { useState } from "react";
import "./Profile.css";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import EditProfile from "../../components/editProfile/EditProfile";
import ImageModal from "../../components/imagemodal/ImageModal"; // Import the ImageModal component

const ProfilePage = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isEditing, setIsEditing] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null); // State to hold the clicked image

  const { isLoading, error, data: user } = useQuery({
    queryKey: ["users", currentUser._id], // Include userId in the query key
    queryFn: async () => {
      const response = await newRequest.get(`/users/${currentUser._id}`);
      return response.data;
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const handleSave = async (updatedData) => {
    try {
      await newRequest.put(`/users/${currentUser._id}`, updatedData);
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const deleteCv = async () => {
    try {
      const res = await newRequest.put(`/users/${currentUser._id}/deleteCv`);
      alert(res.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCertificate = async (index) => {
    try {
      const res = await newRequest.put(`/users/${currentUser._id}/deleteCertificate`, {
        certificateIndex: index,
      });
      alert(res.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // Function to open the image in the modal
  const handleImageClick = (src) => {
    setModalImageSrc(src);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {isEditing ? (
          <EditProfile user={user} onSave={handleSave} onCancle={handleCancel} />
        ) : (
          <>
            <div className="profile-header">
              <img
                src={user?.img || "/img/noavatar.svg"}
                alt={user?.username}
                className="profile-img"
              />
              <div className="user-info">
                <h2 className="username">{user?.username}</h2>
                <p className="country">{user?.country}</p>
                <p className="contact-info">
                  Email: <span>{user?.email || "N/A"}</span>
                </p>
                <p className="contact-info">
                  Phone: <span>{user?.phone || "N/A"}</span>
                </p>
              </div>
            </div>
            <div className="profile-details">
              <h3>About Me</h3>
              <p>{user?.desc || "No description provided."}</p>
            </div>

            {/* Skills Section */}
            <div className="skills-section">
              <h3>Skills</h3>
              <ul>
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No skills added.</li>
                )}
              </ul>
            </div>

            {/* Certificates Section */}
            <div className="certificates-section">
              <h3>Certificates</h3>
              <div className="certificationdisplay">
                {user?.certificates && user.certificates.length > 0 ? (
                  user.certificates.map((cert, index) => (
                    <div className="certificateItem" key={index}>
                      <img
                        src={cert}
                        alt="Certificate"
                        className="certificateImg"
                        onClick={() => handleImageClick(cert)} // Open image in modal on click
                      />
                      <button
                        onClick={() => deleteCertificate(index)}
                        className="deleteCertificate"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No certificates added.</p>
                )}
              </div>
            </div>

            {/* CV Section */}
            <div className="cv-section">
              <h3>CV</h3>
              {user?.cv ? (
                <div className="cvItem">
                  <img
                    className="cvImg"
                    src={user?.cv}
                    alt="CV"
                    onClick={() => handleImageClick(user?.cv)} // Open CV in modal on click
                  />
                  <button onClick={deleteCv} className="deleteCv">
                    Delete
                  </button>
                </div>
              ) : (
                <p>No CV uploaded.</p>
              )}
            </div>

            <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Render the ImageModal component when an image is clicked */}
      {modalImageSrc && (
        <ImageModal src={modalImageSrc} onClose={() => setModalImageSrc(null)} />
      )}
    </div>
  );
};

export default ProfilePage;
