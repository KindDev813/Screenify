import { useState } from "react";
import { Button, Radio, Space } from "antd";
import ReactPlayer from "react-player";
// import TimeRange from "react-timeline-range-slider";

import { MdCrop, MdOutlinePalette } from "react-icons/md";
import { TbMovieOff, TbSticker, TbColorFilter } from "react-icons/tb";
import { GiSettingsKnobs } from "react-icons/gi";

import { LABEL } from "../../utils/constants";

const editToolLabels = [
  {
    label: LABEL.TRIM,
    icon: <TbMovieOff style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.CROP,
    icon: <MdCrop style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.FINETUNE,
    icon: <GiSettingsKnobs style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.FILTER,
    icon: <TbColorFilter style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.ANNOTATE,
    icon: <MdOutlinePalette style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.STICKER,
    icon: <TbSticker style={{ fontSize: "30px" }} className="mx-auto" />,
  },
];

function EditMedia() {
  return (
    <div className="grid grid-cols-7 gap-4  w-full h-screen p-4 max-w-[70%] mx-auto">
      <div className="flex col-span-1 justify-center h-full items-center border-2 border-[#00000057] rounded-lg">
        <Radio.Group
        // onChange={onChange}
        // value={value}
        >
          <Space direction="vertical">
            {editToolLabels.map((editTool, index) => {
              return (
                <Radio.Button
                  className="h-auto !p-0 "
                  value={index}
                  key={index}
                >
                  <div className="flex flex-col py-1 sm:py-2 md:py-3 justify-center h-full min-w-[50px] w-full sm:w-[50px] lg:w-[70px] xl:w-[90px] 2xl:w-[95px]">
                    {editTool.icon}
                    <span className="text-[12px] whitespace-nowrap">
                      {editTool.label}
                    </span>
                  </div>
                </Radio.Button>
              );
            })}
          </Space>
        </Radio.Group>
      </div>

      <div className="col-span-6 flex flex-col justify-evenly h-full my-auto p-4 border-2 border-[#00000057] rounded-lg">
        <div className="flex justify-end">
          <Button
            type="primary"
            shape="round"
            style={{ backgroundColor: "red" }}
          >
            Done!
          </Button>
        </div>
        <div className="mx-auto p-4">
          <ReactPlayer
            url={
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
            playing={true}
            controls={true}
            loop={true}
            muted={true}
            playsinline={true}
            width={"100%"}
            height={"auto"}
          />
        </div>
        <div className="flex flex-col justify-center">
          <Button size="large">Done!</Button>
          <Button size="large">Done!</Button>
        </div>
      </div>
    </div>
  );
}

export default EditMedia;
