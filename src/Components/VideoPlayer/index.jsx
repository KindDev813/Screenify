import React from "react";

const VideoPlayer = (props) => {
  const { localVideoLink } = props;
  return (
    <div className="mx-auto p-4">
      <video id="blob_video" controls autoPlay src={localVideoLink}></video>
    </div>
  );
};

export default VideoPlayer;
