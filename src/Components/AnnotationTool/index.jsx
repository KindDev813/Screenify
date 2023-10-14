import { useState } from "react";
import { FloatButton, ColorPicker, Popover, Slider } from "antd";
import { IoShapesOutline } from "react-icons/io5";
import {
  MdOutlineVolumeUp,
  MdOutlineVolumeOff,
  MdMicNone,
  MdMicOff,
  MdOutlinePause,
  MdOutlinePlayArrow,
  MdCheck,
  MdClose,
  MdOutlineSettings,
  MdOutlineModeEditOutline,
  MdTitle,
  MdDeleteOutline,
  MdOutlineRectangle,
  MdOutlineCircle,
  MdShowChart,
  MdOutlinePalette,
} from "react-icons/md";

import "./style.css";

// import FreeHand from "./freeHand";

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
    <div className="flex flex-col w-auto p-1">
      <div className="hover:text-[#ff0000]">
        <MdOutlineRectangle size={50} className="mb-2" />
      </div>
      <div className="hover:text-[#ff0000]">
        <MdOutlineCircle size={50} className="mb-2" />
      </div>
      <div className="hover:text-[#ff0000]">
        <MdShowChart size={50} />
      </div>
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
                    visibleMicrophoneTrack ? (
                      <MdOutlineVolumeUp />
                    ) : (
                      <MdOutlineVolumeOff />
                    )
                  }
                  onClick={() =>
                    setVisibleMicrophoneTrack(!visibleMicrophoneTrack)
                  }
                />
                <FloatButton
                  icon={visibleVolumeTrack ? <MdMicNone /> : <MdMicOff />}
                  onClick={() => setVisibleVolumeTrack(!visibleVolumeTrack)}
                />

                <FloatButton.Group
                  trigger="click"
                  type="primary"
                  style={{
                    left: 20,
                    bottom: 185,
                  }}
                  icon={<MdOutlinePalette />}
                >
                  <FloatButton icon={<MdDeleteOutline />} />
                  <FloatButton
                    className="color_picker"
                    icon={
                      <ColorPicker size="small" style={{ margin: "auto" }} />
                    }
                  ></FloatButton>
                  <FloatButton icon={<MdTitle />} />
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
                    <FloatButton icon={<MdOutlineModeEditOutline />} />
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
                  icon={<MdOutlinePause />}
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
                  icon={<MdClose />}
                  onClick={() => {
                    handleChangeRecordingStarted(false);
                  }}
                />
                <FloatButton
                  icon={<MdCheck />}
                  onClick={() => {
                    handleChangeRecordingStarted(false);
                  }}
                />
                <FloatButton
                  icon={<MdOutlinePlayArrow />}
                  onClick={() => {
                    setSwitchDropEditMenu(false);
                  }}
                />
              </FloatButton.Group>
            )}
          </div>
          {/* <FreeHand /> */}
        </div>
      </div>
    </>
  );
};

export default AnnotationTools;
