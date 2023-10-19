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
  MdOutlinePalette,
} from "react-icons/md";

import ShapePanel from "./ShapePanel";
import AnnotationPlayField from "./AnnotationPlayField";

import "./style.css";

const AnnotationTool = (props) => {
  const { recordingStarted, handleChangeRecordingStarted } = props;
  const [switchDropEditMenu, setSwitchDropEditMenu] = useState(false); // After pressing pause button
  const [visibleVolumeTrack, setVisibleVolumeTrack] = useState(true); // enable/disable audio track
  const [visibleMicrophoneTrack, setVisibleMicrophoneTrack] = useState(true); // enable/disable microphone track
  const [currentSelectedOption, setCurrentSelectedOption] = useState(0); // Now, this is the option you selected. 0: Delete, 1: ColorPicker, 2: TextEditor, 3: Shape, 4: FreeHand
  const [nowColor, setNowColor] = useState("#ff0000"); // Setted color by Color Picker
  const [nowSize, setNowSize] = useState(40); // Setted size by pencil scroll
  const [annotationToolsOpen, setAnnotationToolsOpen] = useState(false);

  const annotationBadge = {
    dot: true,
    color: nowColor,
  };

  const freeHandContent = (
    <div>
      <Slider
        vertical
        defaultValue={nowSize}
        style={{ display: "inline-block", height: 100 }}
        onChange={(value) => setNowSize(value)}
      />
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
                type="default"
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
                  open={annotationToolsOpen}
                  trigger="click"
                  type="primary"
                  style={{
                    left: 20,
                    bottom: 185,
                  }}
                  icon={<MdOutlinePalette />}
                  onClick={() => setAnnotationToolsOpen(!annotationToolsOpen)}
                >
                  <FloatButton
                    icon={<MdDeleteOutline />}
                    onClick={() => setCurrentSelectedOption(0)}
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
                    onClick={() => {}}
                  ></FloatButton>
                  <FloatButton
                    icon={<MdTitle />}
                    badge={currentSelectedOption === 2 && annotationBadge}
                    onClick={() => setCurrentSelectedOption(2)}
                  />
                  <Popover
                    placement="rightTop"
                    trigger={"hover"}
                    content={
                      <ShapePanel color={nowColor} strokeWidth={nowSize / 4} />
                    }
                  >
                    <FloatButton
                      icon={<IoShapesOutline />}
                      badge={currentSelectedOption === 3 && annotationBadge}
                      onClick={() => setCurrentSelectedOption(3)}
                    />
                  </Popover>
                  <Popover
                    placement="rightTop"
                    trigger={"hover"}
                    content={freeHandContent}
                  >
                    <FloatButton
                      icon={<MdOutlineModeEditOutline />}
                      badge={currentSelectedOption === 4 && annotationBadge}
                      onClick={() => setCurrentSelectedOption(4)}
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

          {currentSelectedOption !== 0 && (
            <AnnotationPlayField
              nowColor={nowColor}
              nowSize={nowSize}
              currentSelectedOption={currentSelectedOption}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AnnotationTool;
