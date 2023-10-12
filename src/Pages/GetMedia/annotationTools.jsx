import { useState } from "react";
import { FloatButton, ColorPicker, Popover, Slider } from "antd";
import {
  AudioOutlined,
  SoundOutlined,
  EditOutlined,
  CaretRightOutlined,
  PauseOutlined,
  CheckOutlined,
  CloseOutlined,
  LineHeightOutlined,
  DeleteOutlined,
  AudioMutedOutlined,
  HighlightOutlined,
  RadiusSettingOutlined,
} from "@ant-design/icons";
import { SlVolume2, SlVolumeOff } from "react-icons/sl";
import { IoShapesOutline } from "react-icons/io5";
import { TfiPencil } from "react-icons/tfi";
import { BiRectangle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa6";
import { BsTriangle } from "react-icons/bs";
import { MdTimeline } from "react-icons/md";

import FreeHand from "./freeHand";

const AnnotationTools = (props) => {
  const { recordingStarted, handleChangeRecordingStarted } = props;
  const [switchDropEditMenu, setSwitchDropEditMenu] = useState(false); // After pressing pause button
  const [visibleVolumeTrack, setVisibleVolumeTrack] = useState(true); // enable/disable audio track
  const [visibleMicrophoneTrack, setVisibleMicrophoneTrack] = useState(true); // enable/disable microphone track

  const freeHandContent = (
    <div>
      <Slider
        vertical
        defaultValue={30}
        style={{ display: "inline-block", height: 100 }}
      />
    </div>
  );

  const shapeContent = (
    <div className="flex flex-col w-auto p-2">
      <div className="hover:text-[#0000ffb2]">
        <BiRectangle size={70} className="mb-2" />
      </div>
      <FaRegCircle size={70} className="mb-2" />
      <BsTriangle size={70} className="mb-2" />
      <MdTimeline size={70} />
    </div>
  );

  return (
    <>
      <div className="absolute !z-[34] !w-full !h-full">
        <div className="relative">
          <div className="absolute !z-[50] hover:!z-50">
            {!switchDropEditMenu ? (
              <FloatButton.Group
                // trigger="click"
                type="primary"
                style={{
                  left: 20,
                  bottom: 20,
                }}
              >
                <FloatButton
                  icon={
                    visibleMicrophoneTrack ? <SlVolume2 /> : <SlVolumeOff />
                  }
                  onClick={() =>
                    setVisibleMicrophoneTrack(!visibleMicrophoneTrack)
                  }
                />
                <FloatButton
                  icon={
                    visibleVolumeTrack ? (
                      <AudioOutlined />
                    ) : (
                      <AudioMutedOutlined />
                    )
                  }
                  onClick={() => setVisibleVolumeTrack(!visibleVolumeTrack)}
                />

                <FloatButton.Group
                  trigger="click"
                  type="primary"
                  style={{
                    left: 20,
                    bottom: 185,
                  }}
                  icon={<EditOutlined />}
                >
                  <FloatButton icon={<DeleteOutlined />} />
                  <FloatButton
                    className="color_picker"
                    icon={
                      <ColorPicker size="small" style={{ margin: "auto" }} />
                    }
                  ></FloatButton>
                  <FloatButton icon={<LineHeightOutlined />} />
                  <Popover
                    placement="rightTop"
                    trigger={"hover"}
                    content={shapeContent}
                  >
                    <FloatButton icon={<IoShapesOutline />} />
                  </Popover>
                  <Popover
                    placement="rightTop"
                    trigger={"hover"}
                    content={freeHandContent}
                  >
                    <FloatButton icon={<TfiPencil />} />
                  </Popover>

                  {/* <FloatButton.Group
              trigger="hover"
              type="primary"
              // style={{
              //   left: 20,
              //   bottom: 185,
              // }}
              icon={<EditOutlined />}
            >
              <FloatButton icon={<LineHeightOutlined />} />
            </FloatButton.Group> */}
                </FloatButton.Group>

                <FloatButton
                  icon={<PauseOutlined />}
                  onClick={() => {
                    setSwitchDropEditMenu(true);
                  }}
                />
              </FloatButton.Group>
            ) : (
              <FloatButton.Group
                // trigger="click"
                type="primary"
                style={{
                  left: 20,
                  bottom: 20,
                  zIndex: 40,
                }}
              >
                <FloatButton
                  icon={<CloseOutlined />}
                  onClick={() => {
                    handleChangeRecordingStarted(false);
                  }}
                />
                <FloatButton
                  icon={<CheckOutlined />}
                  onClick={() => {
                    handleChangeRecordingStarted(false);
                  }}
                />
                <FloatButton
                  icon={<CaretRightOutlined />}
                  onClick={() => {
                    setSwitchDropEditMenu(false);
                  }}
                />
              </FloatButton.Group>
            )}
          </div>
          <FreeHand />
        </div>
      </div>
    </>
  );
};

export default AnnotationTools;
