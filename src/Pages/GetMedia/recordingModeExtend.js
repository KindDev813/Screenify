import { useNavigate } from "react-router-dom";

let videoStream; // Variable to store the video stream
let mediaRecorder; // Variable to store the media recorder
let recordedChunks = []; // Array to store the recorded video chunk

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

// fullScreenRecordingMode,
export const fullScreenRecordingMod = async (recordingStatus, qualityValue) => {
  if (recordingStatus) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
        audio: true,
      });

      await timeCountDown();
      console.log("~~~~~~~~~~~~~~~~~~~~~Started");

      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
        videoBitsPerSecond: Number(qualityValue),
      });
      mediaRecorder.ondataavailable = (e) => {
        console.log(e.data);
        recordedChunks.push(e.data);
      };

      mediaRecorder.start();
    } catch (error) {
      console.log("Error accessing the screen: ", error);
    }
  } else {
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
        recordedChunks = [];
      };
    }
  }
};

//   windowRecordingMode
export const windowRecordingMode = async (recordingStatus, qualityValue) => {
  if (recordingStatus) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
        videoBitsPerSecond: Number(qualityValue),
      });
      mediaRecorder.ondataavailable = (e) => {
        recordedChunks.push(e.data);
      };

      mediaRecorder.start();
    } catch (error) {
      console.log("Error accessing the screen: ", error);
    }
  } else {
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
        recordedChunks = [];
      };
    }
  }
};

//   currentTabRecordingMode
export const cameraOnlyRecordingMode = async (
  recordingStatus,
  qualityValue
) => {
  if (recordingStatus) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoStream = stream;

        mediaRecorder = new MediaRecorder(videoStream, {
          mimeType: "video/webm; codecs=vp9",
          videoBitsPerSecond: Number(qualityValue),
        });
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
      })
      .catch((error) => {
        console.log("Error accessing webcam:", error);
      });
  } else {
    await videoStream.getTracks().forEach((track) => track.stop());
    mediaRecorder.stop();

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "screen-recording.webm";
      a.click();
      URL.revokeObjectURL(url);
      recordedChunks = [];
    };
  }
};

//   cameraOnlyRecordingMode
export const currentTabRecordingMode = async (
  recordingStatus,
  qualityValue
) => {
  if (recordingStatus) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {},
      });

      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
        videoBitsPerSecond: Number(qualityValue),
      });
      mediaRecorder.ondataavailable = (e) => {
        recordedChunks.push(e.data);
      };

      mediaRecorder.start();
    } catch (error) {
      console.log("Error accessing the screen: ", error);
    }
  } else {
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
        recordedChunks = [];
      };
    }
  }
};

const timeCountDown = () => {
  return new Promise((resolve) => {
    let countNumber = 3;

    function updateCountdown() {
      if (countNumber === 0) {
        console.log("Go!");
        resolve();
      } else {
        console.log(countNumber);
        countNumber--;
        setTimeout(updateCountdown, 1000); // Update countdown every 1 second
      }
    }
    updateCountdown();
  });
};
