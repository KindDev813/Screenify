import React, { useEffect, useState } from "react";
import { Slider, InputNumber, Select } from "antd";

import { RECORDING_DURATION } from "../../utils/constants";

const TrimSliderControl = (props) => {
  const {
    localVideoLink,
    handleLimitMinTrimValue,
    handleLimitMaxTrimValue,
    handleOutFormat,
  } = props;

  const [limitMinTrimValue, setlimitMinTrimValue] = useState(0);
  const [limitMaxTrimValue, setlimitMaxTrimValue] = useState();
  const [maxTrimValue, setMaxTrimValue] = useState("");
  const [outFormat, setOutFormat] = useState("webm");

  useEffect(() => {
    if (localVideoLink) {
      setMaxTrimValue(
        Math.floor(localStorage.getItem(RECORDING_DURATION) / 1000)
      );
      setlimitMaxTrimValue(
        Math.floor(localStorage.getItem(RECORDING_DURATION) / 1000)
      );
    } else {
      setMaxTrimValue(0);
      setlimitMaxTrimValue(0);
    }
  }, [localVideoLink]);

  useEffect(() => {
    handleLimitMaxTrimValue(limitMaxTrimValue);
    handleLimitMaxTrimValue(limitMaxTrimValue);
    handleOutFormat(outFormat);
  }, [limitMinTrimValue, limitMaxTrimValue, outFormat]);

  return (
    <div className="flex flex-col justify-center p-5">
      <div className="flex justify-between ">
        <div>
          <InputNumber
            min={0}
            max={maxTrimValue}
            value={limitMinTrimValue}
            onChange={(value) => setlimitMinTrimValue(value)}
            className="mr-[10px]"
          />
          <InputNumber
            min={0}
            max={maxTrimValue}
            value={limitMaxTrimValue}
            onChange={(value) => setlimitMaxTrimValue(value)}
          />
        </div>
        <Select
          defaultValue={outFormat}
          style={{ width: 100 }}
          onChange={(value) => setOutFormat(value)}
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
          setlimitMinTrimValue(value[0]);
          setlimitMaxTrimValue(value[1]);
        }}
      />
    </div>
  );
};

export default TrimSliderControl;
