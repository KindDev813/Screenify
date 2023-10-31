import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { LABEL } from "../../utils/constants";

const VideoPlayer = (props) => {
  const { localVideoLink, currentTool, handleCropDimensionsData } = props;
  const [cropData, setCropData] = useState();

  const handleAbsoluteData = (value) => {
    setCropData(value);

    let width = document.getElementById("blob_video")?.clientWidth;
    let height = document.getElementById("blob_video")?.clientHeight;

    handleCropDimensionsData({
      width: value.width / width,
      height: value.height / height,
      x: value.x / width,
      y: value.y / height,
    });
  };

  return (
    <div className="mx-auto p-4">
      {currentTool === LABEL.CROP ? (
        <ReactCrop
          crop={cropData}
          onChange={(value) => handleAbsoluteData(value)}
        >
          <video
            id="blob_video"
            autoPlay
            controls
            src={localVideoLink}
            className="w-[100%] h-auto"
          />
        </ReactCrop>
      ) : (
        <video
          id="blob_video"
          autoPlay
          controls
          src={localVideoLink}
          className="w-[100%] h-auto"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
