import React, { useState, useEffect, useRef } from "react";
import { Spin, Button } from "antd";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

import { LOCAL_STORAGE, LABEL } from "../../utils/constants";
import TrimSliderControl from "../../Components/TrimSliderControl";
import BgMusicOverControl from "../../Components/BgMusicOverControl";
import VideoPlayer from "../../Components/VideoPlayer";
import EditToolMenu from "../../Components/EditToolMenu";
import {
  trimVideoFFmpeg,
  cropVideoFFmpeg,
  musicOverFFmpeg,
  getVideoDimensions,
} from "../../utils/functions";

const ffmpeg = createFFmpeg({ log: false });

function EditMedia() {
  const originalVideo = useRef();
  const [limitMinTrimValue, setlimitMinTrimValue] = useState(0);
  const [limitMaxTrimValue, setlimitMaxTrimValue] = useState();
  const [localVideoLink, setLocalVideoLink] = useState("");
  const [outFormat, setOutFormat] = useState("mp4");
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [currentTool, setCurrentTool] = useState(LABEL.TRIM);
  const [overMusic, setOverMusic] = useState(null);
  const [cropDimensions, setCropDimensions] = useState();
  const [origDimensions, setOrigDimensions] = useState({});

  useEffect(() => {
    ffmpeg.load().then(() => {
      setLoadingVisible(false);
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
    a.download = `${fileName}.${outFormat}`;
    setLoadingVisible(false);
    a.click();
  };

  const trimModeDown = async (fileName) => {
    let url = await trimVideoFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      limitMinTrimValue,
      limitMaxTrimValue
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
          <div className="flex justify-end p-4">
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                onSaveAndDownload();
              }}
            >
              Done!
            </Button>
          </div>

          <VideoPlayer
            localVideoLink={localVideoLink}
            currentTool={currentTool}
            handleCropDimensionsData={(value) => setCropDimensions(value)}
          />

          {currentTool === LABEL.TRIM && (
            <TrimSliderControl
              localVideoLink={localVideoLink}
              outFormat={outFormat}
              limitMinTrimValue={limitMinTrimValue}
              limitMaxTrimValue={limitMaxTrimValue}
              handleLimitMinTrimValue={(value) => setlimitMinTrimValue(value)}
              handleLimitMaxTrimValue={(value) => setlimitMaxTrimValue(value)}
              handleOutFormat={(value) => setOutFormat(value)}
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
