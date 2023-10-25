import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { LABEL } from "../../utils/constants";

const VideoPlayer = (props) => {
  const { localVideoLink, currentTool, handleCropDimensionsData } = props;

  const [videoTagDimensions, setVideoTagDimensions] = useState();
  const [cropData, setCropData] = useState();

  useEffect(() => {
    if (currentTool === LABEL.CROP) {
      setVideoTagDimensions({
        width: document.getElementById("crop_blob_video")?.clientWidth,
        height: document.getElementById("crop_blob_video")?.clientHeight,
      });
    }
  }, [currentTool]);

  useEffect(() => {
    const updateVideoDimensions = () => {
      setVideoTagDimensions({
        width: document.getElementById("crop_blob_video").clientWidth,
        height: document.getElementById("crop_blob_video").clientHeight,
      });
    };

    window.addEventListener("resize", updateVideoDimensions);

    return () => window.removeEventListener("resize", updateVideoDimensions);
  }, []);

  useEffect(() => {}, [videoTagDimensions]);

  const handleAbsoluteData = (value) => {
    setCropData(value);

    if (videoTagDimensions) {
      handleCropDimensionsData({
        width: value.width / videoTagDimensions.width,
        height: value.height / videoTagDimensions.width,
        x: value.x / videoTagDimensions.width,
        y: value.y / videoTagDimensions.width,
      });
    }
  };

  return (
    <div className="mx-auto p-4">
      {currentTool === LABEL.CROP ? (
        <ReactCrop
          crop={cropData}
          onChange={(value) => handleAbsoluteData(value)}
        >
          <video id="crop_blob_video" controls autoPlay src={localVideoLink} />
        </ReactCrop>
      ) : (
        <video id="blob_video" controls autoPlay src={localVideoLink} />
      )}
    </div>
  );
};

export default VideoPlayer;
