
// // import React, { useState } from "react";
// // import "./EditProfile.css";
// // import upload from "../../utils/upload";
// // import { useParams } from "react-router-dom";

// // const EditProfile = ({ user, onSave, onCancle }) => {
// //   const [singleFile, setSingleFile] = useState(null);
// //   const [files, setFiles] = useState([]);
// //   const [upload, setUpload ] = useState(false)

// //   const [formData, setFormData] = useState({
// //     username: user.username,
// //     email: user.email,
// //     phone: user.phone,
// //     country: user.country,
// //     desc: user.desc,
// //     skills: user.skills.join(", "), // Assuming skills is an array
// //     certificates: user.certificates || [], // Initializing with existing certificates
// //     cv: user.cv || null,
// //   });

// //   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// //   console.log(currentUser)

// //   const handleUpload = async () => {
// //     setUpload(true)
// //     try {
// //       let uploadedcv = formData.cv;
// //       let uploadedcertificates = [];

// //       if (singleFile) {
// //         uploadedcv = await upload(singleFile);
// //       }

// //       if (files.length >= 0) {
// //         uploadedcertificates = await Promise.all(
// //           [...files].map(async (file) => {
// //             const url = await upload(file);
// //             return url;
// //           })
// //         );
// //       }

// //       // Append newly uploaded certificates to the existing ones
// //       setFormData((prev) => ({
// //         ...prev,
// //         cv: uploadedcv,
// //         certificates: [...prev.certificates, ...uploadedcertificates],
// //       }));
// //       setUpload(false)
// //     } catch (err) {
// //       console.error("Error during file upload:", err);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [e.target.name]: e.target.value,
// //     }));
// //   };

// //   const handleSave = () => {
// //     onSave(formData);
// //   };

// //   const handleCancle = () => {
// //     onCancle();
// //   };

// //   return (
// //     <div className="edit-profile">
// //       <div className="editContainer">
// //         <h3>Edit Profile</h3>
// //         <div className="form-group">
// //           <label>Username:</label>
// //           <input
// //             type="text"
// //             name="username"
// //             value={formData.username}
// //             onChange={handleChange}
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label>Email:</label>
// //           <input
// //             type="email"
// //             name="email"
// //             value={formData.email}
// //             onChange={handleChange}
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label>Phone:</label>
// //           <input
// //             type="text"
// //             name="phone"
// //             value={formData.phone}
// //             onChange={handleChange}
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label>Country:</label>
// //           <input
// //             type="text"
// //             name="country"
// //             value={formData.country}
// //             onChange={handleChange}
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label>About Me:</label>
// //           <textarea name="desc" value={formData.desc} onChange={handleChange} />
// //         </div>
// //         {
// //           currentUser.isFreelancer && (
// //             <>
          
// //             <div className="form-group">
// //             <label>Skills:</label>
// //             <input
// //               type="text"
// //               name="skills"
// //               value={formData.skills}
// //               onChange={handleChange}
// //               placeholder="Separate skills with commas"
// //             />
// //           </div>
// //           <div className="certificate-cv">
// //             <div className="form-group">
// //               <label>Certificates:</label>
// //               <input
// //                 type="file"
// //                 name="certificates"
// //                 multiple
// //                 onChange={(e) => setFiles(e.target.files)}
// //               />
// //             </div>
// //             <div className="form-group">
// //               <label>CV:</label>
// //               <input
// //                 type="file"
// //                 name="cv"
// //                 accept=".png, .jpeg, .jpg"
// //                 onChange={(e) => setSingleFile(e.target.files[0])}
// //               />
// //             </div>
// //             <button className="imageAdd" onClick={handleUpload}>
// //               {upload?"uploading":"upload"}Upload
// //             </button>
// //           </div>
// //           </>
// //           )
// //         }

// //         <div className="button-group">
// //           <button onClick={handleSave}>Save</button>
// //           <button onClick={handleCancle}>Cancel</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EditProfile;

// import React, { useState } from "react";
// import "./EditProfile.css";
// import upload from "../../utils/upload";
// import { useParams } from "react-router-dom";

// const EditProfile = ({ user, onSave, onCancle }) => {
//   const [singleFile, setSingleFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const [formData, setFormData] = useState({
//     username: user.username,
//     email: user.email,
//     phone: user.phone,
//     country: user.country,
//     desc: user.desc,
//     skills: user.skills.join(", "),
//     certificates: user.certificates || [],
//     cv: user.cv || null,
//   });

//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   console.log("Current User:", currentUser);

//   const handleUpload = async () => {
//     if (!singleFile && files.length === 0) {
//       alert("Please select a file to upload.");
//       return;
//     }

//     setUploading(true);

//     try {
//       let uploadedCV = formData.cv;
//       let uploadedCertificates = [];

//       if (singleFile) {
//         console.log("Uploading CV...");
//         uploadedCV = await upload(singleFile);
//         console.log("Uploaded CV URL:", uploadedCV);
//       }

//       if (files.length > 0) {
//         console.log("Uploading Certificates...");
//         uploadedCertificates = await Promise.all(
//           Array.from(files).map(async (file) => {
//             const url = await upload(file);
//             console.log(`Uploaded Certificate URL: ${url}`);
//             return url;
//           })
//         );
//       }

//       // Update the form data with the uploaded files
//       setFormData((prev) => ({
//         ...prev,
//         cv: uploadedCV,
//         certificates: [...prev.certificates, ...uploadedCertificates],
//       }));

//       console.log("Upload successful!");
//     } catch (err) {
//       console.error("Error during file upload:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSave = () => {
//     console.log("Saving profile with data:", formData);
//     onSave(formData);
//   };

//   const handleCancle = () => {
//     onCancle();
//   };

//   return (
//     <div className="edit-profile">
//       <div className="editContainer">
//         <h3>Edit Profile</h3>
//         <div className="form-group">
//           <label>Username:</label>
//           <input type="text" name="username" value={formData.username} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label>Email:</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label>Phone:</label>
//           <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label>Country:</label>
//           <input type="text" name="country" value={formData.country} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label>About Me:</label>
//           <textarea name="desc" value={formData.desc} onChange={handleChange} />
//         </div>

//         {currentUser.isFreelancer && (
//           <>
//             <div className="form-group">
//               <label>Skills:</label>
//               <input
//                 type="text"
//                 name="skills"
//                 value={formData.skills}
//                 onChange={handleChange}
//                 placeholder="Separate skills with commas"
//               />
//             </div>
//             <div className="certificate-cv">
//               <div className="form-group">
//                 <label>Certificates:</label>
//                 <input
//                   type="file"
//                   name="certificates"
//                   multiple
//                   onChange={(e) => setFiles(Array.from(e.target.files))}
//                 />
//               </div>
//               <div className="form-group">
//                 <label>CV:</label>
//                 <input
//                   type="file"
//                   name="cv"
//                   accept=".png, .jpeg, .jpg, .pdf"
//                   onChange={(e) => setSingleFile(e.target.files[0])}
//                 />
//               </div>
//               <button className="imageAdd" onClick={handleUpload} disabled={uploading}>
//                 {uploading ? "Uploading..." : "Upload"}
//               </button>
//             </div>
//           </>
//         )}

//         <div className="button-group">
//           <button onClick={handleSave}>Save</button>
//           <button onClick={handleCancle}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;

import React, { useState } from "react";
import "./EditProfile.css";
import upload from "../../utils/upload";

const EditProfile = ({ user, onSave, onCancle }) => {
  const [singleFile, setSingleFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone,
    country: user.country,
    desc: user.desc,
    skills: user.skills.join(", "),
    certificates: user.certificates || [],
    cv: user.cv || null,
    paymentMethod: user.paymentMethod || "", // Added payment method
    esewaId: user.esewaId || "", // Added eSewa ID
    stripeAccountId: user.stripeAccountId || "", // Added Stripe account ID
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Current User:", currentUser);

  const handleUpload = async () => {
    if (!singleFile && files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      let uploadedCV = formData.cv;
      let uploadedCertificates = [];

      if (singleFile) {
        console.log("Uploading CV...");
        uploadedCV = await upload(singleFile);
        console.log("Uploaded CV URL:", uploadedCV);
      }

      if (files.length > 0) {
        console.log("Uploading Certificates...");
        uploadedCertificates = await Promise.all(
          Array.from(files).map(async (file) => {
            const url = await upload(file);
            console.log(`Uploaded Certificate URL: ${url}`);
            return url;
          })
        );
      }

      // Update the form data with the uploaded files
      setFormData((prev) => ({
        ...prev,
        cv: uploadedCV,
        certificates: [...prev.certificates, ...uploadedCertificates],
      }));

      console.log("Upload successful!");
    } catch (err) {
      console.error("Error during file upload:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log("Saving profile with data:", formData);
    onSave(formData);
  };

  const handleCancle = () => {
    onCancle();
  };

  return (
    <div className="edit-profile">
      <div className="editContainer">
        <h3>Edit Profile</h3>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Country:</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>About Me:</label>
          <textarea name="desc" value={formData.desc} onChange={handleChange} />
        </div>

        {currentUser.isFreelancer && (
          <>
            <div className="form-group">
              <label>Skills:</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Separate skills with commas"
              />
            </div>
            <div className="certificate-cv">
              <div className="form-group">
                <label>Certificates:</label>
                <input
                  type="file"
                  name="certificates"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
              </div>
              <div className="form-group">
                <label>CV:</label>
                <input
                  type="file"
                  name="cv"
                  accept=".png, .jpeg, .jpg, .pdf"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
              </div>
              <button className="imageAdd" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {/* Payment Information Section */}
            <div className="payment-info">
              <h3>Payment Information</h3>
              <div className="form-group">
                <label>Preferred Payment Method:</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Method</option>
                  <option value="esewa">eSewa</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              {formData.paymentMethod === "esewa" && (
                <div className="form-group">
                  <label>eSewa ID:</label>
                  <input
                    type="text"
                    name="esewaId"
                    value={formData.esewaId}
                    onChange={handleChange}
                    placeholder="Enter your eSewa ID"
                  />
                </div>
              )}
              {formData.paymentMethod === "stripe" && (
                <div className="form-group">
                  <label>Stripe Account ID:</label>
                  <input
                    type="text"
                    name="stripeAccountId"
                    value={formData.stripeAccountId}
                    onChange={handleChange}
                    placeholder="Enter your Stripe Account ID"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="button-group">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancle}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;