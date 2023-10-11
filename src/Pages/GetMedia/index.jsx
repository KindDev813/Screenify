import { useState, useEffect } from "react";
import { Button, Radio, Select, Modal, FloatButton } from "antd";
import {
  ChromeOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  WindowsOutlined,
  AudioOutlined,
  SoundOutlined,
  EditOutlined,
  CaretRightOutlined,
  PauseOutlined,
  CheckOutlined,
  CloseOutlined,
  LineHeightOutlined,
  DeleteOutlined,
  BgColorsOutlined,
  FormatPainterOutlined,
} from "@ant-design/icons";
import Draggable from "react-draggable";
import Webcam from "react-webcam";
import "./style.css";
import {
  fullScreenRecordingMod,
  windowRecordingMode,
  currentTabRecordingMode,
  cameraOnlyRecordingMode,
} from "./recordingModeExtend";

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

  const [sizeWebcamDrag, setSizeWebcamDrag] = useState("200px"); // Webcam Drag default size : 200 px
  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false); // Webcam Drag enable/disable varaiable
  const [cameraSource, setCameraSource] = useState(false);
  const [visibleTimeCounterModal, setVisibleTimeCounterModal] = useState(false); // Time Counter Modal enable/disable modal
  const [switchDropEditMenu, setSwitchDropEditMenu] = useState(false); // After pressing pause button
  const [stream, setStream] = useState(null);
  const [countNumber, setCountNumber] = useState(4); // Time updater
  const [mediaRecorder, setMediaRecorder] = useState(null);
  let videoStream; // Variable to store the video stream
  // let mediaRecorder; // Variable to store the media recorder
  // let recordedChunks = []; // Array to store the recorded video chunk
  const [recordedChunks, setRecordedChunks] = useState([]);
  function handleDataAvailable(event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  }

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
        onFullScreenRecording();
        break;
      case "2":
        onWindowRecording();
        break;
      case "3":
        onCurrentTabRecording();
        break;
      default:
        onCameraOnlyRecording();
        break;
    }
  };

  // Only one tab recording functionality : 1
  const onFullScreenRecording = () => {
    fullScreenRecordingMode(!fullScreenRecordingStarted);
    setFullScreenRecordingStarted(!fullScreenRecordingStarted);
    setRecordingStarted(!recordingStarted);
  };

  // Desktop recording functionality : 2
  const onWindowRecording = () => {
    // windowRecordingMode(!windowRecordingStarted, qualityDefaultValue);
    // setWindowRecordingStarted(!windowRecordingStarted);
    // setRecordingStarted(!recordingStarted);
  };

  // Current Tab recording funtionality : 3
  const onCurrentTabRecording = () => {
    // currentTabRecordingMode(!currentTabRecordingStarted, qualityDefaultValue);
    // setCurrentTabRecordingStarted(!currentTabRecordingStarted);
    // setRecordingStarted(!recordingStarted);
  };

  // Camera recording functionality : 4
  const onCameraOnlyRecording = () => {
    // cameraOnlyRecordingMode(!cameraOnlyRecordingStarted, qualityDefaultValue);
    // setCameraOnlyRecordingStarted(!cameraOnlyRecordingStarted);
    // setRecordingStarted(!recordingStarted);
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
        setRecordedChunks([...recordedChunks, e.data]);
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

  // Full Screen mode recording mode
  const fullScreenRecordingMode = async (recordingStatus) => {
    if (recordingStatus) {
      try {
        const res = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "monitor" },
          audio: true,
        });

        if (cameraSource) {
          setVisibleWebcamDrag(true);
        }

        setStream(res);
        setVisibleTimeCounterModal(true);
      } catch (error) {
        console.log("Error accessing the screen: ", error);
      }
    } else {
      onSaveRecording();
      setVisibleWebcamDrag(false);
    }
  };

  const onChangeCameraSource = (value) => {
    value === "disabled" ? setCameraSource(false) : setCameraSource(true);
  };

  const onChangeMicrophoneSource = (value) => {};

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

      <div className="absolute">
        <Modal
          centered
          closable={false}
          footer={null}
          open={visibleTimeCounterModal}
          width={"275px"}
          className="time_counter_modal"
        >
          <p className="text-[150px] flex w-full justify-center my-auto not-italic font-bold bg-transparent">
            {countNumber}
          </p>
        </Modal>
      </div>

      <div className="absolute">
        {!switchDropEditMenu ? (
          <FloatButton.Group
            // trigger="click"
            type="primary"
            style={{
              left: 20,
              bottom: 20,
            }}
          >
            <FloatButton icon={<SoundOutlined />} />
            <FloatButton icon={<AudioOutlined />} />
            {/* <FloatButton icon={<EditOutlined />} /> */}

            <FloatButton.Group
              trigger="click"
              type="primary"
              style={{
                left: 20,
                bottom: 185,
              }}
              icon={<EditOutlined />}
            >
              <FloatButton icon={<DeleteOutlined />} />
              <FloatButton icon={<LineHeightOutlined />} />
              <FloatButton icon={<BgColorsOutlined />} />
              <FloatButton icon={<FormatPainterOutlined />} />
              <FloatButton icon={<EditOutlined />} />
            </FloatButton.Group>
            <FloatButton
              icon={<PauseOutlined />}
              onClick={() => setSwitchDropEditMenu(true)}
            />
          </FloatButton.Group>
        ) : (
          <FloatButton.Group
            // trigger="click"
            type="primary"
            style={{
              left: 20,
              bottom: 20,
            }}
          >
            <FloatButton icon={<CloseOutlined />} />
            <FloatButton icon={<CheckOutlined />} />
            <FloatButton
              icon={<CaretRightOutlined />}
              onClick={() => setSwitchDropEditMenu(false)}
            />
          </FloatButton.Group>
        )}
      </div>
    </div>
  );
};

export default GetMedia;
