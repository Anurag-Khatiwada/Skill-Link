// // src/components/EditProfile.jsx
// import React, { useState } from "react";
// import "./EditProfile.css"; // Create a CSS file for styling if needed
// import upload from "../../utils/upload";

// const EditProfile = ({ user, onSave, onCancle }) => {
//   const [singleFile, setSingleFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [formData, setFormData] = React.useState({
//     username: user.username,
//     email: user.email,
//     phone: user.phone,
//     country: user.country,
//     desc: user.desc,
//     skills: user.skills.join(", "), // Assuming skills is an array
//     certificates: [], // Assuming certificates is an array
//     cv: null,
//   });
  
//   const handleUpload = async ()=>{
//     try{
//         const uploadedcv = await upload(singleFile);

//         const uploadedcertificates = await Promise.all(
//             [...files].map(async(file)=>{
//                 const url = await upload(file)
//                 return url
//             })
//         )
//         console.log(uploadedcv,uploadedcertificates)
//         setFormData({
//             ...formData,
//             cv: uploadedcv,
//             certificates: uploadedcertificates

//         })
//     }catch(err){
//         console.error(err);
//     }
//   }

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSave = () => {
//     // Call the onSave function with the updated data
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
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label>Phone:</label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label>Country:</label>
//           <input
//             type="text"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label>About Me:</label>
//           <textarea name="desc" value={formData.desc} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label>Skills:</label>
//           <input
//             type="text"
//             name="skills"
//             value={formData.skills}
//             onChange={handleChange}
//             placeholder="Separate skills with commas"
//           />
//         </div>
//         <div className="certificate-cv">
//           <div className="form-group">
//             <label>Certificates:</label>
//             <input
//               type="file"
//               name="certificates"
//               multiple
//               onChange={(e) => setFiles(e.target.files)}
//               placeholder="Separate certificates with commas"
//             />
//           </div>
//           <div className="form-group">
//             <label>CV :</label>
//             <input
//               type="file"
//               name="cv"
//               accept=".png, .jpeg, .jpg"
//               onChange={(e) => setSingleFile(e.target.files[0])}
//             />
//           </div>
//           <button className="imageAdd" onClick={handleUpload}>upload</button>
//         </div>
//         <div className="button-group">
//           <button onClick={handleSave}>Save</button>
//           <button onClick={handleCancle}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;

// src/components/EditProfile.jsx
import React, { useState } from "react";
import "./EditProfile.css";
import upload from "../../utils/upload";

const EditProfile = ({ user, onSave, onCancle }) => {
  const [singleFile, setSingleFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone,
    country: user.country,
    desc: user.desc,
    skills: user.skills.join(", "), // Assuming skills is an array
    certificates: user.certificates || [], // Initializing with existing certificates
    cv: user.cv || null,
  });

  const handleUpload = async () => {
    try {
      let uploadedcv = formData.cv;
      let uploadedcertificates = [];

      if (singleFile) {
        uploadedcv = await upload(singleFile);
      }

      if (files.length >= 0) {
        uploadedcertificates = await Promise.all(
          [...files].map(async (file) => {
            const url = await upload(file);
            return url;
          })
        );
      }

      // Append newly uploaded certificates to the existing ones
      setFormData((prev) => ({
        ...prev,
        cv: uploadedcv,
        certificates: [...prev.certificates, ...uploadedcertificates],
      }));
    } catch (err) {
      console.error("Error during file upload:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
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
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>About Me:</label>
          <textarea name="desc" value={formData.desc} onChange={handleChange} />
        </div>
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
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <div className="form-group">
            <label>CV:</label>
            <input
              type="file"
              name="cv"
              accept=".png, .jpeg, .jpg"
              onChange={(e) => setSingleFile(e.target.files[0])}
            />
          </div>
          <button className="imageAdd" onClick={handleUpload}>
            Upload
          </button>
        </div>
        <div className="button-group">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancle}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

