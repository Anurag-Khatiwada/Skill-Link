

import React from "react";
import "./Slide.css";
import Slider from "infinite-react-carousel";

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  const settings = {
    autoplay: true, // Enable autoplay for smooth experience
    slidesToShow: Math.min(slidesToShow, React.Children.count(children)), // Prevent exceeding child count
    arrowsScroll: Math.min(arrowsScroll, React.Children.count(children)), // Match arrow scroll to child count
    adaptiveHeight: true, // Adjust height dynamically to avoid layout shift
    centerMode: true, // Align slides properly
  };

  return (
    <div className="slide">
      <div className="sliderContainer">
        <Slider {...settings}>{children}</Slider>
      </div>
    </div>
  );
};

export default Slide;


