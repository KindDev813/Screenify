import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Radio, Modal } from "antd";
import {
  ChromeOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import {
  QUALITYOPTIONS,
  LABEL,
  BLOB_LINKS,
  RECORDING_DURATION,
} from "../../utils/constants";

import "./style.css";
import WebcamDrag from "../../Components/WebcamDrag";
import TimeCounterModal from "../../Components/TimeCounterModal";
import LabelSelect from "../../Components/LabelSelect";
import AnnotationTool from "../../Components/AnnotationTool";

let stream,
  mediaRecorder,
  recordingStartTime,
  recordingEndTime = null;

// Recording mode labels & icons
const modeLabels = [
  {
    label: LABEL.FULL_SCREEN,
    icon: <DesktopOutlined style={{ fontSize: "50px" }} className="mx-auto" />,
  },
  {
    label: LABEL.WINDOW,
    icon: <WindowsOutlined style={{ fontSize: "50px" }} className="mx-auto" />,
  },
  {
    label: LABEL.CURRENT_TAB,
    icon: <ChromeOutlined style={{ fontSize: "50px" }} className="mx-auto" />,
  },
  {
    label: LABEL.CAMERA_ONLY,
    icon: (
      <VideoCameraOutlined style={{ fontSize: "50px" }} className="mx-auto" />
    ),
  },
];

function Record() {
  const navigate = useNavigate();
  const [recordingMode, setRecordingMode] = useState(0); // Recording status: 0(Full Screen), 1(Window), 2(Current Tab), 3(Camera only)
  const [qualityDefaultValue, setQualityDefaultValue] = useState("3000000"); // Recording quality status

  const [recordingStarted, setRecordingStarted] = useState(false); // Recording start
  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false); // Webcam Drag enable/disable
  const [cameraSource, setCameraSource] = useState("Disabled"); // Camera source deviceId
  const [microphoneSource, setMicrophoneSource] = useState("Disabled"); // Camera source deviceId
  const [visibleTimeCounterModal, setVisibleTimeCounterModal] = useState(false); // Time Counter Modal enable/disable

  const [countNumber, setCountNumber] = useState(4); // Time counter number
  const [visibleEditMenu, setVisibleEditMenu] = useState(false); // Edit tool menu enable/disable
  const [cameraAllowed, setCameraAllowed] = useState(false); // Camera permission status
  const [microphoneAllowed, setMicrophoneAllowed] = useState(false); // Microphone permission status
  const [recordedChunks, setRecordedChunks] = useState([]); // Recorded chunks
  const [microphoneOptions, setMicrophoneOptions] = useState([]); // Microphone source list
  const [cameraOptions, setCameraOptions] = useState([]); // Camera source list

  // Get camera & audio device
  useEffect(() => {
    const getDeviceName = async () => {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
      switch (temp) {
        case 0:
          onCloseModalStartRecording();
          setVisibleEditMenu(true);
          break;
        case 1:
          setRecordingStarted(true);
          setVisibleTimeCounterModal(false);
        default:
          temp--;
          setCountNumber(temp);
          setTimeout(updateCountdown, 1000);
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

  useEffect(() => {
    const onEnded = () => {
      onSaveRecording();
    };

    if (stream) {
      stream.getVideoTracks()[0].addEventListener("ended", onEnded);
    }

    return () => {
      if (stream) {
        stream.getVideoTracks()[0].removeEventListener("ended", onEnded);
      }
    };
  }, [stream]);

  const onClickRecordingStartOrStop = () => {
    !recordingStarted ? onStartRecording() : onSaveRecording();
  };

  // Start recording &  Getting the stream and merging the each stream according to recording mode
  const onStartRecording = async () => {
    try {
      if (recordingMode === 3) {
        if (cameraSource === "Disabled") {
          alertModal("Please enable your camera(microphone)!");
        } else {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: cameraSource ? cameraSource : undefined,
            },
            audio: microphoneSource
              ? {
                  deviceId: microphoneSource,
                }
              : false,
          });

          setVisibleTimeCounterModal(true);
        }
      } else {
        const audioContext = new AudioContext();
        let audioIn_01, audioIn_02;
        let dest = audioContext.createMediaStreamDestination();

        let screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface:
              recordingMode === 0
                ? "monitor"
                : recordingMode === 1
                ? "window"
                : "browser",
          },
          audio: true,
        });

        if (screenStream.getAudioTracks()[0]) {
          let screenAudioMediaStream = new MediaStream();
          screenAudioMediaStream.addTrack(screenStream.getAudioTracks()[0]);

          audioIn_01 = audioContext.createMediaStreamSource(
            screenAudioMediaStream
          );
          audioIn_01.connect(dest);
        }

        if (microphoneSource !== "Disabled") {
          let microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: microphoneSource },
          });

          if (microphoneStream.getAudioTracks()[0]) {
            let micAudioMediaStream = new MediaStream();
            micAudioMediaStream.addTrack(microphoneStream?.getAudioTracks()[0]);

            audioIn_02 =
              audioContext.createMediaStreamSource(micAudioMediaStream);
            audioIn_02.connect(dest);
          }
        }

        let mergedMediaStream = new MediaStream();
        mergedMediaStream.addTrack(screenStream.getVideoTracks()[0]);
        mergedMediaStream.addTrack(dest.stream.getAudioTracks()[0]);

        stream = mergedMediaStream;
        setVisibleTimeCounterModal(true);
      }
    } catch (error) {
      console.log("Error accessing the screen: ", error);
    }
  };

  // Saving & downloading chunks into file
  const onSaveRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        recordingEndTime = new Date().getTime();
        localStorage.setItem(BLOB_LINKS, JSON.stringify(url));
        localStorage.setItem(
          RECORDING_DURATION,
          (recordingEndTime - recordingStartTime).toString()
        );
        navigate("/editMedia");
        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "screen-recording.mp4";
        // a.click();
        // URL.revokeObjectURL(url);
        // setRecordedChunks([]);
      };
    }

    stream?.getTracks().forEach(function (track) {
      track.stop();
    });

    setRecordingStarted(false);
    setVisibleEditMenu(false); // Closing edit tools menu
  };

  // Closing time counter modal & start recording
  const onCloseModalStartRecording = () => {
    recordingStartTime = new Date().getTime();

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
      videoBitsPerSecond: Number(qualityDefaultValue),
    });
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
  const alertModal = (value) => {
    Modal.error({
      title: value,
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
            label={LABEL.CAMERA}
            options={cameraOptions}
            allowed={cameraAllowed}
            onChangeDeviceSource={(value) => onChangeCameraSource(value)}
          />

          {/* Microphone source selection */}
          <LabelSelect
            label={LABEL.MICROPHONE}
            options={microphoneOptions}
            allowed={microphoneAllowed}
            onChangeDeviceSource={(value) => onChangeMicrophoneSource(value)}
          />

          {/* Recording quality */}
          <p className="mt-5 text-start font-bold">{LABEL.RECORDING_QUALITY}</p>
          <Radio.Group
            qualityOptions={50}
            options={QUALITYOPTIONS}
            onChange={(e) => setQualityDefaultValue(e.target.value)}
            value={qualityDefaultValue}
            className="mt-2 flex justify-between mx-10"
          />

          {/* start or stop button */}
          <div className="flex">
            <Button
              className="bg-[#ff1616] h-[40px] mt-5 w-full"
              type="primary"
              onClick={() => onClickRecordingStartOrStop()}
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
          handleSaveRecording={() => {
            onSaveRecording();
          }}
        ></AnnotationTool>
      )}
    </div>
  );
}

export default Record;
