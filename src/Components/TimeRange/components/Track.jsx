import PropTypes from "prop-types";
import React from "react";

const getTrackConfig = ({ error, source, target, disabled }) => {
  const basicStyle = {
    left: `${source.percent}%`,
    width: `calc(${target.percent - source.percent}% - 1px)`,
  };

  if (disabled) return basicStyle;

  return { ...basicStyle };
};

const Track = ({ error, source, target, getTrackProps, disabled }) => {
  console.log(source);
  console.log(target);
  return (
    <>
      <div
        className="react_time_range__track"
        style={getTrackConfig({ error, source, target, disabled })}
        {...getTrackProps()}
      />
    </>
  );
};

export default Track;
