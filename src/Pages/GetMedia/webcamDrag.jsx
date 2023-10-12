import { useState } from "react";
import { Button } from "antd";
import Draggable from "react-draggable";
import Webcam from "react-webcam";
import "./style.css";

const WebcamDrag = () => {
  const [sizeWebcamDrag, setSizeWebcamDrag] = useState("200px"); // Webcam Drag default size : 200 px

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    // Update any state or perform actions with the x and y coordinates
  };

  // webcam drag size
  const onChangeSizeWebCamDrag = (value) => {
    switch (value) {
      case 1:
        setSizeWebcamDrag("200px");
        break;
      case 2:
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
            <Webcam
              className="rounded-full"
              style={{
                width: sizeWebcamDrag,
                height: sizeWebcamDrag,
              }}
            />

            <div className="z-50 flex justify-center mt-2">
              <Button
                className="bg-[#ffffff] text-[#121212] mr-2 font-bold border-2 border-[#4e54f8]"
                type="primary"
                shape="circle"
                onClick={() => onChangeSizeWebCamDrag(1)}
              >
                1x
              </Button>

              <Button
                className="bg-[#ffffff] text-[#121212] mr-2 font-bold border-2 border-[#4e54f8]"
                type="primary"
                shape="circle"
                onClick={() => onChangeSizeWebCamDrag(2)}
              >
                1.5x
              </Button>

              <Button
                className="bg-[#ffffff] text-[#121212] font-bold border-2 border-[#4e54f8]"
                type="primary"
                shape="circle"
                onClick={() => onChangeSizeWebCamDrag(3)}
              >
                2x
              </Button>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WebcamDrag;
