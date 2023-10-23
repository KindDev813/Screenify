import { useState, useEffect, useRef } from "react";
import { Button, Radio, Space, Slider, InputNumber, Select } from "antd";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
// import TimeRange from "react-timeline-range-slider";

import { MdCrop, MdOutlinePalette } from "react-icons/md";
import { TbMovieOff, TbSticker, TbColorFilter } from "react-icons/tb";
import { GiSettingsKnobs } from "react-icons/gi";

import { LABEL, BLOB_LINKS, RECORDING_DURATION } from "../../utils/constants";

const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  log: true,
});

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
  const [limitMinTrimValue, setlimitMinTrimValue] = useState(0);
  const [limitMaxTrimValue, setlimitMaxTrimValue] = useState();
  const [maxTrimValue, setMaxTrimValue] = useState("");
  const [localVideoLink, setLocalVideoLink] = useState("");
  const [outFormat, setOutFormat] = useState("webm");
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const blobVideoRef = useRef();

  useEffect(() => {
    ffmpeg.load().then(() => {
      setFFmpegLoaded(true);
    });
  }, []);

  useEffect(() => {
    let chunks = JSON.parse(localStorage.getItem("chunks"));

    let links = JSON.parse(localStorage.getItem(BLOB_LINKS));
    links ? setLocalVideoLink(links) : setLocalVideoLink();
  }, []);

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

  const onSaveAndDownload = async () => {
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(localVideoLink));

    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-ss",
      `${limitMinTrimValue}`,
      "-to",
      `${limitMaxTrimValue}`,
      "-f",
      "mp4",
      "test1.mp4"
    );
    const data = ffmpeg.FS("readFile", "test1.mp4");
    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );

    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = "screen-recording.mp4";
    a.click();
  };

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
            onClick={() => {
              onSaveAndDownload();
            }}
          >
            Done!
          </Button>
        </div>
        <div className="mx-auto p-4">
          <video
            ref={blobVideoRef}
            id="blob_video"
            controls
            autoPlay
            src={localVideoLink}
          ></video>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-between">
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
            min={1}
            max={maxTrimValue}
            value={[limitMinTrimValue, limitMaxTrimValue]}
            defaultValue={[limitMinTrimValue, limitMaxTrimValue]}
            onChange={(value) => {
              setlimitMinTrimValue(value[0]);
              setlimitMaxTrimValue(value[1]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditMedia;
