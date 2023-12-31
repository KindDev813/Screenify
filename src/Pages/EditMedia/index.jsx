import React, { useState, useEffect } from "react";
import { Spin, Button } from "antd";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { useNavigate } from "react-router-dom";

import { LOCAL_STORAGE, LABEL } from "../../utils/constants";
import TrimSliderControl from "../../Components/TrimSliderControl";
import TimeRange from "../../Components/TimeRange";
import BgMusicOverControl from "../../Components/BgMusicOverControl";
import VideoPlayer from "../../Components/VideoPlayer";
import EditToolMenu from "../../Components/EditToolMenu";
import {
  trimVideoFFmpeg,
  cropVideoFFmpeg,
  musicOverFFmpeg,
  extractImagesFFmpeg,
  getVideoDimensions,
  alertModal,
} from "../../utils/functions";

const ffmpeg = createFFmpeg({ log: false });

function EditMedia() {
  const navigate = useNavigate();
  const [limitMinTrimValue, setlimitMinTrimValue] = useState(0);
  const [limitMaxTrimValue, setlimitMaxTrimValue] = useState(100);
  const [localVideoLink, setLocalVideoLink] = useState("");
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [currentTool, setCurrentTool] = useState(LABEL.TRIM);
  const [overMusic, setOverMusic] = useState(null);
  const [cropDimensions, setCropDimensions] = useState();
  const [origDimensions, setOrigDimensions] = useState({});
  const [maxTime, setMaxTime] = useState([]);
  const [timeRangeBgImages, setTimeRangeBgImages] = useState([]);

  useEffect(() => {
    ffmpeg
      .load()
      .then(() => {
        setLoadingVisible(false);
      })
      .catch((error) => {
        alertModal("Please reload the editting page!");
      });

    let links = JSON.parse(localStorage.getItem(LOCAL_STORAGE.BLOB_LINKS));
    links ? setLocalVideoLink(links) : setLocalVideoLink();
  }, []);

  useEffect(() => {
    if (localVideoLink) {
      getVideoDimensions(localVideoLink)
        .then(({ width, height }) => {
          setOrigDimensions({ width: width, height: height });
        })
        .catch((error) => {
          console.log(`Error occurred: ${error}`);
        });
    }
  }, [localVideoLink]);

  useEffect(() => {
    const getImages = async () => {
      if (localVideoLink && !loadingVisible) {
        let fileName = new Date().getTime();
        let imageLinks = await extractImagesFFmpeg(
          ffmpeg,
          localVideoLink,
          maxTime,
          fileName
        );
        setTimeRangeBgImages(imageLinks);
        setLoadingVisible(false);
      }
    };

    getImages();
  }, [localVideoLink, loadingVisible]);

  const onSaveAndDownload = async () => {
    setLoadingVisible(true);
    let fileName = new Date().getTime();
    let downUrl;

    switch (currentTool) {
      case LABEL.TRIM:
        downUrl = await trimModeDown(fileName);
        break;
      case LABEL.CROP:
        downUrl = await cropModeDown(fileName);
        break;
      case LABEL.BGMUSIC:
        downUrl = await musicOverModeDown(fileName);
        break;
    }

    const a = document.createElement("a");
    a.href = downUrl;
    a.download = `${fileName}.mp4`;
    setLoadingVisible(false);
    a.click();
  };

  const onBack = () => {
    URL.revokeObjectURL(localVideoLink);
    navigate("/");
  };

  const trimModeDown = async (fileName) => {
    let url = await trimVideoFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      (maxTime / 100) * limitMinTrimValue,
      (maxTime / 100) * limitMaxTrimValue
    );

    return url;
  };

  const cropModeDown = async (fileName) => {
    let url = await cropVideoFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      cropDimensions,
      origDimensions
    );

    return url;
  };

  const musicOverModeDown = async (fileName) => {
    let url = await musicOverFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      overMusic
    );

    return url;
  };

  return (
    <Spin spinning={loadingVisible} size="large" delay={500}>
      <div className="grid grid-cols-7 gap-4  w-full h-screen p-4 max-w-[70%] mx-auto">
        <EditToolMenu
          handleCurrentTool={(value) => setCurrentTool(value)}
          currentTool={currentTool}
        />

        <div className="col-span-6 flex flex-col justify-evenly h-full my-auto p-4 border-2 border-[#00000057] rounded-lg">
          <div className="flex justify-between p-4">
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                onBack();
              }}
            >
              Back
            </Button>

            <Button
              type="primary"
              shape="round"
              onClick={() => {
                onSaveAndDownload();
              }}
            >
              Done
            </Button>
          </div>

          <VideoPlayer
            localVideoLink={localVideoLink}
            currentTool={currentTool}
            limitMinTrimValue={(maxTime / 100) * limitMinTrimValue}
            limitMaxTrimValue={(maxTime / 100) * limitMaxTrimValue}
            handleCropDimensionsData={(value) => setCropDimensions(value)}
          />

          {currentTool === LABEL.TRIM && (
            <TimeRange
              error={false}
              ticksNumber={20}
              localVideoLink={localVideoLink}
              backgroundImages={timeRangeBgImages}
              selectedInterval={[0, 100]}
              onUpdateCallback={(value) => {
                setlimitMinTrimValue(value[0]);
                setlimitMaxTrimValue(value[1]);
              }}
              maxTime={maxTime}
              handleMaxTime={(value) => setMaxTime(value)}
              step={100 / maxTime}
              limitMinTrimValue={limitMinTrimValue}
              limitMaxTrimValue={limitMaxTrimValue}
            />
          )}
          {currentTool === LABEL.BGMUSIC && (
            <BgMusicOverControl
              overMusic={overMusic}
              handleOverMusic={(value) => setOverMusic(value)}
            />
          )}
        </div>
      </div>
    </Spin>
  );
}

export default EditMedia;
