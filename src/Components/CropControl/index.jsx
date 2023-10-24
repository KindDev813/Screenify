import React, { useEffect, useState } from "react";
import { Slider, InputNumber, Select } from "antd";
import "./style.css";

const CropControl = (props) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-between">
        <InputNumber
          addonBefore="X"
          min={0}
          // max={maxTrimValue}
          // value={limitMinTrimValue}
          // onChange={(value) => setlimitMinTrimValue(value)}
          className="mr-[10px]"
        />
        <InputNumber
          addonBefore="Y"
          min={0}
          // max={maxTrimValue}
          // value={limitMaxTrimValue}
          // onChange={(value) => setlimitMaxTrimValue(value)}
          className="mr-[10px]"
        />
        <InputNumber
          addonBefore="W"
          min={0}
          // max={maxTrimValue}
          // value={limitMaxTrimValue}
          // onChange={(value) => setlimitMaxTrimValue(value)}
          className="mr-[10px]"
        />
        <InputNumber
          addonBefore="H"
          min={0}
          // max={maxTrimValue}
          // value={limitMaxTrimValue}
          // onChange={(value) => setlimitMaxTrimValue(value)}
          className="mr-[10px]"
        />
      </div>
    </div>
  );
};

export default CropControl;
