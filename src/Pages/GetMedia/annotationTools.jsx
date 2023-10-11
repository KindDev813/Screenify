import { useState } from "react";
import { FloatButton, ColorPicker } from "antd";
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
  FormatPainterOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";

const AnnotationTools = () => {
  const [switchDropEditMenu, setSwitchDropEditMenu] = useState(false); // After pressing pause button
  const [visibleAudioTrack, setVisibleAudioTrack] = useState(false); // enable/disable audio track

  return (
    <div className="absolute">
      {!switchDropEditMenu ? (
        <FloatButton.Group
          // trigger="click"
          type="primary"
          style={{
            left: 20,
            bottom: 20,
          }}
        >
          <FloatButton icon={<SoundOutlined />} />
          <FloatButton
            icon={
              visibleAudioTrack ? <AudioOutlined /> : <AudioMutedOutlined />
            }
            onClick={() => setVisibleAudioTrack(!visibleAudioTrack)}
          />
          {/* <AudioMutedOutlined /> */}
          {/* <FloatButton icon={<EditOutlined />} /> */}
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
            <FloatButton icon={<LineHeightOutlined />} />
            {/* <FloatButton icon={<BgColorsOutlined />} /> */}
            <FloatButton
              className="color_picker"
              icon={<ColorPicker size="small" style={{ margin: "auto" }} />}
            ></FloatButton>
            <FloatButton icon={<FormatPainterOutlined />} />
            <FloatButton icon={<EditOutlined />} />
          </FloatButton.Group>
          <FloatButton
            icon={<PauseOutlined />}
            onClick={() => setSwitchDropEditMenu(true)}
          />
        </FloatButton.Group>
      ) : (
        <FloatButton.Group
          // trigger="click"
          type="primary"
          style={{
            left: 20,
            bottom: 20,
          }}
        >
          <FloatButton icon={<CloseOutlined />} />
          <FloatButton icon={<CheckOutlined />} />
          <FloatButton
            icon={<CaretRightOutlined />}
            onClick={() => setSwitchDropEditMenu(false)}
          />
        </FloatButton.Group>
      )}
    </div>
  );
};

export default AnnotationTools;
