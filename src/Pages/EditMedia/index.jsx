import React, { useState, useEffect } from "react";
import { Spin, Button } from "antd";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

import { BLOB_LINKS, LABEL } from "../../utils/constants";
import TrimSliderControl from "../../Components/TrimSliderControl";
// import CropControl from "../../Components/CropControl";
import VideoPlayer from "../../Components/VideoPlayer";
import EditToolMenu from "../../Components/EditToolMenu";
import { trimVideoFFmpeg, cropVideoFFmpeg } from "../../utils/functions";

const ffmpeg = createFFmpeg({ log: true });

function EditMedia() {
  const [limitMinTrimValue, setlimitMinTrimValue] = useState(0);
  const [limitMaxTrimValue, setlimitMaxTrimValue] = useState();
  const [localVideoLink, setLocalVideoLink] = useState("");
  const [outFormat, setOutFormat] = useState("mp4");
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [currentTool, setCurrentTool] = useState(LABEL.TRIM);
  const [cropData, setCropData] = useState();
  const [downUrl, setDownUrl] = useState("");

  useEffect(() => {
    ffmpeg.load().then(() => {
      setLoadingVisible(false);
    });

    let links = JSON.parse(localStorage.getItem(BLOB_LINKS));
    links ? setLocalVideoLink(links) : setLocalVideoLink();
  }, []);

  const onSaveAndDownload = async () => {
    setLoadingVisible(true);
    let fileName = new Date().getTime();

    switch (currentTool) {
      case LABEL.TRIM:
        await trimModeDown(fileName);
        break;
      case LABEL.CROP:
        await cropModeDown(fileName);
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

    setDownUrl(url);
  };

  const cropModeDown = async (fileName) => {
    let url = await cropVideoFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      cropData.width,
      cropData.height,
      cropData.x,
      cropData.y
    );

    setDownUrl(url);
  };

  return (
    <Spin spinning={loadingVisible} size="large" delay={500}>
      <div className="grid grid-cols-7 gap-4  w-full h-screen p-4 max-w-[70%] mx-auto">
        <EditToolMenu
          handleCurrentTool={(value) => setCurrentTool(value)}
          currentTool={currentTool}
        />

        <div className="col-span-6 flex flex-col justify-evenly h-full my-auto p-4 border-2 border-[#00000057] rounded-lg">
          <div className="flex justify-end">
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
            cropData={cropData}
            handleCropData={(value) => setCropData(value)}
          />

          {currentTool === LABEL.TRIM && (
            <TrimSliderControl
              localVideoLink={localVideoLink}
              handleLimitMinTrimValue={(value) => setlimitMinTrimValue(value)}
              handleLimitMaxTrimValue={(value) => setlimitMaxTrimValue(value)}
              handleOutFormat={(value) => setOutFormat(value)}
            />
          )}
          {/* {currentTool === LABEL.CROP && <CropControl />} */}
        </div>
      </div>
    </Spin>
  );
}

export default EditMedia;
