import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

import { BLOB_LINKS } from "../../utils/constants";
import TrimSliderControl from "../../Components/TrimSliderControl";
import DownButton from "../../Components/DownButton";
import VideoPlayer from "../../Components/VideoPlayer";
import EditToolMenu from "../../Components/EditToolMenu";

const ffmpeg = createFFmpeg({ log: true });

function EditMedia() {
  const [limitMinTrimValue, setlimitMinTrimValue] = useState(0);
  const [limitMaxTrimValue, setlimitMaxTrimValue] = useState();
  const [localVideoLink, setLocalVideoLink] = useState("");
  const [outFormat, setOutFormat] = useState("webm");
  const [loadingVisible, setLoadingVisible] = useState(true);

  useEffect(() => {
    ffmpeg.load().then(() => {
      setLoadingVisible(false);
    });

    let links = JSON.parse(localStorage.getItem(BLOB_LINKS));
    links ? setLocalVideoLink(links) : setLocalVideoLink();
  }, []);

  return (
    <Spin spinning={loadingVisible} size="large" delay={500}>
      <div className="grid grid-cols-7 gap-4  w-full h-screen p-4 max-w-[70%] mx-auto">
        <EditToolMenu />

        <div className="col-span-6 flex flex-col justify-evenly h-full my-auto p-4 border-2 border-[#00000057] rounded-lg">
          <DownButton
            ffmpeg={ffmpeg}
            localVideoLink={localVideoLink}
            limitMinTrimValue={limitMinTrimValue}
            limitMaxTrimValue={limitMaxTrimValue}
            outFormat={outFormat}
            handleLoadingVisible={(value) => setLoadingVisible(value)}
          />
          <VideoPlayer localVideoLink={localVideoLink} />
          <TrimSliderControl
            localVideoLink={localVideoLink}
            handleLimitMinTrimValue={(value) => setlimitMinTrimValue(value)}
            handleLimitMaxTrimValue={(value) => setlimitMaxTrimValue(value)}
            handleOutFormat={(value) => setOutFormat(value)}
          />
        </div>
      </div>
    </Spin>
  );
}

export default EditMedia;
