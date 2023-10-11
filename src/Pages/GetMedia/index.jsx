import { useState, useEffect } from "react";
import { Button, Radio, Select } from "antd";
import {
  ChromeOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

import "./style.css";
import AnnotationTools from "./annotationTools";
import WebcamDrag from "./webcamDrag";
import TimeCounterModal from "./timeCounterModal";

const GetMedia = () => {
  const [recordingMode, setRecordingMode] = useState("1"); // Recording mode : 1(Full Screen), 2(Window), 3(Current Tab), 4(Camera only)
  const [qualityDefaultValue, setQualityDefaultValue] = useState("90000"); // Recording quality (video bit per second)
  const [cameraDeviceName, setCameraDeviceName] = useState(""); // Camera Device Name
  const [audioDeviceName, setAudioDeviceName] = useState(""); // Audio Device Name

  // const [permissionAllowed, setPermission] = useState(true);
  // Recording start varialble
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [fullScreenRecordingStarted, setFullScreenRecordingStarted] =
    useState(false);
  const [windowRecordingStarted, setWindowRecordingStarted] = useState(false);
  const [currentTabRecordingStarted, setCurrentTabRecordingStarted] =
    useState(false);
  const [cameraOnlyRecordingStarted, setCameraOnlyRecordingStarted] =
    useState(false);

  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false); // Webcam Drag enable/disable varaiable
  const [cameraSource, setCameraSource] = useState(false);
  const [visibleTimeCounterModal, setVisibleTimeCounterModal] = useState(false); // Time Counter Modal enable/disable modal
  const [stream, setStream] = useState(null);
  const [countNumber, setCountNumber] = useState(4); // Time updater
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [visibleEditMenu, setVisibleEditMenu] = useState(false); // edit tool menu visible

  const [recordedChunks, setRecordedChunks] = useState([]);

  // get camera & audio device
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

  // Time counter
  useEffect(() => {
    let temp = 4;
    function updateCountdown() {
      if (temp === 1) {
        setVisibleTimeCounterModal(false);
        setCountNumber(3);
        onCloseModalStartRecording();

        if (cameraSource) {
          setVisibleWebcamDrag(true);
        }

        setVisibleEditMenu(true);
      } else {
        temp--;
        setCountNumber(temp);
        setTimeout(updateCountdown, 1000); // Update countdown every 1 second
      }
    }

    if (visibleTimeCounterModal) {
      updateCountdown();
    }
  }, [visibleTimeCounterModal]);

  // Recording quality options
  const qualityOptions = [
    {
      label: "Low",
      value: "90000",
    },
    {
      label: "Medium",
      value: "3000000",
    },
    {
      label: "High",
      value: "5000000",
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

  // Recording quality change
  const onQualityChange = ({ target: { value } }) => {
    setQualityDefaultValue(value);
  };

  // Start recording
  const onRecording = () => {
    switch (recordingMode) {
      case "1":
        screenRecordingMode(!fullScreenRecordingStarted, "monitor");
        setFullScreenRecordingStarted(!fullScreenRecordingStarted);
        setRecordingStarted(!recordingStarted);
        break;
      case "2":
        screenRecordingMode(!windowRecordingStarted, "window");
        setWindowRecordingStarted(!windowRecordingStarted);
        setRecordingStarted(!recordingStarted);
        break;
      case "3":
        screenRecordingMode(!currentTabRecordingStarted, "browser");
        setCurrentTabRecordingStarted(!currentTabRecordingStarted);
        setRecordingStarted(!recordingStarted);
        break;
      default:
        screenRecordingMode(!cameraOnlyRecordingStarted, "webcam");
        setCameraOnlyRecordingStarted(!cameraOnlyRecordingStarted);
        setRecordingStarted(!recordingStarted);
        break;
    }
  };

  // Close time counter modal & start recording
  const onCloseModalStartRecording = () => {
    setMediaRecorder(
      new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
        videoBitsPerSecond: Number(qualityDefaultValue),
      })
    );
  };

  useEffect(() => {
    if (mediaRecorder && recordingStarted) {
      mediaRecorder.ondataavailable = (e) => {
        let temp = recordedChunks;
        temp.push(e.data);
        setRecordedChunks(temp);
      };

      mediaRecorder.start();
    }
  }, [mediaRecorder]);

  // Save and download recording
  const onSaveRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "screen-recording.webm";
        a.click();
        URL.revokeObjectURL(url);
        setRecordedChunks([]);
      };
    }
  };

  // mode recording mode
  const screenRecordingMode = async (recordingStatus, recordingMode) => {
    if (recordingStatus) {
      try {
        const constraints = {
          video: { displaySurface: recordingMode },
        };

        if (recordingMode === "webcam") {
          setStream(
            await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            })
          );
        } else {
          setStream(await navigator.mediaDevices.getDisplayMedia(constraints));
        }

        setVisibleTimeCounterModal(true);
      } catch (error) {
        console.log("Error accessing the screen: ", error);
      }
    } else {
      onSaveRecording();
      setVisibleWebcamDrag(false);
      setVisibleEditMenu(false);
    }
  };

  // exist camera
  const onChangeCameraSource = (value) => {
    value === "disabled" ? setCameraSource(false) : setCameraSource(true);
  };

  const onChangeMicrophoneSource = (value) => {};

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
              <div className="flex flex-col justify-center h-full w-full sm:w-[50px] lg:w-[70px] xl:w-[90px] 2xl:w-[95px]">
                <DesktopOutlined
                  style={{ fontSize: "50px" }}
                  className="mx-auto"
                />
                <span className="text-[12px] whitespace-nowrap">
                  Full Screen
                </span>
              </div>
            </Radio.Button>

            <Radio.Button className="h-[100px]" value="2">
              <div className="flex flex-col justify-center h-full w-full sm:w-[50px] lg:w-[70px] xl:w-[90px] 2xl:w-[95px]">
                <WindowsOutlined
                  style={{ fontSize: "50px" }}
                  className="mx-auto"
                />
                <span className="text-[12px] whitespace-nowrap">Window</span>
              </div>
            </Radio.Button>

            <Radio.Button className="h-[100px]" value="3">
              <div className="flex flex-col h-full justify-center w-full sm:w-[50px] lg:w-[70px] xl:w-[90px] 2xl:w-[95px]">
                <ChromeOutlined
                  style={{ fontSize: "50px" }}
                  className="mx-auto"
                />
                <span className="text-[12px] whitespace-nowrap">
                  Current Tab
                </span>
              </div>
            </Radio.Button>

            <Radio.Button className="h-[100px]" value="4">
              <div className="flex flex-col h-full justify-center  w-full sm:w-[50px] lg:w-[70px] xl:w-[90px] 2xl:w-[95px]">
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

      {visibleWebcamDrag && <WebcamDrag />}

      <TimeCounterModal
        visibleTimeCounterModal={visibleTimeCounterModal}
        countNumber={countNumber}
      />

      {/* {visibleEditMenu && ( */}
      <AnnotationTools></AnnotationTools>
      {/* )} */}
    </div>
  );
};

export default GetMedia;
