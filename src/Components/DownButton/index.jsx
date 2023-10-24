import React from "react";
import { Button } from "antd";

import { trimVideoFFmpeg } from "../../utils/functions";

const DownButton = (props) => {
  const {
    ffmpeg,
    localVideoLink,
    limitMinTrimValue,
    limitMaxTrimValue,
    outFormat,
    handleLoadingVisible,
  } = props;

  const onSaveAndDownload = async () => {
    handleLoadingVisible(true);
    let fileName = new Date().getTime();

    const downUrl = await trimVideoFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      limitMinTrimValue,
      limitMaxTrimValue
    );

    const a = document.createElement("a");
    a.href = downUrl;
    a.download = `${fileName}.${outFormat}`;
    handleLoadingVisible(false);
    a.click();
  };

  return (
    <div className="flex justify-end">
      <Button
        type="primary"
        shape="round"
        style={{ backgroundColor: "red" }}
        onClick={() => {
          onSaveAndDownload();
        }}
      >
        Done!
      </Button>
    </div>
  );
};
export default DownButton;
