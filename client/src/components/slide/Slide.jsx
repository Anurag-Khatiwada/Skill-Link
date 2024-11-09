import React from "react";
import "./Slide.css";
import Slider from "infinite-react-carousel";

const Slide = ({ children, slidesToShow, arrowsScroll }) => {
  const settings = {
    autoplay: true,
    dots: true,
    slidesToShow: Math.min(slidesToShow, React.Children.count(children)),
    arrowsScroll: Math.min(arrowsScroll, React.Children.count(children))
  };

  return (
    <div className="slide">
      <div className="sliderContainer">
        <Slider {...settings}>
          {children}
        </Slider>
      </div>
    </div>
  );
};

export default Slide;

