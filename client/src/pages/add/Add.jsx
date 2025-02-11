import React, { useReducer, useState } from "react";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import "./Add.css";
import upload from "../../utils/upload.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest.js";
import { useNavigate } from "react-router-dom";
const Add = () => {
  const categoriesList = [
    "Web Design",
    "WordPress",
    "Logo Design",
    "Digital Marketing",
    "AI Services",
    "Graphic Design",
    "Video & Animation",
    "Writing & Translation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "Lifestyle",
    "Game Development",
    "SEO",
    "Data Science",
    "Photo Editing",
    "Mobile App Development",
    "E-commerce Development",
    "Social Media Management",
    "Content Writing",
    "Illustration",
    "3D Modeling",
    "Voice Over",
    "Online Tutoring",
    "Virtual Assistance",
    "Project Management",
  ];

  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target.value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );

      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/services", gig);
    },
    onSuccess: () => {
      // Invalidate and refetch the reviews after a successful post
      queryClient.invalidateQueries(["myGigs"]);
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
    e.preventDefault();
    mutation.mutate(state);
    navigate("/mygigs");
  };

  return (
    <div className="add">
      <div className="addContainer">
        <h1>Add New Service</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="">Title</label>
            <input
              onChange={handleChange}
              type="text"
              name="title"
              placeholder="I will do something I'm really good at"
            />
            <label htmlFor="">Category</label>

            <select onChange={handleChange} name="cat" id="cats">
              {categoriesList.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option> // Use item as the value
              ))}
            </select>

            <div className="imagesinput">
              <div className="inputImages">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button className="imageAddss" onClick={handleUpload}>
                {uploading ? "uploading" : "upload"}
              </button>
            </div>

            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              cols="30"
              rows="16"
              placeholder="Brief description about your service"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="right">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              onChange={handleChange}
              name="shortTitle"
              placeholder="eg. one page web design"
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              id=""
              cols="30"
              rows="16"
              placeholder="Brief description about your service"
              onChange={handleChange}
            ></textarea>
            <label htmlFor="">Delivery Time(eg. 5 days)</label>
            <input
              type="number"
              onChange={handleChange}
              name="deliveryTime"
              min={1}
            />
            <form action="" onSubmit={handleFeature}>
              <label htmlFor="">Add Features</label>
              <div className="add">
                <input type="text" placeholder="eg. page design" />
                <button type="submit">add</button>
              </div>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span> X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price" min={1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
