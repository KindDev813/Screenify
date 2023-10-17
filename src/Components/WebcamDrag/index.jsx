import { useState, useEffect } from "react";
import { Button } from "antd";
import Draggable from "react-draggable";
import "./style.css";

const xCounters = [1, 1.5, 2];

const WebcamDrag = (props) => {
  const { cameraDeviceId } = props;
  const [sizeWebcamDrag, setSizeWebcamDrag] = useState("200px"); // Webcam Drag default size : 200 px

  useEffect(() => {
    handleCameraSource();
  }, [cameraDeviceId]);

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    // Update any state or perform actions with the x and y coordinates
  };

  const handleCameraSource = async () => {
    try {
      const constraints = {
        audio: false,
        video: {
          deviceId: cameraDeviceId ? cameraDeviceId : undefined,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.querySelector("video#webcam_video");
      videoElement.srcObject = stream;
    } catch (error) {
      console.log("Error opening video camera.", error);
    }
  };

  // webcam drag size
  const onChangeSizeWebCamDrag = (value) => {
    switch (value) {
      case xCounters[0]:
        setSizeWebcamDrag("200px");
        break;
      case xCounters[1]:
        setSizeWebcamDrag("300px");
        break;
      default:
        setSizeWebcamDrag("400px");
        break;
    }
  };

  return (
    <div className="rounded-full absolute">
      <Draggable onDrag={handleDrag}>
        <div
          style={{
            width: sizeWebcamDrag,
            height: sizeWebcamDrag,
            backgroundColor: "black",
          }}
          className="rounded-full absolute z-[9999]"
        >
          <div>
            <video
              className="rounded-full"
              id="webcam_video"
              autoPlay
              style={{
                width: sizeWebcamDrag,
                height: sizeWebcamDrag,
              }}
            />

            <div className="z-50 flex justify-center mt-2">
              {xCounters.map((xCounter) => {
                return (
                  <Button
                    className="bg-[#ffffff] text-[#121212] mr-2 font-bold border-2 border-[#4e54f8]"
                    type="primary"
                    shape="circle"
                    key={xCounter}
                    onClick={() => onChangeSizeWebCamDrag(xCounter)}
                  >
                    {xCounter}x
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WebcamDrag;
