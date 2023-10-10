import { useNavigate } from "react-router-dom";

let videoStream; // Variable to store the video stream
let mediaRecorder; // Variable to store the media recorder
let recordedChunks = []; // Array to store the recorded video chunk

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

export const webcamMode = async (recordingStatus) => {
  if (recordingStatus) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoStream = stream;

        mediaRecorder = new MediaRecorder(videoStream);
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

export const desktopMode = async (recordingStatus) => {
  if (recordingStatus) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      mediaRecorder = new MediaRecorder(stream);
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

export const tabMode = async (recordingStatus) => {
  if (recordingStatus) {
    chrome.tabCapture.capture({ video: true }, (stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.start();
    });
  } else {
    mediaRecorder.stop();
    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "recorded_video.webm";
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }
};
