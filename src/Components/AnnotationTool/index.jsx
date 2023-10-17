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
  MdOutlineModeEditOutline,
  MdTitle,
  MdDeleteOutline,
  MdOutlineRectangle,
  MdOutlineCircle,
  MdShowChart,
  MdOutlinePalette,
} from "react-icons/md";

// import TextEditor from "../TextEditor";
// import FreeHand from "../FreeHand";

import "./style.css";

const AnnotationTool = (props) => {
  const { recordingStarted, handleChangeRecordingStarted } = props;
  const [switchDropEditMenu, setSwitchDropEditMenu] = useState(false); // After pressing pause button
  const [visibleVolumeTrack, setVisibleVolumeTrack] = useState(true); // enable/disable audio track
  const [visibleMicrophoneTrack, setVisibleMicrophoneTrack] = useState(true); // enable/disable microphone track
  const [currentSelectedOption, setCurrentSelectedOption] = useState("0"); // Now, this is the option you selected. 0: Delete, 1: ColorPicker, 2: TextEditor, 3: Shape, 4: FreeHand
  const [nowColor, setNowColor] = useState("#ff0000"); // Setted color by Color Picker
  const [nowPencilSize, setNowPencilSize] = useState(20); // Setted size by pencil scroll

  const freeHandContent = (
    <div>
      <Slider
        vertical
        defaultValue={nowPencilSize}
        style={{ display: "inline-block", height: 100 }}
        onChange={(value) => setNowPencilSize(value)}
      />
    </div>
  );

  const shapeContent = (
    <div className="flex flex-col w-auto p-1">
      <div className="hover:text-[#ff0000]">
        <MdOutlineRectangle size={50} className="mb-1" />
      </div>
      <div className="hover:text-[#ff0000]">
        <MdOutlineCircle size={50} />
      </div>
      <div className="hover:text-[#ff0000]">
        <MdShowChart size={50} />
      </div>
    </div>
  );

  return (
    <>
      <div className="absolute !z-[34]">
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
                  <FloatButton
                    icon={<MdDeleteOutline />}
                    onClick={() => setCurrentSelectedOption("0")}
                  />
                  <FloatButton
                    className="color_picker"
                    icon={
                      <ColorPicker
                        size="small"
                        style={{ margin: "auto" }}
                        value={nowColor}
                        onChange={(value, hex) => setNowColor(hex)}
                      />
                    }
                    onClick={() => setCurrentSelectedOption("1")}
                  ></FloatButton>
                  <FloatButton
                    icon={<MdTitle />}
                    onClick={() => setCurrentSelectedOption("2")}
                  />
                  <Popover
                    placement="rightTop"
                    trigger={"hover"}
                    content={shapeContent}
                  >
                    <FloatButton
                      icon={<IoShapesOutline />}
                      onClick={() => setCurrentSelectedOption("3")}
                    />
                  </Popover>
                  <Popover
                    placement="rightTop"
                    trigger={"hover"}
                    content={freeHandContent}
                  >
                    <FloatButton
                      icon={<MdOutlineModeEditOutline />}
                      onClick={() => setCurrentSelectedOption("4")}
                    />
                  </Popover>
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

          {/* {currentSelectedOption === "2" ?? <TextEditor />} */}
          {/* {currentSelectedOption === "3" ?? <Shape />} */}
          {/* {currentSelectedOption === "4" ?? <FreeHand />} */}
        </div>
      </div>
    </>
  );
};

export default AnnotationTool;
