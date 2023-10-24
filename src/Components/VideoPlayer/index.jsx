import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { LABEL } from "../../utils/constants";

const VideoPlayer = (props) => {
  const { localVideoLink, currentTool, cropData, handleCropData } = props;

  return (
    <div className="mx-auto p-4">
      {currentTool === LABEL.CROP ? (
        <ReactCrop crop={cropData} onChange={(value) => handleCropData(value)}>
          <video id="blob_video" controls autoPlay src={localVideoLink} />
        </ReactCrop>
      ) : (
        <video id="blob_video" controls autoPlay src={localVideoLink} />
      )}
    </div>
  );
};

export default VideoPlayer;
