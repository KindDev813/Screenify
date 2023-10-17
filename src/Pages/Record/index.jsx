import { useState, useEffect } from "react";
import { Button, Radio, Modal } from "antd";
import {
  ChromeOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

import "./style.css";
import WebcamDrag from "../../Components/WebcamDrag";
import TimeCounterModal from "../../Components/TimeCounterModal";
import LabelSelect from "../../Components/LabelSelect";
import AnnotationTool from "../../Components/AnnotationTool";

// Recording mode labels & icons
const modeLabels = [
  {
    label: "Full Screen",
    icon: <DesktopOutlined style={{ fontSize: "50px" }} className="mx-auto" />,
  },
  {
    label: "Window",
    icon: <WindowsOutlined style={{ fontSize: "50px" }} className="mx-auto" />,
  },
  {
    label: "Current Tab",
    icon: <ChromeOutlined style={{ fontSize: "50px" }} className="mx-auto" />,
  },
  {
    label: "Camera only",
    icon: (
      <VideoCameraOutlined style={{ fontSize: "50px" }} className="mx-auto" />
    ),
  },
];

function Record() {
  const [recordingMode, setRecordingMode] = useState(0); // Recording status: 0(Full Screen), 1(Window), 2(Current Tab), 3(Camera only)
  const [qualityDefaultValue, setQualityDefaultValue] = useState("90000"); // Recording quality status

  const [recordingStarted, setRecordingStarted] = useState(false); // Recording start
  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false); // Webcam Drag enable/disable
  const [cameraSource, setCameraSource] = useState("Disabled"); // Camera source deviceId
  const [microphoneSource, setMicrophoneSource] = useState("Disabled"); // Camera source deviceId
  const [visibleTimeCounterModal, setVisibleTimeCounterModal] = useState(false); // Time Counter Modal enable/disable
  const [stream, setStream] = useState(null); // Media stream
  const [countNumber, setCountNumber] = useState(4); // Time counter number
  const [mediaRecorder, setMediaRecorder] = useState(null); // media recorder

  const [visibleEditMenu, setVisibleEditMenu] = useState(false); // Edit tool menu enable/disable
  const [cameraAllowed, setCameraAllowed] = useState(false); // Camera permission status
  const [microphoneAllowed, setMicrophoneAllowed] = useState(false); // Microphone permission status
  const [recordedChunks, setRecordedChunks] = useState([]); // Recorded chunks
  const [microphoneOptions, setMicrophoneOptions] = useState([]); // Microphone source list
  const [cameraOptions, setCameraOptions] = useState([]); // Camera source list

  // Get camera & audio device
  useEffect(() => {
    const getDeviceName = async () => {
      try {
        await checkPermissionAllowed("camera");
        await checkPermissionAllowed("microphone");
      } catch (error) {
        console.error("Error getting camera device name:", error);
      }
    };

    getDeviceName();
  }, []);

  // Time counter
  useEffect(() => {
    let temp = 4;
    function updateCountdown() {
      if (temp === 0) {
        setCountNumber(3);
        onCloseModalStartRecording();
        setVisibleEditMenu(true);
      } else {
        if (temp === 1) {
          setVisibleTimeCounterModal(false);
          setRecordingStarted(true);
        }
        temp--;
        setCountNumber(temp);
        setTimeout(updateCountdown, 1000); // Update countdown every 1 second
      }
    }

    if (visibleTimeCounterModal) {
      updateCountdown();
    }
  }, [visibleTimeCounterModal]);

  // Camera source enable/disable
  useEffect(() => {
    if (cameraAllowed) {
      if (cameraSource === "Disabled") {
        setVisibleWebcamDrag(false);
      } else {
        setVisibleWebcamDrag(true);
      }
    } else {
      setVisibleWebcamDrag(false);
    }
  }, [cameraSource, microphoneSource, cameraAllowed]);

  useEffect(() => {
    if (!recordingStarted) {
      onSaveRecording();
    } else {
      onRecordingStarted();
    }
  }, [recordingStarted]);

  // Putting chunks during the recording
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

  // Getting camera & microphone source
  const onGetDeviceSouce = async () => {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = mediaDevices.filter(
      (device) => device.kind === "videoinput"
    );

    const audioDevices = mediaDevices.filter(
      (device) => device.kind === "audioinput"
    );

    if (videoDevices.length > 0) {
      let temp = videoDevices.map((videoDevice) => {
        return { label: videoDevice.label, value: videoDevice.deviceId };
      });

      temp.unshift({ label: "Disabled", value: "Disabled" });
      setCameraOptions(temp);
    } else {
      setCameraOptions([...cameraOptions, "No camera device found"]);
    }

    if (audioDevices.length > 0) {
      let temp = audioDevices.map((audioDevice) => {
        return { label: audioDevice.label, value: audioDevice.deviceId };
      });
      temp.unshift({ label: "Disabled", value: "Disabled" });
      setMicrophoneOptions(temp);
    } else {
      setMicrophoneOptions([
        ...microphoneOptions,
        "No microphone device found",
      ]);
    }
  };

  // Checking device permission
  const checkPermissionAllowed = async (device) => {
    const descriptor = { name: device };

    await navigator.permissions
      .query(descriptor)
      .then((result) => {
        onVisibleDeviceSelect(device, result.state);

        result.onchange = function () {
          onVisibleDeviceSelect(device, result.state);
        };
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Camera & Microphone souce enable/disable
  const onVisibleDeviceSelect = (deviceName, state) => {
    if (state === "granted") {
      deviceName === "camera"
        ? setCameraAllowed(true)
        : setMicrophoneAllowed(true);

      onGetDeviceSouce();
    } else {
      deviceName === "camera"
        ? setCameraAllowed(false)
        : setMicrophoneAllowed(false);
    }
  };

  // Changing recording quality
  const onQualityChange = ({ target: { value } }) => {
    setQualityDefaultValue(value);
  };

  // Start recording
  const onRecordingStarted = () => {
    switch (recordingMode) {
      case 0:
        screenRecordingMode(recordingStarted, "monitor");
        break;
      case 1:
        screenRecordingMode(recordingStarted, "window");
        break;
      case 2:
        screenRecordingMode(recordingStarted, "browser");
        break;
      default:
        screenRecordingMode(recordingStarted, "webcam");
        break;
    }
  };

  // Closing time counter modal & start recording
  const onCloseModalStartRecording = () => {
    setMediaRecorder(
      new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
        videoBitsPerSecond: Number(qualityDefaultValue),
      })
    );
  };

  // if (stream) {
  //   stream.getVideoTracks()[0].addEventListener("ended", function () {
  //     setRecordingStarted(false);
  //   });
  // }

  // Getting the device according to recording mode
  const screenRecordingMode = async (recordingStatus, recordingMode) => {
    if (recordingStatus) {
      try {
        if (recordingMode === "webcam") {
          if (cameraSource === "Disabled") {
            cameraDisableErrorModal();
          } else {
            setStream(
              await navigator.mediaDevices.getUserMedia({
                video: {
                  deviceId: cameraSource ? cameraSource : undefined,
                },
                audio: microphoneSource
                  ? {
                      deviceId: microphoneSource,
                    }
                  : false,
              })
            );

            setVisibleTimeCounterModal(true);
          }
        } else {
          await navigator.mediaDevices
            .getDisplayMedia({
              video: { displaySurface: recordingMode },
              audio: true,
            })
            .then(async (screen) => {
              // Get Microphone Stream
              await navigator.mediaDevices
                .getUserMedia({ audio: { deviceId: microphoneSource } })
                .then((mic) => {
                  let screenAudioMediaStream = new MediaStream();
                  screenAudioMediaStream.addTrack(screen.getAudioTracks()[0]);

                  let micAudioMediaStream = new MediaStream();
                  micAudioMediaStream.addTrack(mic.getAudioTracks()[0]);

                  const audioContext = new AudioContext();
                  let audioIn_01 = audioContext.createMediaStreamSource(
                    screenAudioMediaStream
                  );
                  let audioIn_02 =
                    audioContext.createMediaStreamSource(micAudioMediaStream);

                  let dest = audioContext.createMediaStreamDestination();

                  audioIn_01.connect(dest);
                  audioIn_02.connect(dest);

                  let mergedMediaStream = new MediaStream();
                  mergedMediaStream.addTrack(screen.getVideoTracks()[0]);
                  mergedMediaStream.addTrack(dest.stream.getAudioTracks()[0]);

                  setStream(mergedMediaStream);
                  setVisibleTimeCounterModal(true);
                })
                .catch((err) =>
                  console.error("Error with microphone stream: ", err)
                );
            })
            .catch((err) => console.error("Error with screen stream: ", err));
        }
      } catch (error) {
        console.log("Error accessing the screen: ", error);
      }
    } else {
      setRecordingStarted(false);
    }
  };

  // Saving & downloading chunks into file
  const onSaveRecording = () => {
    //     stream?.getTracks().forEach((t) => t.stop()); // Closing stop sharing prompt
    setVisibleEditMenu(false); // Closing edit tools menu

    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "screen-recording.mp4";
        a.click();
        URL.revokeObjectURL(url);
        setRecordedChunks([]);
      };
    }
  };

  // Changing camera source
  const onChangeCameraSource = (value) => {
    value === "Disabled" ? setCameraSource("Disabled") : setCameraSource(value);
  };

  // Changing microphone source
  const onChangeMicrophoneSource = (value) => {
    value === "Disabled"
      ? setMicrophoneSource("Disabled")
      : setMicrophoneSource(value);
  };

  // Error modal when disable the camera source
  const cameraDisableErrorModal = () => {
    Modal.error({
      title: "Please enable your camera(microphone)!",
    });
  };

  return (
    <div className="grid grid-cols-7 p-7 h-screen gap-3 relative w-full">
      <div className="col-span-7 flex flex-col my-auto">
        <div className="max-w-[600px] w-full border-[#111231] border-2 rounded-lg p-10 mx-auto">
          {/* Mode of recording */}
          <Radio.Group
            value={recordingMode}
            onChange={(e) => setRecordingMode(e.target.value)}
          >
            {modeLabels.map((modeLabel, index) => {
              return (
                <Radio.Button className="h-[100px]" value={index} key={index}>
                  <div className="flex flex-col justify-center h-full w-full sm:w-[50px] lg:w-[70px] xl:w-[90px] 2xl:w-[95px]">
                    {modeLabel.icon}
                    <span className="text-[12px] whitespace-nowrap">
                      {modeLabel.label}
                    </span>
                  </div>
                </Radio.Button>
              );
            })}
          </Radio.Group>

          {/* Camera source selection */}
          <LabelSelect
            label={"Camera"}
            options={cameraOptions}
            allowed={cameraAllowed}
            onChangeDeviceSource={(value) => onChangeCameraSource(value)}
          />

          {/* Microphone source selection */}
          <LabelSelect
            label={"Microphone"}
            options={microphoneOptions}
            allowed={microphoneAllowed}
            onChangeDeviceSource={(value) => onChangeMicrophoneSource(value)}
          />

          {/* Recording quality */}
          <p className="mt-5 text-start font-bold">Recording quality</p>
          <Radio.Group
            qualityOptions={50}
            options={qualityOptions}
            onChange={onQualityChange}
            value={qualityDefaultValue}
            className="mt-2 flex justify-between mx-10"
          />

          {/* start or stop button */}
          <div className="flex">
            <Button
              className="bg-[#ff1616] h-[40px] mt-5 w-full"
              type="primary"
              onClick={() => setRecordingStarted(!recordingStarted)}
            >
              <span className="text-[15px] whitespace-nowrap font-bold">
                {!recordingStarted ? "Start Recording" : "Stop & Save"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Webcam drag */}
      {visibleWebcamDrag && <WebcamDrag cameraDeviceId={cameraSource} />}

      {/* Time counter modal */}
      <TimeCounterModal
        visibleTimeCounterModal={visibleTimeCounterModal}
        countNumber={countNumber}
      />

      {visibleEditMenu && (
        <AnnotationTool
          recordingStarted={recordingStarted}
          handleChangeRecordingStarted={(state) => {
            setRecordingStarted(state);
            onSaveRecording();
          }}
        ></AnnotationTool>
      )}
    </div>
  );
}

export default Record;
