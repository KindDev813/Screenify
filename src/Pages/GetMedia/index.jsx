import { useCallback, useState, useEffect, useRef } from "react";
import { Button, Radio, Select } from "antd";
import {
  ChromeOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Draggable from "react-draggable";
import Webcam from "react-webcam";

import { webcamMode, desktopMode, tabMode } from "./recordingMode";

const GetMedia = () => {
  const [recordingMode, setRecordingMode] = useState("1");
  const [qualityDefaultValue, setQualityDefaultValue] = useState("low");
  const [cameraDeviceName, setCameraDeviceName] = useState("");
  const [audioDeviceName, setAudioDeviceName] = useState("");

  const [permissionAllowed, setPermission] = useState(true);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [cameraRecordingStarted, setCameraRecordingStarted] = useState(false);
  const [desktopRecordingStarted, setDesktopRecordingStarted] = useState(false);
  const [tabRecordingStarted, setTabRecordingStarted] = useState(false);

  const [sizeWebcamDrag, setSizeWebcamDrag] = useState("200px");
  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false);
  const [cameraSource, setCameraSource] = useState(false);

  useEffect(() => {
    const getCameraDeviceName = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(
          (device) => device.kind === "videoinput"
        );

        const audioDevices = mediaDevices.filter(
          (device) => device.kind === "audioinput"
        );

        if (videoDevices.length > 0) {
          setCameraDeviceName(videoDevices[0].label);
        } else {
          setCameraDeviceName("No camera device found");
        }

        if (audioDevices.length > 0) {
          setAudioDeviceName(audioDevices[0].label);
        } else {
          setAudioDeviceName("No audio device found");
        }
      } catch (error) {
        console.error("Error getting camera device name:", error);
      }
    };

    getCameraDeviceName();
  }, []);

  // Recording quality options
  const qualityOptions = [
    {
      label: "Low",
      value: "low",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "High",
      value: "high",
    },
  ];

  // Camera settings
  const cameraOptions = [
    { value: "disabled", label: "Disabled" },
    { value: cameraDeviceName, label: cameraDeviceName },
  ];

  // Microphone settings
  const microphoneOptions = [
    { value: "disabled", label: "Disabled" },
    { value: audioDeviceName, label: audioDeviceName },
  ];

  const onQualityChange = ({ target: { value } }) => {
    setQualityDefaultValue(value);
  };

  // Start recording
  const onRecording = () => {
    if (cameraSource) {
      setVisibleWebcamDrag(!recordingStarted);
    }

    switch (recordingMode) {
      case "1":
        onTabRecording();
        break;
      case "2":
        onDesktopRecording();
        break;
      default:
        onCameraRecording();
        break;
    }
  };

  // Camera recording functionality : 3
  const onCameraRecording = () => {
    webcamMode(!cameraRecordingStarted);
    setCameraRecordingStarted(!cameraRecordingStarted);
    setRecordingStarted(!recordingStarted);
  };

  // Desktop recording functionality : 2
  const onDesktopRecording = () => {
    desktopMode(!desktopRecordingStarted);
    setDesktopRecordingStarted(!desktopRecordingStarted);
    setRecordingStarted(!recordingStarted);
  };

  // Only one tab recording functionality : 1
  const onTabRecording = () => {
    tabMode(!tabRecordingStarted);
    setTabRecordingStarted(!tabRecordingStarted);
    setRecordingStarted(!recordingStarted);
  };

  const onChangeCameraSource = (value) => {
    value === "disabled" ? setCameraSource(false) : setCameraSource(true);
  };

  const onChangeMicrophoneSource = (value) => {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~2", value);
  };

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    // Update any state or perform actions with the x and y coordinates
  };

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
    <div className="grid grid-cols-7 p-7 h-screen gap-3 relative">
      <div className="col-span-7 flex flex-col my-auto">
        <div className="max-w-[600px] border-[#111231] border-2 rounded-lg p-10 mx-auto">
          {/* Mode of recording */}
          <Radio.Group
            value={recordingMode}
            onChange={(e) => setRecordingMode(e.target.value)}
          >
            {/* Tab, Desktop, Camera only */}
            <Radio.Button className="h-[100px]" value="1">
              <div className="flex flex-col h-full justify-center w-full sm:w-[60px] lg:w-[80px] xl:w-[100px] 2xl:w-[110px]">
                <ChromeOutlined
                  style={{ fontSize: "50px" }}
                  className="mx-auto"
                />
                <span className="text-[12px] whitespace-nowrap">Tab only</span>
              </div>
            </Radio.Button>

            <Radio.Button className="h-[100px]" value="2">
              <div className="flex flex-col justify-center h-full w-full sm:w-[60px] lg:w-[80px] xl:w-[100px] 2xl:w-[110px]">
                <DesktopOutlined
                  style={{ fontSize: "50px" }}
                  className="mx-auto"
                />
                <span className="text-[12px] whitespace-nowrap">Desktop</span>
              </div>
            </Radio.Button>

            <Radio.Button className="h-[100px]" value="3">
              <div className="flex flex-col h-full justify-center  w-full sm:w-[60px] lg:w-[80px] xl:w-[100px] 2xl:w-[110px]">
                <VideoCameraOutlined
                  style={{ fontSize: "50px" }}
                  className="mx-auto"
                />
                <span className="text-[12px] whitespace-nowrap">
                  Camera only
                </span>
              </div>
            </Radio.Button>
          </Radio.Group>

          <p className="mt-5 text-start font-bold">Camera</p>
          {/* Camera source */}
          <Select
            defaultValue="disabled"
            onChange={(e) => onChangeCameraSource(e)}
            options={cameraOptions}
            className="mt-2 w-full h-[40px]"
          />

          <p className="mt-5 text-start font-bold">Microphone</p>
          {/* Microphone source */}
          <Select
            defaultValue="disabled"
            onChange={(e) => onChangeMicrophoneSource(e)}
            options={microphoneOptions}
            className="mt-2 w-full h-[40px]"
          />

          <p className="mt-5 text-start font-bold">Recording quality</p>
          {/* Recording quality */}
          <Radio.Group
            qualityOptions={50}
            options={qualityOptions}
            onChange={onQualityChange}
            value={qualityDefaultValue}
            className="mt-2 flex justify-between mx-10"
          />

          <div className="flex">
            {/* start or stop button */}
            <Button
              className="bg-[#ff1616] h-[40px] mt-5 w-full"
              type="primary"
              onClick={() => onRecording()}
            >
              <span className="text-[15px] whitespace-nowrap font-bold">
                {!recordingStarted ? "Start Recording" : "Stop & Save"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {visibleWebcamDrag && (
        <div className="rounded-full absolute">
          <Draggable onDrag={handleDrag}>
            <div
              style={{
                width: sizeWebcamDrag,
                height: sizeWebcamDrag,
                backgroundColor: "black",
              }}
              className="rounded-full absolute z-[99]"
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
      )}
    </div>
  );
};

export default GetMedia;
