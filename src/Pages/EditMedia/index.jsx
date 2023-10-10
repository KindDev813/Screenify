import { useState } from "react";
import { Slider, InputNumber, Button, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const EditMedia = () => {
  const TrimVideo = () => {
    // Trim video
    const [inputValue, setInputValue] = useState(0);
    const onChange = (value) => {
      if (isNaN(value)) {
        return;
      }
      setInputValue(value);
    };
    return (
      <div className="mt-2 flex flex-col">
        <div className="flex flex-row justify-between">
          <InputNumber
            min={0}
            max={1}
            step={0.01}
            value={inputValue}
            onChange={onChange}
          />
        </div>
        <Slider
          min={0}
          max={1}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
          step={0.01}
          controlSize={15}
          dotActiveBorderColor="#0000ff"
          colorPrimary="#0000ff"
        />
      </div>
    );
  };

  const CripVideo = () => {
    // Crip video
    const [firstValue, setFirstValue] = useState(0);
    const [endValue, setEndValue] = useState(0);

    const onChange = (value) => {
      setFirstValue(value[0]);
      setEndValue(value[1]);
    };

    const onAfterChange = (value) => {
      if (isNaN(value)) {
        return;
      }
      setFirstValue(value[0]);
      setEndValue(value[1]);
    };

    return (
      <div className="mt-2 flex flex-col">
        <div className="flex flex-row justify-between">
          <div>
            <InputNumber
              min={0}
              max={1}
              step={0.01}
              value={firstValue}
              onChange={(e) => setFirstValue(e)}
              className="mr-2"
            />

            <InputNumber
              min={0}
              max={1}
              step={0.01}
              value={endValue}
              onChange={(e) => setEndValue(e)}
              className="mr-2"
            />

            <InputNumber
              min={0}
              max={1}
              step={0.01}
              value={endValue}
              onChange={(e) => setEndValue(e)}
            />
          </div>
        </div>

        <Slider
          range
          defaultValue={[0.3, 0.6]}
          min={0}
          max={1}
          onChange={onChange}
          onAfterChange={onAfterChange}
          step={0.01}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-rows-5 gap-3 py-8 h-screen">
      <div className="row-span-2 sm:row-span-3 m-auto shadow-2xl h-auto w-full px-3 sm:px-5 md:px-0 md:w-3/5 min-w-[300px] max-w-[800px]">
        {/* Play video */}
        <ReactPlayer
          url={
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
          playing={true}
          controls={true}
          loop={true}
          muted={true}
          playsinline={true}
          width={"auto"}
          height={"100%"}
        />
      </div>

      <div className="sm:row-span-2 row-span-3 min-w-[280px] w-1/2 m-auto grid gap-2">
        {/* Panel to control the video */}
        <p className="text-start font-bold">Trim Video</p>
        {/* Panel to trim the video */}
        <TrimVideo />

        <p className="mt-3 text-start font-bold">Remove part of the video</p>
        {/* Panel to crip the video */}
        <CripVideo />

        <div className="flex justify-between ">
          {/* Panel to select the format and save(download) the video */}
          <Select
            defaultValue="mp4"
            options={[
              { value: "mp4", label: "Mp4" },
              { value: "webm", label: "Webm" },
            ]}
            className="h-[40px] sm:mt-3 mt-10 w-[88px]"
          />
          <Button
            className="bg-[#1641ff] h-[40px] sm:mt-3 mt-10 w-[200px]  "
            type="primary"
          >
            <span className="text-[15px] whitespace-nowrap font-bold">
              <DownloadOutlined className="mr-2" />
              Save & Download
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditMedia;
