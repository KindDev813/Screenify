import React from "react";
import PropTypes from "prop-types";

const getRangeRailInnerStyle = ({ backgroundImages }) => {
  if (backgroundImages.length === 0) {
    return {};
  }

  const backgroundImage = backgroundImages
    .map((value) => {
      return `url("${value}")`;
    })
    .join(",");

  const backgroundPosition = backgroundImages
    .map((value, index) => {
      return `calc(100% / ${backgroundImages.length - 1} * ${index}) 0%`;
    })
    .join(",");

  const style = {
    backgroundImage: backgroundImage,
    backgroundPosition: backgroundPosition,
    backgroundSize: `calc(100% / ${backgroundImages.length}) 100%`,
    backgroundRepeat: "no-repeat",
  };

  return style;
};

export const SliderRail = ({ getRailProps, backgroundImages }) => (
  <>
    <div className="react_time_range__rail__outer" {...getRailProps()} />
    <div
      className="react_time_range__rail__inner"
      style={getRangeRailInnerStyle({ backgroundImages })}
    />
  </>
);

SliderRail.propTypes = {
  getRailProps: PropTypes.func.isRequired,
  backgroundImages: PropTypes.arrayOf(PropTypes.string),
};

export default SliderRail;
