// src/components/ImageModal.jsx
import React from "react";
import "./ImageModal.css"; // Create this CSS file for modal styles

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal">
        <img src={src} alt="Enlarged" />
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageModal;
