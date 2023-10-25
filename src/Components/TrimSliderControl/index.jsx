import React, { useEffect, useState } from "react";
import { Slider, InputNumber, Select } from "antd";

import { LOCAL_STORAGE } from "../../utils/constants";

const TrimSliderControl = (props) => {
  const {
    localVideoLink,
    outFormat,
    limitMinTrimValue,
    limitMaxTrimValue,
    handleLimitMinTrimValue,
    handleLimitMaxTrimValue,
    handleOutFormat,
  } = props;

  const [maxTrimValue, setMaxTrimValue] = useState();

  useEffect(() => {
    if (localVideoLink) {
      setMaxTrimValue(
        Math.floor(
          localStorage.getItem(LOCAL_STORAGE.RECORDING_DURATION) / 1000
        )
      );
      handleLimitMaxTrimValue(
        Math.floor(
          localStorage.getItem(LOCAL_STORAGE.RECORDING_DURATION) / 1000
        )
      );
    } else {
      handleLimitMaxTrimValue(0);
    }
  }, [localVideoLink]);

  return (
    <div className="flex flex-col justify-center p-5">
      <div className="flex justify-between ">
        <div>
          <InputNumber
            min={0}
            max={maxTrimValue}
            value={limitMinTrimValue}
            onChange={(value) => handleLimitMinTrimValue(value)}
            className="mr-[10px]"
          />
          <InputNumber
            min={0}
            max={maxTrimValue}
            value={limitMaxTrimValue}
            onChange={(value) => handleLimitMaxTrimValue(value)}
          />
        </div>
        <Select
          defaultValue={outFormat}
          style={{ width: 100 }}
          onChange={(value) => handleOutFormat(value)}
          options={[
            { value: "webm", label: "WEBM" },
            { value: "mp4", label: "MP4" },
          ]}
        />
      </div>

      <Slider
        range
        min={0}
        max={maxTrimValue}
        value={[limitMinTrimValue, limitMaxTrimValue]}
        defaultValue={[limitMinTrimValue, limitMaxTrimValue]}
        onChange={(value) => {
          handleLimitMinTrimValue(value[0]);
          handleLimitMaxTrimValue(value[1]);
        }}
      />
    </div>
  );
};

export default TrimSliderControl;
